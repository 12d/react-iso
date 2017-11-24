/**
 *
 * @type {{audio: boolean, video: {optional: [null,null,null,null,null]}}}
 */
let MediaRecorder  = window.MediaRecorder || require("./MediaRecorder").default;

const mediaConstraints = {
    'audio': true,
    'video': {
        'optional': [
            {
                "minWidth": 1024
            },
            {
                "maxWidth": 1024
            },
            {
                "minFrameRate": 15
            },
            {
                "maxFrameRate": 15
            },
            {
                "width": {
                    "max": 1024
                },
                "frameRate": {
                    "min": 10,
                    "ideal": 15,
                    "max": 30
                }
            }
        ]
    }
}

const mediaRecorderOptions = {mimeType: 'video/webm;codecs="vp9,vp8"'}
//navigator.getUserMedia已被新版弃用，被移至navigator.mediaDevices.getUserMedia上
// @see https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices
if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia
}

window.URL = window.URL || window.webkitURL || window.mozURL;
const isNewerVersion = !!navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia;

var getCamera = (options) => isNewerVersion &&
    navigator.mediaDevices.getUserMedia(options) ||
    navigator.getUserMedia && new Promise((resolve, reject) => {
        navigator.getUserMedia(options, (stream) => {
            resolve(stream)
        }, (e) => {
            reject(e)
        })
    });


const isSupported = !!(getCamera && window.URL && window.FileReader && MediaRecorder);

var tempCanvas = document.createElement('canvas');
var tempVideo = document.createElement('video');


/**
 * @class helper for web camera
 */
export default class WebCamHelper {
    static isSupported = () => isSupported;
    static dataURLtoBlob (dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

    /**
     * 方法中使用到的URL.createObjectURL, 在新版本浏览器的MediaStream上使用做了限制，可以用HTMLMediaElement.srcObject代替 @see https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/srcObject
     * @param blob
     * @returns {Promise}
     */
    static blobToDataURL (blob) {

        return new Promise((resolve, reject) => {
            var blobUrl = URL.createObjectURL(blob)

            var xhr = new XMLHttpRequest()
            xhr.responseType = 'blob';

            xhr.onload = function () {
                var recoveredBlob = xhr.response

                var reader = new FileReader()

                reader.onload = function () {
                    resolve(reader.result)
                }

                reader.readAsDataURL(recoveredBlob)
            }

            xhr.open('GET', blobUrl)
            xhr.send()
        })
    }
    download (url) {

        var a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = 'test.webm'
        document.body.appendChild(a)
        a.click()
    }
    releaseUserMedia () {
        this.live && this.live.getVideoTracks()[0].stop()
    }
    constructor () {
        this._recordChunks = []
    }
    getCamera (options, cb) {
        this.options = options;
        /*必须.call(navigator)的方式去调用，否则手机端会报错*/
        getCamera.call(navigator, this._adaptOptions(options)).then(stream=>{

            this.live = stream;
            cb && cb(this.getStreamURI(stream), stream)
        }).catch(err=>{
            console.log(err,this._adaptOptions(options))
        })
    }
    _adaptOptions(options){
        options = Object.assign({}, options);

        var video = Object.assign({}, options.video),
            height = video.height,
            width = video.width;
        if(!isNewerVersion) {
            video = {};
            video.mandatory = {
                "maxWidth": width||480,
                "maxHeight": height||640
            }
            options.video = video;
        }

        return options;
    }
    getStreamURI (stream) {
        return "srcObject" in HTMLMediaElement.prototype ? null : URL.createObjectURL(stream)
    }
    snapshot (video) {
        var context,
            videoOptions = this.options.video;
        tempCanvas.height = videoOptions.height || video.videoHeight;
        tempCanvas.width = videoOptions.width || video.videoWidth;

        context = tempCanvas.getContext('2d');
        context.drawImage(video, 0, 0);
        return tempCanvas.toDataURL()
    }
    _onRecordDataAvailable ({data}) {
        data && data.size > 0 && this._recordChunks.push(data);
    }
    _onRecordStop () {
        if (this.__recordCompleteCallback){
            console.log(this._recorder.mimeType,'this._recorder.mimeType')
            let dataBlob = new Blob(this._recordChunks, {
                type: 'video/webm'
                // type: this._recorder.mimeType,
            })
            // cb(this.getStreamURI(dataBlob), dataBlob);
            WebCamHelper.blobToDataURL(dataBlob).then(rs=>{
                this.__recordCompleteCallback(rs, dataBlob)
            })

        }

    }

    /**
     *
     * @param {HTMLElement} video 需要进行录制的video 元素，仅仅使用在浏览器端不支持MediaRecorder对象时
     */
    record (video) {
        // this._recordChunks = [];
        this._recorder = new MediaRecorder(this.live, mediaRecorderOptions, video);
        this._recorder.ondataavailable=this._onRecordDataAvailable.bind(this);
        this._recorder.onstop=this._onRecordStop.bind(this);
        this._recorder.start();
        // console.log('start recorder')
    }
    stopRecord (cb) {
        let self = this;
        this.__recordCompleteCallback = cb;
        if (this._recorder && this._recorder.state === 'recording') {
            self._recorder.stop();

        }else{
            throw new Error('stream is inactive')
        }

    }


}
