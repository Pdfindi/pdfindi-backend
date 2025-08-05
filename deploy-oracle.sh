#!/bin/bash
# PDFINDI Oracle Cloud Mumbai Deployment Script
# Run this script on your Oracle Cloud VM after SSH connection

echo "🚀 Starting PDFINDI Backend Deployment on Oracle Cloud Mumbai"
echo "============================================================="

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"

# Install PM2 (Process Manager)
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/pdfindi
sudo chown $USER:$USER /var/www/pdfindi
cd /var/www/pdfindi

echo "✅ Server setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Upload your backend files to /var/www/pdfindi/"
echo "2. Run: cd /var/www/pdfindi/backend && npm install"
echo "3. Run: pm2 start server.js --name 'pdfindi-backend'"
echo "4. Configure Nginx (see ORACLE_CLOUD_SETUP.md)"
echo ""
echo "🎉 Your Oracle Cloud Mumbai server is ready for PDFINDI!"
