const http = require('http');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
var survey = require(../)

var express = require('express');
var app = express();

var intro = 'If you are having an emergency or need help and have not called Nine One One yet, hang up and call Nine One One immediately. Otherwise please stay on the line to answer some quick questions about your situation.';

var questions = [
    'How old are you?',
    'Are you at a hackathon',
    'How many siblings do you have?',
    'Please press 4 if you do not like spiders',
];

var currentSurveyPositions = {};

exports.interview = function(req, res) {
    var phone = req.body.From;
    var input = req.body.RecordingUrl || req.body.Digits;
    var twiml = new VoiceResponse();

    function say(text) {
        twiml.say(text);
    }

    function respond() {
        res.type('text/xml');
        res.send(twiml.toString());
    }

    // Here is where we need to decide which survey question to ask
    // A database is ideally involved but for now we just hold arrays of qs
    // and dicts of surveys

    if(phone in currentSurveyPositions){

        var qIndex = currentSurveyPositions[phone];
        var questionText = questions[qIndex];
        currentSurveyPositions[phone]++;

        if currentSurveyPositions == 


    } else { // There is no survey 
        currentSurveyPositions[phone] = 0;



    }

}

app.post('/voiceintro', function(req,res){
    //res.send(req.body);
    console.log("test");

    const twiml = new VoiceResponse();
    //***console.log(req.body.From);
    twiml.say('If you are having an emergency or need help and have not called Nine One One yet, hang up and call Nine One One immediately. Otherwise please stay on the line to answer some quick questions about your situation.');

    /*
    function say(text) {
        twiml.say({ voice: 'alice'}, text);
    }

    // respond with the current TwiML content
    function respond() {
        response.type('text/xml');
        response.send(twiml.toString());
    }
    */

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


