var category_key = "category";
var payload_key = "payload"
var from_id_key = "from_id";
var to_id_key = "to_id_key";

var Message = function(json) {
	this.from_id = json[from_id_key];
	this.to_id = json[to_id_key];
	this.category = json[category_key];
	this.payload = json[payload_key];
}