'use strict';

var _ = require( 'lodash' );
var fs = require( 'fs' );
var pathUtil = require( 'path' );
var Promise = require( 'bluebird' );

fs = Promise.promisifyAll( fs );

module.exports = {

    getChildDirectoriesAsync: function( path ) {

        return fs
            .readdirAsync( path )
            .then( function( files ) {
                return Promise.map( files, function( file ) {

                    var filePath = pathUtil.join( path, file );

                    return fs.statAsync( filePath )
                        .then( function( stats ) {

                            return {
                                path: filePath,
                                isDirectory: stats.isDirectory()
                            };
                        } );
                } );
            } )
            .then( function( files ) {

                var directories = _.filter( files, file => file.isDirectory );

                var directoryPaths = _.pluck( directories, 'path' );
                return directoryPaths;
            } );
    },

    doesFileExist: function( directory, file ) {

        var path = pathUtil.join( directory, file );
        return fs
            .statAsync( path )
            .then( function( stats ) {

                if( !stats ) {
                    return false;
                }

                var isFile = stats.isFile();
                return isFile;
            } )
            .catch( err => false );
    }
};
