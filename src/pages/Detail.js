/**
 * @author xuweichen@meitu.io
 * @date 2017/8/25
 */
import React, {Component} from 'react';
import AnimatedWrapper from "../common/AnimatedWrapper";
class Detail extends Component {
    render(){
        return (
            <div style={{backgroundColor:'blue'}}>
                <h1>详情页</h1>
                <p>id: {this.props.match.params.id}</p>
            </div>
        )
    }
}
export default Detail