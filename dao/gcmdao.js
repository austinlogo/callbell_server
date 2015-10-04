var request = require('request');

exports.send = function(msg, callback) {
    var reg_id = "eVkzBXIVmDM:APA91bECnl5QHrs2i4q9Yb77Ku4CIeRJg4tktLZePH7TVnWwOK9vnblgrwfYCaWVTPSuUhTS1wb2Zq8YzQ4gXKgREGyAc8wKVVQTJrk-ILFSuq4iC0jL0Iol1FW1OuuthXRhPWfE9Z48";
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
                            "fromu": "Austin",
                            "name": "Austin"
                        }, 
                        "time-to-live" : 3600
                    })
        }
        , function (error, response, body) {
              callback({'error': error});
        }
      )
}