var assert = require('assert');
var mockery = require('mockery');
var sinon = require('sinon');
var testData = require('./testdata.js');
var Message = require('../models/Message.js');
var State = require('../models/State.js');

var sandbox = sinon.sandbox.create();

// Stubbed external Dependencies
var stubbedDao = {
    get_device_states_for_group: sandbox.stub().yields(null, "STUBBED"),
    get_device_row: sandbox.stub().yields(
        null, 
        [{DEVICE_ID: '1'}]
    ),
    
    insert_states: sandbox.stub().yields(
        null, 
        "{successful}"
    ),
    
    get_state_row_by_device_id: sandbox.stub().yields(
        null,
        ["DEVICE_PAYLOAD"]
    ),
    
    get_reg_id: sandbox.stub().yields(
        null, 
        [ { REGISTRATION_ID: 'TEST_ER_STATION' } ]
    ),
    
    record_call_bell: sandbox.stub().returns()
}

var stubbedGcm = {
    send_message: sandbox.stub().yields(null, "ME_MINE")
}

var messages;
    

describe('messages', function() {
    
    before(function() {
        mockery.enable();
    });
    
    beforeEach(function() {
        mockery.registerAllowable('../business/messages.js');
        mockery.registerAllowable('async');
        mockery.registerAllowable('../models/State');
        mockery.registerAllowable('../models/Message');
        mockery.registerMock('../dao/gcmdao', stubbedGcm);
        mockery.registerMock('../dao/mysqldao', stubbedDao);
        
        messages = require('../business/messages.js');
    });
    
    afterEach(function() {
        sandbox.verifyAndRestore();
       mockery.deregisterAll(); 
    });
    
    after(function() {
        mockery.disable();
    });
    
    describe('route_message', function() {
        it('sends_message_succesfull', function() {
            
            stubbedGcm.send_message.reset();
            
            messages.route_message(testData.message_json, function(err, result) {
                console.log("done");
                assert(stubbedDao.get_reg_id.calledOnce);
                console.log("done");
                assert(stubbedGcm.send_message.calledOnce);
                console.log("done");
                assert(false);
                console.log("done");
            });
        });
        
        it('sends_message_unsuccesfull', function() {
           
            stubbedGcm.send_message.reset();
            stubbedGcm.send_message.yields("AUSTIN", "SECOND");
            
            messages.route_message(testData.message_json, function(err, result) {
                console.log("result: " + result);
                
                assert(stubbedDao.get_reg_id.called);
                assert(stubbedGcm.send_message.calledOnce);
            });           
        });
    });
    
    describe('update_state', function() {
        
        it('update_successful', function() {
            stubbedGcm.send_message.reset();
            
            messages.update_state(testData.state_body_json, function(resp) {
                assert(stubbedGcm.send_message.calledOnce);
            });
        });
    });
    
    
    describe('get_device_state', function () {
        it('get_state_successful', function () {
            var body = {
                "STATE_ID": testData.state_one
            }
            
            messages.get_device_states(body, function(resp) {
                assert(stubbedDao.get_device_states_for_group.calledOnce);
                assert.equal(resp['stateList'], "STUBBED");
            });
            
            

        });
    });
});