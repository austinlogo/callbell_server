var gcmdao;
var sinon = require('sinon');
var assert = require('assert');
var mockery = require('mockery');
var testData = require('./testdata');

var sandbox = sinon.sandbox.create();

var stubbedSockets = {
    send_message_to_device: sandbox.stub()
}

describe('mysqlDao', function() {
    before(function() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });        
    });
    
    beforeEach(function() {
        mockery.registerMock('../sockets', stubbedSockets);
        mockery.registerAllowable('../dao/gcmdao.js');
        
        gcmdao = require('../dao/gcmdao.js');
    });
    
    afterEach(function() {
        sandbox.verifyAndRestore();
       mockery.deregisterAll(); 
    });
    
    after(function() {
        mockery.disable();
    });
    
    describe('gcmdao', function() {
       
        describe('send_message', function() {
            it ('isSuccessful', function() {
                var state = testData.state_one;
                gcmdao.send_message(state.LOCATION_ID, state, "Hello", "call_bell", state.TABLET_NAME, function(err, payload) {
                    assert(err == null);
                    assert(payload != null);
                } )
            });
        })
    });
    
});