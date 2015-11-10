'use strict';

var assert = require( 'assert' );

var conf = require( '../lib/conf' );
var objects = require( './subscriberLoaderTestsObjects' );
var subscriberLoader = require( '../lib/subscriberLoader' );

describe( 'subscriberLoader', function() {

    describe( 'when one package with multiple subscribers', function() {
        it( 'should work', function() {

            conf.subscribers.path = 'test/subscribersRoot/onePackageManySubscribers/';

            return subscriberLoader()
                .then( function( result ) {
                    assert.deepEqual(
                        result.subscription,
                        [ objects.one.subscription, objects.two.subscription ]
                    );
                } );

        } );
    } );

    describe( 'when multiple package with multiple subscribers', function() {
        it( 'should work', function() {

            conf.subscribers.path = 'test/subscribersRoot/manyPackageManySubscribers/';

            return subscriberLoader()
                .then( function( result ) {
                    assert.deepEqual(
                        result.subscription,
                        [ objects.one.subscription, objects.two.subscription, objects.three.subscription ]
                    );
                } );

        } );
    } );

} );
