
var bed_id_key = 'bed_id'
var reg_id_key = 'register_id'


var RegistrationRequest = function (json) {
	this.bed_id = json[bed_id_key];
	this.reg_id = json[reg_id_key];
}

module.exports = RegistrationRequest