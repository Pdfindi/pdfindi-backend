require('dotenv').config();
// Production PDFINDI Backend for Render
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (configure for your domain in production)
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ── Universal Agent API ──────────────────────────────────────────
const agentApi = require('./api/index');
app.use('/api', agentApi);
// ────────────────────────────────────────────────────────────────

// ── Dynamic SEO Injection Middleware ──────────────────────────
const fs = require('fs');
app.get(['/', '/*.html', '/tools/*', '/blog/*'], (req, res, next) => {
  // Only handle HTML requests or clean tool URLs
  if (req.path.includes('/api/') || req.path.includes('.') && !req.path.endsWith('.html')) return next();

  let relPath = req.path === '/' ? 'index.html' : req.path;
  if (!relPath.endsWith('.html')) relPath += '.html';
  
  const fullPath = path.join(__dirname, 'public_html', relPath);
  
  if (fs.existsSync(fullPath)) {
    // Determine the SEO slug (e.g., 'index', 'tools-merge-pdf', 'faq')
    const seoSlug = relPath.replace('.html', '').replace(/\//g, '-');
    const seoDataPath = path.join(__dirname, 'data/seo', `${seoSlug}.json`);
    
    let html = fs.readFileSync(fullPath, 'utf8');
    
    if (fs.existsSync(seoDataPath)) {
      try {
        const seo = JSON.parse(fs.readFileSync(seoDataPath, 'utf8'));
        
        // Inject Title
        if (seo.title) {
          html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${seo.title}</title>`);
          html = html.replace(/property=["']og:title["'] content=["'][^"']*["']/i, `property="og:title" content="${seo.title}"`);
        }
        
        // Inject Description
        if (seo.description) {
          html = html.replace(/<meta[^>]*name=["']description["'][^>]*content=["'][^"']*["']/i, `<meta name="description" content="${seo.description}">`);
          html = html.replace(/property=["']og:description["'] content=["'][^"']*["']/i, `property="og:description" content="${seo.description}"`);
        }
        
        // Inject Keywords
        if (seo.keywords) {
          html = html.replace(/<meta[^>]*name=["']keywords["'][^>]*content=["'][^"']*["']/i, `<meta name="keywords" content="${seo.keywords}">`);
        }
      } catch (err) {
        console.error('SEO Injection Error:', err);
      }
    }
    
    return res.send(html);
  }
  next();
});
// ────────────────────────────────────────────────────────────────

// Serve static files from the public_html directory (with html extension fallback for clean URLs)
app.use(express.static(path.join(__dirname, 'public_html'), { extensions: ['html'] }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    // Accept PDF, Word documents, and image files
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/rtf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'image/webp'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and RTF files are allowed.'));
    }
  }
});

// Free Tier Configuration
const FREE_TIER_LIMITS = {
  conversionsPerHour: 3,
  conversionsPerDay: 10,
  maxFileSizeMB: 10,
  supportedFormats: ['pdf', 'jpg', 'png', 'docx', 'txt']
};

// Usage tracking Map
const usageTracker = new Map();

// Environment check
const CLOUDMERSIVE_API_KEY = process.env.CLOUDMERSIVE_API_KEY;
if (!CLOUDMERSIVE_API_KEY) {
  console.error('❌ CLOUDMERSIVE_API_KEY environment variable is required');
  process.exit(1);
}
// Usage tracking functions
function getClientIP(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || '127.0.0.1';
}

function checkUsageLimits(req, res, next) {
  const clientIP = getClientIP(req);
  const now = new Date();
  const hourKey = clientIP + '-' + now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate() + '-' + now.getHours();
  const dayKey = clientIP + '-' + now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate();
  
  const hourlyUsage = usageTracker.get(hourKey) || 0;
  const dailyUsage = usageTracker.get(dayKey) || 0;
  
  if (hourlyUsage >= FREE_TIER_LIMITS.conversionsPerHour) {
    return res.status(429).json({
      error: 'Hourly limit exceeded',
      limit: FREE_TIER_LIMITS.conversionsPerHour,
      resetTime: new Date(now.getTime() + (60 - now.getMinutes()) * 60000).toISOString(),
      message: 'You have reached the free tier hourly limit. Please try again next hour.'
    });
  }
  
  if (dailyUsage >= FREE_TIER_LIMITS.conversionsPerDay) {
    return res.status(429).json({
      error: 'Daily limit exceeded', 
      limit: FREE_TIER_LIMITS.conversionsPerDay,
      resetTime: new Date(now.getTime() + (24 - now.getHours()) * 3600000).toISOString(),
      message: 'You have reached the free tier daily limit. Please try again tomorrow.'
    });
  }
  
  if (req.file && req.file.size > FREE_TIER_LIMITS.maxFileSizeMB * 1024 * 1024) {
    return res.status(413).json({
      error: 'File too large',
      maxSize: FREE_TIER_LIMITS.maxFileSizeMB + 'MB',
      message: 'File size exceeds free tier limit of ' + FREE_TIER_LIMITS.maxFileSizeMB + 'MB'
    });
  }
  
  usageTracker.set(hourKey, hourlyUsage + 1);
  usageTracker.set(dayKey, dailyUsage + 1);
  
  // Clean up old entries (keep only last 25 hours)
  const cutoffTime = new Date(now.getTime() - 25 * 3600000);
  for (const [key] of usageTracker.entries()) {
    if (key.includes('-')) {
      const parts = key.split('-');
      if (parts.length >= 4) {
        const entryDate = new Date(parts[1], parts[2], parts[3]);
        if (entryDate < cutoffTime) {
          usageTracker.delete(key);
        }
      }
    }
  }
  
  next();
}


// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'PDFINDI API is running',
    timestamp: new Date().toISOString(),
    location: 'Render Cloud',
    version: '1.0.0',
    freeTier: {
      limits: FREE_TIER_LIMITS,
      description: 'Free service with usage limits!'
    }
  });
});

// PDF to Word conversion endpoint
app.post('/api/pdf-to-word', checkUsageLimits, upload.single('file'), async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] PDF to Word conversion requested`);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'File must be a PDF' });
    }

    console.log(`Processing: ${req.file.originalname} (${req.file.size} bytes)`);

    // Create FormData for Cloudmersive API
    const formData = new FormData();
    formData.append('inputFile', req.file.buffer, {
      filename: req.file.originalname,
      contentType: 'application/pdf'
    });

    // Call Cloudmersive PDF to DOCX API
    const response = await axios.post(
      'https://api.cloudmersive.com/convert/pdf/to/docx',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Apikey': CLOUDMERSIVE_API_KEY
        },
        responseType: 'arraybuffer',
        timeout: 30000
      }
    );

    // Convert to base64 for frontend
    const base64Data = Buffer.from(response.data).toString('base64');
    const outputFilename = req.file.originalname.replace(/\.pdf$/i, '.docx');

    console.log(`✅ Conversion successful: ${outputFilename}`);

    res.json({
      success: true,
      filename: outputFilename,
      base64: base64Data,
      originalSize: req.file.size,
      convertedSize: response.data.length,
      message: 'PDF successfully converted to Word document'
    });

  } catch (error) {
    console.error('❌ PDF to Word conversion error:', error.message);
    
    if (error.response) {
      console.error('API Error Status:', error.response.status);
      console.error('API Error Data:', error.response.data?.toString?.() || 'No details');
      
      return res.status(error.response.status).json({ 
        error: `Conversion API error: ${error.response.status}`,
        details: error.response.data?.toString?.() || 'Unknown API error'
      });
    }
    
    res.status(500).json({ 
      error: 'Internal conversion error',
      details: error.message 
    });
  }
});

