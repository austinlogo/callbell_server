var async = require('async');
var Message = require('../models/Message');
var mysqlDao = require('../dao/mysqldao');
var gcm = require('../dao/gcmdao');
var State = require('../models/State');

exports.route_message = function(json, master_callback) {
	var message = new Message(json);

	send_gcm_message(message, function(gcm_result) {
        console.log("GCM: " + gcm_result);
		master_callback(null, gcm_result);
	});
}

exports.update_state = function (body, master_callback) {

	var state = new State(body[State.id_key]);
	var message = new Message(body);

	console.log(message);
	
	/*
	 * Get Device Row
	 * Insert updated State into new Row
	 * get device state row
	 * send message
	 */
	async.waterfall([
		
		function(cb) {
			mysqlDao.get_device_row(state, function(err, result) {
				console.log("DEVICE: " + result[0]['DEVICE_ID']);
				cb(err, result[0])
			});
		},
		function(device_row,cb) {
			var device_id = device_row['DEVICE_ID'];
			mysqlDao.insert_states(device_id, state, function (err, result) {
				cb(err, device_id);
			});
		},
		function(device_id, cb) {
			mysqlDao.get_state_row_by_device_id(device_id, function (err, result) {
				cb (err, result[0]);
			});
		},
		function(device_row, cb) {
			message.payload = device_row;
			console.log("Send message to " + message.to_id);
			send_gcm_message(message, function(gcm_result) {
				cb(null, gcm_result);
			});
		}
	], function(err, result) {

		console.log("err: " + err);
		console.log("---RESULT---");
		console.log(result);
		var resp = {
			'error': err,
			'result': result
		}

		master_callback(resp);
	});
}

exports.get_device_states = function (body, master_callback) {
	var state = new State(body[State.id_key]);
	console.log("STATE: ");
	console.log(state);
	
	mysqlDao.get_device_states_for_group(state, function(err, result) {
		var resp_json = {
			'error': err,
			'stateList': result
		}

		 return master_callback(resp_json);
	});
}


function send_gcm_message (message, master_cb) {
	async.waterfall([
		
        //get destination registration_id
		function(cb) {
			mysqlDao.get_reg_id(message.state.HOSPITAL_ID, message.state.GROUP_ID, message.to_id, function (err, result) {
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
		function(loc_id, cb) {
			if (loc_id == undefined) {

				var error = {'error':'Registration Empty'};
				cb(error, error);
				return
			}

			console.log("Sending Message from " + message.state.LOCATION_ID);
			gcm.send_message(
                loc_id, 
                message.state, 
                message.payload, 
                message.category, 
                message.state.LOCATION_ID, 
                function (err, resp) {
                    console.log("hello darling");
                    console.log(resp);
                    cb (err, resp);
                });
		}
	], function(err, result) {
		if (err != undefined) {
			console.log("Error in routing message: ");
			console.log(err);
			master_cb(err);
			
		}
		master_cb(result);
	});
}

