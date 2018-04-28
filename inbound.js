const http = require('http');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

var express = require('express');
var app = express();

app.post('/voice', function(req,res){
    //res.send(req.body);
    console.log("test");

    const twiml = new VoiceResponse();
    console.log(req.body.From);
    twiml.say('Emergency?');

    function say(text) {
        twiml.say({ voice: 'alice'}, text);
    }

    // respond with the current TwiML content
    function respond() {
        response.type('text/xml');
        response.send(twiml.toString());
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());

});



//var server = http.createServer()
/*
http
  .createServer((req, res) => {
    // Create TwiML response
    const twiml = new VoiceResponse();
    //console.log(req.body.From);
    twiml.say('Emergency?');

    function say(text) {
        twiml.say({ voice: 'alice'}, text);
    }

    // respond with the current TwiML content
    function respond() {
        response.type('text/xml');
        response.send(twiml.toString());
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  })
  .listen(1337, '127.0.0.1');
*/

var server = http.createServer(app);
server.listen(1337, function() {
    console.log('Express server started on *:'+1337);
});


