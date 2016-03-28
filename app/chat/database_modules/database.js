var mysql = require("mysql");

var db = {}

var connection = mysql.createConnection({
	host: "localhost",
	user: "marchbot",
	password: "Chelsea23",
	database: "marchbot_test"
});

db.connect = function(){
	connection.connect(function(err){
		if (err){
			console.log("Error connecting to Db");
			return;
		}
		console.log('Database Connection Established.');
	});
}

db.query = function(queryString, callback){
	connection.query(queryString, callback);
}

db.closeConnection = function(){
	connection.end(function(err){
		if (err) throw err;
		console.log("DB Connection Gracefully Closed");
	});
}
module.exports = db;