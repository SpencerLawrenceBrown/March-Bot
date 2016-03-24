//Chat Bot Dummy to test message queries
var util = require('util');

//Chat Brain
var bot = require("./brain");

function startChat(){
	//Start the bot
	bot.init();
	
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	prompt();

	//Attach an event to input from console
	process.stdin.on('data', function (text) {
		if (text === 'quit\n') {
		  done();
		} else {
			//Perform analysis
			var response = bot.analyze(text);
			process.stdout.write(response);
			prompt();
		}
	});

	function done() {
		process.exit();
	}
}

function prompt(){
	process.stdout.write("\n> ");
}

exports.start = startChat;