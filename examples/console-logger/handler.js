'use strict';

module.exports = {

    name: 'console-logger',

    subscription: {
        topic: 'console',
        qos: 0
    },

    receive: function( topic, message ) {
        console.info( message.toString() );
    }

};
