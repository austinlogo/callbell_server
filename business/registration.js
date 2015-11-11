var mysqlDao = require('../dao/mysqldao');
var async = require('async');
var messages = require('../business/messages');

//saves registration and returns the response in the callback
exports.save_registration = function (state, master_callback) {

	console.log(state);

	async.waterfall([
		function(cb) {
			mysqlDao.insert_devices(state, 
					state.TABLET_NAME, 
					function(err, result) {

				if (err != undefined) {
					console.log("error saving registration: " + error);
				}

				

				 cb (err, result);
			});
		},
		function(response_json, cb) {
			mysqlDao.get_device_row(state, function(err, result) {
				console.log("DEVICE: " + result[0]['DEVICE_ID']);
				cb(err, result[0]['DEVICE_ID'])
			});
		},
		function(device_id, cb) {
			mysqlDao.insert_states(device_id, state, function(err, result) {
				cb(err, result);
			});
		}
		], function(err, result) {

			var response_json = {
					'err': err,
					'result': result
				}
			master_callback(response_json);
		});

	
}

exports.toggleRegister = function (reg_id, isConnected, master_callback) {
	mysqlDao.set_device_connection(reg_id, isConnected, function() {
		return master_callback();
	});
}