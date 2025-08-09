#!/bin/bash

# Production Server Setup Script for Ubuntu
# Run this on your production server

set -e

echo "=== Hudson Valley Flying Circus Production Setup ==="

# Variables
APP_DIR="/var/www/hvfc"
NGINX_SITE="hvfc"
DOMAIN="hvflyingcircus.com"

# 1. Install dependencies
echo "Installing dependencies..."
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# 2. Create application directory
echo "Setting up application directory..."
sudo mkdir -p $APP_DIR
sudo chown -R $USER:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR

# 3. Copy application files (assuming files are in current directory)
echo "Copying application files..."
# Note: You should have already copied files to the server before running this
# rsync -av --exclude 'node_modules' --exclude '.git' ./ $APP_DIR/

# 4. Build the application
echo "Building application..."
cd $APP_DIR/client
npm install --production
npm run build -- --configuration production

cd $APP_DIR/api
dotnet publish -c Release -o ./publish

# 5. Set up Nginx
echo "Configuring Nginx..."
sudo cp $APP_DIR/nginx.conf /etc/nginx/sites-available/$NGINX_SITE
sudo ln -sf /etc/nginx/sites-available/$NGINX_SITE /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 6. Set up systemd service
echo "Setting up systemd service..."
sudo cp $APP_DIR/hvfc.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable hvfc
sudo systemctl start hvfc

# 7. Set up firewall
echo "Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

# 8. Check service status
echo "Checking service status..."
sudo systemctl status hvfc --no-pager

echo "=== Setup Complete ==="
echo "Your application should now be running at http://$DOMAIN"
echo ""
echo "Next steps:"
echo "1. Set up SSL with: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "2. Monitor logs with: sudo journalctl -u hvfc -f"
echo "3. Check Nginx logs: sudo tail -f /var/log/nginx/error.log"