// Word to PDF conversion endpoint
app.post('/api/word-to-pdf', upload.single('file'), async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] Word to PDF conversion requested`);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const allowedTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'File must be a Word document (DOC or DOCX)' });
    }

    console.log(`Processing: ${req.file.originalname} (${req.file.size} bytes)`);

    // Create FormData for Cloudmersive API
    const formData = new FormData();
    formData.append('inputFile', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Call Cloudmersive DOCX to PDF API
    const response = await axios.post(
      'https://api.cloudmersive.com/convert/docx/to/pdf',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Apikey': CLOUDMERSIVE_API_KEY
        },
        responseType: 'arraybuffer',
        timeout: 30000
      }
    );

    // Convert to base64 for frontend
    const base64Data = Buffer.from(response.data).toString('base64');
    
    // Robust filename handling: Parse original name and append .pdf
    const originalExt = path.extname(req.file.originalname);
    const originalBase = path.basename(req.file.originalname, originalExt);
    const outputFilename = `${originalBase}.pdf`;

    console.log(`✅ Conversion successful: ${outputFilename}`);

    res.json({
      success: true,
      filename: outputFilename,
      base64: base64Data,
      originalSize: req.file.size,
      convertedSize: response.data.length,
      message: 'Word document successfully converted to PDF'
    });

  } catch (error) {
    console.error('❌ Word to PDF conversion error:', error.message);
    
    if (error.response) {
      console.error('API Error Status:', error.response.status);
      console.error('API Error Data:', error.response.data?.toString?.() || 'No details');
      
      return res.status(error.response.status).json({ 
        error: `Conversion API error: ${error.response.status}`,
        details: error.response.data?.toString?.() || 'Unknown API error'
      });
    }
    
    res.status(500).json({ 
      error: 'Internal conversion error',
      details: error.message 
    });
  }
});

// PDF Compression endpoint (using PDF quality reduction)
app.post('/api/compress-pdf', upload.single('file'), async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] PDF compression requested`);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'File must be a PDF' });
    }

    console.log(`Compressing: ${req.file.originalname} (${req.file.size} bytes)`);

    // Get compression level from request (default to medium)
    const compressionLevel = req.body.level || 'medium';
    
    console.log(`Compression settings: level=${compressionLevel}`);

    // Use pdf-lib for compression by removing metadata and optimizing
    const PDFDocument = require('pdf-lib').PDFDocument;
    
    try {
      // Load the PDF
      const pdfDoc = await PDFDocument.load(req.file.buffer);
      
      // Save with compression options
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50
      });

      const base64Data = Buffer.from(pdfBytes).toString('base64');
      const compressionRatio = Math.max(0, ((req.file.size - pdfBytes.length) / req.file.size * 100)).toFixed(1);

      console.log(`✅ Compression successful: ${compressionRatio}% reduction`);

      res.json({
        success: true,
        filename: req.file.originalname,
        base64: base64Data,
        originalSize: req.file.size,
        compressedSize: pdfBytes.length,
        compressionRatio: parseFloat(compressionRatio),
        message: `PDF compressed successfully (${compressionRatio}% size reduction)`
      });
    } catch (pdfError) {
      console.error('PDF-lib compression failed, falling back to original:', pdfError.message);
      
      // If pdf-lib fails, return original file
      const base64Data = req.file.buffer.toString('base64');
      res.json({
        success: true,
        filename: req.file.originalname,
        base64: base64Data,
        originalSize: req.file.size,
        compressedSize: req.file.size,
        compressionRatio: 0,
        message: `PDF optimization not possible for this file`
      });
    }

  } catch (error) {
    console.error('❌ PDF compression error:', error.message);
    
    if (error.response) {
      console.error('API Error Status:', error.response.status);
      console.error('API Error Data:', error.response.data);
      return res.status(error.response.status).json({ 
        error: `Compression API error: ${error.response.status}`,
        details: error.response.data?.toString?.() || 'Unknown API error'
      });
    }
    
    res.status(500).json({ 
      error: 'Internal compression error',
      details: error.message 
    });
  }
});

