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

module.exports = function( subscriber ) {

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

        var connected = false;

        client.on( 'connect', function( connack ) {
            log.info( { connack: connack }, 'connected to mqtt' );

            return Promise
                .map( subscription, function( sub ) {

                    log.debug( { topic: sub.topic, qos: sub.qos }, 'subscribing' );
                    return client.subscribeAsync( sub.topic, { qos: sub.qos || 0 } )
                        .then( function( granted ) {
                            log.info( { granted: granted }, 'subscribed' );
                        } );
                } )
                .then( function() {

                    if( !connected ) {
                        connected = true;

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

                    if( !connected ) {
                        reject( err );
                    }
                } );
        } );

        client.on( 'error', function( err ) {

            log.error( err, 'mqtt error' );

            if( !connected ) {
                reject( err );
            }
        } );

        client.on( 'offline', function() {
            log.info( 'mqtt offline' );
        } );

        client.on( 'close', function() {
            log.info( 'mqtt closed' );
        } );

        var subscriberClient = {
            publish: client.publish.bind( client ),
            publishAsync: client.publishAsync.bind( client )
        };

        client.on( 'message', function( topic, message, packet ) {
            subscriber.receive(
                topic,
                message,
                {
                    client: subscriberClient,
                    packet: packet
                }
            );
        } );
    } );
};
