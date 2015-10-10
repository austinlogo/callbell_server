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


module.exports.reg_id_key = "REGISTRATION_ID";
module.exports.hospital_id_key = "HOSPITAL_ID";
module.exports.group_id = "GROUP_ID";
module.exports.location_id_key = "LOCATION_ID";

module.exports.init = function() {
	connection.connect();

	connection.query( 'CREATE TABLE IF NOT EXISTS devices (' +
		'HOSPITAL_ID VARCHAR(50) NOT NULL, ' +
		'GROUP_ID VARCHAR(50) NOT NULL, ' +
		'LOCATION_ID VARCHAR(50) NOT NULL, ' +
		'REGISTRATION_ID VARCHAR(250), ' +
		'PRIMARY KEY (HOSPITAL_ID, GROUP_ID, LOCATION_ID) ' +
		');');
}

module.exports.get_reg_id = function (hospital_id, group_id, location_id, cb) {
	console.log("id: " + hospital_id);
	sqlQuery = "SELECT REGISTRATION_ID FROM devices WHERE LOCATION_ID = '" + location_id + "' AND GROUP_ID = '" + group_id + "' AND HOSPITAL_ID = '"+ hospital_id +"';";
	console.log("Query one: " + sqlQuery);
	query_resposne_handler (sqlQuery, cb);
}

module.exports.remove = function (key, cb) {
	removeRowQuery = "DELETE FROM devices WHERE LOCATION_ID = '" + key + "';";

	query_resposne_handler(removeRowQuery, cb);
}

module.exports.insert = function (hospital_id, group_id, location_id, reg_id, cb) {
	addDeviceQuery = "INSERT INTO devices (HOSPITAL_ID, GROUP_ID, LOCATION_ID, REGISTRATION_ID) "
		+ "VALUES ('"+ hospital_id +"', '"+ group_id + "', '" + location_id +"', '"+ reg_id + "') "
		+ "ON DUPLICATE KEY UPDATE REGISTRATION_ID=VALUES(REGISTRATION_ID);";
	
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
