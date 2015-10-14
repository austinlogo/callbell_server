var async = require('async');
var Message = require('../models/Message');
var mysqlDao = require('../dao/mysqldao');
var gcm = require('../dao/gcmdao');
var State = require('../models/State');

exports.route_message = function(json, master_callback) {
	var message = new Message(json);

	async.parallel([
		function(cb) {
			send_gcm_message(message, function(gcm_result) {
				cb(gcm_result);
			});
		},
		function(cb) {
			update_states_table(message.state);
		}
	], function(err, result) {
		master_callback(result[0]);
	});
}

exports.get_device_states = function (body, master_callback) {
	var state = new State(body['state_id']);
	console.log(state);
	
	mysqlDao.get_device_states(state, function(err, result) {
		var resp_json = {
			'error': err,
			'stateList': result
		}

		master_callback(resp_json)
	})
}


function send_gcm_message (message, cb) {
	async.waterfall([
		//get destination registration_id
		function(cb) {
			mysqlDao.get_reg_id(message.state.hospital_id, message.state.group_id, message.to_id, function (err, result) {
				console.log(result);

				if (result.length == 0) {

				var error = {'error':'No Station Returned'};
				cb(error, error);
				return
			}
				cb(err, result[0]['REGISTRATION_ID']);
			});
		},
		//send message
		function(reg_id, cb) {
			if (reg_id == undefined) {

				var error = {'error':'Registration Empty'};
				cb(error, error);
				return
			}

			gcm.send_message(reg_id, message.payload, message.from_id, function (resp) {
				console.log(resp);
				cb (null, resp);
			});
		}
	], function(err, result) {
		if (err != undefined) {
			console.log("Error in routing message: " + err);
		}

		cb(result);
	});
}

function update_states_table (state) {
	
	async.waterfall([
		function(cb) {
			mysqlDao.get_device_row(state, function(err, result) {
				console.log("DEVICE: " + result[0]['DEVICE_ID']);
				cb(err, result[0]['DEVICE_ID'])
			});
		},
		function(device_id,cb) {
			mysqlDao.insert_states(device_id, state, function(err, result) {
				cb(err, result);
			});
		}
	], function(err, result) {

		console.log("err: " + err);
		console.log("---RESULT---");
		console.log(result);
	});
}