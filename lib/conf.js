'use strict';

var EnvironmentVariableReader = require( 'cti-process-environment-variable-reader' );

var log = require( './log.js' );
var env = new EnvironmentVariableReader( log );

var requireClientId = process.env.REQUIRE_CLIENT_ID || false; // eslint-disable-line no-process-env

var clientId;
if( requireClientId && requireClientId !== 'false' ) { // eslint-disable-line no-process-env
    clientId = env.getRequired( 'MQTT_CLIENT_ID', 203 );
} else {
    clientId = env.getOptional( 'MQTT_CLIENT_ID', null );
}

var clean = env.getOptional(
    'MQTT_CLIENT_CLEAN',
    'true',
    { restriction: [ 'true', 'false' ] }
);

module.exports = {
    broker: {
        url: env.getRequired( 'MQTT_BROKER_URL', 200 )
    },
    client: {
        clientId: clientId,
        clean: ( clean === 'true' ),
        connectTimeout: parseInt( env.getOptional( 'MQTT_CLIENT_CONNECT_TIMEOUT', '30000' ), 10 ),
        keepalive: parseInt( env.getOptional( 'MQTT_CLIENT_KEEPALIVE', '10' ), 10 ),

        username: env.getOptional( 'MQTT_CLIENT_USERNAME', null ),
        password: env.getOptional( 'MQTT_CLIENT_PASSWORD', null )
    },
    subscribers: {
        path: env.getRequired( 'SUBSCRIBERS_ROOT', 201 )
    }
};
