'use strict';

var assert = require( 'assert' );

var conf = require( '../lib/conf.js' );
var objects = require( './subscribersLoaderTestsObjects.js' );
var subscribersLoader = require( '../lib/subscribersLoader.js' );

describe( 'subscribersLoader', function() {

    describe( 'when one package with multiple subscribers', function() {
        it( 'should work', function() {

            conf.subscribers.path = 'test/subscribersRoot/onePackageManySubscribers/';

            return subscribersLoader()
                .then( function( subscribers ) {

                    assert.deepEqual( subscribers, [
                        objects.one,
                        objects.two
                    ] );
                } );

        } );
    } );

    describe( 'when multiple package with multiple subscribers', function() {
        it( 'should work', function() {

            conf.subscribers.path = 'test/subscribersRoot/manyPackageManySubscribers/';

            return subscribersLoader()
                .then( function( subscribers ) {

                    assert.deepEqual( subscribers, [
                        objects.one,
                        objects.two,
                        objects.three
                    ] );
                } );

        } );
    } );

} );
