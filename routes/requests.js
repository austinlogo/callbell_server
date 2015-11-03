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
	console.log(req.body);

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
});

//This comes from the Bed tablet
router.post('/updateState', function (req, res, next) {
	var body = req.body;
	console.log(body);

	messages.update_state(body, function(resp) {
		res.send(resp);
	});

});

router.post('/getDeviceStates', function (req, res, next) {
	var body = req.body;

	messages.get_device_states(body, function(resp) {
		res.send(resp);
	});
});



module.exports = router;
