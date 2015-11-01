'use strict';

var assert = require( 'assert' );
var sinon = require( 'sinon' );

var log = require( '../lib/log.js' );
var subscriberMerger = require( '../lib/subscriberMerger.js' );

var logWarnSpy = sinon.spy( log, 'warn' );
var logErrorSpy = sinon.spy( log, 'error' );

function resetSpies() {
    logWarnSpy.reset();
    logErrorSpy.reset();
}

describe( 'subscriberMerger', function() {

    beforeEach( resetSpies );
    after( resetSpies );

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

            assert( !logWarnSpy.called, 'no warnings should have been logged' );
            assert( !logErrorSpy.called, 'no errors should have been logged' );
        } );
    } );

    describe( 'when two subscribers have individual subscriptions', function() {
        it( 'should merge both subscriptions', function() {

            var subscriberA = {
                subscription: {
                    topic: 'abc',
                    qos: 0
                },
                receive: sinon.spy()
            };

            var subscriberB = {
                subscription: {
                    topic: 'def',
                    qos: 1
                },
                receive: sinon.spy()
            };

            var ret = subscriberMerger( [ subscriberA, subscriberB ] );

            assert.deepEqual( ret.subscription, [
                {
                    topic: 'abc',
                    qos: 0
                },
                {
                    topic: 'def',
                    qos: 1
                }
            ] );

            assert( !subscriberA.receive.called, 'receive should not have been called yet' );
            assert( !subscriberB.receive.called, 'receive should not have been called yet' );

            ret.receive( 'abc', 'cats' );
            assert( subscriberA.receive.calledOnce, 'A should be called for topic abc' );
            assert( !subscriberB.receive.called, 'B should not be called for topic abc' );
            assert( subscriberA.receive.calledWith( 'abc', 'cats' ), 'A should be called with correct args' );
            subscriberA.receive.reset();
            subscriberB.receive.reset();

            ret.receive( 'def', 'bats' );
            assert( !subscriberA.receive.called, 'A should not be called for topic def' );
            assert( subscriberB.receive.calledOnce, 'B should be called for topic def' );
            assert( subscriberB.receive.calledWith( 'def', 'bats' ), 'B should be called with correct args' );
            subscriberA.receive.reset();
            subscriberB.receive.reset();

            ret.receive( 'ghi', 'rats' );
            assert( !subscriberA.receive.called, 'A should not be called for topic ghi' );
            assert( !subscriberB.receive.called, 'B should not be called for topic ghi' );
            subscriberA.receive.reset();
            subscriberB.receive.reset();

            assert( !logWarnSpy.called, 'no warnings should have been logged' );
            assert( !logErrorSpy.called, 'no errors should have been logged' );
        } );
    } );

    describe( 'when two subscribers have same subscriptions', function() {
        it( 'should merge subscriptions together', function() {

            var subscriberA = {
                subscription: {
                    topic: 'abc',
                    qos: 2
                },
                receive: sinon.spy()
            };

            var subscriberB = {
                subscription: {
                    topic: 'abc',
                    qos: 2
                },
                receive: sinon.spy()
            };

            var ret = subscriberMerger( [ subscriberA, subscriberB ] );

            assert.deepEqual( ret.subscription, [
                {
                    topic: 'abc',
                    qos: 2
                }
            ] );

            assert( !subscriberA.receive.called, 'receive should not have been called yet' );
            assert( !subscriberB.receive.called, 'receive should not have been called yet' );

            ret.receive( 'abc', 'cats' );
            assert( subscriberA.receive.calledOnce, 'A should be called for topic abc' );
            assert( subscriberB.receive.calledOnce, 'B should be called for topic abc' );
            assert( subscriberA.receive.calledWith( 'abc', 'cats' ), 'A should be called with correct args' );
            assert( subscriberB.receive.calledWith( 'abc', 'cats' ), 'B should be called with correct args' );
            subscriberA.receive.reset();
            subscriberB.receive.reset();

            ret.receive( 'ghi', 'rats' );
            assert( !subscriberA.receive.called, 'A should not be called for topic ghi' );
            assert( !subscriberB.receive.called, 'B should not be called for topic ghi' );
            subscriberA.receive.reset();
            subscriberB.receive.reset();

            assert( !logWarnSpy.called, 'no warnings should have been logged' );
            assert( !logErrorSpy.called, 'no errors should have been logged' );
        } );
    } );

    describe( 'when two subscribers have same subscriptions but different qos', function() {

        describe( 'when first subscriber has highest qos', function() {
            it( 'should merge both subscriptions together, but take the highest qos', function() {

                var subscriberA = {
                    subscription: {
                        topic: 'abc',
                        qos: 1
                    },
                    receive: sinon.spy()
                };

                var subscriberB = {
                    subscription: {
                        topic: 'abc',
                        qos: 2
                    },
                    receive: sinon.spy()
                };

                var ret = subscriberMerger( [ subscriberA, subscriberB ] );

                assert.deepEqual( ret.subscription, [
                    {
                        topic: 'abc',
                        qos: 2
                    }
                ] );

                assert( logWarnSpy.calledOnce, '1 warning should have been logged' );
                assert( logWarnSpy.calledWith( { topic: 'abc' }, 'quality of service subscription mismatch' ) );
                assert( !logErrorSpy.called, 'no errors should have been logged' );
            } );
        } );

        describe( 'when second subscriber has highest qos', function() {
            it( 'should merge both subscriptions together, but take the highest qos', function() {

                var subscriberA = {
                    subscription: {
                        topic: 'abc',
                        qos: 2
                    },
                    receive: sinon.spy()
                };

                var subscriberB = {
                    subscription: {
                        topic: 'abc',
                        qos: 1
                    },
                    receive: sinon.spy()
                };

                var ret = subscriberMerger( [ subscriberA, subscriberB ] );

                assert.deepEqual( ret.subscription, [
                    {
                        topic: 'abc',
                        qos: 2
                    }
                ] );

                assert( logWarnSpy.calledOnce, '1 warning should have been logged' );
                assert( logWarnSpy.calledWith( { topic: 'abc' }, 'quality of service subscription mismatch' ) );
                assert( !logErrorSpy.called, 'no errors should have been logged' );
            } );
        } );

    } );

    describe( 'when subscribers have qos omitted', function() {
        it( 'should merge subscriptions, and default to qos 0', function() {

            var subscriberA = {
                subscription: {
                    topic: 'abc'
                },
                receive: sinon.spy()
            };

            var subscriberB = {
                subscription: {
                    topic: 'def'
                },
                receive: sinon.spy()
            };

            var ret = subscriberMerger( [ subscriberA, subscriberB ] );

            assert.deepEqual( ret.subscription, [
                {
                    topic: 'abc',
                    qos: 0
                },
                {
                    topic: 'def',
                    qos: 0
                }
            ] );

            assert( !logWarnSpy.called, 'no warnings should have been logged' );
            assert( !logErrorSpy.called, 'no errors should have been logged' );
        } );
    } );

    describe( 'when subscribers have multiple subscriptions', function() {
        it( 'should merge all subscriptions', function() {

            var subscriberA = {
                subscription: [
                    {
                        topic: 'abc',
                        qos: 0
                    },
                    {
                        topic: 'def',
                        qos: 2
                    }
                ],
                receive: sinon.spy()
            };

            var subscriberB = {
                subscription: [
                    {
                        topic: 'ghi',
                        qos: 1
                    },
                    {
                        topic: 'def',
                        qos: 2
                    }
                ],
                receive: sinon.spy()
            };

            var ret = subscriberMerger( [ subscriberA, subscriberB ] );

            assert.deepEqual( ret.subscription, [
                {
                    topic: 'abc',
                    qos: 0
                },
                {
                    topic: 'def',
                    qos: 2
                },
                {
                    topic: 'ghi',
                    qos: 1
                }
            ] );

            assert( !logWarnSpy.called, 'no warnings should have been logged' );
            assert( !logErrorSpy.called, 'no errors should have been logged' );

            assert( !subscriberA.receive.called, 'receive should not have been called yet' );
            assert( !subscriberB.receive.called, 'receive should not have been called yet' );

            ret.receive( 'abc', 'bats' );
            assert( subscriberA.receive.calledOnce, 'A should be called for topic abc' );
            assert( !subscriberB.receive.called, 'B should not be called for topic abc' );
            assert( subscriberA.receive.calledWith( 'abc', 'bats' ), 'A should be called with correct args (abc)' );
            subscriberA.receive.reset();
            subscriberB.receive.reset();

            ret.receive( 'def', 'cats' );
            assert( subscriberA.receive.calledOnce, 'A should be called for topic def' );
            assert( subscriberB.receive.calledOnce, 'B should be called for topic def' );
            assert( subscriberA.receive.calledWith( 'def', 'cats' ), 'A should be called with correct args (def)' );
            assert( subscriberB.receive.calledWith( 'def', 'cats' ), 'B should be called with correct args (def)' );
            subscriberA.receive.reset();
            subscriberB.receive.reset();

            ret.receive( 'ghi', 'rats' );
            assert( !subscriberA.receive.called, 'A should not be called for topic rats' );
            assert( subscriberB.receive.calledOnce, 'B should be called for topic rats' );
            assert( subscriberB.receive.calledWith( 'ghi', 'rats' ), 'B should be called with correct args (ghi)' );
            subscriberA.receive.reset();
            subscriberB.receive.reset();

            assert( !logWarnSpy.called, 'no warnings should have been logged' );
            assert( !logErrorSpy.called, 'no errors should have been logged' );
        } );
    } );

    describe( 'when two subscribers have overlapping subscriptions', function() {
        it( 'should merge both subscriptions', function() {

            var subscriberA = {
                subscription: {
                    topic: 'test/+',
                    qos: 0
                },
                receive: sinon.spy()
            };

            var subscriberB = {
                subscription: {
                    topic: '#',
                    qos: 1
                },
                receive: sinon.spy()
            };

            var ret = subscriberMerger( [ subscriberA, subscriberB ] );

            assert.deepEqual( ret.subscription, [
                {
                    topic: 'test/+',
                    qos: 0
                },
                {
                    topic: '#',
                    qos: 1
                }
            ] );

            assert( !subscriberA.receive.called, 'receive should not have been called yet' );
            assert( !subscriberB.receive.called, 'receive should not have been called yet' );

            ret.receive( 'some/random', 'cats' );
            assert( !subscriberA.receive.called, 'A should not be called (some/random)' );
            assert( subscriberB.receive.calledOnce, 'B should be called (some/random)' );
            assert( subscriberB.receive.calledWith( 'some/random', 'cats' ), 'B should be called with correct args' );
            subscriberA.receive.reset();
            subscriberB.receive.reset();

            ret.receive( 'test/stuff', 'bats' );
            assert( subscriberA.receive.calledOnce, 'A should be called (test/stuff)' );
            assert( subscriberB.receive.calledOnce, 'B should be called (test/stuff)' );
            assert( subscriberB.receive.calledWith( 'test/stuff', 'bats' ), 'A should be called with correct args' );
            assert( subscriberB.receive.calledWith( 'test/stuff', 'bats' ), 'B should be called with correct args' );
            subscriberA.receive.reset();
            subscriberB.receive.reset();

            ret.receive( 'test/stuff/deep', 'rats' );
            assert( !subscriberA.receive.called, 'A should not be called (test/stuff/deep)' );
            assert( subscriberB.receive.calledOnce, 'B should be called (test/stuff/deep)' );
            assert( subscriberB.receive.calledWith( 'test/stuff/deep', 'rats' ), 'B should be called with correct args' );
            subscriberA.receive.reset();
            subscriberB.receive.reset();

            assert( !logWarnSpy.called, 'no warnings should have been logged' );
            assert( !logErrorSpy.called, 'no errors should have been logged' );
        } );
    } );

} );
