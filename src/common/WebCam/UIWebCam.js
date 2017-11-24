import React, { Component } from 'react'
import PropTypes from 'prop-types';
import WebCamHelper from './WebCamHelper';
var styles = {
    stage: {
        width: "100%"
    }
}
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
                        // @see https://webkit.org/blog/6784/new-video-policies-for-ios/
                        // ios 上必须加playsinline/muted/autoplay，否则ios上无法自动播放
                        <video style={styles.stage} playsInline="true"  muted={true} autoPlay={true} onError={this.videoOnError.bind(this)} controls={this.state.isPlayback} src={this.state.previewSource} ref="stage" />
                        : null
                }
                {
                    this.state.photo ?
                        <img style={styles.stage} src={this.state.photo}/>
                        : null
                }
            </div>
                :
            <div>web camera is not supported</div>
        )
    }
    videoOnError (e) {

        console.log(e)
    }
    constructor () {
        super();
        this.helper = new WebCamHelper();
        this.state = {
            previewSource: null,
            photo: null,
            isPlayback: false
        }
    }
    componentDidMount () {
        this.prepare();

    }
    reset () {
        this.setState({
            previewSource: null,
            photo: null,
            isPlayback: false
        })
    }
    prepare () {
        this.reset();
        return new Promise((resolve, reject)=>{
            this.helper.getCamera(this.props.mediaOptions, (uri,stream)=>{
                resolve();
                this.setState({
                    previewSource: uri || stream
                },()=>{
                    //safari 11中 MediaStream必须通过srcObject指定，而react 16 beta中无法通过setState设置srcObject
                    !uri && (this.refs.stage.srcObject = stream);
                })
            })
        })
    }
    snapshot (){

        var photo = this.helper.snapshot(this.refs.stage);
        this.helper.releaseUserMedia();
        this.setState({
            previewSource: null,
            photo
        })
        return photo;
    }

    record () {
        this.helper.record(this.refs.stage)
    }
    download (blob) {
        this.helper.download(blob)
    }
    recordEnd () {
        return new Promise((resolve, reject)=>{
            this.helper.stopRecord((uri,blob)=>{
                this.helper.releaseUserMedia();
                this.refs.stage.srcObject=null;//清理srcObject,否则回访继续回从srcObject读取，导致设置src无效

                this.setState({
                    isPlayback: true,
                    previewSource: uri //TODO: 这行导致UC开发版本闪退
                }, ()=>{
                    resolve({
                        uri, blob
                    });
                    // 三星浏览器无法通过setState()来更新src，而chrome必须以setState
                    // var video = this.refs.stage;
                    // video.onerror=function(e){
                    //     console.log(e)
                    // }
                    //
                    // video.src=uri;
                    // video.autoplay=true;
                    // video.controls=true;
                    // document.body.appendChild(video)
                    console.log('update success')
                })


            })
        })

    }
    static defaultProps = {
        mediaOptions: {
            "audio": false,
            "video": {
                "facingMode": {
                    "ideal": "user"
                },
                "height": 640,
                "width": 480
            }
        }
    }
}

export default UIWebCam