// Image to PDF conversion endpoint
app.post('/api/image-to-pdf', checkUsageLimits, upload.single('file'), async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] Image to PDF conversion requested`);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const allowedImageTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'image/webp'
    ];
    
    if (!allowedImageTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'File must be an image (JPEG, PNG, GIF, BMP, TIFF, WebP)' });
    }

    console.log(`Processing: ${req.file.originalname} (${req.file.size} bytes)`);

    // Create FormData for Cloudmersive API
    const formData = new FormData();
    formData.append('inputFile', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Call Cloudmersive Image to PDF API
    const response = await axios.post(
      'https://api.cloudmersive.com/convert/image/to/pdf',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Apikey': CLOUDMERSIVE_API_KEY
        },
        responseType: 'arraybuffer',
        timeout: 30000
      }
    );

    // Convert to base64 for frontend
    const base64Data = Buffer.from(response.data).toString('base64');
    const outputFilename = req.file.originalname.replace(/\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i, '.pdf');

    console.log(`✅ Conversion successful: ${outputFilename}`);

    res.json({
      success: true,
      filename: outputFilename,
      base64: base64Data,
      originalSize: req.file.size,
      convertedSize: response.data.length,
      message: 'Image successfully converted to PDF'
    });

  } catch (error) {
    console.error('❌ Image to PDF conversion error:', error.message);
    
    if (error.response) {
      console.error('API Error Status:', error.response.status);
      console.error('API Error Data:', error.response.data?.toString?.() || 'No details');
      
      return res.status(error.response.status).json({ 
        error: `Conversion API error: ${error.response.status}`,
        details: error.response.data?.toString?.() || 'Unknown API error'
      });
    }
    
    res.status(500).json({ 
      error: 'Internal conversion error',
      details: error.message 
    });
  }
});

// PDF to JPG conversion endpoint - DEPRECATED (Now handled client-side with pdf.js)
// Keeping endpoint stub for backward compatibility but returns message to use client-side
app.post('/api/pdf-to-jpg', checkUsageLimits, upload.single('file'), async (req, res) => {
  console.log(`[${new Date().toISOString()}] PDF to JPG endpoint called - Redirecting to client-side solution`);
  
  res.json({
    success: false,
    deprecated: true,
    message: 'PDF to JPG conversion is now handled client-side using pdf.js for better performance and privacy. Please update your client code.',
    recommendation: 'Use pdf.js library in browser for client-side PDF to image conversion'
  });
});

// OCR Text Extraction from Image endpoint
app.post('/api/ocr-text', upload.single('file'), async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] OCR text extraction requested`);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const allowedImageTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'image/webp'
    ];
    
    if (!allowedImageTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'File must be an image (JPEG, PNG, GIF, BMP, TIFF, WebP)' });
    }

    console.log(`Processing: ${req.file.originalname} (${req.file.size} bytes)`);

    // Create FormData for Cloudmersive API
    const formData = new FormData();
    formData.append('inputFile', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Call Cloudmersive OCR API
    const response = await axios.post(
      'https://api.cloudmersive.com/ocr/image/toText',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Apikey': CLOUDMERSIVE_API_KEY
        },
        timeout: 30000
      }
    );

    console.log(`✅ OCR extraction successful from: ${req.file.originalname}`);

    res.json({
      success: true,
      filename: req.file.originalname,
      extractedText: response.data.TextResult || '',
      confidence: response.data.Successful || false,
      originalSize: req.file.size,
      message: 'Text successfully extracted from image'
    });

  } catch (error) {
    console.error('❌ OCR text extraction error:', error.message);
    
    if (error.response) {
      console.error('API Error Status:', error.response.status);
      console.error('API Error Data:', error.response.data?.toString?.() || 'No details');
      
      return res.status(error.response.status).json({ 
        error: `OCR API error: ${error.response.status}`,
        details: error.response.data?.toString?.() || 'Unknown API error'
      });
    }
    
    res.status(500).json({ 
      error: 'Internal OCR error',
      details: error.message 
    });
  }
});

