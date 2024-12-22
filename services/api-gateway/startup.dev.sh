#!/bin/bash

if [ "$1" = "--test-only" ]; then
  ENV_FILE="envs/.test.env"
else
  ENV_FILE="envs/.app.env"
fi

source $ENV_FILE

if [ $? -eq 0 ]; then
    nest start
else
  echo "Error: Database is not available"
fi
