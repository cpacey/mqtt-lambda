'use strict';

var assert = require( 'assert' );
var pathUtil = require( 'path' );
var fsUtils = require( '../lib/fsUtils.js' );

describe( 'fsUtilts', function() {

    describe( 'doesFileExist', function() {

        describe( 'when file exists', function() {
            it( 'should return true', function() {

                var nestedPath = pathUtil.join( __dirname, 'directory/nested' );
                return fsUtils
                    .doesFileExist( nestedPath, 'package.json' )
                    .then( function( exists ) {
                        assert.equal( exists, true, 'file should exist' );
                    } );
            } );
        } );

        describe( 'when file doesn\'t exists', function() {
            it( 'should return false', function() {

                var nestedPath = pathUtil.join( __dirname, 'directory/nested' );
                return fsUtils
                    .doesFileExist( nestedPath, 'junk.json' )
                    .then( function( exists ) {
                        assert.equal( exists, false, 'file should not exist' );
                    } );
            } );
        } );

        describe( 'when path points to a directory', function() {
            it( 'should return false', function() {

                var nestedPath = pathUtil.join( __dirname, 'directory/nested' );
                return fsUtils
                    .doesFileExist( nestedPath, 'junk.json' )
                    .then( function( exists ) {
                        assert.equal( exists, false, 'file should not exist' );
                    } );
            } );
        } );
    } );

} );
