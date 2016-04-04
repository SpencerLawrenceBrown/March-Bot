/*Manage a Route
*/
//DB Connection
var db = require("../database_modules/database");
var async = require("async");

var route = {};

route.keyTerm = "route";
route.aliases = ["map","path","nav","walk"];

route.vanilla = {
	run: function(eventID, callback){
		var options = {sql:"SELECT event_map_url FROM events_list WHERE events_list.id = ?", values: [eventID]};
		db.query(options, function(err, result){
			if (err){
				throw callback(err);
				return;
			}
			var string = "The event route & directions: " + result[0]["event_map_url"] + ".";
			callback(null, string);
		});
	}
};

route.run = function(eventID, modifiers, callback){

	//Get rid of modifiers that do not apply to this module
	removeInsignificantModifiers(modifiers);
	//Build the content string
	buildContent(eventID, modifiers, function(err, content){
		callback(err,content);
	});
}

route.instructionText = function(){
	return ("\\\"" + route.keyTerm + "\\\": Receive the event route.");
}

function removeInsignificantModifiers(modifiers){
	var validModifersCount = modifiers.length;
	//Determine Modifiers
	for (var i=0; i<validModifersCount; i++){
		switch (modifiers[i]){
			default:
				//If its not in the module, then toss it
				modifiers.splice(i,1);
				validModifersCount--;
				break;
		}
	}
}

function buildContent(eventID, modifiers, callback){
	var content = "";
	if (modifiers.length == 0){
		//Run Vanilla
		route.vanilla.run(eventID, function(err, result){
			content = result;
			callback(err, content);
		});
	} else {
		//Run each modifier
		var modifierContent = "";
		async.each(modifiers, function(modifierTask, taskCallback){
			modifierContent = route.modifiers[modifierTask].run(eventID, function(err, result){
				if (err){ 
					throw taskCallback(err); 
					return;
				}
				content += result;
				content += ". ";
				taskCallback();
			});
		}, function(err){
			if (err) {
				throw err;
			}
			callback(null, content);
		});
	}
}

module.exports = route;