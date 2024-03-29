var HOSPITAL_ID = "HOSPITAL_ID";
var GROUP_ID = "GROUP_ID";
var LOCATION_ID = "LOCATION_ID";
var PHYSICIAN_ID = "PHYSICIAN_ID";
var NURSE_ID = "NURSE_ID";
var RESIDENT_ID = "RESIDENT_ID";
var CHIEF_COMPLAINT_ID = "CHIEF_COMPLAINT_ID";
var PAIN_RATING_ID = "PAIN_RATING_ID";
var CONNECTED_INDICATOR = "CONNECTION_INDICATOR_ID";
var TABLET_NAME_ID = "TABLE_NAME_ID";
var STATION_TABLET_NAME_ID = "STATION_TABLET_NAME_ID";
var PENDING_TESTS_ID = "PENDING_TESTS_ID";
var PENDING_MEDICATIONS_ID = "PENDING_MEDICATIONS_ID";
var DONE_TESTS_ID = "DONE_TESTS_ID";
var DONE_MEDICATIONS_ID = "DONE_MEDICATIONS_ID";
var ALL_TESTS_ID = "ALL_TESTS_ID";
var ALL_MEDICATIONS_ID = "ALL_MEDICATIONS_ID";
var ACCEPTABLE_PAIN_ID = "ACCEPTABLE_PAIN_ID";

var State;

var station_title = "STATION";

State = function (json) {
	
	
	this.HOSPITAL_ID = json[HOSPITAL_ID] == undefined ? '' : json[HOSPITAL_ID];
	this.GROUP_ID = json[GROUP_ID] == undefined ? '' : json[GROUP_ID];
	this.LOCATION_ID = json[LOCATION_ID] == undefined ? '' : json[LOCATION_ID];
	this.PHYSICIAN_ID = json[PHYSICIAN_ID] == undefined ? '' : json[PHYSICIAN_ID];
	this.NURSE_ID = json[NURSE_ID] == undefined ? '' : json[NURSE_ID];
	this.RESIDENT_ID = json[RESIDENT_ID] == undefined ? '' : json[RESIDENT_ID];
	this.CHIEF_COMPLAINT_ID = json[CHIEF_COMPLAINT_ID] == undefined ? '' : json[CHIEF_COMPLAINT_ID];
	this.PAIN_RATING_ID = json[PAIN_RATING_ID] == undefined ? 0 : json[PAIN_RATING_ID];
	this.CONNECTION_INDICATOR_ID = json[CONNECTED_INDICATOR] == undefined 
			? 1
			: json[CONNECTED_INDICATOR];
	this.TABLET_NAME = json[TABLET_NAME_ID] == undefined ? '' : json[TABLET_NAME_ID];
	this.PENDING_TESTS_ID = json[PENDING_TESTS_ID] == undefined ? [] : json[PENDING_TESTS_ID];
	this.PENDING_MEDICATIONS_ID = json[PENDING_MEDICATIONS_ID] == undefined ? [] : json[PENDING_MEDICATIONS_ID];
    this.DONE_TESTS_ID = json[DONE_TESTS_ID] == undefined ? [] : json[DONE_TESTS_ID];
    this.DONE_MEDICATIONS_ID = json[DONE_MEDICATIONS_ID] == undefined ? [] : json[DONE_MEDICATIONS_ID];
	this.ALL_TESTS_ID = json[ALL_TESTS_ID] == undefined ? [] : json[ALL_TESTS_ID];
	this.ALL_MEDICATIONS_ID = json[ALL_MEDICATIONS_ID] == undefined ? [] : json[ALL_MEDICATIONS_ID];
	this.STATION_NAME = json[STATION_TABLET_NAME_ID] == undefined ? '' : json[STATION_TABLET_NAME_ID];
    this.ACCEPTABLE_PAIN_ID = json[ACCEPTABLE_PAIN_ID] == undefined ? 0 : json[ACCEPTABLE_PAIN_ID];
}

State.id_key = 'STATE_ID';

State.HOSPITAL_ID = HOSPITAL_ID;
State.GROUP_ID = GROUP_ID;
State.LOCATION_ID = LOCATION_ID;
State.PHYSICIAN_ID = PHYSICIAN_ID;
State.NURSE_ID = NURSE_ID;
State.RESIDENT_ID = RESIDENT_ID;
State.CHIEF_COMPLAINT_ID = CHIEF_COMPLAINT_ID;
State.ACCEPTABLE_PAIN_ID = ACCEPTABLE_PAIN_ID;
State.PAIN_RATING_ID = PAIN_RATING_ID;
State.CONNECTION_INDICATOR_ID = CONNECTED_INDICATOR;
State.TABLET_NAME_ID = TABLET_NAME_ID;
State.STATION_TABLET_NAME_ID = STATION_TABLET_NAME_ID;
State.PENDING_TESTS_ID = PENDING_TESTS_ID;
State.PENDING_MEDICATIONS_ID = PENDING_MEDICATIONS_ID;
State.DONE_TESTS_ID = DONE_TESTS_ID;
State.DONE_MEDICATIONS_ID = DONE_MEDICATIONS_ID;
State.ALL_TESTS_ID = ALL_TESTS_ID;
State.ALL_MEDICATIONS_ID = ALL_MEDICATIONS_ID;

module.exports = State;