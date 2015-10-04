var express = require('express');
var router = express.Router();
var dao = require('../dao/mysqldao');
var gcm = require('../dao/gcmdao');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/register', function (req, res, next) {

	dao.init();

	dao.add_device('A2', 'A654', function() {
		res.render('register', {reg: 'me'});
	});

	// dao.close();	

});

router.get('/send', function (req, res, next) {
	gcm.send("Hello World", function (res) {
		console.log(res);
	});
});


module.exports = router;
