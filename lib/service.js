'use strict';

const conf = require( './conf.js' );
const log = require( './log.js' );
const mqttListener = require( './mqttListener.js' );
const MqttStatus = require( './MqttStatus.js' );
const subscribersLoader = require( './subscribersLoader.js' );
const subscriberMerger = require( './subscriberMerger.js' );
const startApiServer = require( './api/server.js' );

function run() {

    subscribersLoader()
        .then( function( subscribers ) {

            if( subscribers.length === 0 ) {
                log.error( 'no subscribers found' );
                process.exit( 3 ); // eslint-disable-line no-process-exit
            }

            const mqttStatus = new MqttStatus();

            return startApiServer( subscribers, mqttStatus )
                .then( function( apiServer ) {

                    var subscriber = subscriberMerger( subscribers );
                    mqttListener( subscriber, mqttStatus )
                        .then( function( listener ) {

                            process.on( 'SIGINT', function() {

                                log.info( 'SIGINT signaled, stopping' );
                                listener.stop();
                                apiServer.close();
                            } );
                        } )
                        .timeout( conf.client.connectTimeout )
                        .catch( function( err ) {

                            log.error( err, 'exiting due to listener error' );
                            process.exit( 2 ); // eslint-disable-line no-process-exit
                        } );
                } )
                .catch( function( err ) {

                    log.error( err, 'failed to start api server' );
                    process.exit( 4 ); // eslint-disable-line no-process-exit
                } );
        } )
        .catch( function( err ) {

            log.error( err, 'failed to load subscribers' );
            process.exit( 1 ); // eslint-disable-line no-process-exit
        } );
}

process.on( 'uncaughtException', function( err ) {
    log.fatal( err );
    process.exit( 100 ); // eslint-disable-line no-process-exit
} );

process.on( 'unhandledRejection', function( reason, p ) {
    log.fatal( { reason: reason, p: p }, 'Unhandled rejection' );
    process.exit( 101 ); // eslint-disable-line no-process-exit
} );

if ( require.main === module ) {
    run();
}

module.exports = run;
