var logger = require("./util/logger");
var socketio = require('socket.io');
var registration = require('./business/registration');
var RegistrationRequest = require('./models/RegistrationRequest');
var State = require('./models/State');
var Metric = require('./models/EducationMetric');
var messages = require('./business/messages');
var metrics = require('./business/metrics');
var moment = require('moment');


var io;
var socket;
var clients;
var sockets;


var SERVER_DISCONNECT = "SERVER_DISCONNECT";
var CONNECTION_UPDATE = "CONNECTION_UPDATE";
var GET_DEVICE_STATES = "GET_DEVICE_STATES";
var UPLOAD_EDUCATION_METRICS = "UPLOAD_EDUCATION_METRICS";

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
            
            console.log("REGISTER".green.bold);
            console.log(state);

            var client_id = state.TABLET_NAME;

            add_user(client_id, socket, false, function() {
                clients[client_id].emit('CONFIRMATION', 'true');
                console.log("clients: " + Object.size(clients));

                registration.save_registration(state, function(json) {

                }); 

                send_message (state.STATION_NAME, CONNECTION_UPDATE, JSON.stringify({
                    "CONNECTION_STATUS": true, 
                    "TABLET_NAME": state.TABLET_NAME
                }));
            });   
        });

        socket.on("UNREGISTER", function (request) {
            var json = JSON.parse(request);
            var state = new State(json);

            logger.id("UNREGISTER ", state.TABLET_NAME);

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
            console.log("RECEIVE".green.bold);
            messages.route_message(jsonRequest, function(resp) {
                // res.send(resp);
            }); 
        });


        // TODO: WORK IN PROGRESS
        socket.on("RETRIEVE_STATE", function(request) {
            logger.entry("RETRIEVE_STATE".green.bold);
            var json = JSON.parse(request);

            console.log("State:" + json.toString());

            messages.retrieve_state(json);
        });

        socket.on("UPDATE_STATE_AND_SEND_REQUEST", function (request) {
            logger.entry("UPDATE_STATE_AND_SEND_REQUEST");
            var jsonRequest = JSON.parse(request);

            messages.update_state(jsonRequest, function(resp) {});

        });

        socket.on(GET_DEVICE_STATES, function (request) {
            logger.entry("GET_DEVICE_STATES");
            var body = JSON.parse(request);
            var state = new State(body[State.id_key]);
            console.log(body);

            messages.get_device_states(body, function(resp) {
                send_message_back(socket, GET_DEVICE_STATES, resp);
            });
        });
        
        socket.on(UPLOAD_EDUCATION_METRICS, function(request) {
            logger.entry(UPLOAD_EDUCATION_METRICS);
            
            var body = JSON.parse(request);
            console.log(body);
            metrics.record_education_metrics(body);
        });
        
//
//        socket.on("UPDATE_STATE", function  (request) {
//            var body = JSON.parse(request);
//
//            messages.get_device_states(body, clients, function(resp) {
//
//            });
//        });
        
        socket.on("ping", function (to) {
            var isAdded = clients.hasOwnProperty(to);

            add_user(to, socket, isAdded, function() {

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
            logger.id("on disconnect of ", sockets[socket]);
            remove_user(sockets[socket], socket, function() {});
            socket.emit(SERVER_DISCONNECT, sockets[socket]);
        });

        socket.on("error", function (error) {
            logger.error(error);
        })
    });
}

function send_message_back(socket, operation, payload) {
    
    if (socket != undefined) {
    socket.emit(operation, payload);
    }
}

function send_message (to, operation, payload) {
    logger.id("Destination: ", to);
    if (clients.hasOwnProperty(to)) {
        clients[to].emit(operation, payload);
    } else {
        logger.error(to + " is not a registered device.");
    }
}

module.exports.send_message_to_device = function (location_id, payload) {
    logger.id("Destination: ", location_id);
    if (clients.hasOwnProperty(location_id)) {
        clients[location_id].emit('DEVICE_MESSAGE', payload);
    } else {
        logger.error(location_id + " is not a registered device.");
    }
}

function add_user (client, socket, isAdded, cb) {
    clients[client] = socket;
    sockets[socket] = client; 

    if (!isAdded) {
        logger.id("Added User: ", client);
        console.log(Object.keys(clients));
        registration.toggleRegister(client, true, function() {});
    }
    return cb();
}

function remove_user (client, socket, cb) {
    if (socket != undefined && sockets[socket] != undefined) {
        delete sockets[socket];
    }
    
    if (client != undefined) {
        logger.id("Removed user: ", client);
        delete clients[client];
    }
    
    registration.toggleRegister(client, false, function() {});
    
    cb();
}


