#!/bin/bash

npm adduser <<!
$NPM_USERNAME
$NPM_PASSWORD
$NPM_EMAIL
!
npm publish

docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD" -e no-reply@cantireinnovations.com
export DOCKER_BUILD_TAG="$CIRCLE_BRANCH"
npm run docker.buildAndPush