# Render Deployment Guide - PDFINDI Backend

## 🚀 Render Setup (10 Minutes Total)

### **Step 1: Create Render Account**
1. Go to: https://render.com
2. Sign up with GitHub (free forever)
3. No credit card required

### **Step 2: Create Web Service**
1. Dashboard → "New Web Service"
2. Connect your GitHub repository
3. Select your pdfindi backend repo

### **Step 3: Configuration**
```
Name: pdfindi-backend
Environment: Node
Build Command: npm install
Start Command: npm start
```

### **Step 4: Environment Variables**
```
CLOUDMERSIVE_API_KEY=e46637bc-d958-473f-a8cf-6fc6f4e1ef2f
NODE_ENV=production
```

### **Step 5: Deploy**
- Click "Create Web Service"
- Render builds and deploys automatically
- Get URL: `https://pdfindi-backend.onrender.com`

---

## 💰 **Render Pricing:**
- **Free tier:** 750 hours/month (enough for your needs)
- **Sleep after 15min:** Wakes up on request (2-3 second delay)
- **Perfect for:** Low-traffic PDF conversion service

---

## 🎯 **Your API endpoints:**
```
https://pdfindi-backend.onrender.com/api/health
https://pdfindi-backend.onrender.com/api/pdf-to-word
https://pdfindi-backend.onrender.com/api/word-to-pdf
https://pdfindi-backend.onrender.com/api/compress-pdf
```
