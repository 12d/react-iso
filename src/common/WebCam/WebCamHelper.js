/**
 *
 * @type {{audio: boolean, video: {optional: [null,null,null,null,null]}}}
 */
// import MediaRecorder from "./MediaRecorder";

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

if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia
}

window.URL = window.URL || window.webkitURL || window.mozURL;

var getCamera = (options) => navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    navigator.mediaDevices.getUserMedia(options) ||
    navigator.getUserMedia && new Promise((resolve, reject) => {
        navigator.webkitGetUserMedia(options, (stream) => {
            resolve(stream)
        }, (e) => {
            reject(e)
        })
    });


const isSupported = getCamera && window.URL && window.FileReader && window.MediaRecorder;

var tempCanvas = document.createElement('canvas');
var tempVideo = document.createElement('video');


/**
 * @class helper for web camera
 */
export default class WebCamHelper {
    static isSupported = () => isSupported
    static dataURLtoBlob (dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }
    static blobToDataURL (blob) {

        return new Promise((resolve, reject) => {
            var blobUrl = URL.createObjectURL(blob)

            var xhr = new XMLHttpRequest()
            xhr.responseType = 'blob'

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
    releaseUserMedia () {
        this.live && this.live.getVideoTracks()[0].stop()
    }
    constructor () {
        this._recordChunks = []
    }
    getCamera (options, cb) {
        this.options = options;

        getCamera(options).then(stream=>{
            this.live = stream;
            cb && cb(this.getStreamURI(stream), stream)
        })
    }
    getStreamURI (stream) {
        this._uri = URL.createObjectURL(stream);
        return URL.createObjectURL(stream)
    }
    snapshot (video) {
        var context,
            height = video.height,
            width = video.width;

        tempCanvas.height = height;
        tempCanvas.width = width;

        context = tempCanvas.getContext('2d');
        context.drawImage(video, 0, 0, width, height);
        return tempCanvas.toDataURL()
    }
    _onRecordDataAvailable ({data}) {
        console.log(data)
        data && data.size > 0 && this._recordChunks.push(data);
    }
    _onRecordStop () {
        console.log(this._recordChunks,'_recordChunks')
        if (this.__recordCompleteCallback){
            let dataBlob = new Blob(this._recordChunks, {
                type: this._recorder.mimeType,
            })
            // cb(this.getStreamURI(dataBlob), dataBlob);
            WebCamHelper.blobToDataURL(dataBlob).then(rs=>{
                this.__recordCompleteCallback(rs, dataBlob)
            })

        }

    }
    record () {
        // this._recordChunks = [];
        this._recorder = new MediaRecorder(this.live, mediaRecorderOptions);
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
