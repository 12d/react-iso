import React, { Component } from 'react'
import PropTypes from 'prop-types';
import WebCamHelper from './WebCamHelper';

class UIWebCam extends Component {
    render () {
        var videoOptions = this.props.mediaOptions.video;
        return (
            WebCamHelper.isSupported()
              ?
            <div>
                <h1>UIWebCam</h1>
                {
                    this.state.previewSource ?
                        <video autoPlay={true} onError={this.videoOnError.bind(this)} controls={this.state.isPlayback} src={this.state.previewSource} height={videoOptions.height} width={videoOptions.width} ref="stage" />
                        : null
                }
                <button onClick={this.onCapture.bind(this)}>Capture</button>
                <button onClick={this.onStartRecord.bind(this)}>start record</button>
                <button onClick={this.onStopRecord.bind(this)}>stop record</button>
            </div>
                :
            <div>web camera is not supported</div>
        )
    }
    videoOnError (e) {
        debugger
    }
    constructor () {
        super();
        this.helper = new WebCamHelper();
        this.state = {
            previewSource: null,
            isPlayback: false
        }
    }
    componentDidMount () {
        this.prepare()
    }
    prepare () {
        this.helper.getCamera(this.props.mediaOptions, (uri)=>{
            this.setState({
                previewSource: uri
            })
        })
    }
    onCapture () {
        var img = new Image();
        img.src = this.helper.snapshot(this.refs.stage);
        document.body.appendChild(img);
    }
    onStartRecord () {
        this.helper.record(this.refs.stage)
    }
    onStopRecord () {
        this.helper.stopRecord((uri,blob)=>{
            this.helper.releaseUserMedia();

            this.setState({
                isPlayback: true
                // src: uri //TODO: 这行导致UC开发版本闪退
            }, ()=>{
                // 三星浏览器无法通过setState()来更新src，而chrome必须以setState
                var video = this.refs.stage;
                video.src=uri;
                video.autoplay=true;
                video.controls=true;
            })


        })
    }
    static defaultProps = {
        mediaOptions: {
            "audio": true,
            "video": {
                "height": 160,
                "width": 120
            }
        }
    }
}

export default UIWebCam