var mysqlDao = require('../dao/mysqldao');
var async = require('async');
var RegistrationRequest = require('../models/RegistrationRequest');

//saves registration and returns the response in the callback
exports.save_registration = function (req_body, master_callback) {
	var registration_request = new RegistrationRequest(req_body);

	console.log(registration_request);

	async.waterfall([
		function(cb) {
			mysqlDao.insert_devices(registration_request.state, 
					registration_request.reg_id, 
					function(err, result) {

				if (err != undefined) {
					console.log("error saving registration: " + error);
				}

				

				 cb (err, result);
			});
		},
		function(response_json, cb) {
			mysqlDao.get_device_row(registration_request.state, function(err, result) {
				console.log("DEVICE: " + result[0]['DEVICE_ID']);
				cb(err, result[0]['DEVICE_ID'])
			});
		},
		function(device_id, cb) {
			mysqlDao.insert_states(device_id, registration_request.state, function(err, result) {
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