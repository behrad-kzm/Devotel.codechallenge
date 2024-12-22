#!/bin/bash

if [ "$1" = "--test-only" ]; then
  ENV_FILE="envs/.test.env"
else
  ENV_FILE="envs/.app.env"
fi
cat $ENV_FILE
source $ENV_FILE

/opt/wait-for-it.sh $DATABASE_HOST_MASTER:5432 --timeout=15
# Once Database is available, run migrations
if [ $? -eq 0 ]; then
  # Determine the command to run based on the argument
  if [ "$1" = "--test-only" ]; then
    
    echo "Database is up and running, running migrations..."
    ENV_PATH=$ENV_FILE npm run schema:drop
    ENV_PATH=$ENV_FILE npm run migration:run
    
    echo "Migrations complete, running tests..."
    ENV_PATH=$ENV_FILE npm run test:unit
    ENV_PATH=$ENV_FILE npm run test:e2e
    ENV_PATH=$ENV_FILE npm run schema:drop
  else
    echo "Database is up and running, running migrations..."
    ENV_PATH=$ENV_FILE npm run migration:run

    echo "Migrations complete, starting the application..."
    nest start
  fi
else
  echo "Error: Database is not available"
fi
