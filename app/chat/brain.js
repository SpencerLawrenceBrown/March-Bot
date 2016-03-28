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

//Libraries
var natural = require('natural');

//Brain Object
var brain = {};
//NLP
var brocasArea = require("./languageProcessing");
//Decisions
var frontalLobe = require("./decisionMaking");
//Memory
var temporalLobe = require("./eventsModel");

brain.init = function(){
	brocasArea.init();
	temporalLobe.init();
}

//Current Analysis -- very small currently
brain.analyze = function(input){
	var processedInput 		= brocasArea.processInput(input);
	var determinedAction    = frontalLobe.processInputToAction(processedInput);
	return "" + determinedAction;
}

module.exports = brain;