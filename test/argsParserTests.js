'use strict';

var assert = require( 'assert' );
var argsParser = require( '../bin/argsParser.js' );

describe( 'argsParser', function() {

    describe( 'no arts', function() {
        it( 'should be parsed', function() {

            var argv = [ 'node', 'test.js' ];
            var env = {};

            argsParser( argv, env );

            assert.deepEqual( env, {
                MQTT_CLIENT_CLEAN: true
            } );
        } );
    } );

    describe( 'brokerUrl', function() {
        it( 'should be parsed', function() {

            var argv = [ 'node', 'test.js', '--brokerUrl', 'mqtt://test.org' ];
            var env = {};

            argsParser( argv, env );

            assert.deepEqual( env, {
                MQTT_CLIENT_CLEAN: true,
                MQTT_BROKER_URL: 'mqtt://test.org'
            } );
        } );
    } );

    describe( 'subscribersRoot', function() {
        it( 'should be parsed', function() {

            var argv = [ 'node', 'test.js', '--subscribersRoot', './test/' ];
            var env = {};

            argsParser( argv, env );

            assert.deepEqual( env, {
                MQTT_CLIENT_CLEAN: true,
                SUBSCRIBERS_ROOT: './test/'
            } );
        } );
    } );

    describe( 'clientId', function() {
        it( 'should be parsed', function() {

            var argv = [ 'node', 'test.js', '--clientId', 'abc' ];
            var env = {};

            argsParser( argv, env );

            assert.deepEqual( env, {
                MQTT_CLIENT_CLEAN: true,
                MQTT_CLIENT_ID: 'abc'
            } );
        } );
    } );

    describe( 'clean=true', function() {
        it( 'should be parsed', function() {

            var argv = [ 'node', 'test.js', '--clean', 'true' ];
            var env = {};

            argsParser( argv, env );

            assert.deepEqual( env, {
                MQTT_CLIENT_CLEAN: true
            } );
        } );
    } );

    describe( 'clean=false', function() {
        it( 'should be parsed', function() {

            var argv = [ 'node', 'test.js', '--clean', 'false' ];
            var env = {};

            argsParser( argv, env );

            assert.deepEqual( env, {
                MQTT_CLIENT_CLEAN: false
            } );
        } );
    } );
} );
