#!/bin/bash


if [ -f ./package-lock.json ]; then
  cp ./package-lock.json ./package-lock.bck.json
  rm ./package-lock.json
fi;
# -- "dependencies": {
pnpm remove --save-prod "@loopback/context" "@loopback/core" "@loopback/http-server" "express" "socket.io"
pnpm i --save-prod "@loopback/context" "@loopback/core" "@loopback/http-server" "express" "socket.io"

pnpm remove --save-prod cors
pnpm i --save-prod cors

pnpm remove --save-prod debug
pnpm i --save-prod debug


pnpm remove --save-prod socket.io-adapter
pnpm i --save-prod socket.io-adapter

pnpm remove --save-prod socket.io-parser
pnpm i --save-prod socket.io-parser

# -- "devDependencies": {
pnpm remove --save-dev "@loopback/build" "@loopback/testlab" "@types/node" "@types/socket.io" "@types/socket.io-client" "@typescript-eslint/eslint-plugin" "@typescript-eslint/parser" "eslint" "eslint-config-prettier" "eslint-plugin-eslint-plugin" "eslint-plugin-mocha" "p-event" "socket.io-client"
pnpm i --save-dev "@loopback/build" "@loopback/testlab" "@types/node" "@types/socket.io" "@types/socket.io-client" "@typescript-eslint/eslint-plugin" "@typescript-eslint/parser" "eslint" "eslint-config-prettier" "eslint-plugin-eslint-plugin" "eslint-plugin-mocha" "p-event" "socket.io-client"

pnpm remove --save-dev "@types/cors"
pnpm i --save-dev "@types/cors"

pnpm remove --save-dev "@types/express"
pnpm i --save-dev "@types/express"


pnpm remove --save-dev @types/mocha
pnpm i --save-dev @types/mocha

pnpm remove --save-dev tslib
pnpm i --save-dev tslib

pnpm build



exit 0

# --- Test websockets
export HAZE_HOST=localhost
export HAZE_PORT=3000
curl -ivvv \
     --include \
     --no-buffer \
     --header "Connection: Upgrade" \
     --header "Upgrade: websocket" \
     --header "Host: ${HAZE_HOST}:${HAZE_PORT}" \
     --header "Origin: http://test.haze.io:42123" \
     --header "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" \
     --header "Sec-WebSocket-Version: 13" \
     http://${HAZE_HOST}:${HAZE_PORT}/chats/1
