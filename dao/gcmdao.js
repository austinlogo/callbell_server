var request = require('request');
var sockets = require('../sockets');

var gcm_url = 'https://gcm-http.googleapis.com/gcm/send'
var callback


var clients = [];

// io.on('connection', function (socket){
//   console.log('a user connected');

//   console.log(clients);

//   socket.on("event", function(msg){
//     console.log("Hello_world");
//     send_message("message received");

//   });

//   socket.on("add", function (msg) {
//     socket.user = msg;
//     clients[msg] = socket;
//     console.log("Socket: " + socket);
  
//     clients[msg].emit('message', 'You have been added');
//     console.log(clients);
//   });

//   socket.on("ping", function (to) {
//     clients[to].emit('message', "Someone is pinging you :)");
//   });
// });

// function send_message (msg) {
//   io.emit("message", msg);
// }

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
}


// OLD COMM METHODS

// module.exports.send_message = function(reg_id, state, msg, category, from, cb) {
//     callback = cb;
//     console.log('gcm send reg_id ' + reg_id)

//     console.log("payload: ");
//     console.log(msg);
   
//     request(
//         { 
//             method: 'POST',
//             uri: 'https://gcm-http.googleapis.com/gcm/send',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization':'key=AIzaSyBdc10A1Cy7fsYy-ocn5wwXC1Ne5GYQMgc'
//             },
//             body:   JSON.stringify({
//                         "to" : reg_id,
//                         "data" : {
//                             "CATEGORY_ID": category,
//                             "PAYLOAD_ID": msg,
//                             "STATE_ID": state,
//                             "BED_ID": from
//                         }
//                     })
//         }
//         , gcm_response_callback
//       )
// }

function gcm_response_callback (error, response, body) {
    console.log("GCM Send Response: " + JSON.stringify(response));
    console.log("GCM Send body: " + body);
    var responseStr = response.hasOwnProperty('statusCode') 
            ? response['statusCode']
            : "No Response"
    callback({'GCM Send StatusCode ': responseStr, "Error: ": error});
}