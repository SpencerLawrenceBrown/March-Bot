//Chat Bot Brain

//Libraries
var natural = require('natural');

//NLP Tools
var tokenMaker;
var tagger;

//Brain Object
var brain = {};

/*
Analysis Steps:
1) Classify the entire input to determine the decision branch (Not Currently Implemented)
2) Break the input into tokens, ignoring punctuation
3) Stem the inputs for better percision (Not Currently Implemented)
4) Consider punctuation (Not Currently Implemented)
5) Check if there are multiple prompts (Not Currently Implemented)
6) Seperate into nouns and adjectives -- nouns are the actions, adjectives give context (Not Currently Implemented)
*/


//Public functions
brain.init = function(){
	//Tokenize
	tokenMaker 	= new natural.WordTokenizer();
	// //Stemming
	// natural.PorterStemmer.attach(); //Attach the stemmer that .stem() uses
	// //Tagging
	// var base_folder = "/Users/spencerbrown/Projects/marchbot/node_modules/natural/lib/natural/brill_pos_tagger";
	// var rules_file = base_folder + "/data/English/tr_from_posjs.txt";
	// var lexicon_file = base_folder + "/data/English/lexicon_from_posjs.json";
	// var default_category = 'N';
	// tagger = new natural.BrillPOSTagger(lexicon_file, rules_file, default_category, function(error){
	// 	if(error){
	// 		console.log(error);
	// 	}
	// });
}

//Current Analysis -- very small currently
brain.analyze = function(input){
	var processed = processInput(input);
	var action = determineChoices(processed, true);
	return "" + action;
}



//Private functions

//*Action*//

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

//This is so ugly! And super brutish. Will fix soon hopefully
function determineChoice(input){
	var countArray = [0,0,0];
	var logIndex = 0;
	var detailIndex = 1;
	var civilIndex = 2;

	var logisticsWords = ["map", 
							"route", "path", "day", 
							"time", "when", "where", 
							"walk", "place", "nav",
							"start", "stop", "end", "begin"];
	var detailWords = ["who" , "group", "lead", 
						"creat", "twitter", "mission", 
						"why", "about"]
	var civilWords = ["right", "arrest", "protect", 
						"safe", "civil", "police"]

	var logExpression = logisticsWords.join("[a-z]*|");
	var detailExpression = detailWords.join("[a-z]*|");
	var	civilExpression = civilWords.join("[a-z]*|");
	var logRegex = new RegExp('\\b(' + logExpression + ')\\b', 'i');
	var detailRegex = new RegExp('\\b(' + detailExpression + ')\\b', 'i');
	var civilRegex = new RegExp('\\b(' + civilExpression + ')\\b', 'i');

	for (var i=0; i<input.length;i++){
		var check = logRegex.test(input[i]);
		if(check){
			countArray[logIndex]++;
		}
		check = detailRegex.test(input[i]);
		if(check){
			countArray[detailIndex]++;
		}
		check = civilRegex.test(input[i]);
		if(check){
			countArray[civilIndex]++;
		}
	}
	console.log(countArray);

	//Find max
	var maxSelection = [];
	var maxValue = 0;
	for (var i=0;i<countArray.length;i++){
		if (countArray[i] >= maxValue && countArray > 0){
			maxSelection.push(i);
		}
	}
	if (countArray.length == 1){
		var choice = choiceBranch(input, maxSelection[0]);
	} else {
		var choice = false;
	}

	//-to do- figure out the decision tree. How will I hold options, and choose the right ones?
	//keywords?? hardcoded --"def not"
}

function choiceBranch(input, root){
	switch(root){
		//Logistics
		case 0:
			return determineChoices("Logistics");
			break;
		//Detail
		case 1:
			return determineChoices("Details");
			break;
		//Civil
		case 2:
			return determineChoices("Civil");
			break;
		default:
			return false;

	}
}

function determineChoices(input, branch){

	//Get Term Connections
	var logisticsMap = {
		terms:{
			actionTerms:{
				route:[
					"map",
					"path",
					"nav",
					"walk"
				],
				time:["when"],
				location:["where"]
			},

			modifierTerms:{
				start:["begin"],
				stop:["end"]
			}
		},
		actions:{
			route:{
				action: {
					base: getMap
				}
			},
			time:{
				action:{
					base: getTime,
					modified:{
						start: 0,
						stop:  1
					}
				}
			},
			location:{
				terms:"location", 
				action: {
					base: getPlace,
					modified:{
						start: 0,
						stop:  1
					}
				}
			}
		}
	};


	//Create hashes to connect words
	var actionHash = createTermsHash(logisticsMap.terms.actionTerms);
	var modifierHash = createTermsHash(logisticsMap.terms.modifierTerms);

	var actionable = createActionableStatement(input, actionHash, modifierHash);
	var choice = logisticsMap.actions[actionable.action].action;

	if("modified" in choice){
		var modifierValue = choice.modified[actionable.modifier];
	}
	console.log(choice.base);
	console.log(modifierValue);

	// var detailActions = ["who" , "group", "lead", 
	// 					"creat", "twitter", "mission", 
	// 					"why", "about"]
	// var civilActions = ["right", "arrest", "protect", 
	// 					"safe", "civil", "police"]
}

function createTermsHash(terms){
	var tempHash = {};
	for(var key in terms){
		tempHash[key] = key;
		for(var alias in terms[key]){
			tempHash[terms[key][alias]] = key;
		}
	}
	return tempHash;
}

function createActionableStatement(input, actions, modifiers){
	var statement = {};
	statement.action = [];
	statement.modifier = [];

	for (var i=0;i<input.length;i++){
		for(var word in actions){
			if (input[i] == word){
				statement.action.push(actions[word]);
				break;
			}
		}
		for(var word in modifiers){
			if (input[i] == word){
				statement.modifier.push(modifiers[word]);
				break;
			}
		}
	}
	return statement;
}

function getMap(){}
function getTime(){}
function getPlace(){}
//*Processing*//

//Manages the processing steps
function processInput(input){
	//Step 2 - tokenize
	var tokens = tokenMaker.tokenize(input);

	//Only 1 step! It will get better soon
	var finalTokens = tokens;

	return finalTokens;
}

//Break up a token array and stem it
//-To Do- Figure out if this is worth it? Mis-stems a lot of words
function stemInput(array){
	var stemmedArray = [];
	//list of words currently broken by stemming -- :(
	var brokenStem = ["does", "are", "route"];
	var expression = brokenStem.join("|");
	var regex = new RegExp('\\b(' + expression + ')\\b');

	//Test against the broken words. If not included, then stem
	for(var i=0; i<array.length;i++){
		var check = regex.test(array[i]);
			stemmedArray[i] = array[i].stem();
		// } else {
		// 	stemmedArray[i] = array[i];
		// }
	}
	return stemmedArray;
}

//Determine what the request is
//-to do- create a classifier set to test again
function determineRequest(sanitizedArray){
	var requestArray = [];
	for(var i=0; i<sanitizedArray.length; i++){
		requestArray[i] = classifier.classify(sanitizedArray[i]);
	}
	return requestArray;
}

//Tag the types of arguments
//-to do- figure out to break down the sentences into something useful
function tagInput(array){
	return JSON.stringify(tagger.tag(array));
}

module.exports = brain;