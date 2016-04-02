//DB Connection
var db = require("./database_modules/database");

//Async
var async = require("async");

var modifiersModel = {};
modifiersModel.modifiers = {};

modifiersModel.init = function(){
	var self = this;
	populateModifiersModel();
}

function populateModifiersModel(){
	var allModifiers = [];
	async.series([
		function(callback){
			//Make initial request to db
			var options = {sql: "SELECT modifier_keys.key FROM modifier_keys"};
			db.query(options, function(err, rows){
				if (err){
					callback(err);
					return;
				}
				allModifiers = rows;
				callback();
			});
		},
		function(callback){
			//For each event, get the contained modules
			async.each(allModifiers, function(modifierKey, taskCallback){
				var options = {sql: "SELECT modifier_aliases.alias FROM modifier_aliases WHERE modifier_aliases.key = ?", values: [modifierKey.key]};
				db.query(options, function(err, rows){
					if (err){
						taskCallback(err);
						return;
					}
					var aliasesArray = [];
					for (var x=0; x<rows.length; x++){
						aliasesArray.push(rows[x].alias);
					}
					modifiersModel.modifiers[modifierKey.key] = aliasesArray;
					taskCallback();
				});
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

module.exports = modifiersModel;