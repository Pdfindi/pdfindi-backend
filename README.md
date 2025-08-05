# PDFINDI Backend

🚀 **Production backend for PDFINDI PDF/Word conversion tools**

## 🎯 Features

- **PDF to Word** conversion using Cloudmersive API
- **Word to PDF** conversion using Cloudmersive API  
- **PDF Compression** using Cloudmersive API
- **Secure file handling** with 50MB upload limits
- **Production-ready** Express.js server
- **Railway deployment** optimized

## 🛠️ Tech Stack

- **Node.js 18+** - Runtime environment
- **Express.js 4.18** - Web framework
- **Multer 2.x** - File upload handling (secure)
- **Cloudmersive API** - PDF/Word conversion service
- **Railway** - Deployment platform

## � Deployment

### Railway (Recommended):
1. Fork this repository
2. Connect to Railway.app
3. Set environment variables
4. Deploy automatically

### Environment Variables:
```
CLOUDMERSIVE_API_KEY=your-api-key
NODE_ENV=production
PORT=3001
```

## 📁 API Endpoints

```
GET  /api/health           - Health check
POST /api/pdf-to-word      - Convert PDF to Word
POST /api/word-to-pdf      - Convert Word to PDF  
POST /api/compress-pdf     - Compress PDF files
```

## 🔒 Security

- CORS configured for cross-origin requests
- File type validation (PDF/Word only)
- File size limits (50MB max)
- Secure API key handling

## 💰 Cost Efficient

- Optimized for Railway's $5 free credit
- Sleep mode compatible (saves costs)
- Minimal resource usage

---

**Built for [PDFINDI.com](https://pdfindi.com)** - India's PDF conversion toolkit

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel:**
   ```bash
   cd backend
   vercel --prod
   ```

3. **Update Frontend:**
   Update your frontend to use the new API endpoints:
   ```javascript
   const API_BASE = 'https://your-project.vercel.app/api';
   ```

## 💰 Cost Breakdown:

| Service | Cost | Your Status |
|---------|------|-------------|
| **Frontend Hosting** | $0 | ✅ Already have (Hostinger) |
| **Domain** | $0 | ✅ Already have |
| **Backend API** | $0 | ✅ Free (Vercel) |
| **Total Monthly Cost** | **$0** | 🎉 Completely FREE! |

## 🔄 Alternative: PHP Backend on Hostinger

If you prefer to keep everything on Hostinger, we can create PHP scripts:

```php
// Simple PHP compression endpoint
<?php
// This would require Ghostscript on server
exec("gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=compressed.pdf input.pdf");
?>
```

**Note:** Check if Hostinger supports system commands (Ghostscript, ImageMagick) for advanced PDF operations.

## 🎯 Recommended Next Steps:

1. **Test Vercel deployment** - Start with this free solution
2. **Monitor usage** - Track if you stay within free limits
3. **Scale gradually** - Only upgrade if needed

## 🔧 Tool Implementation Priority:

### Phase 1 (Immediate - FREE):
- ✅ **PDF Compression** - Basic optimization
- ✅ **PDF to JPG** - Single page conversion
- ⏳ **Edit PDF** - Text overlay

### Phase 2 (Later - if needed):
- 📄 **PDF to Word** - Requires OCR libraries
- 📊 **Office conversions** - Needs LibreOffice

This approach keeps you **100% free** while providing functional backend tools!
