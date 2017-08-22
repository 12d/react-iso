/**
 * @author xuweichen@meitu.io
 * @date 2017/8/22
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import css from './css/base.css';
class App extends Component{
    render(){
        return (
            <h1>
                By react-ssr
            </h1>
        )
    }
    constructor(){
        super()
    }
    componentDidMount(){

    }
}
ReactDOM.render(<App/>, document.getElementById('app'))