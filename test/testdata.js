var Message = require('../models/Message');
var State = require('../models/State')

exports.state_one = {
    "NURSE_ID": "Carmen",
    "RESIDENT_ID": "",
    "LOCATION_ID": "3",
    "GROUP_ID": "ER",
    "ACCEPTABLE_PAIN_RATING_ID": 3,
    "PAIN_RATING_ID" : 0,
    "PHYSICIAN_ID": "House",
    "CHIEF_COMPLAINT_ID": "Slurred Speak",
    "HOSPITAL_ID": "TEST",
    "CONNECTION_INDICATOR_ID": 1,
    "TABLE_NAME_ID": "TEST_ER_3",
    "STATION_TABLET_NAME_ID": "TEST_ER_STATION",
    "SHOWN_TESTS_ID": "[0,1,2]",
    "SHOWN_MEDICATIONS_ID": "[0]",
    "ALL_TESTS_ID": "[]",
    "ALL_MEDICATIONS_ID": "[]",
}

exports.message_json = {
    "STATE_ID": this.state_one,
    "CATEGORY_ID": "call_bell",
    "PAYLOAD_ID": {},
    "TO_ID": "STATION"
}

exports.state_body_json = {
    "STATE_ID": this.state_one
}