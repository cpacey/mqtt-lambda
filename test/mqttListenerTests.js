'use strict';

var assert = require( 'assert' );
var mqtt = require( 'mqtt' );
var Promise = require( 'bluebird' );
var sinon = require( 'sinon' );

var brokerUrl = 'mqtt://localhost';

process.env = {
    MQTT_BROKER_URL: brokerUrl,
    MQTT_CLIENT_CONNECT_TIMEOUT: 1000,
    SUBSCRIBERS_ROOT: './examples'
};

var conf = require( '../lib/conf.js' );
var log = require( '../lib/log.js' );
var mqttListener = require( '../lib/mqttListener.js' );

describe( 'mqttListener', function() {

    describe( 'when connects', function() {
        it( 'should subscribe and receive messages', function() {

            var testSubscriber = {
                subscription: {
                    topic: 'mqttListener/example'
                },
                receive: () => assert.fail( 'should never be called' )
            };

            var receiveP = new Promise( function( resolve, reject ) {
                testSubscriber.receive = function( topic, message, extras ) {
                    resolve( { topic, message, extras } );
                }
            } );

            return mqttListener( testSubscriber )
                .then( function() {

                    var testClient = Promise.promisifyAll( mqtt.connect( brokerUrl ) );
                    return testClient
                        .publishAsync( 'mqttListener/example', 'from the cloud' )
                        .then( function() {
                            testClient.end();
                        } );
                } )
                .then( function() {

                    // wait on the receive promise
                    return receiveP;
                } )
                .then( function( recieved ) {

                    assert.equal( recieved.topic, 'mqttListener/example' );
                    assert.equal( recieved.message, 'from the cloud' );
                } );
        } );
    } );

} );