#!/bin/bash
# PDFINDI Oracle Cloud Mumbai - Complete Setup Script
# Save this as setup-oracle.sh and run on your VM

echo "🚀 PDFINDI Oracle Cloud Mumbai Setup Starting..."
echo "=================================================="

# System Update
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 LTS
echo "📦 Installing Node.js 18 LTS..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"

# Install PM2 Process Manager
echo "📦 Installing PM2 Process Manager..."
sudo npm install -g pm2

# Install Nginx Web Server
echo "📦 Installing Nginx..."
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Install UFW Firewall
echo "🔒 Setting up firewall..."
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/pdfindi
sudo chown $USER:$USER /var/www/pdfindi
cd /var/www/pdfindi

# Install Git (for easy file transfer)
echo "📦 Installing Git..."
sudo apt install -y git

echo ""
echo "✅ Oracle Cloud Mumbai setup complete!"
echo "🎉 Server is ready for PDFINDI backend deployment"
echo ""
echo "📋 Next steps:"
echo "1. Upload your backend files to /var/www/pdfindi/"
echo "2. Run: cd /var/www/pdfindi && npm install"
echo "3. Run: pm2 start server.js --name 'pdfindi-backend'"
echo "4. Configure Nginx proxy"
echo ""
echo "🌐 Your server is ready at: $(curl -s ifconfig.me 2>/dev/null || echo 'IP will be shown after setup')"
