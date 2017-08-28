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
export default class List extends Component {
    render(){
        return (
            <div>
                <h1>列表页</h1>
                <Link to="/detail/1">打开详情页</Link>
            </div>
        )
    }
}