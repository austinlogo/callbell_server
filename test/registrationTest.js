var assert = require('assert');
var mockery = require('mockery');
var sinon = require('sinon');
var testData = require('./testdata.js');
var Message = require('../models/Message.js');
var registration;
var sandbox = sinon.sandbox.create();


var SUCCESSFUL_MYSQL_QUERY = "{result: 'success'}";

var stubbedDao = {
    get_device_states_for_group: sandbox.stub().yields(null, "STUBBED"),
    get_device_row: sandbox.stub().yields(
        null, 
        [{DEVICE_ID: '1'}]
    ),
    
    insert_states: sandbox.stub().yields(
        null, 
        SUCCESSFUL_MYSQL_QUERY
    ),
    
    insert_devices: sandbox.stub().yields(
        null,
        SUCCESSFUL_MYSQL_QUERY
    ),
    
    get_reg_id: sandbox.stub().yields(
        null, 
        [ { REGISTRATION_ID: 'TEST_ER_STATION' } ]
    ),
    
    set_device_connection: sandbox.stub().yields()
}

describe('registration', function() {
    before(function() {
        mockery.enable();
    });
    
    beforeEach(function() {
        mockery.registerAllowable('../business/registration')
        mockery.registerAllowable('../business/messages');
        mockery.registerAllowable('async');
        mockery.registerMock('../dao/mysqldao', stubbedDao);
        
        registration = require('../business/registration');
    });
    
    afterEach(function() {
        sandbox.verifyAndRestore();
       mockery.deregisterAll(); 
    });
    
    after(function() {
        mockery.disable();
    });
    
    describe('save_registration', function() {
        
        it('saves_successfully', function() {
            
            registration.save_registration(testData.state_one, function(resp) {
                assert(resp['err'] == null);
                assert.equal(resp['result'], SUCCESSFUL_MYSQL_QUERY);
            });
        });
        
        it('saves_unsuccessfully', function() {
            
            stubbedDao.insert_devices.yields(true, "BAD_QUERY");
            
            registration.save_registration(testData.state_one, function(resp) {
                assert(resp['err'] != null);
                assert.equal(resp['result'], "BAD_QUERY");
            });
        });
    });
    
    describe('toggleRegister', function() {
       it('toggle_successful', function() {
           registration.toggleRegister("TEST_ER_1", 0, function() {
               assert(true);
           })
       });
    });
})