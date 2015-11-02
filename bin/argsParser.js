'use strict';

var _ = require( 'lodash' );
var argsLib = require( 'args' );

var argvOptions = argsLib.Options.parse( [
    {
        name: 'brokerUrl',
        help: 'The mqtt broker url (or via $MQTT_BROKER_URL)'
    },
    {
        name: 'subscribersRoot',
        help: 'The root directory for the subscribers (or via $SUBSCRIBERS_ROOT)'
    },
    {
        name: 'clientId',
        help: 'The mqtt client id (or via $MQTT_CLIENT_ID)'
    },
    {
        name: 'clean',
        type: 'bool',
        defaultValue: true,
        help: 'Whether or not the client should create a clean session (or via $MQTT_CLIENT_CLEAN)'
    }
] );

var argvMap = {
    brokerUrl: 'MQTT_BROKER_URL',
    subscribersRoot: 'SUBSCRIBERS_ROOT',
    clientId: 'MQTT_CLIENT_ID',
    clean: 'MQTT_CLIENT_CLEAN'
};

function parseArgs( argv, env ) {

    var args = argsLib.parser( argv ).parse( argvOptions );
    _.forIn( args, function( value, key ) {

        var envName = argvMap[ key ];
        if( !envName ) {
            throw new Error( 'unknown argument ' + key );
        }

        env[ envName ] = value.toString();
    } );
}

module.exports = parseArgs;
