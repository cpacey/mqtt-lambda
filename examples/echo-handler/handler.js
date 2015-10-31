'use strict';

module.exports = {

    name: 'echoer',

    subscription: {
        topic: 'echo/in',
        qos: 0
    },

    receive: function( topic, message, extras ) {
        extras.client.publish( 'echo/out', message );
    }

};
