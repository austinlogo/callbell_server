var assert = require('assert');
var mockery = require('mockery');
var sinon = require('sinon');
var testData = require('./testdata');
var env = require('../config/env');
var State = require('../models/State');
var mysql = require('mysql');

var mysqlDao;
var state;
var sandbox = sinon.sandbox.create();


describe('mysqlDao', function() {
    before(function() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        
        state = new State(testData.state_one);
    });
    
    beforeEach(function() {
        mockery.registerAllowable('../dao/mysqldao');
        mockery.registerAllowable('../models/State');
        mockery.registerAllowable('../config/env');
        mockery.registerAllowable('mysql');
        
        mysqlDao = require('../dao/mysqldao');
        mysqlDao.set_db_connection(env.mysql_db_test_settings);
    });
    
    afterEach(function() {
        sandbox.verifyAndRestore();
       mockery.deregisterAll(); 
    });
    
    after(function() {
        mockery.disable();
    });
//    
    describe('get_reg_id', function() {
        it ('isSuccessful', function() {
            mysqlDao.init();
            
            var callback = sinon.spy();
            
            mysqlDao.get_reg_id(state.HOSPITAL_ID, state.GROUP_ID, state.LOCATION_ID, function(err, result) {
                assert(err == undefined);
            });
        });
    });
    
    describe('get_device_row', function() {
        it ('isSuccessful', function() {
            mysqlDao.init();
            
            var callback = sinon.spy();
            
            mysqlDao.get_device_row(state, function(err, result) {
                assert(err == undefined);
            });
        });
    });
    
    describe('get_state_row_by_device_id', function() {
        it ('isSuccessful', function() {
            mysqlDao.init();
            
            var callback = sinon.spy();
            
            mysqlDao.get_state_row_by_device_id(1, function(err, result) {
                assert(err == undefined);
            });
        });
    });
    
    describe('remove', function() {
        it ('isSuccessful', function() {
            mysqlDao.init();
            
            var callback = sinon.spy();
            
            mysqlDao.remove(state.LOCATION_ID, function(err, result) {
                assert(err == undefined);
            });
        });
    });
    
    describe('insert_devices', function() {
        it ('isSuccessful', function() {
            mysqlDao.init();
            
            var callback = sinon.spy();
            
            mysqlDao.insert_devices(state, state.TABLET_NAME, function(err, result) {
                assert(err == undefined);
            });
        });
    });
    
    describe('set_device_connection', function() {
        it ('isSuccessful', function() {
            mysqlDao.init();
            
            var callback = sinon.spy();
            
            mysqlDao.set_device_connection(state.TABLET_NAME, 1, function(err, result) {
                assert(err == undefined); 
            });
        });
    });
    
    describe('get_tablet_station_name', function() {
        it ('isSuccessful', function() {
            mysqlDao.init();
            
            var callback = sinon.spy();
            
            mysqlDao.get_tablet_station_name(state.TABLET_NAME, function(stationName, state) {
                assert.equal(stationName, state.STATION_NAME);
            });
        });
        
//        it ('isUnsuccessful', function() {
//            this.timeout(10000);
//            mysqlDao.init();
//            
//            var callback = sinon.spy();
//            
//            mysqlDao.get_tablet_station_name("'''%\0", function(err, result) {
//                assert(err != undefined);
//            });
//        });
    });
    
    describe('insert_states', function() {
        it ('isSuccessful', function() {
            mysqlDao.init();
            
            var callback = sinon.spy();
            
            mysqlDao.insert_states(1, state, function(err, result) {
                assert(err == undefined);
            });
        });
    });
    
    describe('get_device_states_for_group', function() {
        it ('isSuccessful', function() {
            mysqlDao.init();
            
            var callback = sinon.spy();
            
            mysqlDao.get_device_states_for_group(state, function(err, result) {
                assert(err == undefined);
            });
        });
    });
});