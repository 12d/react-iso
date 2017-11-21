import Whammy from './Whammy';
function WhammyRecorderHelper(mediaStream, root) {
    this.record = function(timeSlice) {
        if (!this.width) {
            this.width = 320;
        }
        if (!this.height) {
            this.height = 240;
        }

        if (this.video && this.video instanceof HTMLVideoElement) {
            if (!this.width) {
                this.width = video.videoWidth || video.clientWidth || 320;
            }
            if (!this.height) {
                this.height = video.videoHeight || video.clientHeight || 240;
            }
        }

        if (!this.video) {
            this.video = {
                width: this.width,
                height: this.height
            };
        }

        if (!this.canvas || !this.canvas.width || !this.canvas.height) {
            this.canvas = {
                width: this.width,
                height: this.height
            };
        }

        canvas.width = this.canvas.width;
        canvas.height = this.canvas.height;

        // setting defaults
        if (this.video && this.video instanceof HTMLVideoElement) {
            this.isHTMLObject = true;
            video = this.video.cloneNode();
        } else {
            video = document.createElement('video');
            video.src = URL.createObjectURL(mediaStream);

            video.width = this.video.width;
            video.height = this.video.height;
        }

        video.muted = true;
        video.play();

        lastTime = new Date().getTime();
        whammy = new Whammy.Video(root.speed, root.quality);

        console.log('canvas resolutions', canvas.width, '*', canvas.height);
        console.log('video width/height', video.width || canvas.width, '*', video.height || canvas.height);

        drawFrames();
    };

    this.clearOldRecordedFrames = function() {
        whammy.frames = [];
    };
    function bytesToSize(bytes) {
        if (bytes === 0) return '0 B';

        var k = 1024;

       let  sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        let i = Math.floor(Math.log(bytes) / Math.log(k));

        return (bytes / Math.pow(k, i)) + ' ' + sizes[i];
        //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }
    var requestDataInvoked = false;
    this.requestData = function() {
        if (isPaused) {
            return;
        }

        if (!whammy.frames.length) {
            requestDataInvoked = false;
            return;
        }

        requestDataInvoked = true;
        // clone stuff
        var internalFrames = whammy.frames.slice(0);

        // reset the frames for the new recording

        whammy.frames = dropBlackFrames(internalFrames, -1);
        // whammy.frames = internalFrames;
        var whammyBlob = whammy.compile(function(whammyBlob) {
            root.ondataavailable({data:whammyBlob});
        });
        root.ondataavailable({data:whammyBlob});
        whammy.frames = [];

        requestDataInvoked = false;
    };

    var isOnStartedDrawingNonBlankFramesInvoked = false;
    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
    function coverJpeg2Webp(jpegbase64){
        return new Promise((resolve)=>{
            var imgData= new Blob([dataURLtoBlob(jpegbase64)],{type:'image/webp'});
            var imgDataURL = URL.createObjectURL(imgData);
            var xhr = new XMLHttpRequest()
            xhr.responseType = 'blob'

            xhr.onload = function () {
                var recoveredBlob = xhr.response

                var reader = new FileReader()

                reader.onload = function () {
                    resolve(reader.result);
                }

                reader.readAsDataURL(recoveredBlob)
            }

            xhr.open('GET', imgDataURL)
            xhr.send()
        })
    }
    function drawFrames() {
        if (isPaused) {
            lastTime = new Date().getTime();
            setTimeout(drawFrames, 500);
            return;
        }

        if (isStopDrawing) {
            return;
        }

        if (requestDataInvoked) {
            return setTimeout(drawFrames, 100);
        }

        var duration = new Date().getTime() - lastTime;
        if (!duration) {
            return drawFrames();
        }

        // via webrtc-experiment#206, by Jack i.e. @Seymourr
        lastTime = new Date().getTime();

        if (!self.isHTMLObject && video.paused) {
            video.play(); // Android
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        var rs = canvas.toDataURL('image/webp', 1);

        // coverJpeg2Webp(jpegBase64Data).then(rs=>{
            if (!isStopDrawing) {
                whammy.frames.push({
                    duration: duration,
                    image: rs
                });
            }

            if (!isOnStartedDrawingNonBlankFramesInvoked && !isBlankFrame(whammy.frames[whammy.frames.length - 1])) {
                isOnStartedDrawingNonBlankFramesInvoked = true;
                root.onStartedDrawingNonBlankFrames();
            }

            setTimeout(drawFrames, 10);
        // })
    }

    var isStopDrawing = false;

    this.stop = function() {
        isStopDrawing = true;
        this.requestData();
        this.onstop();
    };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    var video;
    var lastTime;
    var whammy;

    var self = this;

    function isBlankFrame(frame, _pixTolerance, _frameTolerance) {
        var localCanvas = document.createElement('canvas');
        localCanvas.width = canvas.width;
        localCanvas.height = canvas.height;
        var context2d = localCanvas.getContext('2d');

        var sampleColor = {
            r: 0,
            g: 0,
            b: 0
        };
        var maxColorDifference = Math.sqrt(
            Math.pow(255, 2) +
            Math.pow(255, 2) +
            Math.pow(255, 2)
        );
        var pixTolerance = _pixTolerance && _pixTolerance >= 0 && _pixTolerance <= 1 ? _pixTolerance : 0;
        var frameTolerance = _frameTolerance && _frameTolerance >= 0 && _frameTolerance <= 1 ? _frameTolerance : 0;

        var matchPixCount, endPixCheck, maxPixCount;

        var image = new Image();
        image.src = frame.image;
        context2d.drawImage(image, 0, 0, canvas.width, canvas.height);
        var imageData = context2d.getImageData(0, 0, canvas.width, canvas.height);
        matchPixCount = 0;
        endPixCheck = imageData.data.length;
        maxPixCount = imageData.data.length / 4;

        for (var pix = 0; pix < endPixCheck; pix += 4) {
            var currentColor = {
                r: imageData.data[pix],
                g: imageData.data[pix + 1],
                b: imageData.data[pix + 2]
            };
            var colorDifference = Math.sqrt(
                Math.pow(currentColor.r - sampleColor.r, 2) +
                Math.pow(currentColor.g - sampleColor.g, 2) +
                Math.pow(currentColor.b - sampleColor.b, 2)
            );
            // difference in color it is difference in color vectors (r1,g1,b1) <=> (r2,g2,b2)
            if (colorDifference <= maxColorDifference * pixTolerance) {
                matchPixCount++;
            }
        }

        if (maxPixCount - matchPixCount <= maxPixCount * frameTolerance) {
            return false;
        } else {
            return true;
        }
    }

    function dropBlackFrames(_frames, _framesToCheck, _pixTolerance, _frameTolerance) {
        var localCanvas = document.createElement('canvas');
        localCanvas.width = canvas.width;
        localCanvas.height = canvas.height;
        var context2d = localCanvas.getContext('2d');
        var resultFrames = [];

        var checkUntilNotBlack = _framesToCheck === -1;
        var endCheckFrame = (_framesToCheck && _framesToCheck > 0 && _framesToCheck <= _frames.length) ?
            _framesToCheck : _frames.length;
        var sampleColor = {
            r: 0,
            g: 0,
            b: 0
        };
        var maxColorDifference = Math.sqrt(
            Math.pow(255, 2) +
            Math.pow(255, 2) +
            Math.pow(255, 2)
        );
        var pixTolerance = _pixTolerance && _pixTolerance >= 0 && _pixTolerance <= 1 ? _pixTolerance : 0;
        var frameTolerance = _frameTolerance && _frameTolerance >= 0 && _frameTolerance <= 1 ? _frameTolerance : 0;
        var doNotCheckNext = false;

        for (var f = 0; f < endCheckFrame; f++) {
            var matchPixCount, endPixCheck, maxPixCount;

            if (!doNotCheckNext) {
                var image = new Image();
                image.src = _frames[f].image;
                context2d.drawImage(image, 0, 0, canvas.width, canvas.height);
                var imageData = context2d.getImageData(0, 0, canvas.width, canvas.height);
                matchPixCount = 0;
                endPixCheck = imageData.data.length;
                maxPixCount = imageData.data.length / 4;

                for (var pix = 0; pix < endPixCheck; pix += 4) {
                    var currentColor = {
                        r: imageData.data[pix],
                        g: imageData.data[pix + 1],
                        b: imageData.data[pix + 2]
                    };
                    var colorDifference = Math.sqrt(
                        Math.pow(currentColor.r - sampleColor.r, 2) +
                        Math.pow(currentColor.g - sampleColor.g, 2) +
                        Math.pow(currentColor.b - sampleColor.b, 2)
                    );
                    // difference in color it is difference in color vectors (r1,g1,b1) <=> (r2,g2,b2)
                    if (colorDifference <= maxColorDifference * pixTolerance) {
                        matchPixCount++;
                    }
                }
            }

            if (!doNotCheckNext && maxPixCount - matchPixCount <= maxPixCount * frameTolerance) {
                // console.log('removed black frame : ' + f + ' ; frame duration ' + _frames[f].duration);
            } else {
                // console.log('frame is passed : ' + f);
                if (checkUntilNotBlack) {
                    doNotCheckNext = true;
                }
                resultFrames.push(_frames[f]);
            }
        }

        resultFrames = resultFrames.concat(_frames.slice(endCheckFrame));

        if (resultFrames.length <= 0) {
            // at least one last frame should be available for next manipulation
            // if total duration of all frames will be < 1000 than ffmpeg doesn't work well...
            resultFrames.push(_frames[_frames.length - 1]);
        }

        return resultFrames;
    }

    var isPaused = false;

    this.pause = function() {
        isPaused = true;
    };

    this.resume = function() {
        isPaused = false;
    };

    this.onstop = function() {};
}

export default WhammyRecorderHelper;