// Extract PDF text with positions for editing
app.post('/api/extract-pdf-text', checkUsageLimits, upload.single('file'), async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] PDF text extraction for editing requested`);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'File must be a PDF' });
    }

    console.log(`Extracting text from: ${req.file.originalname} (${req.file.size} bytes)`);

    // Use Cloudmersive OCR to extract text with positions
    const formData = new FormData();
    formData.append('imageFile', req.file.buffer, {
      filename: req.file.originalname,
      contentType: 'application/pdf'
    });

    const response = await axios.post(
      'https://api.cloudmersive.com/ocr/pdf/to/lines-with-location',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Apikey': CLOUDMERSIVE_API_KEY
        },
        timeout: 60000
      }
    );

    console.log(`✅ Text extracted successfully`);

    // Also store the original PDF for later reconstruction
    const pdfBase64 = req.file.buffer.toString('base64');

    res.json({
      success: true,
      textData: response.data,
      originalPdf: pdfBase64,
      filename: req.file.originalname
    });

  } catch (error) {
    console.error('❌ PDF text extraction error:', error.message);
    
    if (error.response) {
      console.error('API Error Status:', error.response.status);
      return res.status(error.response.status).json({ 
        error: `Text extraction API error: ${error.response.status}`,
        details: error.response.data
      });
    }
    
    res.status(500).json({ 
      error: 'Internal text extraction error',
      details: error.message 
    });
  }
});

// Rebuild PDF with edited text
app.post('/api/rebuild-pdf', checkUsageLimits, upload.single('file'), async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] PDF rebuild with edits requested`);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No original PDF provided' });
    }

    if (!req.body.edits) {
      return res.status(400).json({ error: 'No edit data provided' });
    }

    const edits = JSON.parse(req.body.edits);
    console.log(`Rebuilding PDF with ${Object.keys(edits).length} edits`);

    // Use pdf-lib to manipulate the PDF
    const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Apply edits to each page
    for (const [editId, editData] of Object.entries(edits)) {
      const { page, x, y, text, fontSize } = editData;
      const targetPageNum = parseInt(page) || 1;
      
      if (targetPageNum > 0 && targetPageNum <= pages.length) {
        const pdfPage = pages[targetPageNum - 1];
        const pageHeight = pdfPage.getHeight();
        const fSize = parseFloat(fontSize) || 12;
        
        // Coordinates from frontend are top-left, pdf-lib is bottom-left
        // We use the coordinates provided by Cloudmersive/Browser
        const pdfX = parseFloat(x);
        const pdfY = pageHeight - parseFloat(y) - fSize;

        // 1. Cover old text with white rectangle (Whiteout)
        // We expand the rectangle slightly to ensure full coverage
        const textWidth = text.length * fSize * 0.55; // Heuristic width
        pdfPage.drawRectangle({
          x: pdfX - 2,
          y: pdfY - 2,
          width: textWidth + 10,
          height: fSize + 5,
          color: rgb(1, 1, 1), // White
        });
        
        // 2. Draw new text
        pdfPage.drawText(text, {
          x: pdfX,
          y: pdfY,
          size: fSize,
          font: font,
          color: rgb(0, 0, 0), // Black
        });
      }
    }

    const editedPdfBytes = await pdfDoc.save();
    const base64Pdf = Buffer.from(editedPdfBytes).toString('base64');

    console.log('✅ PDF successfully rebuilt with edits');

    res.json({
      success: true,
      editedPdf: base64Pdf,
      filename: req.file.originalname.replace('.pdf', '_edited.pdf')
    });

  } catch (error) {
    console.error('❌ PDF rebuild error:', error.message);
    res.status(500).json({ 
      error: 'PDF rebuild failed',
      details: error.message 
    });
  }
});

