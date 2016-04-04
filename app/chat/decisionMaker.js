//Decision Making Components
//All the do able actions are stored here
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
//Modifiers
var modifiersModel = require("./modifiersModel");

var decisionMaker = {};
decisionMaker.modules = {};

//Add modules
decisionMaker.modules.route 		= require("./action_modules/routeModule");
decisionMaker.modules.location 		= require("./action_modules/locationModule");
decisionMaker.modules.time 			= require("./action_modules/timeModule");

//Temp Event
var eventsModel = require("./eventsModel");

decisionMaker.init = function(){
	modifiersModel.init();
}

decisionMaker.processInputToAction = function(processedInput, eventID, callback){
	decisionMaker.determineModule(processedInput, eventID, function(err, content){
		if (err){
			callback(err);
			return;	
		} 
		callback(null, content);
	});
	//var statement 	= decisionMaker.buildStatement(processedInput, module); --ONLY NEEDED WITH BRANCHING DECISION TREES
	//var action    	= decisionMaker.pickAction(statement);
}

decisionMaker.determineModule = function(input, eventID, callback){
	var event 		= eventsModel.events[eventID];
	var modifiers 	= modifiersModel.modifiers;
	//Create object to test against
	var regexModules = [];
	var count=0;

	//For each enabled module, create a regex
	for (var x=0; x<event.modules.length; x++){
		var allTerms = decisionMaker.modules[event.modules[x]].aliases;
		allTerms.push(decisionMaker.modules[event.modules[x]].keyTerm);
		//-todo- add [a-z]* to last entry
		var singleString = allTerms.join("[a-z]*|");
		regexModules.push({term: event.modules[x], key: x, type:"module", exp: new RegExp('\\b(' + singleString + ')\\b', 'i')});
	}
	//For each modifier, create a regex
	for (var key in modifiers){
		var aliases = modifiers[key];
		aliases.push(key);
		//-todo- add [a-z]* to last entry
		var singleString = aliases.join("[a-z]*|");
		regexModules.push({term: key, type:"modifier", alreadyFound: false, exp: new RegExp('\\b(' + singleString + ')\\b', 'i')});
	}

	//Run Tests
	var moduleMatches=[];
	var modifierMatches=[];

	var match = false;
	//For each token
	for(var i=0; i<input.length;i++){
		//Test against each set
		for(var j=0; j<regexModules.length;j++){
			//Zero out array
			if (i == 0){
				moduleMatches[j] = 0;
			}
			match = regexModules[j].exp.test(input[i]);
			if (match){
				if (regexModules[j].type == "modifier"){
					if (regexModules[j].alreadyFound == false){
						modifierMatches.push(regexModules[j].term);
						regexModules[j].alreadyFound = true;
					}
				} else {
					if (moduleMatches.length <= j){
						moduleMatches[j] = 0;
					}
					moduleMatches[j]++;
				}
				match = false;
				break;
			}
		}
	}

	//Determine Module
	var maxValue = 0;
	var moduleSelect = []
	for (var x=0; x<moduleMatches.length; x++){
		if (moduleMatches[x] >= maxValue && moduleMatches[x] > 0){
			if (moduleMatches[x] > maxValue){
				maxValue = moduleMatches[x];
				moduleSelect = [];
			}
			moduleSelect.push(regexModules[x].term);
		}
	}

	//Error - Modules
	if (moduleSelect.length == 0 || moduleSelect.length > 1){
		var messageContent = generateErrorMessage(moduleSelect, eventID);
		callback(null, messageContent);
	} else {
		//Take Action
		decisionMaker.modules[moduleSelect.shift()].run(eventID, modifierMatches, function(err, content){
			if (err){
				callback(err);
				return;	
			} 
			callback(null,content);
		});
	}
}

function generateErrorMessage(modules, eventID){
	var message = "";
	if (modules.length == 0){
		message = "Sorry, I didn't understand your last message. Here are some requests you can make: \n";

		for (var i=0; i<eventsModel.events[eventID].modules.length; i++){
			message += decisionMaker.modules[eventsModel.events[eventID].modules[i]].instructionText();
			message += "\n";
		}
	} else if (modules.length > 1){
		message = "Sorry, I can only process one request at a time. Do you want to ";
		for (var i=0; i<modules.length; i++){
			message += decisionMaker.modules[modules[i]].instructionText();
			if (i < modules.length-1){
				message += "\n or \n";
			} else {
				message += "?";			
			}
		}
	}
	console.log(message);
	return message;
}

// decisionMaker.buildStatement = function(input, module){

// 	//THIS FUNCTION IS NOT NECESSARY WHEN ONLY USING MODULES AND NOT BRANCHES
// 	var actionHash = decisionMaker.createTermsHash(decisionMaker.modules[module]); --not necessary when not using branches
// 	var modifierHash = decisionMaker.createTermsHash(logisticsMap.terms.modifierTerms);
// 	var statement = decisionMaker.determineStatementComponents(input, actionHash, modifierHash);

// 	return statement;
// }
	
// decisionMaker.pickAction = function(statement){
// 	var modifier;
// 	if (statement.modifier.length > 0){
// 		modifier = statement.modifier.shift();
// 	} else {
// 		modifier = "vanilla";
// 	}
// 	var action;
// 	switch (statement.action.shift()){
// 		case "route":
// 			action = decisionMaker.logisticActions.getRoute(modifier);
// 			break;
// 		case "time":
// 			action = decisionMaker.logisticActions.getTime(modifier);
// 			break;
// 		case "location":
// 			action = decisionMaker.logisticActions.getLocation(modifier);
// 			break;
// 		default:
// 			console.log("Action not found. Shouldn't have gotten here");
// 	}

// 	return action;
// }
//
//
// decisionMaker.createTermsHash = function(terms){
// 	var tempHash = {};
// 	for(var key in terms){
// 		tempHash[key] = key;
// 		for(var alias in terms[key]){
// 			tempHash[terms[key][alias]] = key;
// 		}
// 	}
// 	return tempHash;
// }

// decisionMaker.determineStatementComponents = function(input, actions, modifiers){
// 	var statement = {};
// 	statement.action = [];
// 	statement.modifier = [];

// 	perWordLoop:
// 		for (var i=0;i<input.length;i++){
// 			for(var word in actions){
// 				if (input[i] == word){
// 					statement.action.push(actions[word]);
// 					continue perWordLoop;
// 				}
// 			}
// 			for(var word in modifiers){
// 				if (input[i] == word){
// 					statement.modifier.push(modifiers[word]);
// 					break;
// 				}
// 			}
// 		}
// 	return statement;
// }

module.exports = decisionMaker;