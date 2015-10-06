var mysqlDao = require('../dao/mysqldao');
var RegistrationRequest = require('../models/RegistrationRequest');

//saves registration and returns the response in the callback
exports.save_registration = function (req_body, cb) {
	var registration_request = new RegistrationRequest(req_body);

	mysqlDao.insert(registration_request.bed_id, registration_request.reg_id, function(err, result) {
		if (err != undefined) {
			console.log("error saving registration: " + error);
		}

		var response_json = {
			'err': err,
			'result': result
		}

		 cb (response_json);
	});
}