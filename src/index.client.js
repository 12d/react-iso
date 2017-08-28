/**
 * @author xuweichen@meitu.io
 * @date 2017/8/22
 */
import {
    BrowserRouter
} from 'react-router-dom'
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
ReactDOM.render((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), document.getElementById('app'));