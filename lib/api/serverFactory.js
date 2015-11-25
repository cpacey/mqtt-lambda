'use strict';

var restify = require( 'restify' );

var log = require( '../log.js' );

module.exports = function( subscribers, mqttStatus ) {

    var server = restify.createServer( {
        name: 'mqtt-lambda',
        log: log
    } );

    require( './controllers/indexController.js' )( server, subscribers );
    require( './controllers/healthController.js' )( server, mqttStatus );

    server.on( 'uncaughtException', ( req, res, route, err ) => {
        log.error( err, 'Uncaught Restify exception' );
    } );

    server.on( 'after', ( req, res, route, err ) => {

        if( err ) {
            if( err.statusCode >= 400 && err.statusCode < 500 ) {
                log.warn( err, 'request resulted in user error' );
            } else {
                log.error( err, 'request resulted in error' );
            }
        }
    } );

    return server;
};
