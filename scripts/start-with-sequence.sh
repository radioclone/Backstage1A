#!/bin/bash

# Check if Sequence dependencies are installed
if ! npm list @0xsequence/kit > /dev/null 2>&1; then
  echo "Sequence dependencies not found. Installing..."
  npm run install:sequence
fi

# Set environment variables for Sequence
if [ ! -f .env.local ]; then
  echo "Creating .env.local file..."
  cp .env.local.example .env.local
  echo "Please update the NEXT_PUBLIC_SEQUENCE_PROJECT_KEY in .env.local"
fi

# Start the development server
echo "Starting development server with Sequence integration..."
npm run dev
