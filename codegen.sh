#!/bin/bash

echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
echo "WARNING: Running this script requires that a "yarn run build" has been executed in beforehand!"
echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"


BASEDIR=$(dirname "$0")
node "$BASEDIR/bin/index.js" "$@"
