var State = require('./State');

var state_id = 'STATE_ID';
var reg_id_key = 'REGISTRATION_ID';


var RegistrationRequest = function (json) {
	this.state = new State(json[state_id]);
	this.state.CONNECTION_INDICATOR_ID = true;
	this.reg_id = json[reg_id_key];
}

module.exports = RegistrationRequest;