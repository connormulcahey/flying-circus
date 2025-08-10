#!/bin/bash

# Client Deployment Script
# Run this on the server to deploy the latest client changes

set -e

echo "=== Deploying Client Changes ==="

# Variables
SOURCE_DIR="$HOME/flying-circus"
APP_DIR="/var/www/hvfc/api"

# 1. Build Angular app from source
echo "Building Angular application..."
cd $SOURCE_DIR/client
npm ci
npm run build -- --configuration production

echo "Angular build complete. Files in: $SOURCE_DIR/api/wwwroot/"

# 2. Stop the service temporarily
echo "Stopping hvfc service..."
sudo systemctl stop hvfc

# 3. Clear old Angular files
echo "Clearing old client files..."
sudo rm -rf $APP_DIR/wwwroot/*

# 4. Copy new Angular files (they're in browser subfolder)
echo "Copying new client files..."
sudo cp -r $SOURCE_DIR/api/wwwroot/browser/* $APP_DIR/wwwroot/

# 5. Sync images efficiently (only copy new/changed images)
echo "Syncing images..."
sudo rsync -av --delete $SOURCE_DIR/images/ $APP_DIR/wwwroot/images/

# 6. Set proper permissions
echo "Setting permissions..."
sudo chown -R www-data:www-data $APP_DIR/wwwroot

# 7. Start the service
echo "Starting hvfc service..."
sudo systemctl start hvfc

# 8. Check service status
echo "Checking service status..."
sudo systemctl status hvfc --no-pager

echo "=== Client Deployment Complete ==="
echo ""
echo "Test the site:"
echo "  curl http://localhost:5025/index.html"
echo "  curl http://localhost/index.html"
echo "  Open http://hvflyingcircus.com in browser"