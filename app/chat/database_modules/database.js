var mysql 		= require("mysql");
var dbConfig 	= require("../../config/dbConfig");

var db = {}

var connection = mysql.createConnection({
	host: dbConfig.host,
	user: dbConfig.user,
	password: dbConfig.password,
	database: dbConfig.database
});

db.connect = function(){
	connection.connect(function(err){
		if (err){
			console.log("Error connecting to DB.");
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
		console.log("DB Connection Gracefully Closed.");
	});
}
module.exports = db;