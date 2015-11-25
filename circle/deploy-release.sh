#!/bin/bash
set -eu

npm adduser <<!
$NPM_USERNAME
$NPM_PASSWORD
$NPM_EMAIL
!
npm publish

docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD" -e no-reply@cantireinnovations.com

export DOCKER_BUILD_TAG="$CIRCLE_TAG"
npm run docker.buildAndPush

export DOCKER_BUILD_TAG="latest"
npm run docker.buildAndPush
