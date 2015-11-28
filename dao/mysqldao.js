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
var State = require('../models/State');

var DEVICE_ID = 'DEVICE_ID';
var REGISTRATION_ID = 'REGISTRATION_ID';

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
		DEVICE_ID + ' INT NOT NULL PRIMARY KEY AUTO_INCREMENT, ' +
		State.HOSPITAL_ID + ' VARCHAR(50) NOT NULL, ' +
		State.GROUP_ID + ' VARCHAR(50) NOT NULL, ' +
		State.LOCATION_ID + ' VARCHAR(50) NOT NULL, ' +
		REGISTRATION_ID + ' VARCHAR(250), ' +
 		'UNIQUE (' + State.HOSPITAL_ID + ',' + State.GROUP_ID + ', ' + State.LOCATION_ID + ') ' +
		');');

	connection.query( 'CREATE TABLE IF NOT EXISTS states (' +
		DEVICE_ID + ' INT NOT NULL PRIMARY KEY, ' +
		State.LOCATION_ID + ' VARCHAR(50) NOT NULL, ' +
		State.PHYSICIAN_ID + ' VARCHAR(50) NOT NULL, ' +
		State.NURSE_ID + ' VARCHAR(50), ' +
		State.RESIDENT_ID + ' VARCHAR(50), ' + 
		State.CHIEF_COMPLAINT_ID + ' VARCHAR(100), ' +
		State.SHOWN_TESTS_ID + ' VARCHAR(1000), ' +
		State.SHOWN_MEDICATIONS_ID + ' VARCHAR(1000), ' +
		State.ALL_TESTS_ID + ' VARCHAR(1000), ' +
		State.ALL_MEDICATIONS_ID + ' VARCHAR(1000), ' +
		State.PAIN_RATING_ID + ' INT, ' +
		State.CONNECTION_INDICATOR_ID + ' BOOLEAN' +
		');');
}


		

module.exports.get_reg_id = function (hospital_id, group_id, location_id, cb) {
	sqlQuery = "SELECT REGISTRATION_ID FROM devices WHERE " + 
			State.LOCATION_ID + " = '" + location_id + "' AND " + 
			State.GROUP_ID + " = '" + group_id + "' AND " + 
			State.HOSPITAL_ID +" = '"+ hospital_id +"';";
	
	query_resposne_handler (sqlQuery, cb);
}

module.exports.get_device_row = function (st, cb) {
	sqlQuery = "SELECT * FROM devices WHERE "  + 
			State.LOCATION_ID + " = '" + st.LOCATION_ID + "' AND " + 
			State.GROUP_ID + " = '" + st.GROUP_ID + "' AND " + 
			State.HOSPITAL_ID + " = '"+ st.HOSPITAL_ID +"';";
	
	query_resposne_handler (sqlQuery, cb);
}

module.exports.get_state_row_by_device_id = function (device_id, cb) {
	sqlQuery = "SELECT * FROM states left join devices on states.DEVICE_ID = devices.DEVICE_ID WHERE states.DEVICE_ID = " + device_id + ";";
	query_resposne_handler (sqlQuery, cb);
}

module.exports.remove = function (key, cb) {
	removeRowQuery = "DELETE FROM devices WHERE " 
			+ State.LOCATION_ID + " = '" + key + "';";

	query_resposne_handler(removeRowQuery, cb);
}

module.exports.insert_devices = function (st, reg_id, cb) {
	addDeviceQuery = "INSERT INTO devices (" 
				+ State.HOSPITAL_ID + ", " 
				+ State.GROUP_ID + ", " 
				+ State.LOCATION_ID + ", " 
				+ REGISTRATION_ID + ") "
			+ "VALUES ('" 
				+ st.HOSPITAL_ID + "', '" 
				+ st.GROUP_ID + "', '" 
				+ st.LOCATION_ID +"', '" 
				+ reg_id + "') "
			+ "ON DUPLICATE KEY UPDATE " 
			+ REGISTRATION_ID + " = '"  + reg_id + "';";
	
	query_resposne_handler (addDeviceQuery, cb)
}

module.exports.set_device_connection = function(reg_id, connection_status, cb) {
	get_device_id_query = "SELECT DEVICE_ID FROM devices where " + 
			REGISTRATION_ID + " = '" + reg_id + "'";

	connection_query = "UPDATE states SET " + 
			State.CONNECTION_INDICATOR_ID + " = " + connection_status + " WHERE " + 
			DEVICE_ID + " in (" + get_device_id_query + ");";

	query_resposne_handler(connection_query, cb); 
}

