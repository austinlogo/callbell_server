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
		'DEVICE_ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
		'HOSPITAL_ID VARCHAR(50) NOT NULL, ' +
		'GROUP_ID VARCHAR(50) NOT NULL, ' +
		'LOCATION_ID VARCHAR(50) NOT NULL, ' +
		'REGISTRATION_ID VARCHAR(250), ' +
 		'UNIQUE (HOSPITAL_ID, GROUP_ID, LOCATION_ID) ' +
		');');

	connection.query( 'CREATE TABLE IF NOT EXISTS states (' +
		'DEVICE_ID INT NOT NULL PRIMARY KEY, ' +
		'LOCATION_ID VARCHAR(50) NOT NULL, ' +
		'PHYSICIAN VARCHAR(50), ' +
		'NURSE VARCHAR(50), ' +
		'RESIDENT VARCHAR(50), ' + 
		'CHIEF_COMPLAINT VARCHAR(100) ' +
		');');
}


		

module.exports.get_reg_id = function (hospital_id, group_id, location_id, cb) {
	sqlQuery = "SELECT REGISTRATION_ID FROM devices WHERE LOCATION_ID = '" + location_id + "' AND GROUP_ID = '" + group_id + "' AND HOSPITAL_ID = '"+ hospital_id +"';";
	query_resposne_handler (sqlQuery, cb);
}

module.exports.get_device_row = function (state, cb) {
	sqlQuery = "SELECT * FROM devices WHERE LOCATION_ID = '" + state.location_id + "' AND GROUP_ID = '" + state.group_id + "' AND HOSPITAL_ID = '"+ state.hospital_id +"';";
	query_resposne_handler (sqlQuery, cb);
}

module.exports.remove = function (key, cb) {
	removeRowQuery = "DELETE FROM devices WHERE LOCATION_ID = '" + key + "';";

	query_resposne_handler(removeRowQuery, cb);
}

module.exports.insert_devices = function (state, reg_id, cb) {
	addDeviceQuery = "INSERT INTO devices (HOSPITAL_ID, GROUP_ID, LOCATION_ID, REGISTRATION_ID) "
			+ "VALUES ('"+ state.hospital_id +"', '"+ state.group_id + "', '" + state.location_id +"', '"+ reg_id + "') "
			+ "ON DUPLICATE KEY UPDATE REGISTRATION_ID=VALUES(REGISTRATION_ID);";
	
	query_resposne_handler (addDeviceQuery, cb)
}

module.exports.insert_states = function( device_id, state, cb) {
	var add_state_query = "INSERT INTO states (DEVICE_ID, LOCATION_ID, PHYSICIAN, NURSE, RESIDENT, CHIEF_COMPLAINT) "
			+ "VALUES ( "
				+ device_id + ", '"
				+ state.location_id + "', '" 
				+ state.physician_id + "', '"
				+ state.nurse_id + "', '"
				+ state.resident_id + "', '"
				+ state.chief_complaint_id + "') "
				+ "ON DUPLICATE KEY UPDATE "
				+ "LOCATION_ID = '" + state.location_id + "', "
				+ "PHYSICIAN = '" + state.physician_id + "', "
 				+ "NURSE = '" + state.nurse_id + "', "
				+ "RESIDENT = '" + state.resident_id + "', "
				+ "CHIEF_COMPLAINT = '" + state.chief_complaint_id + "' "
				+ ";";

	query_resposne_handler(add_state_query, cb)
} 

////////////////////////////////// HELPER METHODS /////////////////////
function query_resposne_handler(query_string, cb) {
	console.log("Query String: " + query_string);
	connection.query(query_string, function (err, result) {
		if (err != undefined) {
			console.log("Database query error: " + err);
		} 

		console.log("Query result: ");
		console.log(result);
		cb (err, result);
	});
}


///////////////////////////////////////////////////////////////////////////
