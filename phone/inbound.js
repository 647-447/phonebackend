const http = require('http');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const MessagingResponse = require('twilio').twiml.MessagingResponse;

const appName = 'Oh, Shit';

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var intro = 'Thank you for calling '+appName+'. If you have an emergency  and have not called Nine One One, hang up and call immediately. Otherwise Please enter your five digit zip code followed by the star key.';

var zipQuestion = 'Please enter your five digit zip code followed by the star key.';

var questions = [
    'Are you in immediate danger?',
    'Can you move away from your current location if you chose?',
    'Do you need medical assistance?'
];

//var currentSurveyPositions = {};
var currentCallSessions = {};

function resolveZipToCityState(zip) {
    // lol we could use networking here
    var city = 'Fremont';
    var state = 'California'

    return {'city':city, 'state': state};
}
 
var phone = {};

function isEmpty(obj) {
   for(var key in obj) {
       if(obj.hasOwnProperty(key))
           return false;
   }
   return true;
}

app.get('/phone', function(req,res){
   if (!isEmpty(phone)) {
    
        const twiml = new VoiceResponse();
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Test');
        console.log(res);
    }


});

app.post('/voice', function(req,res){
    var input = req.body.Digits;
    var incomingphone = req.body.From;
    //res.send(req.body);
    console.log("test");

    const twiml = new VoiceResponse();
    //console.log('parsed req.body' , JSON.parse((req.body)));
    console.log('req.body' , req.body.From);
    //console.log('req.input' , input);

    function say(text) {
        twiml.say( text);
    }

    // respond with the current TwiML content
    function respond() {
        response.type('text/xml');
        response.send(twiml.toString());
    }





    // Now read the stuff and do the actual whatever

    var questionText;
    var isLastQuestion = false;

    if(incomingphone in currentCallSessions){ 

        // The phone number is in a survey position and therefore can skip
        // to the next bit of info insted of starting from beginning
        // Since this flow only has two stages (1. Enter ZIP, 2. Do this)
        // This naturally means we are in the second stage


        // This is where we would find the user's city and state if we wanted
        // to do it programmatically and not hard coded
        // The numbers for zip would be stored in the input variable


        var citystate = resolveZipToCityState(input);
        var city = citystate.city;
        var state = citystate.state;

        console.log(input);

        // This is the last interaction with them so we can just read to them
        // and delete their information

        delete currentCallSessions[incomingphone];

        // Construct the question text

        questionText = 'You are in '+city+', '+state+ '. There is a wildfire in Eastern Hayward. It is moving south at approximately 8 miles per hour. Fremont is within its path. Evacuate Immediately to the West Bay Area or further inland East. The Dumbarton bridge is congested. Use interstate 880 South instead.';


        /*
        var url = 'http://nkhosla.com/dl/AngelHackAssets/mms.jpg'
        const response = new MessagingResponse();
        const message = response.message();
        message.body('A Map of Your Area');
        message.media(url);

        twiml.sms(message);
        */


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
        questionText = intro;// + '  '+ zipQuestion;
        currentCallSessions[incomingphone] = true;
        //currentSurveyPositions[phone] = 1;
    }

    //twiml.say('Emergency?');

    function gather(qText) {
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

    gather(questionText);

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


var smsSessions = {};

app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();

    console.log(req);
    var phone = req.body.From;
    var body = req.body.Body;

    var responseText;

    if(phone in smsSessions){

        var zip = body;

        var citystate = resolveZipToCityState(zip);
        var city = citystate.city;
        var state = citystate.state;

        responseText = 'You are in '+city+', '+state+ '. There is currently a wildfire in Eastern Hayward. It is is moving south at a rate of approximately 8 miles per hour. Fremont is within the fires path and immediate evacuation to the West Bay Areea or further inland Eastis recommended. Note that the Dumbarton bridge going West is congested. Use interstate 880 South instead.';

        delete smsSessions[phone];

    } else { // no session so create one (not two, only one.)

        smsSessions[phone] = true;

        responseText = 'Than you for texting'+appName+'. Please respond with the 5 digit ZIP code of your current location for further information.';

    }

    
  
    twiml.message(responseText);
  
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  });

var server = http.createServer(app);
server.listen(1337, function() {
    console.log('Express server started on *:'+1337);
});


