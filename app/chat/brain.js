//Chat Bot Brain
//Currently a really blunt mechanism for figuring out what people want, cause this stuff takes time
/*Current tree
	- Logistics
		- Location
			- Start
			- End
			- Route
		- Time
			- Start
			- End
	- Details
		- Mission Statement / Description
		- Leaders
			- Affliated Groups
			- Twitter of leaders
			- Receive alerts
	- Civil Protection
		- Number for group in case you are arrested
		- Rights specific to protests
			- Filming
			- Assembly
			- Etc.
*/
var async		 	= require('async');
var EventEmitter 	= require('events');

//Libraries
var natural = require('natural');

//Brain Object
var brain = {};
brain.emitter = new EventEmitter();

//NLP
var textProcessor = require("./languageProcessing");
//Decisions
var decisionMaker = require("./decisionMaker");
//Conversation Router
var conversationUtility = require("./conversationUtility");
//Memory
var eventsModel = require("./eventsModel");

//Start bot
brain.init = function(){
	textProcessor.init();
	eventsModel.init();
	decisionMaker.init();
	conversationUtility.init();
}

//Current Analysis -- very little analysis currently
brain.analyze = function(incomingNumber, outgoingNumber, input){
	var send = true;
	//For Chat Testing
	if (incomingNumber == false && outgoingNumber == false){
		//Random incoming number
		incomingNumber = "1" + Math.floor(1000000000 + Math.random() * 9000000000);
		//Default outgoing number
		outgoingNumber = '19177087141';
		send = false;
	}

	//Get Conversation
	conversationUtility.getConversationByNumber(incomingNumber, outgoingNumber, function(err, conversation){
		if (err){
			throw err;
		}
		var processedInput = textProcessor.processInput(input);
		decisionMaker.processInputToAction(processedInput, conversation.getEventID(), function(err, determinedContent){
			if (err) {
				throw err;
			}
			//Record the message
			conversationUtility.recordMessage(conversation, input, determinedContent, function(err, success){
				if (err){ throw err; }
			});
			var responseObject = buildResponse(determinedContent, conversation, send);
			brain.emitter.emit("response", responseObject);
		});
	});
}

//Get the response
brain.on = function(event, callback){
	brain.emitter.on(event, callback);
}

//Build the Message
function buildResponse(determinedContent, conversation, send){
	var response = {};
	response.send 		= send;
	response.recepient 	= conversation.incomingNumber;
	response.from		= conversation.outgoingNumber;
	response.message 	= determinedContent;
	return response;
}
module.exports = brain;