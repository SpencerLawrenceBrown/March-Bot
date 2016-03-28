//Libraries
var natural = require('natural');
//NLP
var brocasArea = {};

//NLP Tools
brocasArea.tokenMaker;
brocasArea.tagger;
/*
Analysis Steps:
1) Classify the entire input to determine the decision branch (Not Currently Implemented)
2) Break the input into tokens, ignoring punctuation
3) Stem the inputs for better percision (Not Currently Implemented)
4) Consider punctuation (Not Currently Implemented)
5) Check if there are multiple prompts (Not Currently Implemented)
6) Seperate into nouns and adjectives -- nouns are the actions, adjectives give context (Not Currently Implemented)
*/

//*Processing*//
brocasArea.init = function(){
	brocasArea.tokenMaker 	= new natural.WordTokenizer();
}

//Manages the processing steps
brocasArea.processInput = function(input){
	//Step 2 - tokenize
	var tokens = brocasArea.tokenMaker.tokenize(input);

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

module.exports = brocasArea;