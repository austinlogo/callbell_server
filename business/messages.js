var async = require('async');
var Message = require('../models/Message');
var mysqlDao = require('../dao/mysqldao');
var gcm = require('../dao/gcmdao');
var State = require('../models/State');
var logger = require("../util/logger");

exports.route_message = function(json, master_callback) {
	var message = new Message(json);
    
    if (message.category == Message.CATEGORY_CALL_BELL) {
        mysqlDao.record_call_bell(message);
    }

	send_gcm_message(message, function(gcm_result) {
        console.log(gcm_result);
		return master_callback (null, gcm_result);
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
				logger.id("DEVICE: ", result[0]['DEVICE_ID']);
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
			logger.id("Send message to " + message.to_id);
			send_gcm_message(message, function(gcm_result) {
				cb(null, gcm_result);
			});
		}
	], function(err, result) {
		logger.error(err);
		console.log("---RESULT---");
		console.log(result);
		var resp = {
			'error': err,
			'result': result
		}

		master_callback(resp);
	});
}

exports.retrieve_state = function(json) {
	var state = new State(json[State.id_key]);

	logger.entry("MESSAGES RETRIEVE STATE");
	console.log(state);
	var to = state.LOCATION_ID

	mysqlDao.get_device_row(state, function(err, result) {		
		var message = new Message();

		if (result.length == 0) {
			state = new State({});
		} else {
			state = new State(result[0]);
		}

		message.state = state;
		message.to_id = to;
		message.category = "RETRIEVE_STATE";
		message.payload = {};

		send_gcm_message(message, function(result) {});
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

			logger.id("Sending Message from ", message.state.LOCATION_ID);
			gcm.send_message(
                loc_id, 
                message.state, 
                message.payload, 
                message.category, 
                message.state.LOCATION_ID, 
                function (err, resp) {
                    console.log(resp);
                    cb (err, resp);
                });
		}
	], function(err, result) {
		if (err != undefined) {
			logger.error(err);
			master_cb(err);
			
		}
		master_cb(result);
	});
}

