# Railway Deployment Guide - PDFINDI Backend

## 🚀 Railway Setup (5 Minutes Total)

### **Step 1: Create Railway Account**
1. Go to: https://railway.app
2. Click "Start a New Project"
3. Sign up with GitHub (no credit card needed)

### **Step 2: Deploy from GitHub**
1. Push your backend code to GitHub repository
2. In Railway: "Deploy from GitHub repo"
3. Select your pdfindi repository
4. Railway auto-detects Node.js and deploys

### **Step 3: Set Environment Variables**
```
CLOUDMERSIVE_API_KEY=e46637bc-d958-473f-a8cf-6fc6f4e1ef2f
NODE_ENV=production
PORT=3001
```

### **Step 4: Get Your URL**
Railway gives you: `https://your-app-production.up.railway.app`

---

## 📁 **Required Files for Railway:**

### **package.json** (add start script):
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### **railway.json** (optional):
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
```

---

## 🎯 **Your API endpoints will be:**
```
https://your-app-production.up.railway.app/api/health
https://your-app-production.up.railway.app/api/pdf-to-word
https://your-app-production.up.railway.app/api/word-to-pdf
https://your-app-production.up.railway.app/api/compress-pdf
```

---

## 💰 **Railway Pricing:**
- **Free:** $5 credit/month (enough for PDF conversion service)
- **Usage:** Only pay for what you use
- **Sleep mode:** App sleeps when not used (saves money)
- **Estimate:** Your PDF service should cost $0-2/month
