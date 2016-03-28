/*location Module
*/

var location = {};

location.keyTerm = "location";
location.aliases = ["where"];

location.run = function(modifier){
	return ("Getting Location with " + modifier);
}

module.exports = location;