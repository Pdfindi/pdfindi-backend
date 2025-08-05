# PDFINDI Backend - Free Serverless Solution

## 🚀 Free Deployment on Vercel

This backend is designed to run **completely FREE** on Vercel's serverless platform.

### ✅ What's Included:
- **PDF Compression** - Basic compression using pdf-lib
- **PDF to JPG** - Page extraction (demo implementation)
- **CORS enabled** - Works with your Hostinger domain
- **Zero cost** - Runs on Vercel's free tier

### 📊 Vercel Free Tier Limits:
- **100GB bandwidth/month** - More than enough for PDF tools
- **100,000 function invocations/month** - Plenty for normal usage
- **10MB file size limit** - Suitable for most PDFs
- **10 second execution time** - Sufficient for basic operations

## 🛠️ Setup Instructions:

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
