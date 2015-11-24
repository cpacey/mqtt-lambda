'use strict';

var bunyan = require( 'bunyan' );
var version = require( './version.js' );

/* eslint-disable no-process-env */
module.exports = bunyan.createLogger( {
    name: process.env.LAMBDA_LOG_NAME || 'mqtt-lamda',
    level: process.env.LAMBDA_LOG_LEVEL || 'debug',
    version
} );
/* eslint-enable no-process-env */