// Add Watermark endpoint
app.post('/api/add-watermark', upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] Add watermark requested`);
    
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfFile = req.files.pdf[0];
    
    if (pdfFile.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'File must be a PDF' });
    }

    const watermarkType = req.body.type || 'text';
    const watermarkText = req.body.text || 'CONFIDENTIAL';
    const fontSize = parseInt(req.body.fontSize) || 36;
    const fontColor = req.body.fontColor || '#ff0000';
    const opacity = parseFloat(req.body.opacity) || 0.5;
    const rotation = parseInt(req.body.rotation) || 0;
    const position = req.body.position || 'center';
    const pageRange = req.body.pageRange || '';

    if (watermarkType === 'text' && !watermarkText.trim()) {
      return res.status(400).json({ error: 'Watermark text is required' });
    }
    
    if (watermarkType === 'image' && (!req.files || !req.files.image)) {
      return res.status(400).json({ error: 'Watermark image is required' });
    }

    console.log(`Processing: ${pdfFile.originalname} (${pdfFile.size} bytes) with ${watermarkType} watermark`);

    // Load pdf-lib dynamically
    const { PDFDocument, rgb, degrees, StandardFonts } = require('pdf-lib');
    
    // Load the PDF
    const pdfDoc = await PDFDocument.load(pdfFile.buffer);
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    // Parse page range
    let pagesToWatermark = [];
    if (!pageRange || pageRange.trim() === '') {
      // All pages
      pagesToWatermark = Array.from({ length: totalPages }, (_, i) => i);
    } else {
      // Parse range like "1-3,5,7-9"
      const parts = pageRange.split(',');
      for (let part of parts) {
        part = part.trim();
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(n => parseInt(n.trim()));
          for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
            pagesToWatermark.push(i - 1); // 0-based index
          }
        } else {
          const pageNum = parseInt(part);
          if (pageNum >= 1 && pageNum <= totalPages) {
            pagesToWatermark.push(pageNum - 1); // 0-based index
          }
        }
      }
      pagesToWatermark = [...new Set(pagesToWatermark)].sort((a, b) => a - b);
    }

    // Convert hex color to RGB
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
      } : { r: 1, g: 0, b: 0 }; // Default red
    };

    const color = hexToRgb(fontColor);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Calculate position offsets
    const getPosition = (page, textWidth, textHeight) => {
      const { width, height } = page.getSize();
      const positions = {
        'center': { x: (width - textWidth) / 2, y: (height - textHeight) / 2 },
        'top-left': { x: 50, y: height - 50 - textHeight },
        'top-center': { x: (width - textWidth) / 2, y: height - 50 - textHeight },
        'top-right': { x: width - 50 - textWidth, y: height - 50 - textHeight },
        'center-left': { x: 50, y: (height - textHeight) / 2 },
        'center-right': { x: width - 50 - textWidth, y: (height - textHeight) / 2 },
        'bottom-left': { x: 50, y: 50 },
        'bottom-center': { x: (width - textWidth) / 2, y: 50 },
        'bottom-right': { x: width - 50 - textWidth, y: 50 }
      };
      return positions[position] || positions['center'];
    };

    // Add watermark to selected pages
    for (const pageIndex of pagesToWatermark) {
      const page = pages[pageIndex];
      
      if (watermarkType === 'text') {
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
        const textHeight = font.heightAtSize(fontSize);
        const pos = getPosition(page, textWidth, textHeight);

        page.drawText(watermarkText, {
          x: pos.x,
          y: pos.y,
          size: fontSize,
          font: font,
          color: rgb(color.r, color.g, color.b),
          opacity: opacity,
          rotate: degrees(rotation)
        });
      }
    }

    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();

    console.log(`✅ Watermark added successfully to ${pagesToWatermark.length} pages`);

    // Send as blob
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="watermarked-${pdfFile.originalname}"`,
      'Content-Length': pdfBytes.length
    });
    
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error('❌ Add watermark error:', error.message);
    console.error(error.stack);
    res.status(500).json({ 
      error: 'Failed to add watermark',
      message: error.message 
    });
  }
});

