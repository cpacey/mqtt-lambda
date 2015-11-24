'use strict';

var Promise = require( 'bluebird' );

var conf = require( '../conf.js' );
var log = require( '../log.js' );
var serverFactory = require( './serverFactory.js' );

module.exports = function( subscribers, mqttStatus ) {

    return new Promise( function( resolve, reject ) {

        var server = serverFactory( subscribers, mqttStatus );

        let resolved = false;

        server.on( 'error', function( err ) {
            if( !resolved ) {
                reject( err );
            }
        } );

        try {
            server.listen( conf.api.port, function() {

                log.info(
                    { httpPort: conf.api.port },
                    'api server listening'
                );

                resolved = true;
                resolve( server );
            } );

        } catch( err ) {
            reject( err );
        }
    } );
};
