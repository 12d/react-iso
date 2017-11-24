/**
 * @author xuweichen@meitu.io
 * @date 2017/8/25
 */
import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';
import AnimatedWrapper from './common/AnimatedWrapper';
// import WebCam from './common/WebCam/WebCam';
import UIWebCam from './common/WebCam/UIWebCam';
class Home extends Component {
    onCapture (rs) {
        console.log(rs)
    }
    render () {
        return (
            <div style={{backgroundColor: 'green'}}>
                <h1>首页</h1>
                <Link to="/list">打开列表页</Link>

                {
                    <div>
                        <UIWebCam ref="camera"/>
                        <button onClick={this.onCapture.bind(this)}>Capture</button>
                        <button onClick={this.onRecordStart.bind(this)}>start record</button>
                        <button onClick={this.onRecordStop.bind(this)}>stop record</button>
                        <button onClick={this.onReset.bind(this)}>reset Camera</button>
                    </div>
                }

            </div>
        )
    }
    onReset () {
        this.refs.camera.prepare();
    }
    onCapture () {
        // var img = new Image();

        this.refs.camera.snapshot();
        // document.body.appendChild(img);
    }
    onRecordStart () {
        this.refs.camera.record()
    }
    onRecordStop () {
        this.refs.camera.recordEnd().then(({uri,blob})=>{
            console.log(blob, 'recorded video');
            this.refs.camera.download(blob)
        })
    }
}

export default AnimatedWrapper(Home)