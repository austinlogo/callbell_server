/*
	Database Interface : MYSQL
	For forms sake I'm going to try and establish an interface-like structure here. this is an implementation of a 


	- init ()		: Initializes the database if necessary
	- get (key)		: Gets a row based on the primary key
	- remove (key)	: Removes a row based on the inputed primary key
	- insert (key)	: Insert a row based on the inputted primary key
	- update (key)	: updates a row based on the inputed primary key
*/

var mysql = require('mysql');

var connection = mysql.createConnection({
	host 		: 'localhost',
	user		: 'austinlg', 
	password	: 'sniper', 
	database 	: 'call_bell'
});


module.exports.reg_id_key = "reg_id";
module.exports.hospital_id_key = "hospital_id";
module.exports.bed_id_key = "bed_id";

module.exports.init = function() {
	connection.connect();

	connection.query( 'CREATE TABLE IF NOT EXISTS devices (' +
		'hospital_id VARCHAR(20) NOT NULL, ' +
		'bed_id VARCHAR(20) NOT NULL, ' +
		'reg_id VARCHAR(250), ' +
		'PRIMARY KEY (hospital_id, bed_id) ' +
		');');
}

module.exports.get_reg_id = function (hospital_id, bed_id, cb) {
	console.log("id: " + hospital_id);
	sqlQuery = "SELECT reg_id FROM devices WHERE bed_id = '" + bed_id + "' AND hospital_id = '"+ hospital_id +"';";
	console.log("Query one: " + sqlQuery);
	query_resposne_handler (sqlQuery, cb);
}

module.exports.remove = function (key, cb) {
	removeRowQuery = "DELETE FROM devices WHERE bed_id = '" + key + "';";

	query_resposne_handler(removeRowQuery, cb);
}

module.exports.insert = function (bed_id, reg_id, cb) {
	addDeviceQuery = "INSERT INTO devices (bed_id, reg_id) VALUES ('"+ bed_id +"', '"+ reg_id +"') ON DUPLICATE KEY UPDATE reg_id=VALUES(reg_id);";
	query_resposne_handler (addDeviceQuery, cb)
}

////////////////////////////////// HELPER METHODS /////////////////////
function query_resposne_handler(query_string, cb) {
	console.log("Query String: " + query_string);
	connection.query(query_string, function (err, result) {
		if (err != undefined) {
			console.log("Database query error: " + err);
		} 

		console.log("Query result: " + result);
		cb (err, result);
	});
}


///////////////////////////////////////////////////////////////////////////
