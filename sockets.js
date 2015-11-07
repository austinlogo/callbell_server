var socketio = require('socket.io');
var registration = require('./business/registration');
var RegistrationRequest = require('./models/RegistrationRequest');
// var gcm = require('./dao/gcmdao');
var messages = require('./business/messages');

var io;
var socket;
var clients;
var sockets;

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

exports.listen = function(server){
    io = socketio.listen(server);
    clients = [];
    sockets = [];
    value = "initialized";

    init_listeners();
}

function init_listeners() {

	io.on('connection', function (socket){
		console.log('a user connected');

		socket.on("REGISTER", function (request) {
			var json = JSON.parse(request);
			var client_id = json['REGISTRATION_ID'];

			console.log("adding " + client_id);
			// clients[client_id] = socket;
			// sockets[socket] = client_id;

			add_user(client_id, socket, function() {
				clients[client_id].emit('CONFIRMATION', 'true');
				console.log("clients: " + Object.size(clients));

				registration.save_registration(json, function(json) {
					// res.send(json);
				});	
			});
		
			
		});

		socket.on("UNREGISTER", function (client_id) {
			console.log("unregistering " + client_id);
			delete clients[client_id];
			console.log("Client List: " + Object.size(clients));
		});

		socket.on("RECEIVE", function (request) {
			var jsonRequest = JSON.parse(request);
			console.log("Receiving message");
			messages.route_message(jsonRequest, function(resp) {
				// res.send(resp);
			});	
		});

		socket.on("GET_DEVICE_STATES", function (request) {
			var body = JSON.parse(request);
			console.log(body);

			messages.update_state(body, function(resp) {
				// res.send(resp);
			});
		});

		socket.on("UPDATE_STATE", function	(request) {
			var body = JSON.parse(request);

			messages.get_device_states(body, function(resp) {
				// res.send(resp);
			});
		});
		
		socket.on("ping", function (to) {
			if (!clients.hasOwnProperty(to)) {
				console.log("Adding user: " + to);
			}

			add_user(to, socket, function() {
				clients[to].emit("pong", "");	
			});
		});

		socket.on("disconnect", function () {
			console.log("inner socket disconnect of " + sockets[socket]);
		});
	});
}

module.exports.send_message_to_device = function (location_id, payload) {
	console.log("Destination: " + location_id);
	if (clients.hasOwnProperty(location_id)) {
		clients[location_id].emit('DEVICE_MESSAGE', payload);
	} else {
		console.log(location_id + " is not a registered device.");
	}
}

function add_user(client, socket, cb) {
	clients[client] = socket;
	sockets[socket] = client; 

	return cb();
}


