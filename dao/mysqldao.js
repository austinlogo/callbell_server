var mysql = require('mysql');
var format = require('string-format');

var connection = mysql.createConnection({
	host 		: 'localhost',
	user		: 'austinlg', 
	password	: 'sniper', 
	database 	: 'call_bell'
});

function init() {
	connection.connect();

	connection.query( 'CREATE TABLE IF NOT EXISTS devices (' +
		'bed_id VARCHAR(20) NOT NULL, ' +
		'reg_id VARCHAR(250) NOT NULL, ' +
		'PRIMARY KEY (bed_id) ' +
		');');
}
module.exports.init = init;

function close() {
	connection.close();
} 
module.exports.close = close;

function get_reg_id(bed_id, cb) {
	sqlQuery = "SELECT reg_id FROM devices WHERE bed_id = '" + bed_id + "';";

	query(sqlQuery, cb);
}
module.exports.get_reg_id = get_reg_id;

function add_device(bed_id, reg_id, cb) {
	addDeviceQuery = "INSERT INTO devices (bed_id, reg_id) VALUES ('"+ bed_id +"', '"+ reg_id +"');";
	
	query (addDeviceQuery, cb)
}
module.exports.add_device = add_device;



////////////////////////////////// HELPER METHODS /////////////////////
function query(query_string, cb) {
	connection.query(query_string, function (err, result) {
		if (err != undefined) {
			console.log("error: " + err);
		} 

		cb (err, result);
	});
}