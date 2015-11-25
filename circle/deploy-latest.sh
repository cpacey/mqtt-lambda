#!/bin/bash
set -eu

docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD" -e no-reply@cantireinnovations.com
export DOCKER_BUILD_TAG="latest"
npm run docker.buildAndPush
