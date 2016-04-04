/*Location Module
*/

//DB Connection
var db = require("../database_modules/database");
var async = require("async");

var location = {};
location.keyTerm = "location";
location.aliases = ["where"];
location.modifiers = {};

location.modifiers.start = {
	run: function(eventID, callback){
		var options = {sql:"SELECT event_start_address FROM events_list WHERE events_list.id = ?", values: [eventID]};
		db.query(options, function(err, result){
			if (err){
				throw callback(err);
				return;
			} 
			callback(null, "The event starts at: " + result[0]["event_start_address"]);
		});
	}
};

location.modifiers.stop = {
	run: function(eventID, callback){
		var options = {sql:"SELECT event_end_address FROM events_list WHERE events_list.id = ?", values: [eventID]};
		db.query(options, function(err, result){
			if (err){
				throw callback(err);
				return;
			} 
			callback(null, "The event ends at: " + result[0]["event_end_address"]);
		});
	}
};

location.vanilla = {
	run: function(eventID, callback){
		var options = {sql:"SELECT event_start_address, event_end_address FROM events_list WHERE events_list.id = ?", values: [eventID]};
		db.query(options, function(err, result){
			if (err){
				throw callback(err);
				return;
			}
			var string = "The event starts at: " + result[0]["event_start_address"] + ". \nThe event ends at: " + result[0]["event_end_address"];
			callback(null, string);
		});
	}
};

location.run = function(eventID, modifiers, callback){

	//Get rid of modifiers that do not apply to this module
	removeInsignificantModifiers(modifiers);
	//Build the content string
	buildContent(eventID, modifiers, function(err, content){
		callback(err,content);
	});
}

location.instructionText = function(){
	return ("\\\"" + location.keyTerm + "\\\": Receive the start location and end location of the event.");
}

function removeInsignificantModifiers(modifiers){
	var validModifersCount = modifiers.length;
	//Determine Modifiers
	for (var i=0; i<validModifersCount; i++){
		switch (modifiers[i]){
			case "start":
				break;
			case "stop":
				break;
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
		location.vanilla.run(eventID, function(err, result){
			content = result;
			callback(err, content);
		});
	} else {
		//Run each modifier
		var modifierContent = "";
		async.each(modifiers, function(modifierTask, taskCallback){
			modifierContent = location.modifiers[modifierTask].run(eventID, function(err, result){
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

module.exports = location;