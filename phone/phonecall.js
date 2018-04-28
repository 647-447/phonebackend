var express = require('express');
var http = require('http');
var app = express();

// Create HTTP server and mount Express app

app.get('/', function(req,res){
	res.send('Hello World');
});

var server = http.createServer(app);
server.listen(8080, function() {
    console.log('Express server started on *:'+8080);
});
