// Simple local test server to test our API endpoints with frontend
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve static files from public_html
app.use(express.static(path.join(__dirname, '..', 'public_html')));

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store in memory for processing
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Set environment variable for testing
process.env.CLOUDMERSIVE_API_KEY = 'e46637bc-d958-473f-a8cf-6fc6f4e1ef2f';

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'PDFINDI Backend (Local)',
    environment: 'development'
  });
});

// Word to PDF endpoint (simplified for testing)
app.post('/api/word-to-pdf', upload.single('file'), async (req, res) => {
  try {
    console.log('Word to PDF request received');
    console.log('File:', req.file ? req.file.originalname : 'No file');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // For testing, return a mock successful response
    res.json({
      filename: req.file.originalname.replace(/\.(doc|docx|rtf|odt)$/i, '.pdf'),
      base64: 'JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwKL0xlbmd0aCAzIDA', // Mock PDF base64
      message: 'LOCAL TEST: Word to PDF conversion simulated'
    });
  } catch (error) {
    console.error('Word to PDF error:', error);
    res.status(500).json({ error: 'Conversion failed', details: error.message });
  }
});

// PDF to Word endpoint (simplified for testing)
app.post('/api/pdf-to-word', upload.single('file'), async (req, res) => {
  try {
    console.log('PDF to Word request received');
    console.log('File:', req.file ? req.file.originalname : 'No file');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // For testing, return a mock successful response
    res.json({
      success: true,
      filename: req.file.originalname.replace(/\.pdf$/i, '.docx'),
      base64: 'UEsDBBQABgAIAAAAIQDfpNJsWgEAACAFAAA', // Mock DOCX base64
      originalSize: req.file.size,
      message: 'LOCAL TEST: PDF to Word conversion simulated'
    });
  } catch (error) {
    console.error('PDF to Word error:', error);
    res.status(500).json({ error: 'Conversion failed', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Local server running at http://localhost:${port}`);
  console.log('📁 Frontend available at: http://localhost:3000/tools/pdf-to-word.html');
  console.log('📁 Word to PDF at: http://localhost:3000/tools/word-to-pdf.html');
  console.log('🔧 API endpoints:');
  console.log('   - GET  /api/health');
  console.log('   - POST /api/word-to-pdf');
  console.log('   - POST /api/pdf-to-word');
  console.log('💡 Upload test files to see if the frontend integration works!');
});
