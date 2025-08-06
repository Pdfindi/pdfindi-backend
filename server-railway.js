// Production Express server for Railway deployment
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all origins (adjust for production security)
app.use(cors({
  origin: ['https://pdfindi.com', 'http://localhost:3000', 'https://*.vercel.app'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// API Key from environment variable
const CLOUDMERSIVE_API_KEY = process.env.CLOUDMERSIVE_API_KEY || 'e46637bc-d958-473f-a8cf-6fc6f4e1ef2f';

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'PDFINDI Backend',
    environment: process.env.NODE_ENV || 'production',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'PDFINDI Backend API',
    endpoints: [
      'GET /api/health - Health check',
      'POST /api/pdf-to-word - Convert PDF to Word',
      'POST /api/word-to-pdf - Convert Word to PDF'
    ],
    version: '1.0.0'
  });
});

// PDF to Word conversion endpoint
app.post('/api/pdf-to-word', upload.single('file'), async (req, res) => {
  try {
    console.log('PDF to Word request received');
    console.log('File:', req.file ? req.file.originalname : 'No file');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file type
    if (!req.file.mimetype.includes('pdf') && !req.file.originalname.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({ error: 'File must be a PDF' });
    }

    // Create FormData for Cloudmersive API
    const formData = new FormData();
    formData.append('inputFile', req.file.buffer, {
      filename: req.file.originalname,
      contentType: 'application/pdf'
    });

    // Call Cloudmersive API
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

    res.json({
      filename: outputFilename,
      base64: base64Data,
      message: 'PDF converted to Word successfully',
      size: response.data.length
    });

  } catch (error) {
    console.error('PDF to Word conversion error:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({ 
        error: `Cloudmersive API Error: ${error.response.status}`,
        details: error.response.data?.toString() || 'Unknown API error'
      });
    }
    
    res.status(500).json({ 
      error: 'Conversion failed',
      details: error.message 
    });
  }
});

// Word to PDF conversion endpoint
app.post('/api/word-to-pdf', upload.single('file'), async (req, res) => {
  try {
    console.log('Word to PDF request received');
    console.log('File:', req.file ? req.file.originalname : 'No file');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file type
    const validExtensions = ['.doc', '.docx', '.rtf', '.odt'];
    const fileExt = req.file.originalname.toLowerCase().substring(req.file.originalname.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExt)) {
      return res.status(400).json({ error: 'File must be a Word document (.doc, .docx, .rtf, .odt)' });
    }

    // Create FormData for Cloudmersive API
    const formData = new FormData();
    formData.append('inputFile', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Call Cloudmersive API
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
    const outputFilename = req.file.originalname.replace(/\.(doc|docx|rtf|odt)$/i, '.pdf');

    res.json({
      filename: outputFilename,
      base64: base64Data,
      message: 'Word converted to PDF successfully',
      size: response.data.length
    });

  } catch (error) {
    console.error('Word to PDF conversion error:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({ 
        error: `Cloudmersive API Error: ${error.response.status}`,
        details: error.response.data?.toString() || 'Unknown API error'
      });
    }
    
    res.status(500).json({ 
      error: 'Conversion failed',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 PDFINDI Backend running on port ${port}`);
  console.log(`📁 Health check: http://localhost:${port}/api/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔑 API Key configured: ${CLOUDMERSIVE_API_KEY ? 'Yes' : 'No'}`);
});

module.exports = app;
