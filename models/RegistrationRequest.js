var State = require('./State');

var state_id = 'state_id';
var hospital_id_key = 'hospital_id';
var bed_id_key = 'bed_id';
var reg_id_key = 'registration_id';


var RegistrationRequest = function (json) {
	this.state = new State(json[state_id]);
	this.reg_id = json[reg_id_key];
}

module.exports = RegistrationRequest;