'use strict';

var EnvironmentVariableReader = require( 'cti-process-environment-variable-reader' );

var log = require( './log.js' );
var env = new EnvironmentVariableReader( log );

module.exports = {
    broker: {
        url: env.getRequired( 'MQTT_BROKER_URL', 200 )
    },
    client: {
        clientId: env.getOptional( 'MQTT_CLIENT_ID', null ),
        clean: env.getOptional( 'MQTT_CLIENT_CLEAN', true ),
        keepalive: env.getOptional( 'MQTT_CLIENT_KEEPALIVE', 10 ),

        username: env.getOptional( 'MQTT_CLIENT_USERNAME', null ),
        password: env.getOptional( 'MQTT_CLIENT_PASSWORD', null )
    },
    subscribers: {
        path: env.getRequired( 'SUBSCRIBERS_ROOT', 201 )
    }
};
