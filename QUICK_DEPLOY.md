# PDFINDI Oracle Cloud - Quick Deployment Commands

## 🚀 Once you're SSH'd into your Oracle Cloud VM:

### **1. Run the setup script:**
```bash
# Download and run setup
wget https://raw.githubusercontent.com/nodejs/node/main/install.sh
curl -o setup-oracle.sh https://your-server.com/setup-oracle.sh
chmod +x setup-oracle.sh
./setup-oracle.sh
```

### **2. Upload your backend files:**

#### **Option A: Using SCP (from your Windows machine):**
```powershell
# From your local machine (replace YOUR_VM_IP)
scp -i "ssh-key-XXXX.key" -r "d:\Amit\pdfindi.com\backend\*" ubuntu@YOUR_VM_IP:/var/www/pdfindi/
```

#### **Option B: Using Git (easier):**
```bash
# On the VM
cd /var/www/pdfindi
git clone https://github.com/your-username/pdfindi-backend.git .
```

#### **Option C: Manual upload (if no Git):**
```bash
# Create the files manually on VM
nano /var/www/pdfindi/server.js     # Copy your server.js content
nano /var/www/pdfindi/package.json  # Copy your package.json content  
nano /var/www/pdfindi/.env          # Copy your .env content
```

### **3. Install dependencies and start:**
```bash
cd /var/www/pdfindi
npm install
pm2 start server.js --name 'pdfindi-backend'
pm2 save
pm2 startup
```

### **4. Configure Nginx:**
```bash
sudo cp nginx-pdfindi.conf /etc/nginx/sites-available/pdfindi
sudo ln -s /etc/nginx/sites-available/pdfindi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### **5. Test everything:**
```bash
# Check PM2 status
pm2 status

# Check if API is working
curl http://localhost:3001/api/health

# Check public access (replace YOUR_VM_IP)
curl http://YOUR_VM_IP/api/health
```

---

## 🎯 **Success Indicators:**
- ✅ PM2 shows "online" status
- ✅ Health check returns JSON response
- ✅ Public IP responds to API calls
- ✅ No errors in `pm2 logs`

---

## 🌐 **Your API Endpoints Will Be:**
```
http://YOUR_VM_IP/api/health
http://YOUR_VM_IP/api/pdf-to-word
http://YOUR_VM_IP/api/word-to-pdf
http://YOUR_VM_IP/api/compress-pdf
```
