//Chat Bot Dummy to test message queries
var util 	= require('util');
var request = require('request');
var nexmo 	= require('easynexmo');
var utf8 	= require('utf8');
var auth 	= require('../config/sinchAuth');
//Chat Brain
var bot = require("./brain");

var chat = {}

chat.start = function(){
	nexmo.initialize(auth.key, auth.secret, true);
	//Start the bot
	bot.init();
	bot.on('response', function(response){
		console.log(response);
		if (response.send){
			var data = JSON.stringify({
					api_key: auth.key,
					api_secret: auth.secret,
					to: response.recepient,
					from: response.from,
					text: response.message
				});
			var options = {
				method: "POST",
				url: "https://rest.nexmo.com/sms/json",
				headers:{
					"Content-Type": "application/json"
				},
				body: data
			};

			var callback = function(err, response){
				if (err){ 
					console.log("Error: " + err); 
					throw err;
				}
			}
			console.log(options);
			request(options, callback);
		}
	});
	
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	prompt();

	//Attach an event to input from console
	process.stdin.on('data', function (text) {
		if (text === 'quit\n') {
		  done();
		} else {
			bot.analyze(false,false,text);
		}
	});

	function done() {
		process.exit();
	}
}

function prompt(){
	process.stdout.write("\n> ");
}

module.exports = chat;