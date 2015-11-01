var HOSPITAL_KEY = "HOSPITAL_ID";
var GROUP_KEY = "GROUP_ID";
var LOCATION_KEY = "LOCATION_ID";
var PHYSICIAN_KEY = "PHYSICIAN_ID";
var NURSE_KEY = "NURSE_ID";
var RESIDENT_KEY = "RESIDENT_ID";
var CHIEF_COMPLAINT_KEY = "CHIEF_COMPLAINT_ID";
var PAIN_RATING_KEY = "PAIN_RATING_ID";

var State;

State = function (json) {
	
	
	this.HOSPITAL_ID = json[HOSPITAL_KEY] == undefined ? '' : json[HOSPITAL_KEY];
	this.GROUP_ID = json[GROUP_KEY] == undefined ? '' : json[GROUP_KEY];
	this.LOCATION_ID = json[LOCATION_KEY] == undefined ? '' : json[LOCATION_KEY];
	this.PHYSICIAN_ID = json[PHYSICIAN_KEY] == undefined ? '' : json[PHYSICIAN_KEY];
	this.NURSE_ID = json[NURSE_KEY] == undefined ? '' : json[NURSE_KEY];
	this.RESIDENT_ID = json[RESIDENT_KEY] == undefined ? '' : json[RESIDENT_KEY];
	this.CHIEF_COMPLAINT_ID = json[CHIEF_COMPLAINT_KEY] == undefined ? '' : json[CHIEF_COMPLAINT_KEY];
	this.PAIN_RATING_ID = json[PAIN_RATING_KEY] == undefined ? 0 : json[PAIN_RATING_KEY];
}

State.id_key = 'STATE_ID';

module.exports = State