#!/bin/bash

# Deploy Posts Script
# Run this on the server to update posts.json

set -e

echo "=== Deploying Posts Update ==="

# Variables
SOURCE_DIR="$HOME/flying-circus"
APP_DIR="/var/www/hvfc/api"

# 1. Check if source posts.json exists
if [ ! -f "$SOURCE_DIR/posts.json" ]; then
    echo "ERROR: posts.json not found in $SOURCE_DIR"
    exit 1
fi

echo "Found posts.json in source directory"

# 2. Stop the service to release file locks
echo "Stopping hvfc service..."
sudo systemctl stop hvfc

# 3. Copy new posts.json
echo "Copying posts.json to deployment directory..."
sudo cp "$SOURCE_DIR/posts.json" "$APP_DIR/posts.json"

# 4. Set proper permissions
echo "Setting permissions..."
sudo chown www-data:www-data "$APP_DIR/posts.json"

# 5. Start the service (this will reload posts.json)
echo "Starting hvfc service..."
sudo systemctl start hvfc

# 6. Wait a moment for service to fully start
sleep 3

# 7. Check service status
echo "Checking service status..."
sudo systemctl status hvfc --no-pager

echo "=== Posts Deployment Complete ==="
echo ""
echo "Test the posts:"
echo "  curl http://localhost:5025/api/posts"
echo "  curl http://hvflyingcircus.com/api/posts"