// PDF Protection endpoint - uses Cloudmersive API
app.post('/api/protect-pdf', upload.single('file'), async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] PDF protection requested`);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'File must be a PDF' });
    }

    const {
      userPassword,
      ownerPassword,
      permissions,
      encryptionKeyLength
    } = req.body;

    // Parse permissions if it's a JSON string
    let perms = {};
    if (typeof permissions === 'string') {
      try {
        perms = JSON.parse(permissions);
      } catch (e) {
        perms = {};
      }
    } else {
      perms = permissions || {};
    }

    console.log(`Processing: ${req.file.originalname} (${req.file.size} bytes)`);
    console.log(`Protection: User Password: ${userPassword ? 'Yes' : 'No'}, Owner Password: ${ownerPassword ? 'Yes' : 'No'}`);

    // Create FormData for Cloudmersive API
    const formData = new FormData();
    formData.append('inputFile', req.file.buffer, {
      filename: req.file.originalname,
      contentType: 'application/pdf'
    });

    console.log('Calling Cloudmersive API...');
    console.log('API URL: https://api.cloudmersive.com/convert/edit/pdf/encrypt');
    console.log('API Key (first 10 chars):', CLOUDMERSIVE_API_KEY.substring(0, 10) + '...');
    console.log('File size:', req.file.buffer.length, 'bytes');
    console.log('User Password:', userPassword ? 'SET' : 'NOT SET');
    console.log('Encryption Level:', encryptionKeyLength);
    
    // Prepare headers - simple encryption with just user password
    const headers = {
      ...formData.getHeaders(),
      'Apikey': CLOUDMERSIVE_API_KEY,
      'encryptionKeyLength': encryptionKeyLength === '256' ? '256' : '128'
    };
    
    // Add passwords as headers (both are optional for basic encryption)
    if (userPassword) {
      headers['userPassword'] = userPassword;
    }
    if (ownerPassword) {
      headers['ownerPassword'] = ownerPassword;
    }
    
    console.log('Calling basic PDF encryption endpoint...');
    
    // Call Cloudmersive PDF encryption API (basic - just password protection)
    const response = await axios.post(
      'https://api.cloudmersive.com/convert/edit/pdf/encrypt',
      formData,
      {
        headers: headers,
        responseType: 'arraybuffer',
        timeout: 30000,
        validateStatus: function (status) {
          return status < 500; // Accept any status less than 500
        }
      }
    );

    console.log('API Response Status:', response.status);
    console.log('API Response Content-Type:', response.headers['content-type']);
    
    // Check if response is actually a PDF
    if (response.status !== 200) {
      const errorText = Buffer.from(response.data).toString('utf8');
      console.error('API Error Response Status:', response.status);
      console.error('API Error Response (first 1000 chars):', errorText.substring(0, 1000));
      throw new Error(`Cloudmersive API returned status ${response.status}: ${errorText.substring(0, 200)}`);
    }
    
    // Check content type
    const contentType = response.headers['content-type'] || '';
    console.log('Response Content-Type:', contentType);
    console.log('Response Size:', response.data.byteLength, 'bytes');
    
    if (!contentType.includes('pdf') && !contentType.includes('octet-stream')) {
      const errorHtml = Buffer.from(response.data).toString('utf8');
      console.error('Non-PDF response received. Content-Type:', contentType);
      console.error('Response body (first 500 chars):', errorHtml.substring(0, 500));
      throw new Error(`API returned ${contentType} instead of PDF. Response: ${errorHtml.substring(0, 100)}`);
    }

    console.log('✅ PDF protection successful');
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${req.file.originalname.replace('.pdf', '_protected.pdf')}"`
    });
    
    res.send(Buffer.from(response.data));

  } catch (error) {
    console.error('❌ PDF protection failed:', error.response?.data || error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'PDF protection failed',
        details: error.response.data?.Message || error.message,
        statusCode: error.response.status
      });
    }
    
    res.status(500).json({
      error: 'PDF protection failed',
      details: error.message
    });
  }
});

