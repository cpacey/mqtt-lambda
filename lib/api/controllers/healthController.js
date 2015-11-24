'use strict';

module.exports = server => {
    server.get( '/health', ( req, res, next ) => {
        res.send( 200, 'Ok' );
        next();
    } );
};
