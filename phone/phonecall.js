var express = require('express');
var http = require('http');
var voice = require('./voice');
var app = express();

// Create HTTP server and mount Express app

app.get('/', function(req,res){
	res.send('Hello World');
});

app.get('/voice', voice.interview);

var server = http.createServer(app);
server.listen(8080, function() {
    console.log('Express server started on *:'+8080);
});
