# mqtt-lambda
A service for hosting independent mqtt subscribers

## Running examples

```
export MQTT_BROKER_URL=mqtt://localhost
export SUBSCRIBERS_ROOT=./examples
npm start
```

## Environment Variables

Required:
```
MQTT_BROKER_URL:                The url of the mqtt broker
SUBSCRIBERS_ROOT:               The directory to load the lambda subscribers from
```
Optional:

```
MQTT_CLIENT_ID:                 The mqtt client's id
MQTT_CLIENT_CONNECT_TIMEOUT:    The client's connection timeout in milliseconds
MQTT_CLIENT_KEEPALIVE:          The client's keep alive in seconds

MQTT_CLIENT_USERNAME:           The client's username
MQTT_CLIENT_PASSWORD:           The client's password

REQUIRE_CLIENT_ID:              Whether or not to require a client id

LAMBDA_LOG_NAME:                The name of the bunyan logger used by mqtt-lambda
LAMBDA_LOG_LEVEL:               The log level used by mqtt-lambda

LAMBDA_VERSION:                 The version to stamp log messages with and show in the web api
```