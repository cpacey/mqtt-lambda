'use strict';

var log = require( './log' );
var mqttListener = require( './mqttListener.js' );
var subscriberLoader = require( './subscriberLoader.js' );

subscriberLoader()
    .then( function( subscriber ) {

        mqttListener( subscriber )
            .then( function( listener ) {

                process.on( 'SIGINT', function() {

                    log.info( 'SIGINT signaled, stopping' );
                    listener.stop();
                } );
            } )
            .catch( function( err ) {

                log.info( err, 'exiting due to listener error' );
                process.exit( 2 ); // eslint-disable-line no-process-exit
            } );
    } )
    .catch( function( err ) {

        log.info( err, 'exiting due to subscriber error' );
        process.exit( 1 ); // eslint-disable-line no-process-exit
    } );

