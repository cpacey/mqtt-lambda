'use strict';

var version = require( '../../version.js' );

module.exports = function( server, subscribers ) {

    server.get( '/', ( req, res, next ) => {

        var body = {
            subscribers: subscribers,
            version
        };

        res.json( body );
        next();
    } );
};
