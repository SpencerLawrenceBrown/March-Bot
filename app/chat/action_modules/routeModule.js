/*Manage a Route
*/

var route = {};

route.keyTerm = "route";
route.aliases = ["map","path","nav","walk"];

route.init = function(){

}

route.run = function(modifier){
	return ("Getting Route with " + modifier);
}


module.exports = route;