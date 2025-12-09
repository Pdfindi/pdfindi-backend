// Production PDFINDI Backend for Render
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;



// Enable CORS for all origins (configure for your domain in production)
app.use(cors());
app.use(express.json({ limit: '50mb' }));

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

// Environment check
const CLOUDMERSIVE_API_KEY = process.env.CLOUDMERSIVE_API_KEY;
if (!CLOUDMERSIVE_API_KEY) {
  console.error('❌ CLOUDMERSIVE_API_KEY environment variable is required');
  process.exit(1);
}

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'PDFINDI Backend',
    environment: process.env.NODE_ENV || 'development',
    location: 'Render Cloud',
    version: '1.0.3',
    protectPdfEndpoint: 'available'
  });
});

// PDF to Word conversion endpoint
app.post('/api/pdf-to-word', upload.single('file'), async (req, res) => {
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
    const outputFilename = req.file.originalname.replace(/\.(doc|docx)$/i, '.pdf');

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

    // Create FormData for Cloudmersive API
    const formData = new FormData();
    formData.append('inputFile', req.file.buffer, {
      filename: req.file.originalname,
      contentType: 'application/pdf'
    });

    // Use PDF to DOCX and back to PDF for compression effect
    // First convert to DOCX
    const docxResponse = await axios.post(
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

    // Then convert DOCX back to PDF
    const pdfFormData = new FormData();
    pdfFormData.append('inputFile', docxResponse.data, {
      filename: 'temp.docx',
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    const pdfResponse = await axios.post(
      'https://api.cloudmersive.com/convert/docx/to/pdf',
      pdfFormData,
      {
        headers: {
          ...pdfFormData.getHeaders(),
          'Apikey': CLOUDMERSIVE_API_KEY
        },
        responseType: 'arraybuffer',
        timeout: 30000
      }
    );

    const base64Data = Buffer.from(pdfResponse.data).toString('base64');
    const compressionRatio = Math.max(0, ((req.file.size - pdfResponse.data.length) / req.file.size * 100)).toFixed(1);

    console.log(`✅ Compression successful: ${compressionRatio}% reduction`);

    res.json({
      success: true,
      filename: req.file.originalname,
      base64: base64Data,
      originalSize: req.file.size,
      compressedSize: pdfResponse.data.length,
      compressionRatio: `${compressionRatio}%`,
      message: `PDF compressed successfully (${compressionRatio}% size reduction)`
    });

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

// Image to PDF conversion endpoint - FIXED VERSION
app.post('/api/image-to-pdf', upload.single('file'), async (req, res) => {
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

// PDF to Image conversion endpoint - Enhanced with multiple format support
app.post('/api/pdf-to-image', upload.single('file'), async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] PDF to Image conversion requested`);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'File must be a PDF' });
    }

    // Get desired format from query parameter (default to PNG)
    const format = (req.query.format || 'png').toLowerCase();
    const allowedFormats = ['png', 'jpg', 'jpeg'];
    
    if (!allowedFormats.includes(format)) {
      return res.status(400).json({ 
        error: 'Invalid format. Supported formats: PNG, JPG, JPEG',
        supportedFormats: allowedFormats
      });
    }

    console.log(`Processing: ${req.file.originalname} (${req.file.size} bytes) to ${format.toUpperCase()}`);

    // Create FormData for Cloudmersive API
    const formData = new FormData();
    formData.append('inputFile', req.file.buffer, {
      filename: req.file.originalname,
      contentType: 'application/pdf'
    });

    // Choose the appropriate Cloudmersive API endpoint based on format
    let apiEndpoint;
    let outputExtension;
    
    if (format === 'png') {
      apiEndpoint = 'https://api.cloudmersive.com/convert/pdf/to/png';
      outputExtension = 'png';
    } else if (format === 'jpg' || format === 'jpeg') {
      apiEndpoint = 'https://api.cloudmersive.com/convert/pdf/to/jpg';
      outputExtension = 'jpg';
    }

    console.log(`Using API endpoint: ${apiEndpoint}`);

    // Call Cloudmersive PDF to Image API
    const response = await axios.post(
      apiEndpoint,
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
    const outputFilename = req.file.originalname.replace(/\.pdf$/i, `.${outputExtension}`);

    console.log(`✅ Conversion successful: ${outputFilename} (${format.toUpperCase()})`);

    res.json({
      success: true,
      filename: outputFilename,
      base64: base64Data,
      originalSize: req.file.size,
      convertedSize: response.data.length,
      format: format.toUpperCase(),
      message: `PDF successfully converted to ${format.toUpperCase()} image`
    });

  } catch (error) {
    console.error('❌ PDF to Image conversion error:', error.message);
    
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

// Backward compatibility - PDF to JPG endpoint
app.post('/api/pdf-to-jpg', upload.single('file'), async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] PDF to JPG conversion requested (legacy endpoint)`);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'File must be a PDF' });
    }

    console.log(`Processing: ${req.file.originalname} (${req.file.size} bytes) - Legacy JPG conversion`);

    // Create FormData for Cloudmersive API
    const formData = new FormData();
    formData.append('inputFile', req.file.buffer, {
      filename: req.file.originalname,
      contentType: 'application/pdf'
    });

    // Call Cloudmersive PDF to JPG API
    const response = await axios.post(
      'https://api.cloudmersive.com/convert/pdf/to/jpg',
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
    const outputFilename = req.file.originalname.replace(/\.pdf$/i, '.jpg');

    console.log(`✅ Conversion successful: ${outputFilename} (Legacy JPG)`);

    res.json({
      success: true,
      filename: outputFilename,
      base64: base64Data,
      originalSize: req.file.size,
      convertedSize: response.data.length,
      format: 'JPG',
      message: 'PDF successfully converted to JPG image (legacy endpoint)',
      note: 'Consider using /api/pdf-to-image?format=jpg for enhanced features'
    });

  } catch (error) {
    console.error('❌ PDF to JPG conversion error:', error.message);
    
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

// Add Watermark to PDF endpoint with pdf-lib
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

// Root endpoint - Backend info page
app.get('/', (req, res) => {
  res.json({
    service: 'PDFINDI Backend API',
    version: '1.0.2',
    status: 'online',
    location: 'Render Cloud',
    endpoints: {
      health: 'GET /api/health',
      pdfToWord: 'POST /api/pdf-to-word',
      wordToPdf: 'POST /api/word-to-pdf',
      compressPdf: 'POST /api/compress-pdf',
      imageToPdf: 'POST /api/image-to-pdf',
      pdfToImage: 'POST /api/pdf-to-image?format=png|jpg|jpeg',
      pdfToJpg: 'POST /api/pdf-to-jpg (legacy)',
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

// PDF Protection endpoint - uses pdf-lib with custom encryption metadata
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
    
    if (userPassword) formData.append('userPassword', userPassword);
    if (ownerPassword) formData.append('ownerPassword', ownerPassword);
    formData.append('allowPrinting', perms.allowPrinting ? 'true' : 'false');
    formData.append('allowFormFill', perms.allowFormFill ? 'true' : 'false');
    formData.append('allowEditingAnnotations', perms.allowEditingAnnotations ? 'true' : 'false');
    formData.append('allowContentExtraction', perms.allowContentExtraction ? 'true' : 'false');
    formData.append('allowEditing', perms.allowEditing ? 'true' : 'false');
    formData.append('encryptionKeyLength', encryptionKeyLength === '256' ? '256' : '128');

    console.log('Calling Cloudmersive API...');
    console.log('API URL: https://api.cloudmersive.com/convert/edit/pdf/encrypt/user-password');
    console.log('API Key (first 10 chars):', CLOUDMERSIVE_API_KEY.substring(0, 10) + '...');
    
    // Call Cloudmersive PDF encryption API
    const response = await axios.post(
      'https://api.cloudmersive.com/convert/edit/pdf/encrypt/user-password',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Apikey': CLOUDMERSIVE_API_KEY
        },
        responseType: 'arraybuffer',
        timeout: 30000,
        validateStatus: function (status) {
          return status < 500; // Accept any status less than 500
        }
      }
    );

    console.log('API Response Status:', response.status);
    console.log('API Response Content-Type:', response.headers['content-type']);
    console.log('API Response Size:', response.data.byteLength, 'bytes');

    // Check if response is actually a PDF
    if (response.status !== 200) {
      const errorText = Buffer.from(response.data).toString('utf8');
      console.error('API Error Response:', errorText.substring(0, 1000));
      throw new Error(`Cloudmersive API error (${response.status}): ${errorText.substring(0, 200)}`);
    }
    
    if (response.headers['content-type'] && !response.headers['content-type'].includes('pdf')) {
      const errorHtml = Buffer.from(response.data).toString('utf8');
      console.error('API returned HTML instead of PDF:', errorHtml.substring(0, 500));
      throw new Error('API returned non-PDF response. Check API key and endpoint.');
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

// Serve static frontend files for any non-API route (should be after all API and error handlers)
app.use(express.static(path.join(__dirname, '../public_html')));

// 404 handler for any other routes (after static)
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: 'This is an API server. Use /api/* endpoints or visit / for API info.'
  });
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
  console.log('   POST /api/pdf-to-image?format=png|jpg|jpeg');
  console.log('   POST /api/pdf-to-jpg (legacy)');
  console.log('   POST /api/ocr-text');
  console.log('   POST /api/protect-pdf');
  console.log('');
  console.log('📁 Frontend: Static files served from public_html/');
  console.log('=====================================');
});
