//Chat Bot Dummy to test message queries
var util 	= require('util');
var request = require('request');
var nexmo 	= require('easynexmo');
var auth 	= require('../config/sinchAuth');
//Chat Brain
var bot = require("./brain");

var chat = {}

chat.start = function(){
	nexmo.initialize(auth.key, auth.secret);
	//Start the bot
	bot.init();
	bot.on('response', function(response){
		console.log(response);
		if (response.send){
			nexmo.sendTextMessage(response.from, response.recepient, response.message, function(err, data){
				console.log(data);
			});
		// 	console.log(auth);
		// 	var options = {
		// 		method: "POST",
		// 		url: "https://messagingApi.sinch.com/v1/sms/+" + response.recepient,
		// 		headers : {
		// 			"Content-Type" : "application/json",
		// 			"Authorization" : auth
		// 		},
		// 		body: "{\"From\"" + ":" + "\"+" + response.from + "\", \"Message\"" + ":" + "\"" + response.message + "\"}"
		// 	};
		// 	var callback =	function (error, response, body) {
		// 		if (error) console.log("Error: " + error);
		// 		console.log(body);
		// 	};
		// 	console.log(options);
		// 	request(options, callback);
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