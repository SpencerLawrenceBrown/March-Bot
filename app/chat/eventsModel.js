//DB Connection
var db = require("./database_modules/database");

//Async
var async = require("async");

var eventsModel = {};
eventsModel.events = []

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
						eventsModel.events.push(eventMeta);
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

module.exports = eventsModel;