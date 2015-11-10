'use strict';

module.exports = [ {

    name: 'console-logger-info',

    subscription: {
        topic: 'info',
        qos: 0
    },

    receive: function( topic, message ) {
        console.info( message.toString() );
    }

}, {
    name: 'console-logger-warn',

    subscription: {
        topic: 'warn',
        qos: 0
    },

    receive: function( topic, message ) {
        console.warn( message.toString() );
    }
} ];
