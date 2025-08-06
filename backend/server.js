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
    version: '1.0.0'
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

// Image to PDF conversion endpoint - Fixed for deployment
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

// PDF to JPG conversion endpoint
app.post('/api/pdf-to-jpg', upload.single('file'), async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] PDF to JPG conversion requested`);
    
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

    // Call Cloudmersive PDF to PNG API (which we'll convert to JPG)
    const response = await axios.post(
      'https://api.cloudmersive.com/convert/pdf/to/png',
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
    const outputFilename = req.file.originalname.replace(/\.pdf$/i, '.png');

    console.log(`✅ Conversion successful: ${outputFilename}`);

    res.json({
      success: true,
      filename: outputFilename,
      base64: base64Data,
      originalSize: req.file.size,
      convertedSize: response.data.length,
      message: 'PDF successfully converted to image',
      format: 'PNG'
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

// Root endpoint - Backend info page
app.get('/', (req, res) => {
  res.json({
    service: 'PDFINDI Backend API',
    version: '1.0.0',
    status: 'online',
    location: 'Render Cloud',
    endpoints: {
      health: 'GET /api/health',
      pdfToWord: 'POST /api/pdf-to-word',
      wordToPdf: 'POST /api/word-to-pdf',
      compressPdf: 'POST /api/compress-pdf',
      imageToPdf: 'POST /api/image-to-pdf',
      pdfToJpg: 'POST /api/pdf-to-jpg',
      ocrText: 'POST /api/ocr-text'
    },
    documentation: 'API endpoints accept multipart/form-data with file uploads',
    limits: {
      maxFileSize: '50MB',
      timeout: '30 seconds',
      allowedTypes: ['PDF', 'DOC', 'DOCX', 'RTF', 'JPEG', 'PNG', 'GIF', 'BMP', 'TIFF', 'WebP']
    }
  });
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
  console.log('   POST /api/pdf-to-jpg');
  console.log('   POST /api/ocr-text');
  console.log('');
  console.log('📁 Frontend: Static files served from public_html/');
  console.log('=====================================');
});
