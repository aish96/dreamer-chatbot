var express = require('express');  
var bodyParser = require('body-parser');  
var request = require('request');  
var app = express();

app.use(bodyParser.urlencoded({extended: false}));  
app.use(bodyParser.json());  
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {  
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {  
    if (req.query['hub.verify_token'] === 'dreamer26117') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// handler receiving messages
app.post('/webhook', function (req, res) {  
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];

        if (event.message && event.message.text) {
        	var text = event.message.text;
        	var upperCasedText = text.toUpperCase();
        	var sender = event.sender.id;

				if (upperCasedText.includes('MOOD')) {
				    moodAnalyser(sender);
				  // ignore rest of the event handling
				  continue;
				} else 
				            sendMessage(sender, {text: "Echo: " + text});
				  // ignore rest of the event handling
				  continue;

         }

    }
    res.sendStatus(200);
});

function sendMessage(recipientId, message) {  
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

function moodAnalyser(sender){
	// messageData = {
 //        "attachment": {
 //            "type": "template",
 //            "payload": {
 //                "template_type": "generic",
 //                "elements": [{
 //                    "title": "dreamer",
 //                    "subtitle": "How are you ?",
 //                    // "image_url": myURL + "/appboy_logo.png",
 //                    "buttons": [{
 //                        "type": "web_url",
 //                        "url": "https://www.google.com",
 //                        "title": "Happy"
 //                    },
 //                    {
 //                    	"type": "web_url",
 //                        "url": "https://www.google.com",
 //                        "title": "Sad"
 //                    },
 //                    {
 //                    	"type": "web_url",
 //                        "url": "https://www.google.com",
 //                        "title": "Angry"
 //                    },
 //                    {
 //                    	"type": "postback",
 //                        "url": "https://www.google.com",
 //                        "title": "Excited"
 //                        "payload":"DEVELOPER_DEFINED_PAYLOAD"
 //                    }]
 //                }]
 //            }
 //        }
 //    }

 //    // send the message
 //    sendMessage(sender, messageData);
}