'use strict';

var pathUtil = require( 'path' );
var Promise = require( 'bluebird' );
var _ = require( 'lodash' );

var conf = require( './conf.js' );
var fs = require( './fsUtils.js' );
var log = require( './log.js' );

function loadPackageSubscribers( path ) {

    log.info( { path }, 'loading subscriber' );
    var initialSubscriber = require( path );

    var subscribers = _.flatten( [ initialSubscriber ] );
    return subscribers;
}

function loadDirectorySubscribers( path ) {

    return fs
        .getChildDirectoriesAsync( path )
        .then( function( directories ) {
            return Promise.map( directories, loadPackageSubscribers );
        } )
        .then( function( subscribers ) {

            var allSubscribers = _.flatten( subscribers );
            return allSubscribers;
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
                return loadPackageSubscribers( path );
            }

            return loadDirectorySubscribers( path );
        } );
};
