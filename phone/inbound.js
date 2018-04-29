const http = require('http');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var intro = 'If you are having an emergency or need help and have not called Nine One One yet, hang up and call Nine One One immediately. Otherwise please stay on the line for useful information.';

var zipQuestion = 'Please enter your five digit zip code.';

var questions = [
    'Are you in immediate danger?',
    'Can you move away from your current location if you chose?',
    'Do you need medical assistance?'
];

var currentSurveyPositions = {};
 
app.post('/voice', function(req,res){
    var input = req.body.Digits;
    var phone = req.body.From;
    //res.send(req.body);
    console.log("test");

    const twiml = new VoiceResponse();
    //console.log('parsed req.body' , JSON.parse((req.body)));
    console.log('req.body' , req.body.From);
    //console.log('req.input' , input);

    function say(text) {
        twiml.say({ voice: 'alice'}, text);
    }

    // respond with the current TwiML content
    function respond() {
        response.type('text/xml');
        response.send(twiml.toString());
    }

    var questionText;
    var isLastQuestion = false;

    if(phone in currentSurveyPositions){ 

        // The phone number is in a survey position and therefore can skip
        // to the next bit of info insted of starting from beginning




        /*
        var qIndex = currentSurveyPositions[phone];
        questionText = questions[qIndex];
        currentSurveyPositions[phone]++;

        // if we have reached the end of the array then we delete the session
        if(currentSurveyPositions == questions.length) {
            delete currentSurveyPositions[phone];
            isLastQuestion = true
        }

        */

    } else { // There is no survey, so read intro and question 1
        questionText = intro + '  '+ questions[0];
        currentSurveyPositions[phone] = 1;
    }

    //twiml.say('Emergency?');

    function gather(qText, isLastQuestion) {
        say(qText);
        

        const gather = twiml.gather({
            timeout: 10,
            finishOnKey: '*'
        });
    }
        /*
        const gatherNode = twiml.gather({ numDigits: 1 });
        gatherNode.say('For sales, press 1. For support, press 2.');

        // If the user doesn't enter input, loop
        twiml.redirect('/voice');
        */
    //}

    gather(questionText, isLastQuestion);

    /*
    if (input) {
    switch (input) {
      case '1':
        twiml.say('You selected safe. Good for you!');
        break;
      case '2':
        twiml.say('You need support. We will help!');
        break;
      default:
        twiml.say("Sorry, I don't understand that choice.").pause();
        gather();
        break;
    }
    } else { */
    //    gather();
    //}




    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
    console.log('twiml', twiml.toString());

});

var server = http.createServer(app);
server.listen(1337, function() {
    console.log('Express server started on *:'+1337);
});


