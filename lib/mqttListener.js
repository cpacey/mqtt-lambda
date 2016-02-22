'use strict';

var mqtt = require( 'mqtt' );
var Promise = require( 'bluebird' );

var conf = require( './conf.js' );
var log = require( './log' );

function getSubscription( subscriber ) {

    if( Array.isArray( subscriber.subscription ) ) {
        return subscriber.subscription;
    }

    return [ subscriber.subscription ];
}

module.exports = function( subscriber, mqttStatus ) {

    var brokerUrl = conf.broker.url;

    var clientOptions = {
        clientId: conf.client.clientId,
        clean: conf.client.clean,
        keepalive: conf.client.keepalive,
        username: conf.client.username,
        password: conf.client.password
    };

    var subscription = getSubscription( subscriber );

    var client = Promise.promisifyAll( mqtt.connect( brokerUrl, clientOptions ) );

    return new Promise( function( resolve, reject ) {

        var responded = false;

        client.on( 'connect', function( connack ) {

            log.info( { connack: connack }, 'connected to mqtt' );
            mqttStatus.connected = true;

            return Promise
                .map( subscription, function( sub ) {

                    log.debug( { topic: sub.topic, qos: sub.qos }, 'subscribing' );
                    return client.subscribeAsync( sub.topic, { qos: sub.qos || 0 } )
                        .then( function( granted ) {
                            log.info( { granted: granted }, 'subscribed' );
                        } );
                } )
                .then( function() {

                    log.debug( { connack: connack }, 'fully subscribed to mqtt' );
                    mqttStatus.subscribed = true;

                    if( !responded ) {
                        responded = true;

                        resolve( {

                            stop: function() {

                                log.info( 'closing mqtt client' );
                                client.end();
                            }
                        } );
                    }
                } )
                .catch( function( err ) {

                    log.error( err, 'mqtt subscription error' );

                    if( !responded ) {
                        responded = true;
                        client.end();
                        reject( err );
                    }
                } );
        } );

        client.on( 'error', function( err ) {

            log.error( err, 'mqtt error' );

            if( !responded ) {
                responded = true;
                client.end();
                reject( err );
            }
        } );

        client.on( 'offline', function() {
            log.info( 'mqtt offline' );
            mqttStatus.connected = false;
        } );

        client.on( 'close', function() {
            log.info( 'mqtt closed' );
            mqttStatus.connected = false;
        } );

        var subscriberClient = {
            publish: client.publish.bind( client ),
            publishAsync: client.publishAsync.bind( client )
        };

        client.on( 'message', function( topic, message, packet ) {

            const extras = {
                client: subscriberClient,
                packet: packet
            };

            Promise
                .try( () => subscriber.receive( topic, message, extras ) )
                .catch( err => {
                    log.error( { err, topic }, 'unexpected subscriber failure' );
                } );
        } );
    } );
};
