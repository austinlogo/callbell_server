var sockets = require('../sockets');

var gcm_url = 'https://gcm-http.googleapis.com/gcm/send'

module.exports.send_message = function (loc_id, state, msg, category, from, cb) {
    var payload = JSON.stringify({
        "to" : loc_id,
        "data" : {
            "CATEGORY_ID": category,
            "PAYLOAD_ID": msg,
            "STATE_ID": state,
            "BED_ID": from
        }
    });
    
    sockets.send_message_to_device(loc_id, payload);
    cb (null, payload);
}