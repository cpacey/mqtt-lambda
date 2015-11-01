'use strict';

var bunyan = require( 'bunyan' );

/* eslint-disable no-process-env */
module.exports = bunyan.createLogger( {
    name: process.env.LAMBDA_LOG_NAME || 'mqtt-lamda',
    level: process.env.LAMBDA_LOG_LEVEL || 'debug'
} );
/* eslint-enable no-process-env */