// Unlock PDF endpoint
app.post('/api/unlock-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    console.log('📂 Unlocking PDF:', {
      filename: req.file.originalname,
      size: req.file.size,
      hasPassword: !!password
    });

    // Prepare form data for Cloudmersive API
    const form = new FormData();
    form.append('inputFile', req.file.buffer, {
      filename: req.file.originalname,
      contentType: 'application/pdf'
    });

    console.log('🔓 Calling Cloudmersive decrypt API...');

    const response = await axios.post(
      'https://api.cloudmersive.com/convert/edit/pdf/decrypt',
      form,
      {
        headers: {
          'Apikey': CLOUDMERSIVE_API_KEY,
          'password': password,
          ...form.getHeaders()
        },
        responseType: 'arraybuffer',
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    );

    console.log('📤 Cloudmersive API response:', {
      status: response.status,
      contentType: response.headers['content-type'],
      dataLength: response.data.length
    });

    // Check if response is actually a PDF
    const contentType = response.headers['content-type'];
    if (!contentType || (!contentType.includes('application/pdf') && !contentType.includes('application/octet-stream'))) {
      const errorHtml = Buffer.from(response.data).toString('utf8');
      console.error('Non-PDF response received. Content-Type:', contentType);
      console.error('Response body (first 500 chars):', errorHtml.substring(0, 500));
      throw new Error(`API returned ${contentType} instead of PDF. Response: ${errorHtml.substring(0, 100)}`);
    }

    console.log('✅ PDF unlock successful');
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${req.file.originalname.replace('.pdf', '_unlocked.pdf')}"`
    });
    
    res.send(Buffer.from(response.data));

  } catch (error) {
    console.error('❌ PDF unlock failed:', error.response?.data || error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'PDF unlock failed',
        details: error.response.data?.Message || error.message,
        statusCode: error.response.status
      });
    }
    
    res.status(500).json({
      error: 'PDF unlock failed',
      details: error.message
    });
  }
});

// Root endpoint - Backend info page
app.get('/', (req, res) => {
  res.json({
    service: 'PDFINDI Backend API',
    version: '1.0.3',
    status: 'online',
    location: 'Render Cloud',
    endpoints: {
      health: 'GET /api/health',
      pdfToWord: 'POST /api/pdf-to-word',
      wordToPdf: 'POST /api/word-to-pdf',
      compressPdf: 'POST /api/compress-pdf',
      imageToPdf: 'POST /api/image-to-pdf',
      pdfToJpg: 'POST /api/pdf-to-jpg',
      ocrText: 'POST /api/ocr-text',
      addWatermark: 'POST /api/add-watermark',
      protectPdf: 'POST /api/protect-pdf'
    },
    documentation: 'API endpoints accept multipart/form-data with file uploads',
    limits: {
      maxFileSize: '50MB',
      timeout: '30 seconds',
      allowedTypes: ['PDF', 'DOC', 'DOCX', 'RTF', 'JPEG', 'PNG', 'GIF', 'BMP', 'TIFF', 'WebP']
    }
  });
});

// ==========================================
// CONTACT FORM EMAIL ENDPOINT
// ==========================================
// Email transporter configuration
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.EMAIL_PORT) || 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your email (support@pdfindi.com)
      pass: process.env.EMAIL_PASSWORD // Hostinger email password
    }
  });
};

app.post('/api/contact-form', express.json(), async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const subject = req.body.subject || 'PDFIndi User Contact/Feedback';

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, email, and message are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email address' 
      });
    }

    console.log(`📧 Contact form submission from: ${email}`);

    // Create transporter
    const transporter = createEmailTransporter();

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'support@pdfindi.com',
      replyTo: email,
      subject: `PDFIndi Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #FF9933; margin-bottom: 20px; border-bottom: 3px solid #FF9933; padding-bottom: 10px;">
              🇮🇳 New Contact Form Submission
            </h2>
            
            <div style="background: #FFF8F0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 5px 0;"><strong>📋 Subject:</strong> ${subject}</p>
              <p style="margin: 5px 0;"><strong>👤 Name:</strong> ${name}</p>
              <p style="margin: 5px 0;"><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #FF9933;">${email}</a></p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #FF9933;">
              <h3 style="color: #333; margin-top: 0;">💬 Message:</h3>
              <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
              <p style="margin: 5px 0;">⏰ Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
              <p style="margin: 5px 0;">🌐 From: PDFIndi Contact Form</p>
            </div>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent successfully to support@pdfindi.com`);

    res.json({ 
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.'
    });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send message. Please try again later.',
      details: error.message
    });
  }
});

