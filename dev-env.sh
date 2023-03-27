#!/bin/sh

export COMPOSE_PROJECT_NAME=strac_app
export COMPOSE_FILE=dockerfiles/docker-compose.yml:dockerfiles/docker-compose.yml

if [ "$#" -eq 0 ]; then
    docker-compose up
elif [ "$1" = 'init' ]; then
    echo 'Building Images'
    docker-compose build
    echo 'Starting Containers'
    docker-compose up -d
    echo 'Sleeping for 3 seconds' # wait for database to accept connections
    sleep 3s
    echo 'Running Migrations'
    docker-compose exec -T app npm run sequelize:migrate
    echo 'Running Seeds'
    docker-compose exec -T app npm run sequelize:seed
elif [ "$1" = 'start' ]; then
    echo 'Starting Services'
    docker-compose start
elif [ "$1" = 'stop' ]; then
    echo 'Stopping Services'
    docker-compose stop
elif [ "$1" = 'down' ]; then
    echo 'Stopping & Removing Services'
    docker-compose down
elif [ "$1" = 'logs' ]; then
    docker-compose logs
elif [ "$1" = 'exec' ]; then
    docker-compose exec app sh
else
    echo "Command not found - ${1}"
fi
