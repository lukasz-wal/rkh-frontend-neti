#!/bin/bash

DOCKER_EXEC="docker exec -w /usr/src/app/packages/application allocator-rkh-backend-app-1 /bin/sh"

# Check if at least one argument is provided
if [ $# -eq 0 ]; then
    echo "No arguments provided. Usage: ./test.sh [option]"
    exit 1
fi

option=$1

if [ "$option" == "create-app" ]; then
    # sudo docker compose up -d --no-deps --build app
    sudo docker compose restart app
    # sudo $DOCKER_EXEC -c "npm run build && TS_NODE_BASEURL=dist node -r tsconfig-paths/register dist/api/index.js"
    sudo $DOCKER_EXEC -c "npm run build && TS_NODE_BASEURL=dist node -r tsconfig-paths/register dist/testing/create-app.js"
elif [ "$option" == "ma-approval" ]; then
    # sudo docker compose up -d --no-deps --build app
    sudo docker compose restart app
    sudo $DOCKER_EXEC -c "npm run build && TS_NODE_BASEURL=dist node -r tsconfig-paths/register dist/testing/ma-approval.js"
elif [ "$option" == "edit-app" ]; then
    sudo docker compose restart app
    sudo $DOCKER_EXEC -c "npm run build && TS_NODE_BASEURL=dist node -r tsconfig-paths/register dist/testing/edit-app.js"
else
    echo "Invalid option: $1. Usage: ./test.sh [create-app|ma-approval]"
    exit 1
fi
