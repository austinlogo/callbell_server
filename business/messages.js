var async = require('async');
var Message = require('../models/Message');
var mysqlDao = require('../dao/mysqldao');
var gcm = require('../dao/gcmdao');

exports.route_message = function(json, callback) {
	var message = new Message(json);

	async.waterfall([
		//get destination registration_id
		function(cb) {
			mysqlDao.get_reg_id(message.hospital_id, message.to_id, function (err, result) {
				console.log("query: " + result)
				cb(err, result[0]['reg_id']);
			});
		},
		//send message
		function(reg_id, cb) {
			gcm.send_message(reg_id, message.payload, message.from_id, function (resp) {
				console.log(resp);
				cb (null, resp);
			});
		}
	], function(err, result) {
		if (err != undefined) {
			console.log("Error in routing message: " + e);
		}

		callback(result);
	});
};