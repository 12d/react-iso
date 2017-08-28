/**
 * @author xuweichen@meitu.io
 * @date 2017/8/25
 */
import React, {Component} from 'react';

export default class Detail extends Component {
    render(){
        return (
            <div>
                <h1>详情页</h1>
                <p>id: {this.props.match.params.id}</p>
            </div>
        )
    }
}