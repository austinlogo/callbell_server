var State = require('./State');

var state_key = "STATE_ID";
var category_key = "CATEGORY_ID";
var payload_key = "PAYLOAD_ID"
var to_id_key = "TO_ID";
var CALL_BELL_REASON = "CALL_BELL_REASON";

var Message = function(json) {

	if (json == undefined) {
		return;
	}
	
	this.state = new State(json[state_key])
	this.to_id = json[to_id_key];
	this.category = json[category_key];
	this.payload = json[payload_key];
};

Message.CATEGORY_CALL_BELL = "call_bell";
Message.CATEGORY_RATE_PAIN = "rate_pain";
Message.CATEGORY_TABLET_STATE_UPDATE = "tablet_state";
Message.CALL_BELL_REASON = CALL_BELL_REASON;

module.exports = Message;