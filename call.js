const accountSid = 'AC0c32f3307ec6587cb5b738c369d770c8';
const authToken = 'dc577b13437d27b54c6f4860648a978f';
const Twilio = require('twilio');
const client = new Twilio(accountSid, authToken);

client.api.calls
  .create({
    url: 'http://demo.twilio.com/docs/voice.xml',
    to: '+14087262297',
    from: '+14424447448',
  })
  .then(call => console.log(call.sid));