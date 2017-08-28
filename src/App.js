/**
 * @author xuweichen@meitu.io
 * @date 2017/8/24
 */
import React,{Component} from 'react';
// import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
// import css from './css/base.css';
import {
    Route,
    Link
} from 'react-router-dom'
import Home from './Home';
import List from './List';
import Detail from './pages/Detail';
import AsyncComponent from './common/AsyncComponent';
export default class App extends Component {
    render(){
        return (
                <div>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/list" component={List}/>
                    <Route path="/detail/:id" render={AsyncComponent(Detail)}/>
                </div>
        )
    }
    constructor(){
        super()
    }
    componentDidMount(){

    }
}