/**
 * @author xuweichen@meitu.io
 * @date 2017/8/25
 */
import React, {Component} from 'react';
import {
    Link
} from 'react-router-dom'
import AnimatedWrapper from "./common/AnimatedWrapper";
class List extends Component {
    render(){
        return (
            <div style={{backgroundColor:'green'}}>
                <h1>列表页</h1>
                <Link to="/detail/1">打开详情页</Link>
            </div>
        )
    }
    componentWillAppear(){
        console.log('componentWillAppear')
    }
    componentWillEnter(){
        console.log('componentWillEnter')
    }
    componentWillLeave(){
        console.log('componentWillLeave')
    }
}
export default AnimatedWrapper(List)