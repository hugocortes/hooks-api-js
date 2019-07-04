#!/bin/bash

#############
# Start app #
#############

SYS_PROPS=""

if [[ $NODE_ENV =~ ^[dD][eE][bB].*$ ]]; then
  SYS_PROPS+="--inspect=0.0.0.0 "
fi

exec node $SYS_PROPS $@ build/index.js
exit $?
