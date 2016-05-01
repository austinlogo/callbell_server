require("colors");

exports.error = function(str) {
	if (notUndefined(str)) {
		console.error(str.bold.red);
	}
}

/* 
 * Use this log to state entries into different workflows.
 * e.g: MESSAGES RETRIEVE STATE, RECEIVE, GET_DEVICE_STATE
 */
exports.entry = function(str) {
	if (notUndefined(str)) {
		console.log(str.bold.blue);
	}
}

exports.success = function(str) {
	if (notUndefined(str)) {
		console.log(str.green);
	}
}

/* Use these when you are indicating an action related to a given tablet
 * e.g: tablet_id_log("Send Message to:", state.tablet_name) 
 */
exports.id = function(prefix, id) {
	if (id === undefined || id === null) {
		id = "undefined";
	}

	if (notUndefined(prefix)) {
		console.log(prefix + id.yellow);
	}
}

function notUndefined(str) {
	return str !== undefined && str !== null;
}