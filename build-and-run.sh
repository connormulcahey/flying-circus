#!/bin/bash

echo "Building Angular application..."
cd client
npm run build

echo "Starting .NET application..."
cd ../api
dotnet run

# Note: For production, use:
# dotnet run --environment Production