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

			add_user(client_id, socket, function() {
				clients[client_id].emit('CONFIRMATION', 'true');
				console.log("clients: " + Object.size(clients));

				registration.save_registration(json, function(json) {

				});	
			});
		
			
		});

		socket.on("UNREGISTER", function (client_id) {
			console.log("unregistering " + client_id);

			remove_user(client_id, socket, function() {
				console.log("Client List: " + Object.size(clients));
				// registration.toggleRegister(client_id, false);
			});
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

			});
		});

		socket.on("UPDATE_STATE", function	(request) {
			var body = JSON.parse(request);

			messages.get_device_states(body, clients, function(resp) {

			});
		});
		
		socket.on("ping", function (to) {
			var isAdded = clients.hasOwnProperty(to);

			add_user(to, socket, function() {

				if (to.indexOf('STATION') > 0) {
					clients[to].emit("pong", JSON.stringify(Object.keys(clients)));
				} else {
					clients[to].emit("pong", "");
				}

				

				if (!isAdded) {
					registration.toggleRegister(to, true, function () {
						return;						
					});
				}
			});
		});

		socket.on("disconnect", function () {
			console.log("on disconnect of " + sockets[socket]);
			socket.emit("SERVER_DISCONNECT", sockets[socket]);
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

function add_user (client, socket, cb) {
	clients[client] = socket;
	sockets[socket] = client; 

	console.log("Added User: " + client);
	console.log(Object.keys(clients));

	return cb();
}

function remove_user (client, socket, cb) {
	delete clients[client];
	delete sockets[socket];

	console.log("Removed user: " + client);
	console.log(Object.keys(clients));

	cb();
}


