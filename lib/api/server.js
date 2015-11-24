'use strict';

var restify = require( 'restify' );

var conf = require( '../conf.js' );
var log = require( '../log.js' );

module.exports = function( subscribers, mqttStatus ) {

    return new Promise( function( resolve, reject ) {

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
            if ( err && !err.alreadyLogged ) {
                if ( err.statusCode >= 400 && error.statusCode < 500 ) {
                    req.log.warn( err, 'request resulted in user error' );
                } else {
                    req.log.error( err, 'request resulted in error' );
                }
            }
        } );

        server.on( 'error', function( err ) {
            reject( err );
        } );

        try {
            server.listen( conf.api.port, function() {

                log.info(
                    { httpPort: conf.api.port },
                    'api server listening'
                );

                resolve( {
                    close: function() {
                        server.close();
                    }
                } );
            } );

        } catch( err ) {
            reject( err );
        }
    } );
};
