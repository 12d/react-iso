import React, { Component } from 'react'
import PropTypes from 'prop-types';
import WebCamHelper from './WebCamHelper';

class UIWebCam extends Component {
    render () {
        var videoOptions = this.props.mediaOptions.video;
        return (
            <div>
                <h1>UIWebCam</h1>
                {
                    this.state.previewSource ?
                        <video autoPlay={true} src={this.state.previewSource} height={videoOptions.height} width={videoOptions.width} ref="stage" />
                        : null
                }
                <button onClick={this.onCapture.bind(this)}>Capture</button>
                <button onClick={this.onStartRecord.bind(this)}>start record</button>
                <button onClick={this.onStopRecord.bind(this)}>stop record</button>
            </div>
        )
    }
    constructor () {
        super();
        this.helper = new WebCamHelper();
        this.state = {
            previewSource: null
        }
    }
    componentDidMount () {
        this.helper.getCamera(this.props.mediaOptions, (uri)=>{
            this.setState({
                previewSource: uri
            })
        })
    }
    onCapture () {

    }
    onStartRecord () {
        this.helper.record()
    }
    onStopRecord () {
        this.helper.stopRecord((uri)=>{
            this.helper.releaseUserMedia();
            setTimeout(()=>{
                this.setState({
                    previewSource: uri
                })
            },1000)
        })
    }
    static defaultProps = {
        mediaOptions: {
            "audio": true,
            "video": {
                "height": 300,
                "width": 300
            }
        }
    }
}

export default UIWebCam