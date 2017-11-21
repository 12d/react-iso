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
                    <UIWebCam />
                }
            </div>
        )
    }
}

export default AnimatedWrapper(Home)