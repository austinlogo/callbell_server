var State = require('./State');

var state_key = "state_id";
var category_key = "category_id";
var payload_key = "payload_id"
var to_id_key = "to_id";

var Message = function(json) {
	this.state = new State(json[state_key])
	this.to_id = json[to_id_key];
	this.category = json[category_key];
	this.payload = json[payload_key];
};

module.exports = Message;