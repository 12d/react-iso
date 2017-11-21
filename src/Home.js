/**
 * @author xuweichen@meitu.io
 * @date 2017/8/25
 */
import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';
import AnimatedWrapper from './common/AnimatedWrapper';
import WebCam from './common/WebCam/WebCam';
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
                    <WebCam audio={false} style={{height:300,width:100}} onCapture={this.onCapture.bind(this)} />
                }
            </div>
        )
    }
}

export default AnimatedWrapper(Home)