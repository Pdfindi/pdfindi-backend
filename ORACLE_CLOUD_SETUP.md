# Oracle Cloud Mumbai Deployment Guide
# PDFINDI Backend Production Setup

## Prerequisites
1. Oracle Cloud Account (Always Free Tier)
2. SSH Key Pair for VM access
3. Basic Linux knowledge

## Step 1: Create Oracle Cloud VM (Mumbai)

### 1.1 Login to Oracle Cloud Console
- Go to: https://cloud.oracle.com
- Sign in to your account
- Navigate to: Compute → Instances

### 1.2 Create VM Instance
```bash
Region: India Central (Mumbai)
Availability Domain: Any
Shape: VM.Standard.A1.Flex (ARM-based, Always Free)
OCPU: 1
Memory: 6 GB
Image: Ubuntu 22.04 LTS
Boot Volume: 50 GB
Network: Create new VCN or use existing
Subnet: Public subnet
SSH Keys: Upload your public key
```

### 1.3 Configure Network Security
```bash
Security List Rules (Ingress):
- Port 22 (SSH): 0.0.0.0/0
- Port 80 (HTTP): 0.0.0.0/0  
- Port 443 (HTTPS): 0.0.0.0/0
- Port 3000 (App): 0.0.0.0/0 (temporary, use reverse proxy later)
```

## Step 2: Server Setup

### 2.1 Connect to VM
```bash
ssh -i /path/to/your/private-key ubuntu@YOUR_VM_IP
```

### 2.2 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2.3 Install Node.js 18
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v18.x
npm --version
```

### 2.4 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 2.5 Install Nginx (Reverse Proxy)
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

## Step 3: Deploy Application

### 3.1 Create Application Directory
```bash
sudo mkdir -p /var/www/pdfindi
sudo chown $USER:$USER /var/www/pdfindi
cd /var/www/pdfindi
```

### 3.2 Upload Files
```bash
# Method 1: Using SCP (from your local machine)
scp -i /path/to/private-key -r backend/ ubuntu@YOUR_VM_IP:/var/www/pdfindi/
scp -i /path/to/private-key -r public_html/ ubuntu@YOUR_VM_IP:/var/www/pdfindi/

# Method 2: Using Git (if you have a repository)
git clone https://github.com/yourusername/pdfindi.git .
```

### 3.3 Install Dependencies
```bash
cd /var/www/pdfindi/backend
npm install
```

### 3.4 Configure Environment
```bash
# Edit .env file with production settings
nano .env

# Ensure correct ownership
sudo chown -R $USER:$USER /var/www/pdfindi
```

## Step 4: Configure Nginx Reverse Proxy

### 4.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/pdfindi
```

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;
    
    # Serve static files directly
    location / {
        root /var/www/pdfindi/public_html;
        try_files $uri $uri/ @backend;
    }
    
    # API routes to backend
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # File upload limits
        client_max_body_size 50M;
    }
    
    # Fallback to backend for other routes
    location @backend {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4.2 Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/pdfindi /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

## Step 5: Start Application

### 5.1 Start with PM2
```bash
cd /var/www/pdfindi/backend
pm2 start server.js --name "pdfindi-backend"
pm2 startup  # Configure PM2 to start on boot
pm2 save     # Save current PM2 configuration
```

### 5.2 Check Status
```bash
pm2 status
pm2 logs pdfindi-backend
```

## Step 6: Configure SSL (Let's Encrypt)

### 6.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Obtain SSL Certificate
```bash
sudo certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com
```

## Step 7: Firewall Configuration

### 7.1 Configure UFW
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Step 8: Testing

### 8.1 Test Health Endpoint
```bash
curl http://YOUR_VM_IP/api/health
```

### 8.2 Test from Browser
- Visit: http://YOUR_DOMAIN.com/tools/pdf-to-word.html
- Upload a test PDF file
- Verify conversion works

## Step 9: Monitoring & Maintenance

### 9.1 Check Logs
```bash
pm2 logs pdfindi-backend
sudo journalctl -u nginx -f
```

### 9.2 Update Application
```bash
cd /var/www/pdfindi/backend
git pull  # If using git
npm install  # If dependencies changed
pm2 restart pdfindi-backend
```

### 9.3 Monitor Resources
```bash
htop  # Install: sudo apt install htop
pm2 monit
```

## Domain Configuration

### Point Your Domain to Oracle Cloud VM
1. **Get VM Public IP**: From Oracle Cloud Console
2. **DNS Records**: Add A record pointing to VM IP
3. **Update Nginx**: Replace YOUR_DOMAIN.com with actual domain
4. **SSL Certificate**: Run certbot with your domain

## Backup Strategy

### 9.4 Automated Backups
```bash
# Create backup script
sudo nano /usr/local/bin/backup-pdfindi.sh

#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /home/ubuntu/backups/pdfindi_$DATE.tar.gz /var/www/pdfindi
find /home/ubuntu/backups -name "pdfindi_*.tar.gz" -mtime +7 -delete

# Make executable and add to crontab
sudo chmod +x /usr/local/bin/backup-pdfindi.sh
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-pdfindi.sh
```

## Security Hardening

### 9.5 Additional Security
```bash
# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no

# Configure fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban

# Regular updates
sudo apt update && sudo apt upgrade -y
```

## Troubleshooting

### Common Issues:
1. **Port 3000 blocked**: Check Oracle Cloud Security Lists
2. **File upload fails**: Check nginx client_max_body_size
3. **API errors**: Check PM2 logs and environment variables
4. **Domain not working**: Verify DNS and Nginx configuration

### Support Files:
- Server logs: `pm2 logs pdfindi-backend`
- Nginx logs: `/var/log/nginx/error.log`
- System logs: `journalctl -xe`

---

**Congratulations!** Your PDFINDI backend is now running on Oracle Cloud Mumbai with:
- ✅ Free forever hosting
- ✅ Indian server location (low latency)
- ✅ Production-ready setup
- ✅ SSL encryption
- ✅ Reverse proxy configuration
- ✅ Process monitoring
- ✅ Automatic restart on failure
