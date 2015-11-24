'use strict';

module.exports = {
    one: {

        name: 'one',

        subscription: {
            topic: 'one',
            qos: 0
        },

        receive: function( topic, message ) {
        }

    },
    two: {
        name: 'two',

        subscription: {
            topic: 'two',
            qos: 0
        },

        receive: function( topic, message ) {
        }
    },
    three: {
        name: 'three',

        subscription: {
            topic: 'three',
            qos: 0
        },

        receive: function( topic, message ) {
        }
    }
};
