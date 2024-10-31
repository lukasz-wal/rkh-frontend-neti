#!/bin/bash


ENV_VARS="-e LOTUS_RPC_URL=http://127.0.0.1:8545 \
    -e ALLOCATOR_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
    -e ALLOCATOR_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
    -e VALID_META_ALLOCATOR_ADDRESSES=0x15A9D9b81E3c67b95Ffedfb4416D25a113C8c6df \
    -e SUBSCRIBE_META_ALLOCATOR_APPROVALS_POLLING_INTERVAL=1000 \
    -e MONGODB_URI=mongodb+srv://filecoin-plus:m6CEYieBTc0Y7kLs@ragnarokdemocluster.4zqzb.mongodb.net"

DOCKER_EXEC="docker exec $ENV_VARS -w /usr/src/app/packages/application allocator-rkh-backend-app-1 /bin/sh"

# Check if at least one argument is provided
if [ $# -eq 0 ]; then
    echo "No arguments provided. Usage: ./test.sh [option]"
    exit 1
fi

option=$1

if [ "$suboption" == "build" ]; then
    sudo docker compose up -d --no-deps --build app
else
    sudo docker compose restart app
fi


if [ "$option" == "create-app" ]; then
    sudo $DOCKER_EXEC -c "npm run build && TS_NODE_BASEURL=dist node -r tsconfig-paths/register dist/testing/create-app.js"
elif [ "$option" == "ma-approval" ]; then
    sudo $DOCKER_EXEC -c "npm run build && TS_NODE_BASEURL=dist node -r tsconfig-paths/register dist/testing/ma-approval.js"
elif [ "$option" == "edit-app" ]; then
    sudo $DOCKER_EXEC -c "npm run build && TS_NODE_BASEURL=dist node -r tsconfig-paths/register dist/testing/edit-app.js"
elif [ "$option" == "gov-review" ]; then
    sudo $DOCKER_EXEC -c "npm run build && TS_NODE_BASEURL=dist node -r tsconfig-paths/register dist/testing/gov-review.js"
else
    echo "Invalid option: $1. Usage: ./test.sh [create-app|ma-approval]"
    exit 1
fi
