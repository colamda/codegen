#!/bin/bash

echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
echo "WARNING: You are running the DEVELOPMENT script, which recompiles the whole application and, hence, is slow!"
echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"

INIT_DIR=$PWD
BASEDIR=$(dirname "$0")

# yarn need to run in the same directory as where the package.json resides, therefore, we cd into this dir...
cd "$BASEDIR"

# ...and run yarn there...
yarn run clean \
  && yarn run prep-dir \
  && yarn run copy-ng \
  && yarn run copy-resources \
  && yarn run copy-google-formatter \
  && yarn run compile

# ...then go back to initial directory so that node run from the right directory
cd "$INIT_DIR"
node "$BASEDIR/bin/index.js" "$@"