// ==========================================
// PDF EDITOR ENDPOINT (Like Sejda)
// ==========================================
app.post('/api/edit-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const edits = JSON.parse(req.body.edits || '[]');
    
    console.log('📝 Processing PDF edits:', {
      filename: req.file.originalname,
      size: req.file.size,
      edits: edits.length
    });

    // Import pdf-lib
    const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
    
    // Load the PDF
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const pages = pdfDoc.getPages();
    
    // Embed font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Process each edit
    for (const edit of edits) {
      const page = pages[edit.page - 1];
      if (!page) continue;

      const pageHeight = page.getHeight();
      const pageWidth = page.getWidth();

      // Calculate scale from viewport to actual PDF
      const scale = edit.scale || 1;

      switch (edit.type) {
        case 'existing-text':
          // Cover original text with white rectangle
          if (edit.originalX !== undefined && edit.originalY !== undefined) {
            page.drawRectangle({
              x: edit.originalX * scale - 2,
              y: pageHeight - edit.originalY * scale - edit.fontSize * scale - 5,
              width: Math.max(edit.width * scale, edit.text.length * edit.fontSize * scale * 0.6) + 10,
              height: edit.fontSize * scale + 10,
              color: rgb(1, 1, 1)
            });

            // Draw new text
            page.drawText(edit.text, {
              x: edit.originalX * scale,
              y: pageHeight - edit.originalY * scale - edit.fontSize * scale,
              size: edit.fontSize * scale,
              font: font,
              color: rgb(0, 0, 0)
            });
          }
          break;

        case 'text':
          // Add new text
          page.drawText(edit.text, {
            x: edit.x * scale,
            y: pageHeight - (edit.y * scale) - edit.fontSize * scale,
            size: edit.fontSize * scale,
            font: font,
            color: rgb(
              edit.color?.r || 0,
              edit.color?.g || 0,
              edit.color?.b || 0
            )
          });
          break;

        case 'whiteout':
        case 'rectangle':
          page.drawRectangle({
            x: edit.x * scale,
            y: pageHeight - (edit.y * scale) - edit.height * scale,
            width: edit.width * scale,
            height: edit.height * scale,
            color: edit.type === 'whiteout' ? rgb(1, 1, 1) : rgb(1, 1, 1),
            borderColor: edit.type === 'rectangle' ? rgb(0, 0, 0) : undefined,
            borderWidth: edit.type === 'rectangle' ? 2 : 0
          });
          break;

        case 'circle':
          const radius = edit.width * scale / 2;
          page.drawCircle({
            x: edit.x * scale + radius,
            y: pageHeight - (edit.y * scale) - radius,
            size: radius,
            borderColor: rgb(0, 0, 0),
            borderWidth: 2
          });
          break;

        case 'highlight':
          page.drawRectangle({
            x: edit.x * scale,
            y: pageHeight - (edit.y * scale) - edit.height * scale,
            width: edit.width * scale,
            height: edit.height * scale,
            color: rgb(1, 1, 0),
            opacity: 0.4
          });
          break;

        case 'image':
        case 'signature':
          if (edit.imageData) {
            try {
              const imageBytes = Buffer.from(edit.imageData.split(',')[1], 'base64');
              let image;
              
              if (edit.imageData.includes('image/png')) {
                image = await pdfDoc.embedPng(imageBytes);
              } else {
                image = await pdfDoc.embedJpg(imageBytes);
              }

              page.drawImage(image, {
                x: edit.x * scale,
                y: pageHeight - (edit.y * scale) - edit.height * scale,
                width: edit.width * scale,
                height: edit.height * scale
              });
            } catch (imgError) {
              console.error('Error embedding image:', imgError);
            }
          }
          break;
      }
    }

    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();

    // Send back the edited PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${req.file.originalname.replace('.pdf', '_edited.pdf')}"`);
    res.send(Buffer.from(pdfBytes));

    console.log('✅ PDF edited successfully');

  } catch (error) {
    console.error('❌ PDF editing error:', error);
    res.status(500).json({ 
      error: 'Failed to edit PDF',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler for API routes only
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// 404 handler for any other routes
app.use('*', (req, res) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, 'public_html', '404.html'));
  } else {
    res.status(404).json({ 
      error: 'Route not found',
      message: 'This is an API server. Use /api/* endpoints or visit / for API info.'
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 PDFINDI Backend Server Started');
  console.log('=====================================');
  console.log(`📍 Location: Render Cloud`);
  console.log(`🌐 Server: http://0.0.0.0:${PORT}`);
  console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 API Key: ${CLOUDMERSIVE_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log('');
  console.log('🔧 Available Endpoints:');
  console.log('   GET  /api/health');
  console.log('   POST /api/pdf-to-word');
  console.log('   POST /api/word-to-pdf');
  console.log('   POST /api/compress-pdf');
  console.log('   POST /api/image-to-pdf');
  console.log('   POST /api/pdf-to-jpg (deprecated - use client-side pdf.js)');
  console.log('   POST /api/extract-pdf-text');
  console.log('   POST /api/rebuild-pdf');
  console.log('   POST /api/ocr-text');
  console.log('   POST /api/add-watermark');
  console.log('   POST /api/contact-form');
  console.log('');
  console.log('📁 Frontend: Static files served from public_html/');
  console.log('=====================================');
});








