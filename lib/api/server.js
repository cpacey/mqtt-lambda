'use strict';

var restify = require( 'restify' );

var conf = require( '../conf.js' );
var log = require( '../log.js' );

module.exports = function() {
    return new Promise( function( resolve, reject ) {

        var server = restify.createServer();
        require( './controllers/healthController.js' )( server );

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

        server.listen( conf.api.port, function() {

            log.info(
                {
                    serverName: server.name,
                    httpPort: conf.api.port
                },
                'api server listening'
            );

            resolve();
        } );

    } );
};
