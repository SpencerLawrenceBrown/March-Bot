//Chat Bot Dummy to test message queries
var util = require('util');

//Chat Brain
var bot = require("./brain");

var chat = {}

chat.start = function(){
	//Start the bot
	bot.init();
	bot.on('response', function(response){
		console.log(response);
	});
	
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	prompt();

	//Attach an event to input from console
	process.stdin.on('data', function (text) {
		if (text === 'quit\n') {
		  done();
		} else {
			//Perform analysis
			bot.analyze(text);
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