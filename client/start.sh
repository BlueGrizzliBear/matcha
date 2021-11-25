#!/bin/sh
# start.sh

if [ "$NODE_ENV" = 'production' ]
then
    npm run build
else
    npm start
    npm install -g serve
    serve -s build
fi
