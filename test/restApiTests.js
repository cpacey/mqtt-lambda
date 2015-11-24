'use strict';

const request = require( 'supertest-as-promised' );

const MqttStatus = require( '../lib/MqttStatus.js' );
const serverFactory = require( '../lib/api/serverFactory.js' );
const testSubscribers = require( './subscribersLoaderTestsObjects.js' );
const version = require( '../lib/version.js' );

const mqttStatus = new MqttStatus();
const subscribers = [ testSubscribers.one, testSubscribers.two, testSubscribers.three ];
const server = serverFactory( subscribers, mqttStatus );

describe( 'apiServer', function() {

    beforeEach( () => mqttStatus.connected = false );

    describe( 'GET /', function() {
        it( 'should return 200', function() {
            return request( server )
                .get( '/' )
                .expect( 200 )
                .expect( {
                    subscribers: [
                        {
                            name: testSubscribers.one.name,
                            subscription: testSubscribers.one.subscription
                        },
                        {
                            name: testSubscribers.two.name,
                            subscription: testSubscribers.two.subscription
                        },
                        {
                            name: testSubscribers.three.name,
                            subscription: testSubscribers.three.subscription
                        }
                    ],
                    version
                } );
        } );
    } );

    describe( 'GET /health', function() {

        describe( 'when connected and subscribed', function() {
            it( 'should return 200', function() {

                mqttStatus.connected = true;
                mqttStatus.subscribed = true;

                return request( server )
                    .get( '/health' )
                    .expect( 200 )
                    .expect( {
                        mqtt: {
                            connected: true,
                            subscribed: true
                        }
                    } );
            } );
        } );

        describe( 'when only connected', function() {
            it( 'should return 500', function() {

                mqttStatus.connected = true;

                return request( server )
                    .get( '/health' )
                    .expect( 500 )
                    .expect( {
                        mqtt: {
                            connected: true,
                            subscribed: false
                        }
                    } );
            } );
        } );

        describe( 'when not connected', function() {
            it( 'should return 500', function() {

                return request( server )
                    .get( '/health' )
                    .expect( 500 )
                    .expect( {
                        mqtt: {
                            connected: false,
                            subscribed: false
                        }
                    } );
            } );
        } );
    } );
} );
