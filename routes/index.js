var express = require('express');
var router = express.Router();
var dao = require('../dao/mysqldao');
var gcm = require('../dao/gcmdao');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/register', function (req, res, next) {
	var body = req.body

	dao.init();

	dao.add_device(body['from'], body['message'], function(err, result) {
		res.send({
			'err': err,
			'result': result
		});
	});

});

router.post('/receive', function (req, res, next) {
	var body = req.body;
	console.log(req.body);

	dao.get_reg_id(body['to'], function (err, result) {
		if (err != null) {
			console.log("error");
			return;
		}

		var reg_id = result[0]['reg_id'];

		gcm.send(reg_id, body['message'], body['from'], body['to'], function (resp) {
			console.log(resp);
			res.send(resp);
		});

	});

	

	
});


module.exports = router;
