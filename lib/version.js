'use strict';

var packageVersion = require( '../version.json' );
module.exports = process.env.LAMBDA_VERSION || packageVersion; // eslint-disable-line no-process-env
