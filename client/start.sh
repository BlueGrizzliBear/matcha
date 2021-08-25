#!/bin/sh
# start.sh

if [ "$NODE_ENV" = 'production' ]
then
    npm run build
else
    npm start
fi
