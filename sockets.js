var socketio = require('socket.io');
var registration = require('./business/registration');
var RegistrationRequest = require('./models/RegistrationRequest');
var State = require('./models/State');
var messages = require('./business/messages');
var moment = require('moment');

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

    io.on('connection', function (socket) {
        console.log('a user connected');

        socket.on("REGISTER", function (request) {
            var json = JSON.parse(request);
            var state = new State(json);

            console.log(state);

            var client_id = state.TABLET_NAME;

            add_user(client_id, socket, function() {
                clients[client_id].emit('CONFIRMATION', 'true');
                console.log("clients: " + Object.size(clients));

                registration.save_registration(state, function(json) {

                }); 

                send_message (state.STATION_NAME, "CONNECTION_UPDATE", JSON.stringify({
                    "CONNECTION_STATUS": true, 
                    "TABLET_NAME": state.TABLET_NAME
                }));
            });   
        });

        socket.on("UNREGISTER", function (request) {
            var json = JSON.parse(request);
            var state = new State(json);

            console.log("unregistering " + state.TABLET_NAME);

            send_message(state.STATION_NAME, "CONNECTION_UPDATE", JSON.stringify({
                    "CONNECTION_STATUS": false, 
                    "TABLET_NAME": state.TABLET_NAME
                })
            );

            remove_user(state.TABLET_NAME, socket, function() {
                console.log("Client List: " + Object.size(clients));
            });

            
        });

        socket.on("RECEIVE", function (request) {
            var jsonRequest = JSON.parse(request);
            console.log("Receiving message");
            messages.route_message(jsonRequest, function(resp) {
                // res.send(resp);
            }); 
        });


        // TODO: WORK IN PROGRESS
        socket.on("RETRIEVE_STATE", function(request) {
            console.log("RETRIEVE_STATE");
            var json = JSON.parse(request);

            console.log("JSON GOING ALONG");
            console.log(json);

            messages.retrieve_state(json);
        });

        socket.on("UPDATE_STATE_AND_SEND_REQUEST", function (request) {
            console.log("UPDATE_STATE_AND_SEND_REQUEST");
            var jsonRequest = JSON.parse(request);

            messages.update_state(jsonRequest, function(resp) {});

        });

        socket.on("GET_DEVICE_STATES", function (request) {
            var body = JSON.parse(request);
            console.log(body);

            messages.update_state(body, function(resp) {

            });
        });

        socket.on("UPDATE_STATE", function  (request) {
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

function send_message (to, operation, payload) {
    console.log("Destination: " + to);
    if (clients.hasOwnProperty(to)) {
        clients[to].emit(operation, payload);
    } else {
        console.log(to + " is not a registered device.");
    }
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


