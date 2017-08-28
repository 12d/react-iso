/**
 * @author xuweichen@meitu.io
 * @date 2017/8/25
 */
var fs = require('fs');
var url = require('url');

//添加MIME类型
var MIME_TYPE = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};
function handle(request, response){
    var pathname = url.parse(request.url).pathname;
    var realPath = path.join(process.cwd(),'dist',pathname);
    var ext = path.extname(realPath);
    ext = ext?ext.slice(1) : 'unknown';
    var contentType = MIME_TYPE[ext] || "text/plain";

    fs.exists(realPath, function (exists) {

        if (!exists) {
            console.log("This request URL " + pathname + " was not found on this server.")
            response.writeHead(404, {'Content-Type': 'text/plain'});

            response.write("This request URL " + pathname + " was not found on this server.");

            response.end();

        } else {

            fs.readFile(realPath, "binary", function(err, file) {

                if (err) {

                    response.writeHead(500, {'Content-Type': 'text/plain'});

                    response.end(err);

                } else {

                    response.writeHead(200, {'Content-Type': contentType});

                    response.write(file, "binary");

                    response.end();

                }

            });

        }

    });
}

module.exports = handle;