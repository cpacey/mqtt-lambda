'use strict';

var assert = require( 'assert' );
var subscriberMerger = require( '../lib/subscriberMerger.js' );

describe( 'subscriberMerger', function() {

    describe( 'when no subscribers', function() {
        it( 'should throw', function() {

            assert.throws(
                () => subscriberMerger( [] ),
                Error,
                'at least one subscriber is required'
            );
        } );
    } );

    describe( 'when single subscriber', function() {
        it( 'should not merge, and just return', function() {

            var subscriber = {};

            var ret = subscriberMerger( [ subscriber ] );
            assert.equal( ret, subscriber );
        } );
    } );

} );
