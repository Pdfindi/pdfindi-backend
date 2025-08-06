// Direct test of our API functions
require('dotenv').config();

// Mock request and response objects
function createMockResponse() {
  const response = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader: function(key, value) {
      this.headers[key] = value;
    },
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.body = JSON.stringify(data);
      console.log(`Response ${this.statusCode}:`, data);
      return this;
    },
    end: function() {
      console.log(`Response ${this.statusCode} ended`);
      return this;
    }
  };
  return response;
}

async function testHealthEndpoint() {
  console.log('\n=== Testing Health Endpoint ===');
  
  // Import health function
  const healthModule = require('./api/health.js');
  const healthHandler = healthModule.default || healthModule;
  
  const mockReq = {
    method: 'GET',
    headers: {}
  };
  
  const mockRes = createMockResponse();
  
  try {
    await healthHandler(mockReq, mockRes);
    console.log('✅ Health endpoint test completed');
  } catch (error) {
    console.error('❌ Health endpoint test failed:', error);
  }
}

async function testWordToPdfEndpoint() {
  console.log('\n=== Testing Word to PDF Endpoint ===');
  
  // Test with JSON (should get content-type error)
  const wordToPdfModule = require('./api/word-to-pdf.js');
  const wordToPdfHandler = wordToPdfModule.default || wordToPdfModule;
  
  const mockReq = {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    }
  };
  
  const mockRes = createMockResponse();
  
  try {
    await wordToPdfHandler(mockReq, mockRes);
    console.log('✅ Word to PDF endpoint test completed');
  } catch (error) {
    console.error('❌ Word to PDF endpoint test failed:', error);
  }
}

async function testPdfToWordEndpoint() {
  console.log('\n=== Testing PDF to Word Endpoint ===');
  
  // Test with JSON (should get content-type error)
  const pdfToWordModule = require('./api/pdf-to-word.js');
  const pdfToWordHandler = pdfToWordModule.default || pdfToWordModule;
  
  const mockReq = {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    }
  };
  
  const mockRes = createMockResponse();
  
  try {
    await pdfToWordHandler(mockReq, mockRes);
    console.log('✅ PDF to Word endpoint test completed');
  } catch (error) {
    console.error('❌ PDF to Word endpoint test failed:', error);
  }
}

async function runAllTests() {
  console.log('🧪 Starting Local API Tests...');
  console.log('Environment API Key present:', !!process.env.CLOUDMERSIVE_API_KEY);
  
  await testHealthEndpoint();
  await testWordToPdfEndpoint();
  await testPdfToWordEndpoint();
  
  console.log('\n🏁 All tests completed!');
}

runAllTests().catch(console.error);
