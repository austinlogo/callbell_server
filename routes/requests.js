var express = require('express');
var router = express.Router();
var registration = require('../business/registration');
var gcm = require('../dao/gcmdao');
var messages = require('../business/messages');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

//Registration request for new devices and devices updating their tokens
router.post('/register', function (req, res, next) {
	console.log ("registration request");

	registration.save_registration(req.body, function(json) {
		res.send(json);
	});

});

router.post('/receive', function (req, res, next) {
	var body = req.body;
	console.log(req.body);

	messages.route_message(body, function(resp) {
		res.send(resp);
	});
	
	// mysqlDao.get_reg_id(body['to'], function (err, result) {
	// 	if (err != null) {
	// 		console.log("error");
	// 		return;
	// 	}

	// 	var reg_id = result[0]['reg_id'];

	// 	gcm.send(reg_id, body['message'], body['from'], body['to'], function (resp) {
	// 		console.log(resp);
	// 		res.send(resp);
	// 	});

	// });

	

	
});

module.exports = router;
