var express = require('express');  
var bodyParser = require('body-parser');  
var request = require('request');  
var app = express();
// var apiai = require('apiai');
// var app = apiai(CLIENT_ACCESS_TOKEN);
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
				} else if (event.message.quick_reply) {
					var payload = event.message.quick_reply.payload;
					var msg;
					if ( payload.includes('happy'))
						msg="Its great to see you happy. Here's a quote to add some sugar to your pie :";
					else if(payload.includes('sad'))
						msg="Hang in there ,buddy . Here's a quote to bring a smile on your lovely face:";
					else if(payload.includes('energetic'))
						msg="Its nice to see you so pumped up . Here's a quote because why not ? :";
					else
						msg="Ahaan, romantic! Here's a quote to spice up the things a little: ";

					// messageData={"text":msg	};
					sendMessage(sender,{text:msg});
					getQuote(sender);

				}  
				else if (upperCasedText.includes('GOOGLE')) {
					google_search(sender);
					continue;
				}

				else 
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
			        "payload":"happy"
			      },
			      {
			        "content_type":"text",
			        "title":"Sad",
			        "payload":"sad"
			      },
			      {
			        "content_type":"text",
			        "title":"Energetic",
			        "payload":"energetic"
			      },
			      {
			        "content_type":"text",
			        "title":"Romantic",
			        "payload":"romantic"
			      }
			    ]
		}
		//console.log(messageData);
    // send the message
    sendMessage(sender, messageData);


}

function getQuote(sender)
{		

		request({
		    url: "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=text",
		    json: true
		}, function (error, response, body) {

		    if (!error && response.statusCode === 200) {
		        console.log(body) // Print the json response
		        msg= {"text":body};
		        sendMessage(sender,msg);
		    }
		})
}

function google_search(sender)
{
	// var GoogleSearch = require('google-search');
	// var googleSearch = new GoogleSearch({
	//   key: 'AIzaSyDr-tiz_6JGU2_Xkr58m5hhluSGttHa2q0',
	//   //AIzaSyDfack-gscJo5BOoKXpeyrGSYX8K9A0kXg
	//   cx: '002402230919056642985:h1o_wygafue'
	//   //002402230919056642985:mhcirunx4c8'
	// });
 
 
	// googleSearch.build({
	//   q: "",
	//   start: 5,
	//   // fileType: "pdf",
	//   // gl: "tr", //geolocation, 
	//   // lr: "lang_tr",
	//   num: 10 // Number of search results to return between 1 and 10, inclusive 
	//   //siteSearch: "http://.ankara.edu.tr/" // Restricts results to URLs from a specified site 
	// }, function(error, response) {
	//   console.log(response);
	//   msg= {"text":response};
	// 	        sendMessage(sender,msg);
	// });

	sendMessage(sender, {text: "google search results"});
}

