'use strict';

const assert = require( 'assert' );
const mqtt = require( 'mqtt' );
const mqttPacket = require( 'mqtt-packet' );
const net = require( 'net' );
const Promise = require( 'bluebird' );
const sinon = require( 'sinon' );

const brokerUrl = 'mqtt://localhost';

/* eslint-disable no-process-env */
process.env = {
    MQTT_BROKER_URL: brokerUrl,
    MQTT_CLIENT_CONNECT_TIMEOUT: 1000,
    SUBSCRIBERS_ROOT: 'null'
};
/* eslint-enable no-process-env */

const conf = require( '../lib/conf.js' );
const mqttListener = require( '../lib/mqttListener.js' );
const MqttStatus = require( '../lib/MqttStatus.js' );
const log = require( '../lib/log.js' );

describe( 'mqttListener', function() {

    describe( 'when connects', function() {
        it( 'should subscribe and receive messages', function() {

            const mqttStatus = new MqttStatus();

            var testSubscriber = {
                subscription: {
                    topic: 'mqttListener/example'
                },
                receive: () => assert.fail( 'should never be called' )
            };

            var receiveP = new Promise( function( resolve, reject ) {
                testSubscriber.receive = function( topic, message, extras ) {
                    resolve( { topic, message, extras } );
                };
            } );

            return mqttListener( testSubscriber, mqttStatus )
                .then( function( listener ) {

                    assert( mqttStatus.connected, 'should be connected' );
                    assert( mqttStatus.subscribed, 'should be connected' );

                    var testClient = Promise.promisifyAll( mqtt.connect( brokerUrl ) );
                    return testClient
                        .publishAsync( 'mqttListener/example', 'from the cloud' )
                        .then( function() {
                            testClient.end();
                        } )
                        .then( function() {

                            // wait on the receive promise
                            return receiveP;
                        } )
                        .then( function( recieved ) {

                            assert.equal( recieved.topic, 'mqttListener/example' );
                            assert.equal( recieved.message, 'from the cloud' );
                        } )
                        .finally( function() {
                            listener.stop();
                        } );
                } );
        } );
    } );

    describe( 'when lone subscriber throws', function() {
        beforeEach( () => sinon.stub( log, 'error' ) );
        afterEach( () => log.error.restore() );

        it( 'should log', function() {

            const topic = 'mqttListener/example';
            const err = new Error( 'simulated client failure' );

            const mqttStatus = new MqttStatus();

            var testSubscriber = {
                subscription: {
                    topic: 'mqttListener/example'
                },
                receive: () => assert.fail( 'should never be called' )
            };

            var receiveP = new Promise( function( resolve, reject ) {
                testSubscriber.receive = function() {
                    resolve();
                    return Promise.reject( err );
                };
            } );

            return mqttListener( testSubscriber, mqttStatus )
                .then( function( listener ) {

                    assert( mqttStatus.connected, 'should be connected' );
                    assert( mqttStatus.subscribed, 'should be connected' );

                    var testClient = Promise.promisifyAll( mqtt.connect( brokerUrl ) );
                    return testClient
                        .publishAsync( 'mqttListener/example', 'from the cloud' )
                        .then( function() {

                            testClient.end();
                        } )
                        .then( function() {
                            // wait on the receive promise
                            return receiveP;
                        } )
                        .delay( 1 ) // We need to let mqttListener handle the rejected promise first
                        .then( function() {

                            sinon.assert.called(
                                log.error,
                                { err, topic },
                                'unexpected subscriber failure'
                            );

                        } )
                        .finally( function() {
                            listener.stop();
                        } );
                } );
        } );
    } );

    describe( 'when connection fails', function() {
        it( 'should throw error', function() {

            const mqttStatus = new MqttStatus();

            var testSubscriber = {
                subscription: {
                    topic: 'mqttListener/example'
                },
                receive: function() {
                    assert.fail( 'should never be called' );
                }
            };

            var mockMqttServer = Promise.promisifyAll( net.createServer( function( client ) {

                var packet = mqttPacket.generate( {
                    cmd: 'connack',
                    returnCode: 4,
                    sessionPresent: false
                } );

                client.write( packet );
                client.end();
            } ) );

            return mockMqttServer
                .listenAsync( 1884 )
                .then( function() {

                    conf.broker.url = 'mqtt://localhost:1884';

                    return mqttListener( testSubscriber, mqttStatus )
                        .then( function() {
                            assert.fail( 'should not have connected' );
                        } )
                        .catch( function( err ) {
                            assert.equal( err.message, 'Connection refused: Bad username or password' );
                            assert( !mqttStatus.connected, 'should not be connected' );
                            assert( !mqttStatus.subscribed, 'should not be connected' );
                        } );
                } )
                .finally( function() {
                    mockMqttServer.closeAsync();
                } );
        } );
    } );
} );
