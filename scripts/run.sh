#!/bin/sh
echo "Setting update path to: $2"
UPDATE_PATH=$2

echo "Pulling docker image: $1"
docker pull $1

echo "Changing directory to ${UPDATE_PATH} and starting docker compose with service: $3"
cd ${UPDATE_PATH} && docker compose up $3 -d
