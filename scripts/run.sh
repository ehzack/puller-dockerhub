#!/bin/sh
UPDATE_PATH=$2
docker pull $1
cd ${UPDATE_PATH} && docker compose up -d
