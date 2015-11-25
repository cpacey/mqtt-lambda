'use strict';

class MqttStatus {

    constructor() {
        this.isConnected = false;
        this.isSubscribed = false;
    }

    set connected( state ) {
        if( state !== true && state !== false ) {
            throw new Error( 'invalid connected state' );
        }

        this.isConnected = state;
        if( !state ) {
            this.isSubscribed = false;
        }
    }

    get connected() {
        return this.isConnected;
    }

    set subscribed( state ) {

        if( state !== true ) {
            throw new Error( 'invalid subscribed state' );
        }

        this.isSubscribed = state;
    }

    get subscribed() {
        return this.isSubscribed;
    }
}

module.exports = MqttStatus;
