import React, { Component } from 'react'
import PropTypes from 'prop-types';
const styles = {
    video: {
        height: 200,
        width: 200,
    },
}
const BUTTON_LABELS = {
    '0': 'start',
    '1': 'stop',
}
/**
 *
 * @type {{audio: boolean, video: {optional: [null,null,null,null,null]}}}
 */
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
if (!navigator.getUserMedia) {
    navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia
}
var getCamera = (options) => navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    navigator.mediaDevices.getUserMedia(options) ||
    navigator.getUserMedia && new Promise((resolve, reject) => {
        navigator.getUserMedia(options, (stream) => {
            resolve(stream)
        }, (e) => {
            reject(e)
        })
    })
// var getCamera = (options) => navigator.mediaDevices && navigator.mediaDevices.getUserMedia(options) || new Promise((resolve, reject)=>{
//     navigator.getUserMedia();
// });
var mediaRecorderOptions;

mediaRecorderOptions = {mimeType: 'video/webm;codecs="vp9,vp8"'}
// mediaRecorderOptions = {mimeType: 'video/webm;codecs=vp9,vp8'}
const isSupported = getCamera && window.URL && window.FileReader && window.MediaRecorder;

class WebCam extends Component {
    constructor () {
        super()
        this.state = {
            status: 0,
            previewSource: null,
        }
        this.mediaRecorder = null
    }

    render () {
        let videoOptions = this.props.video
        return (
            WebCam.isSupported() ?
            <div style={this.props.style}>
                <video src={this.state.previewSource} height={videoOptions.height} width={videoOptions.width}
                       ref="stage" style={[styles.video, this.props.videoStyle]} />
                <button onClick={this.handleButtonClick.bind(this)}>{BUTTON_LABELS[this.state.status]}</button>
                <button onClick={this.getUserMedia.bind(this)}>reset</button>
            </div> :
            <div>not supported browser</div>
        )
    }

    componentDidMount () {
        this.getUserMedia()
    }

    isLive () {
        return !(this.recordChunks && this.recordChunks.length)
    }

    blobToData (blob) {

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

    previewStream (stream, videoStage, isRecord) {
        if (isRecord) {
            //部分chrome版本（例如三星s8的5.4版本内置浏览器，采用chrome51.0.2704.106内核）无法直接展示URL.createObjectURL(dataBlob)的数据
            //所以先借助ajax转化成base64的数据，再进行预览
            this.blobToData(stream).then(rs => {
                videoStage.src = rs
                videoStage.controls = true
            })
        } else {
            videoStage.src = URL.createObjectURL(stream)
            videoStage.controls = false
            videoStage.onloadedmetadata = (e) => {
                !isRecord && videoStage.play()
            }

        }
    }

    handleButtonClick () {
        this.setState({
            status: this.state.status ^ 1
        }, () => {
            this.mediaRecorder[this.state.status ? 'start' : 'stop']()
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

    handleStream (stream) {

        // debugger;
        this.cameraStream = stream
        this.recordChunks = []
        this.previewStream(stream, this.refs.stage, false);
        this.mediaRecorder = new MediaRecorder(stream, mediaRecorderOptions)
        // this.mediaRecorder = new MediaRecorder(stream,{
        //     mimeType: "video/webm;codecs=vp9,vp8"
        // })
        this.mediaRecorder.addEventListener('stop', this.handleRecordStop.bind(this, stream))
        this.mediaRecorder.addEventListener('start', this.handleRecordStart.bind(this))
        this.mediaRecorder.addEventListener('dataavailable', this.handleRecordDataAvailable.bind(this))
    }

    handleRecordStop (stream) {
        let dataBlob = new Blob(this.recordChunks, {
            type: this.mediaRecorder.mimeType,
        })

        this.releaseUserMedia()
        this.previewStream(dataBlob, this.refs.stage, true)
        this.props.onCapture.call(this, dataBlob)

    }

    handleRecordStart () {

    }

    handleRecordDataAvailable ({data}) {
        data.size > 0 && this.recordChunks.push(data)
    }

    releaseUserMedia () {
        this.cameraStream && this.cameraStream.getVideoTracks()[0].stop()
    }

    getUserMedia () {
        getCamera({
            "audio": true,//必须得标准的JSON格式(属性名用双引号)，否则低版本webkitGetUserMedia会报错，malformed constrants
            "video": true,
        }).then(this.handleStream.bind(this))
    }
    takeSnapShot () {}
    static isSupported () {
        return isSupported;
    }
    static defaultProps = {
        audio: true,
        video: {width: 300, height: 300},
    }
}

export default WebCam
