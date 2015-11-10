'use strict';

var pathUtil = require( 'path' );
var Promise = require( 'bluebird' );
var _ = require( 'lodash' );

var conf = require( './conf.js' );
var fs = require( './fsUtils.js' );
var log = require( './log.js' );
var subscriberMerger = require( './subscriberMerger.js' );

function loadSubscriber( path ) {

    log.info( { path }, 'loading subscriber' );
    var initialSubscriber = require( path );
    var subscribers = _.flatten( [ initialSubscriber ] );
    var subscriber = subscriberMerger( subscribers );
    return subscriber;

}

function loadSubscribers( path ) {

    return fs
        .getChildDirectoriesAsync( path )
        .then( function( directories ) {
            return Promise.map( directories, loadSubscriber );
        } )
        .then( function( subscribers ) {

            if( subscribers.length === 0 ) {
                throw new Error( 'No subscribers found' );
            }

            var subscriber = subscriberMerger( subscribers );
            return subscriber;
        } );
}

module.exports = function() {

    var path = conf.subscribers.path;

    if( !pathUtil.isAbsolute( path ) ) {
        path = pathUtil.join( process.cwd(), path );
    }

    return fs
        .doesFileExist( path, 'package.json' )
        .then( function( isPackage ) {

            if( isPackage ) {
                return loadSubscriber( path );
            }

            return loadSubscribers( path );
        } );
};
