'use strict';

var version = process.env.LAMBDA_VERSION; // eslint-disable-line no-process-env
if( !version ) {

    var npmPackage = require( '../package.json' );
    version = npmPackage.version;
}

module.exports = version;