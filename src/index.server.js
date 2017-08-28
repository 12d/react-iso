/**
 * @author xuweichen@meitu.io
 * @date 2017/8/22
 */
import {
    StaticRouter
} from 'react-router-dom';

import React,{Component} from 'react';
import ReactDOM from 'react-dom/server';
import App from './App';
global.renderReact = function(req, context){
    return ReactDOM.renderToString(
        <StaticRouter location={req.url} context={context}>
            <App/>
        </StaticRouter>
    );
}