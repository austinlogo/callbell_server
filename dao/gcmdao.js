var request = require('request');

var gcm_url = 'https://gcm-http.googleapis.com/gcm/send'

module.exports.send_message = function(reg_id, msg, from, callback) {
    // var reg_id = "eVkzBXIVmDM:APA91bECnl5QHrs2i4q9Yb77Ku4CIeRJg4tktLZePH7TVnWwOK9vnblgrwfYCaWVTPSuUhTS1wb2Zq8YzQ4gXKgREGyAc8wKVVQTJrk-ILFSuq4iC0jL0Iol1FW1OuuthXRhPWfE9Z48";
    console.log('gcm send reg_id ' + reg_id)
    var len = 1;
   
    request(
        { 
            method: 'POST',
            uri: 'https://gcm-http.googleapis.com/gcm/send',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':'key=AIzaSyBdc10A1Cy7fsYy-ocn5wwXC1Ne5GYQMgc'
            },
            body:   JSON.stringify({
                        "to" : reg_id,
                        "data" : {
                            "message": msg,
                            "bed_id": from
                        }
                    })
        }
        , gcm_response_callback
      )
}

function gcm_response_callback (error, response, body) {
    console.log("GCM Send Response: " + JSON.stringify(response));
    console.log("GCM Send body: " + body);
    callback({'GCM Send StatusCode ': response['statusCode'], "Error: ": error});
}