/*Conversation Utility
* Determine the conversation of a particular message & routes it appropriately
*/

var db 				= require("./database_modules/database");
var Conversation 	= require("./conversationObject");
var utility = {};

utility.init = function(){
};

utility.recordMessage = function(conversation, request, response, callback){
	var options = {sql: "INSERT INTO messages SET ?", values: [{conversation_id: conversation.getID(), request: request, response: response}]};
	db.query(options, function(err, data){
		if (err){
			callback(err);
		}
		callback(null, data.insertId);
	});
}

//This will be used for short codes eventually
// utility.getConversationByEventID = function(incomingNumber, eventID, callback){
// 	var options = {sql: "SELECT outgoing_number FROM conversations WHERE conversations.incoming_number = ? AND conversations.event_id = ?", value:[incomingNumber, eventID]};
// 	db.query(options, function(err, data){
// 		if (err){
// 			callback(err);
// 		}
// 		var convo = new Conversation();
// 		convo.setIncomingNumber(incomingNumber);
// 		convo.setEventID(eventID);

// 		//If this conversation exists
// 		if (data.length > 0){
// 			convo.setOutgoingNumber(data[0]["outgoing_number"]);
// 			callback(null, convo);

// 		//Else, make a new conversation
// 		} else {
// 			createNewConversationByEventID(incomingNumber, eventID, function(err, outgoingNumber){
// 				if (err){
// 					callback(err);
// 				}
// 				convo.setOutgoingNumber(outgoingNumber);
// 				callback(null, convo);
// 			});
// 		}
// 	});
// }

utility.getConversationByNumber = function(incomingNumber, outgoingNumber, callback){
	var options = {sql: "SELECT id, event_id FROM conversations WHERE conversations.incoming_number = ? AND conversations.outgoing_number = ?", values:[incomingNumber, outgoingNumber]};
	db.query(options, function(err, data){
		if (err){
			callback(err);
		}
		var convo = new Conversation();
		convo.setIncomingNumber(incomingNumber);
		convo.setOutgoingNumber(outgoingNumber);

		//If this conversation exists
		if (data.length > 0){
			convo.setEventID(data[0]["event_id"]);
			convo.setID(data[0]["id"]);
			callback(null, convo);

		//Else, make a new conversation
		} else {
			createNewConversationByNumber(convo, incomingNumber, outgoingNumber, function(err, updatedConvo){
				if (err){
					callback(err);
				}
				callback(null, updatedConvo);
			});
		}
	});
}

// This will be used for short codes eventually
// function createNewConversationByEventID(incomingNumber, eventID, callback){
// 	var options = {sql: "SELECT phone_number FROM outgoing_numbers WHERE outgoing_numbers.event_id = ? ORDER BY outgoing_numbers.live_connections LIMIT 1" , values: [eventID]};
// 	db.query(options, function(err, data){
// 		if (err){
// 			callback(err);
// 		}

// 		if (data.length > 0){
// 			var outgoinNumber = data[0]["outgoing_number"];
// 			checkIncomingNumber(incomingNumber, function(err, data){
// 				if (err){
// 					callback(err);
// 				}
// 				var options = {sql: "INSERT INTO conversations SET ?", values:[{incoming_number: incomingNumber, outgoing_number: outgoingNumber, event_id: eventID}]};
// 				db.query(options, function(err, data){
// 					if(err){
// 						callback(err);
// 					}
// 					if (data.length > 0){
// 						callback(null, outgoingNumber);
// 					}
// 				});
// 			});
// 		}
// 	});
// }

function createNewConversationByNumber(convo, incomingNumber, outgoingNumber, callback){
	var options = {sql: "SELECT event_id FROM outgoing_numbers WHERE outgoing_numbers.phone_number = ?" , values: [outgoingNumber]};
	db.query(options, function(err, data){
		if (err){
			callback(err);
		}
		if (data.length > 0){
			var eventID = data[0]["event_id"];
			convo.setEventID(eventID);
			checkIncomingNumber(incomingNumber, function(err, data){
				if (err){
					callback(err);
				}
				var options = {sql: "INSERT INTO conversations SET ?", values:[{incoming_number: incomingNumber, outgoing_number:outgoingNumber, event_id: eventID}]};
				db.query(options, function(err, data){
					if(err){
						callback(err);
					}
					convo.setID(data.insertId);
					callback(null, convo);
				});
			})
		}
	});
}

function addNewIncomingNumber(incomingNumber, callback){
	var options = {sql: "INSERT INTO incoming_numbers SET ?", values: [{phone_number: incomingNumber}]};
	db.query(options, function(err, data){
		if (err){
			callback(err);
		}
		callback(null, true);
	});
}

function checkIncomingNumber(incomingNumber, callback){
	var options = {sql: "SELECT id FROM incoming_numbers WHERE incoming_numbers.phone_number = ?", values: [incomingNumber]};
	db.query(options, function(err, data){
		if (err){
			callback(err);
		}
		if (data.length == 0){
			addNewIncomingNumber(incomingNumber, function(err, success){
				if (err){
					callback(err);
				}
				callback(null, success);
			});
		} else {
			callback(null, true);
		}
	});
}

module.exports = utility;