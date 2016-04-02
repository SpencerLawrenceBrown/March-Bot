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

var EventEmitter = require('events');
var util = require('util');


//Libraries
var natural = require('natural');

//Brain Object
var brain = {};
brain.emitter = new EventEmitter();

//NLP
var textProcessor = require("./languageProcessing");
//Decisions
var decisionMaker = require("./decisionMaker");
//Memory
var eventsModel = require("./eventsModel");

//Start bot
brain.init = function(){
	textProcessor.init();
	eventsModel.init();
	decisionMaker.init();
}

//Current Analysis -- very small currently
brain.analyze = function(input){
	var processedInput = textProcessor.processInput(input);
	eventsModel.getConversationEventID("9175725201", "9177087141", function (err, id){
		// if (err) {
		// 	throw err;
		// }
		var conversation = {
			incomingNumber: "9175725201",
			outgoingNumber: "9177087141"
		}
		decisionMaker.processInputToAction(processedInput, id, function(err, determinedContent){
			if (err) {
				throw err;
				return;
			}
			var responseObject = buildResponse(determinedContent, conversation);
			brain.emitter.emit("response", responseObject);
		});
	});
}

//Get the response
brain.on = function(event, callback){
	brain.emitter.on(event, callback);
}

//Build the Message
function buildResponse(determinedContent, conversation){
	var response = {};
	response.recepient 	= "+1" + conversation.incomingNumber;
	response.from		= "+1" + conversation.outgoingNumber;
	response.message 	= determinedContent;
	return response;
}
module.exports = brain;