var HOSPITAL_KEY = "hospital_id";
var LOCATION_KEY = "location_id";
var GROUP_KEY = "group_id";

var State = function (json) {
	this.hospital_id = json[HOSPITAL_KEY];
	this.group_id = json[GROUP_KEY];
	this.location_id = json[LOCATION_KEY];
}

module.exports = State