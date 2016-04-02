//DB Connection
var db = require("./database_modules/database");

//Async
var async = require("async");

var eventsModel = {};
eventsModel.events = {};

eventsModel.init = function(){
	var self = this;
	populateEventsModel();
}

function populateEventsModel(){
	var allEvents = [];
	async.series([
		function(callback){
			//Make initial request to db
			var options = {sql: "SELECT * FROM events_list"};
			db.query(options, function(err, rows){
				if (err){
					callback(err);
					return;
				}
				allEvents = rows;
				callback();
			});
		},
		function(callback){
			//For each event, get the contained modules
			async.each(allEvents, function(eventMeta, taskCallback){
				if (eventMeta.event_state === "LIVE" || eventMeta.event_state === "PRE"){
					var options = {sql: "SELECT * FROM event_modules INNER JOIN action_modules ON event_modules.module_id = action_modules.id WHERE event_modules.event_id = ?", values: [eventMeta.id]};
					db.query(options, function(err, rows){
						if (err){
							taskCallback(err);
							return;
						}
						var modulesArray = [];
						for (var x=0; x<rows.length; x++){
							modulesArray.push(rows[x].module_name);
						}
						eventMeta.modules = modulesArray;
						eventsModel.events[eventMeta.id] = eventMeta;
						taskCallback();
					});
				}
			}, function(err){
				if (err){ 
					callback(err);
					return;
				}
				callback();
			});
		}
	]);
}

eventsModel.getConversationEventID = function(incomingNumber, outgoingNumber, callback){
	var options = {sql: "SELECT event_id FROM conversations WHERE incoming_number = ? AND outgoing_number = ?", values: [incomingNumber, outgoingNumber]};
	db.query(options, function(err, rows){
		if (err){
			callback(err);
			return;	
		} 
		if (rows.length == 1){
			callback(false, rows[0].event_id);
		} else if (rows.length > 1) {
			//-to-do error handling
			console.log("Something is wrong...");
			callback(new Error("Multiple Rows"), -1);
		} else {
			//-to-do- trigger new conversation!
			console.log("Conversation doesn't exist...make new");
			callback(new Error("Conversation Doesn't Exist."), -1);
		}
	});
}

module.exports = eventsModel;