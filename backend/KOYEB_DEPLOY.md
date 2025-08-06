# Koyeb Deployment Guide - PDFINDI Backend

## 🚀 Koyeb Setup (10 Minutes Total)

### **Why Koyeb is Great:**
- ✅ Global CDN (fast in India)
- ✅ Free tier: 2 services, 512MB RAM
- ✅ Auto-scaling
- ✅ No sleep mode (always on)

### **Step 1: Create Account**
1. Go to: https://www.koyeb.com
2. Sign up with GitHub
3. No credit card required

### **Step 2: Deploy Service**
1. Dashboard → "Create App"
2. Select "Deploy from GitHub"
3. Choose your repository

### **Step 3: Configuration**
```
App name: pdfindi-backend
Instance type: nano (free tier)
Regions: Frankfurt (closest to India with free tier)
Port: 3001
```

### **Step 4: Environment Variables**
```
CLOUDMERSIVE_API_KEY=e46637bc-d958-473f-a8cf-6fc6f4e1ef2f
NODE_ENV=production
PORT=3001
```

### **Step 5: Deploy**
- Koyeb auto-builds from GitHub
- Get URL: `https://pdfindi-backend-your-app.koyeb.app`

---

## 💰 **Koyeb Pricing:**
- **Free:** 2 nano instances forever
- **No sleep:** Always available (no cold starts)
- **Perfect for:** Production PDF service

---

## 🎯 **Your API endpoints:**
```
https://pdfindi-backend-your-app.koyeb.app/api/health
https://pdfindi-backend-your-app.koyeb.app/api/pdf-to-word
https://pdfindi-backend-your-app.koyeb.app/api/word-to-pdf
https://pdfindi-backend-your-app.koyeb.app/api/compress-pdf
```
