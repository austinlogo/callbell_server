var HOSPITAL_KEY = "hospital_id";
var GROUP_KEY = "group_id";
var LOCATION_KEY = "location_id";
var PHYSICIAN_KEY = "physician_id";
var NURSE_KEY = "nurse_id";
var RESIDENT_KEY = "resident_id";
var CHIEF_COMPLAINT_KEY = "chief_complaint_key";

var State = function (json) {
	this.hospital_id = json[HOSPITAL_KEY] == undefined ? '' : json[HOSPITAL_KEY];
	this.group_id = json[GROUP_KEY] == undefined ? '' : json[GROUP_KEY];
	this.location_id = json[LOCATION_KEY] == undefined ? '' : json[LOCATION_KEY];
	this.physician_id = json[PHYSICIAN_KEY] == undefined ? '' : json[PHYSICIAN_KEY];
	this.nurse_id = json[NURSE_KEY] == undefined ? '' : json[NURSE_KEY];
	this.resident_id = json[RESIDENT_KEY] == undefined ? '' : json[RESIDENT_KEY];
	this.chief_complaint_id = json[CHIEF_COMPLAINT_KEY] == undefined ? '' : json[CHIEF_COMPLAINT_KEY];
}

module.exports = State