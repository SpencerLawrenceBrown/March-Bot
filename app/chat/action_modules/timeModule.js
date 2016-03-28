/*Time Module
*/

var time = {};

time.keyTerm = "time";
time.aliases = ["when"];

time.run = function(modifier){
	return ("Getting Time with " + modifier);
}

module.exports = time;