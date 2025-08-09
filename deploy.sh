#!/bin/bash

# Parse command line arguments
PRODUCTION=false
while getopts "p" opt; do
  case $opt in
    p)
      PRODUCTION=true
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      echo "Usage: $0 [-p]"
      echo "  -p: Run in production environment"
      exit 1
      ;;
  esac
done

# Build Angular application
if [ "$PRODUCTION" = true ]; then
  echo "Building Angular application for PRODUCTION..."
  cd client
  npm run build -- --configuration production
else
  echo "Building Angular application for DEVELOPMENT..."
  cd client
  npm run build
fi

# Start .NET application
cd ../api
if [ "$PRODUCTION" = true ]; then
  echo "Starting .NET application in PRODUCTION mode..."
  dotnet run --environment Production
else
  echo "Starting .NET application in DEVELOPMENT mode..."
  dotnet run
fi