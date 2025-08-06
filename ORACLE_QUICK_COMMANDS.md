# PDFINDI Oracle Cloud Mumbai - Quick Commands Reference

## 🚀 Once You're SSH'd into your Oracle Cloud VM:

### **Download and run the deployment script:**
```bash
wget https://raw.githubusercontent.com/your-repo/pdfindi/main/deploy-oracle.sh
chmod +x deploy-oracle.sh
./deploy-oracle.sh
```

### **Upload your backend files (from your local machine):**
```bash
# Option 1: Using SCP (replace YOUR_VM_IP with actual IP)
scp -r backend/ ubuntu@YOUR_VM_IP:/var/www/pdfindi/

# Option 2: Clone from GitHub (if you push to GitHub)
git clone https://github.com/your-username/pdfindi.git /var/www/pdfindi/
```

### **Install and start your backend:**
```bash
cd /var/www/pdfindi/backend
npm install
pm2 start server.js --name 'pdfindi-backend'
pm2 save
pm2 startup
```

### **Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/pdfindi.conf
# Copy the Nginx configuration from ORACLE_CLOUD_SETUP.md
sudo ln -s /etc/nginx/sites-available/pdfindi.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### **Check everything is working:**
```bash
# Check PM2 status
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Check if port 3001 is running
netstat -tlnp | grep :3001

# Test the API
curl http://localhost:3001/api/health
```

## 🔑 **Important IPs and Ports:**
- **Backend Server:** Port 3001
- **Nginx Proxy:** Port 80 (HTTP) / 443 (HTTPS)
- **SSH Access:** Port 22

## 🌐 **After Domain Setup:**
Your API will be available at:
- `https://your-domain.com/api/pdf-to-word`
- `https://your-domain.com/api/word-to-pdf`
- `https://your-domain.com/api/compress-pdf`
