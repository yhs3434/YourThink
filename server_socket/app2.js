// ssl 적용하기 위한 서버
// letsencrypt 이용.

var http = require('http');

http.createServer(function (request, response) {  
    response.writeHead(200, {'Content-Type' : 'text/plain'});
    response.write('Hello nodejs');
    response.end();
}).listen(443);