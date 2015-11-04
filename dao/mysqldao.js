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
		'PHYSICIAN_ID VARCHAR(50), ' +
		'NURSE_ID VARCHAR(50), ' +
		'RESIDENT_ID VARCHAR(50), ' + 
		'CHIEF_COMPLAINT_ID VARCHAR(100), ' +
		'PAIN_RATING_ID INT' +
		');');
}


		

module.exports.get_reg_id = function (hospital_id, group_id, location_id, cb) {
	sqlQuery = "SELECT REGISTRATION_ID FROM devices WHERE LOCATION_ID = '" + location_id + "' AND GROUP_ID = '" + group_id + "' AND HOSPITAL_ID = '"+ hospital_id +"';";
	query_resposne_handler (sqlQuery, cb);
}

module.exports.get_device_row = function (state, cb) {
	sqlQuery = "SELECT * FROM devices WHERE LOCATION_ID = '" + state.LOCATION_ID + "' AND GROUP_ID = '" + state.GROUP_ID + "' AND HOSPITAL_ID = '"+ state.HOSPITAL_ID +"';";
	query_resposne_handler (sqlQuery, cb);
}

module.exports.get_state_row_by_device_id = function (device_id, cb) {
	sqlQuery = "SELECT * FROM states left join devices on states.DEVICE_ID = devices.DEVICE_ID WHERE states.DEVICE_ID = " + device_id + ";";
	query_resposne_handler (sqlQuery, cb);
}

module.exports.remove = function (key, cb) {
	removeRowQuery = "DELETE FROM devices WHERE LOCATION_ID = '" + key + "';";

	query_resposne_handler(removeRowQuery, cb);
}

module.exports.insert_devices = function (state, reg_id, cb) {
	addDeviceQuery = "INSERT INTO devices (HOSPITAL_ID, GROUP_ID, LOCATION_ID, REGISTRATION_ID) "
			+ "VALUES ('"+ state.HOSPITAL_ID +"', '"+ state.GROUP_ID + "', '" + state.LOCATION_ID +"', '"+ reg_id + "') "
			+ "ON DUPLICATE KEY UPDATE REGISTRATION_ID=VALUES(REGISTRATION_ID);";
	
	query_resposne_handler (addDeviceQuery, cb)
}

module.exports.insert_states = function( device_id, state, cb) {
	var add_state_query = "INSERT INTO states (DEVICE_ID, LOCATION_ID, PHYSICIAN_ID, NURSE_ID, RESIDENT_ID, CHIEF_COMPLAINT_ID, PAIN_RATING_ID) "
			+ "VALUES ( "
				+ device_id + ", '"
				+ state.LOCATION_ID + "', '" 
				+ state.PHYSICIAN_ID + "', '"
				+ state.NURSE_ID + "', '"
				+ state.RESIDENT_ID + "', '"
				+ state.CHIEF_COMPLAINT_ID + "', "
				+ state.PAIN_RATING_ID + ") "
				+ "ON DUPLICATE KEY UPDATE "
				+ "LOCATION_ID = '" + state.LOCATION_ID + "', "
				+ "PHYSICIAN_ID = '" + state.PHYSICIAN_ID + "', "
 				+ "NURSE_ID = '" + state.NURSE_ID + "', "
				+ "RESIDENT_ID = '" + state.RESIDENT_ID + "', "
				+ "CHIEF_COMPLAINT_ID = '" + state.CHIEF_COMPLAINT_ID + "', "
				+ "PAIN_RATING_ID = " + state.PAIN_RATING_ID
				+ ";";

	query_resposne_handler(add_state_query, cb);
} 

module.exports.get_device_states_for_group = function(state, cb) {
	var devices_query = "SELECT DEVICE_ID from devices where HOSPITAL_ID = '" + state.HOSPITAL_ID + "' AND GROUP_ID = '" + state.GROUP_ID + "' AND LOCATION_ID NOT LIKE '%STATION%'";
	var get_device_states_query = "SELECT * FROM states left join devices on states.DEVICE_ID = devices.DEVICE_ID WHERE states.DEVICE_ID in (" + devices_query + ");";

	query_resposne_handler(get_device_states_query, cb);
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
