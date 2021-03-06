'use strict';

module.exports = function( server, mqttStatus ) {

    server.get( '/health', ( req, res, next ) => {

        const connected = mqttStatus.connected;
        const subscribed = mqttStatus.subscribed;

        var body = {
            mqtt: {
                connected,
                subscribed
            }
        };

        var statusCode = ( connected && subscribed ) ? 200 : 500;
        res.send( statusCode, body );
        next();
    } );
};
