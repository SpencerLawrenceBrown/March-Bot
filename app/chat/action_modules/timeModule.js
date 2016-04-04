/*Send the time
*/
//DB Connection
var db = require("../database_modules/database");
var async = require("async");

var time = {};
time.keyTerm = "time";
time.aliases = ["when"];
time.modifiers = {};
time.modifiers.start = {
	run: function(eventID, callback){
		var options = {sql:"SELECT date_start FROM events_list WHERE events_list.id = ?", values: [eventID]};
		db.query(options, function(err, result){
			if (err){
				throw callback(err);
				return;
			}
			var string = "";
			var start = null;
			if (result[0]["date_start"] != null){
				start = readableDate(result[0]["date_start"]);
				string += " The event starts at: " + start + ".";
			} else {
				string += " There is not a set start time for the event."
			}
			callback(null, string);
		});
	}
};

time.modifiers.stop = {
	run: function(eventID, callback){
		var options = {sql:"SELECT date_start FROM events_list WHERE events_list.id = ?", values: [eventID]};
		db.query(options, function(err, result){
			if (err){
				throw callback(err);
				return;
			}
			var string = "";
			var end = null;
			if (result[0]["date_end"] != null){
				end = readableDate(result[0]["date_end"]);
				string += " The event ends at: " + end + ".";
			} else {
				string += " There is not a set end time for the event."
			}
			callback(null, string);
		});
	}
};
time.vanilla = {
	run: function(eventID, callback){
		var options = {sql:"SELECT date_start, date_end FROM events_list WHERE events_list.id = ?", values: [eventID]};
		db.query(options, function(err, results){
			if (err){
				throw callback(err);
				return;
			}
			var string = "";
			var start = null;
			if (results[0]["date_start"] != null){
				start = readableDate(results[0]["date_start"]);
				string += " The event starts at: " + start + ".";
			} else {
				string += " There is not a set start time for the event."
			}
			var end = null;
			if (results[0]["date_end"] != null){
				end = readableDate(results[0]["date_end"]);
				string += " The event ends at: " + end + ".";
			} else {
				string += " There is not a set end time for the event."
			}
			callback(null, string);
		});
	}
};

time.run = function(eventID, modifiers, callback){

	//Get rid of modifiers that do not apply to this module
	removeInsignificantModifiers(modifiers);
	//Build the content string
	buildContent(eventID, modifiers, function(err, content){
		callback(err,content);
	});
}

time.instructionText = function(){
	return ("\\\"" + time.keyTerm + "\\\": Receive the event time.");
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
		time.vanilla.run(eventID, function(err, result){
			content = result;
			callback(err, content);
		});
	} else {
		//Run each modifier
		var modifierContent = "";
		async.each(modifiers, function(modifierTask, taskCallback){
			modifierContent = time.modifiers[modifierTask].run(eventID, function(err, result){
				if (err){ 
					throw taskCallback(err); 
					return;
				}
				content += result;
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

function readableDate(dbDate){
	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	var PM = false;

	var d = new Date(dbDate);
	var hour = d.getHours();
	if (hour > 12){
		PM = true;
		hour -= 12;
	} else if (hour === 0){
		hour = 12;
	}
	var minute = d.getMinutes();
	if (minute < 10){
		minute = "0" + minute;
	}

	var formattedDate = "";
	formattedDate += (days[d.getDay()] + ", ");
	formattedDate += (months[d.getMonth()] + " ");
	formattedDate += (d.getDate() + " ");
	formattedDate += ("at " + hour + ":" + minute);
	if (PM){
		formattedDate += "PM";
	} else {
		formattedDate += "AM"
	}
	return (formattedDate);
}

module.exports = time;