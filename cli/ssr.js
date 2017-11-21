/**
 * @author xuweichen@meitu.io
 * @date 2017/8/25
 */
"use strict";
/**
 * @author xuweichen@meitu.io
 * @date 2017/7/13
 */
const cluster = require('cluster');
// const http = require('http');
const express = require('express');
const numCPUs = require('os').cpus().length;
var fs = require('fs');
var url = require('url');
var path = require('path');
//https 相关
var http = require('http');
var https = require('spdy');
var privateKey  = fs.readFileSync(path.resolve(__dirname,'../temp/private.pem'), 'utf8');
var certificate = fs.readFileSync(path.resolve(__dirname,'../temp/file.crt'), 'utf8');

require('../dist/main');
var htmlTemplate = fs.readFileSync(path.resolve(__dirname,'../dist','index.html'),'utf8');
var htmlPrefixIndex = htmlTemplate.indexOf('<preload></preload>');
var htmlPrefix = htmlTemplate.substring(0,htmlPrefixIndex);
htmlTemplate = htmlTemplate.substring(htmlPrefixIndex+19);
var compress = require('compression');
function renderFullPage(html, initialState, startTime){
    return htmlTemplate.replace(/\<viewstacks\/\>/ig, html+'<script>window.__INITIAL_STATE__ = '+JSON.stringify(initialState)+';window.__RENDER_AT="server"</script>')
}
function logPerf(label, start, end){
    console.log(`[performance]****`,label,end-start);
}
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    // http.createServer((req, res) => {
    //     res.writeHead(200);
    //     res.end('hello world\n');
    // }).listen(1338);
    var app = express();
    //gzip开启压缩
    app.use(compress());
    app.use(express.static('dist'));//静态资源
    app.use(function(req, res){
        const context = {}
        res.status(200).write(htmlPrefix);
        let particialHTML = global.renderReact(req, context);
        console.log(particialHTML);
        /**
         * server push demo
         */
        var stream = res.push('/main.85ee.js', {
            status: 200, // optional
            method: 'GET', // optional
            request: {
                accept: '*/*'
            },
            response: {
                'content-type': 'application/javascript'
            }
        })
        stream.on('error', function(e) {
            console.log(e)
        })
        stream.end(fs.readFileSync('dist/main.85ee.js','binary'))
        // stream.end('console.log("end")');
        res.end(renderFullPage(particialHTML, {}));
    })
    //
    var credentials = {key: privateKey, cert: certificate};

    var httpServer = http.createServer(app);
    var httpsServer = https.createServer(credentials, app);
    var PORT = 5678;
    var SSLPORT = 5679;
    httpServer.listen(PORT, function() {
        console.log('HTTP Server is running on: http://localhost:%s', PORT);
    });
    httpsServer.listen(SSLPORT, function() {
        console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
    });
    console.log(`Worker ${process.pid} started`);
}
