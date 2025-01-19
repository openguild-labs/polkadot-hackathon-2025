#!/bin/bash

# Function to start a participant and log its output to terminal
start_participant() {
    local id=$1
     node --loader ts-node/esm src/participant.ts $id 2>&1 | sed "s/^/[Participant $id] /" &
}

# Start participants 1, 2, and 3
start_participant 1
start_participant 2
start_participant 3

echo "All participants started. Logs are being displayed in the terminal."

# Wait for all background processes to finish
wait