'use strict';

var pathUtil = require( 'path' );
var Promise = require( 'bluebird' );

var conf = require( './conf.js' );
var fs = require( './fsUtils.js' );
var log = require( './log.js' );
var subscriberMerger = require( './subscriberMerger.js' );


module.exports = function() {

    var serviceRoot = pathUtil.join( __dirname, '..' );
    var path = pathUtil.join( serviceRoot, conf.subscribers.path );

    return fs
        .getChildDirectoriesAsync( path )
        .then( function( directories ) {
            return Promise.map( directories, function( dir ) {

                log.info( { path: dir }, 'loading subscriber' );
                return require( dir );
            } );
        } )
        .then( function( subscribers ) {

            if( subscribers.length === 0 ) {
                throw new Error( 'No subscribers found' );
            }

            var subscriber = subscriberMerger( subscribers );
            return subscriber;
        } );
};
