/**
 * @author xuweichen@meitu.io
 * @date 2017/8/25
 */
import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
import AnimatedWrapper from "./common/AnimatedWrapper";
class Home extends Component{
    render(){
        return (
            <div style={{backgroundColor:'yellow'}}>
                <h1>首页</h1>
                <Link to="/list">打开列表页</Link>
            </div>
        )
    }
}

export default AnimatedWrapper(Home)