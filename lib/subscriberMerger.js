'use strict';

var _ = require( 'lodash' );
var log = require( './log.js' );
var mqttRegexBuilder = require( 'mqtt-regex-builder' );

function mergeSubscription( subscriber, subscription, map ) {

    var topic = subscription.topic;
    var qos = subscription.qos || 0;

    var record = map[ topic ];
    if( !record ) {

        map[ topic ] = {
            topic: topic,
            regex: mqttRegexBuilder( topic ),
            qos: qos,
            subscribers: [ subscriber ]
        };

        return;
    }

    if( record.qos !== qos ) {

        log.warn(
            { topic: topic },
            'quality of service subscription mismatch'
        );

        if( qos > record.qos ) {
            record.qos = qos;
        }
    }

    if( record.subscribers._contains( subscriber ) ) {
        throw new Error( `duplicate subscription by ${subscriber.name}` );
    }

    record.subscribers.push( subscriber );
}

function mapSubscriptionsToTopics( subscribers ) {

    var map = {};

    subscribers.forEach( function( subscriber ) {

        if( Array.isArray( subscriber.subscription ) ) {

            subscriber.subscription.forEach( function( subscription ) {
                mergeSubscription( subscriber, subscription, map );
            } );

        } else {
            mergeSubscription( subscriber, subscriber.subscription, map );
        }
    } );

    return map;
}

module.exports = function( subscribers ) {

    if( subscribers.length === 0 ) {
        throw new Error( 'at least one subscriber is required' );
    }

    if( subscribers.length === 1 ) {
        return subscribers[ 0 ];
    }

    var map = mapSubscriptionsToTopics( subscribers );

    var subscriptions = _.map(
        map,
        subscription => _.pick( subscription, [ 'topic', 'qos' ] )
    );

    return {
        subscription: subscriptions,
        receive: function( topic, message, extras ) {

            _.forIn( map, function( subscription ) {

                if( topic.match( subscription.regex ) ) {

                    return subscription.subscribers.forEach( function( subscriber ) {
                        subscriber.receive( topic, message, extras );
                    } );
                }
            } );
        }
    };
};
