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
	messageData = {
       "text":"How you doin' ?",
	    	"quick_replies":[
			      {
			        "content_type":"text",
			        "title":"Happy",
			        "image_url":"http://images.clipartpanda.com/smiley-face-transparent-background-smile-triste-421a98.gif"
			        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
			      },
			      {
			        "content_type":"text",
			        "title":"Sad",
			        "image_url":"https://img.clipartfest.com/1facaa4efcdeb93a2fb18bd4bcd0de0a_smiley20face20transparent-clipart-sad-face-transparent-background_512-512.png"
			        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
			      },
			      {
			        "content_type":"text",
			        "title":"Energetic",
			        "image_url":"https://s-media-cache-ak0.pinimg.com/736x/01/35/2b/01352b00e1914879039530fb36f1373a.jpg"
			        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
			      },
			      {
			        "content_type":"text",
			        "title":"Romantic",
			        "image_url":"http://pix.iemoji.com/images/emoji/apple/ios-9/256/smiling-face-with-heart-shaped-eyes.png"			        
			        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
			      }
			    ]
		}

    // send the message
    sendMessage(sender, messageData);
}