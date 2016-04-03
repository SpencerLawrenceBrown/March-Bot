/*Conversation Object
*/

function conversation(){
	var self = this;

	self.id = null;
	self.incomingNumber = "";
	self.outgoingNumber = "";
	self.eventID		= null;
}

conversation.prototype.setIncomingNumber = function(incoming) {
	var self = this;
	self.incomingNumber = incoming;
};

conversation.prototype.setOutgoingNumber = function(outgoing) {
	var self = this;
	self.outgoingNumber = outgoing;
};

conversation.prototype.setEventID = function(eventID) {
	var self = this;
	self.eventID = eventID;
};

conversation.prototype.setID = function(id){
	var self = this;
	self.id = id;
}

conversation.prototype.getIncomingNumber = function() {
	var self = this;
	return self.incomingNumber;
};

conversation.prototype.getOutgoingNumber = function() {
	var self = this;
	return self.outgoingNumber;
};

conversation.prototype.getEventID = function() {
	var self = this;
	return self.eventID;
};

conversation.prototype.getID = function() {
	var self = this;
	return self.id;
};

module.exports = conversation;