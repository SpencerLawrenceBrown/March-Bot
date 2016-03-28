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
var frontalLobe = {};
frontalLobe.modules = {};

//Add modules
frontalLobe.modules.route 		 	= require("./action_modules/routeModule");
frontalLobe.modules.location 		= require("./action_modules/locationModule");
frontalLobe.modules.time 			= require("./action_modules/timeModule");


//Temp Event
var event = {};
event.enabledModules = ["route", "time"];


frontalLobe.processInputToAction = function(processedInput){
	var module 			= frontalLobe.determineModule(processedInput);
	//var statement 	= frontalLobe.buildStatement(processedInput, module); --ONLY NEEDED WITH BRANCHES
	//var action    	= frontalLobe.pickAction(statement);
	return module;
}

frontalLobe.determineModule = function(input){

	//Create Tests

	//Create object to test against
	var regexModules = [];
	var count=0;
	//For each enabled module, create a regex
	for (var x=0; x<event.enabledModules.length; x++){
		var allTerms = frontalLobe.modules[event.enabledModules[x]].aliases;
		allTerms.push(frontalLobe.modules[event.enabledModules[x]].keyTerm);
		//-todo- add [a-z]* to last entry
		var singleString = allTerms.join("[a-z]*|");
		regexModules.push({key: x, module: event.enabledModules[x], exp: new RegExp('\\b(' + singleString + ')\\b', 'i')});
	}

	// //For the modifiers, create a regex

	// for (var x=0; x<frontalLobe.modifiers.length; x++){

	// }

	//-to-do- Add regex loop.

	//Run Tests
	var moduleMatches=[];

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
				moduleMatches[j]++;
				match = false;
				break;
			}
		}
	}

	//--to-do ERROR CHECKING

	//Determine Module
	var maxValue = 0;
	var moduleSelect = []
	for (var x=0; x<moduleMatches.length; x++){
		if (moduleMatches[x] >= maxValue && moduleMatches[x] > 0){
			maxValue = moduleMatches[x];
			moduleSelect.push(regexModules[x].module);
		}
	}
	console.log(moduleSelect);

	//Take Action
	//console.log(frontalLobe.modules[moduleSelect.shift()]);
	var messageContent = frontalLobe.modules[moduleSelect.shift()].run();
	return messageContent;

}

// frontalLobe.buildStatement = function(input, module){

// 	//THIS FUNCTION IS NOT NECESSARY WHEN ONLY USING MODULES AND NOT BRANCHES
// 	var actionHash = frontalLobe.createTermsHash(frontalLobe.modules[module]); --not necessary when not using branches
// 	var modifierHash = frontalLobe.createTermsHash(logisticsMap.terms.modifierTerms);
// 	var statement = frontalLobe.determineStatementComponents(input, actionHash, modifierHash);

// 	return statement;
// }
	
// frontalLobe.pickAction = function(statement){
// 	var modifier;
// 	if (statement.modifier.length > 0){
// 		modifier = statement.modifier.shift();
// 	} else {
// 		modifier = "vanilla";
// 	}
// 	var action;
// 	switch (statement.action.shift()){
// 		case "route":
// 			action = frontalLobe.logisticActions.getRoute(modifier);
// 			break;
// 		case "time":
// 			action = frontalLobe.logisticActions.getTime(modifier);
// 			break;
// 		case "location":
// 			action = frontalLobe.logisticActions.getLocation(modifier);
// 			break;
// 		default:
// 			console.log("Action not found. Shouldn't have gotten here");
// 	}

// 	return action;
// }

frontalLobe.buildRegex = function(){

}
//
//
// frontalLobe.createTermsHash = function(terms){
// 	var tempHash = {};
// 	for(var key in terms){
// 		tempHash[key] = key;
// 		for(var alias in terms[key]){
// 			tempHash[terms[key][alias]] = key;
// 		}
// 	}
// 	return tempHash;
// }

// frontalLobe.determineStatementComponents = function(input, actions, modifiers){
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

module.exports = frontalLobe;