module.exports.get_tablet_station_name = function (reg_id, cb) {
	get_device_row = "SELECT * FROM devices where " + 
			REGISTRATION_ID + " = '" + reg_id + "';";

	internal_query(get_device_row, function (err, result) {
		if (err != undefined) {
			console.log("send_connection_status_to_station error");
			console.log(err);
		}

		var state = new State(result[0]);

		cb(state.STATION_NAME, state);


	});

}

function start_replace(jsonarray) {
	for (var index = 0; index < jsonarray.length; index++) {
		jsonarray[index] = jsonarray[index].replace("'", "\\'");
		console.log(jsonarray[index]);
	}

	return jsonarray;
}

module.exports.insert_states = function( device_id, st, cb) {

	var replace_string = "[" + String.fromCharCode(8217) + String.fromCharCode(8216) + String.fromCharCode(39) + "]";
	console.log();
 
	console.log("start_replace");
	var all_tests = JSON.stringify(st.ALL_TESTS_ID).replace(new RegExp(replace_string, "g"), "\\'");
	var all_meds = JSON.stringify(st.ALL_MEDICATIONS_ID).replace("'", "\\'");
	console.log("INSERT");
	console.log(all_tests);
	
	var add_state_query = "INSERT INTO states (" 
				+ DEVICE_ID + ", " 
				+ State.LOCATION_ID + ", " 
				+ State.PHYSICIAN_ID + ", " 
				+ State.NURSE_ID + ", " 
				+ State.RESIDENT_ID + ", " 
				+ State.CHIEF_COMPLAINT_ID + ", " 
				+ State.PAIN_RATING_ID + ", " 
				+ State.SHOWN_TESTS_ID + ", "
				+ State.SHOWN_MEDICATIONS_ID + ", "
				+ State.ALL_TESTS_ID + ", "
				+ State.ALL_MEDICATIONS_ID + ", "
				+ State.CONNECTION_INDICATOR_ID + ") "
			+ "VALUES ( "
				+ device_id + ", '"
				+ st.LOCATION_ID + "', '" 
				+ st.PHYSICIAN_ID + "', '"
				+ st.NURSE_ID + "', '"
				+ st.RESIDENT_ID + "', '"
				+ st.CHIEF_COMPLAINT_ID + "', "
				+ st.PAIN_RATING_ID + ", '"
				+ JSON.stringify(st.SHOWN_TESTS_ID) + "', '"
				+ JSON.stringify(st.SHOWN_MEDICATIONS_ID) + "', '"
				+ all_tests + "', '"
				+ all_meds + "', "
				+ st.CONNECTION_INDICATOR_ID 
			+ ") "
			+ "ON DUPLICATE KEY UPDATE "
			+ State.LOCATION_ID + " = '" + st.LOCATION_ID + "', "
			+ State.PHYSICIAN_ID + " = '" + st.PHYSICIAN_ID + "', "
			+ State.NURSE_ID + " = '" + st.NURSE_ID + "', "
			+ State.RESIDENT_ID + " = '" + st.RESIDENT_ID + "', "
			+ State.CHIEF_COMPLAINT_ID + " = '" + st.CHIEF_COMPLAINT_ID + "', "
			+ State.PAIN_RATING_ID + " = " + st.PAIN_RATING_ID + ", "
			+ State.SHOWN_TESTS_ID + " = '" + JSON.stringify(st.SHOWN_TESTS_ID) + "', "
			+ State.SHOWN_MEDICATIONS_ID + " = '" + JSON.stringify(st.SHOWN_MEDICATIONS_ID) + "', "
			+ State.ALL_TESTS_ID + " = '" + all_tests + "', "
			+ State.ALL_MEDICATIONS_ID + " = '" + all_meds + "', "
			+ State.CONNECTION_INDICATOR_ID + " = " + st.CONNECTION_INDICATOR_ID
			+ ";";

	query_resposne_handler(add_state_query, cb);
} 

module.exports.get_device_states_for_group = function(st, cb) {
	var devices_query = "SELECT DEVICE_ID from devices where " 
			+ State.HOSPITAL_ID + " = '" + st.HOSPITAL_ID + "' AND " 
			+ State.GROUP_ID + " = '" + st.GROUP_ID + "' AND " 
			+ State.LOCATION_ID + " NOT LIKE '%STATION%'";
	
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

function internal_query(query_string, cb) {
	console.log("Query String: " + query_string);
	connection.query(query_string, function (err, result) {
		if (err != undefined) {
			console.log("Database query error: " + err);
		} 

		cb (err, result);
	});
}


///////////////////////////////////////////////////////////////////////////
