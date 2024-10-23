#!/bin/bash

# Start Temporal
/entrypoint.sh &

# Wait for Temporal to be ready
sleep 10

# Add custom search attributes
tctl --namespace default operator search-attribute create --name userId --type Int

# Wait for all background processes
wait