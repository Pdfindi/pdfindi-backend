// PDF to Word conversion for Vercel - handles FormData without dependencies
import axios from 'axios';
import FormData from 'form-data';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check API key
    const apiKey = process.env.CLOUDMERSIVE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Check if it's multipart form data
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Content-Type must be multipart/form-data' });
    }

    // Collect the raw body
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    
    await new Promise((resolve, reject) => {
      req.on('end', resolve);
      req.on('error', reject);
    });
    
    const body = Buffer.concat(chunks);
    
    if (body.length === 0) {
      return res.status(400).json({ error: 'No data received' });
    }

    // Extract boundary from content-type
    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) {
      return res.status(400).json({ error: 'Invalid multipart data' });
    }
    
    const boundary = boundaryMatch[1];
    const textBody = body.toString('binary');
    
    // Find the file part in multipart data
    const parts = textBody.split(`--${boundary}`);
    let fileBuffer = null;
    let filename = 'upload.pdf';
    
    for (const part of parts) {
      if (part.includes('Content-Disposition: form-data') && part.includes('filename=')) {
        // Extract filename
        const filenameMatch = part.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
        
        // Find the start of binary data (after double CRLF)
        const dataStart = part.indexOf('\r\n\r\n');
        if (dataStart !== -1) {
          // Extract binary data (everything from dataStart+4 to the last CRLF before boundary)
          const binaryData = part.substring(dataStart + 4);
          const endMarker = binaryData.lastIndexOf('\r\n');
          const cleanData = endMarker > 0 ? binaryData.substring(0, endMarker) : binaryData;
          
          fileBuffer = Buffer.from(cleanData, 'binary');
          break;
        }
      }
    }
    
    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({ error: 'No valid file found in upload' });
    }

    // Create FormData for Cloudmersive API
    const formData = new FormData();
    formData.append('inputFile', fileBuffer, {
      filename: filename,
      contentType: 'application/pdf'
    });

    // Call Cloudmersive API
    const response = await axios.post(
      'https://api.cloudmersive.com/convert/pdf/to/docx',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Apikey': apiKey
        },
        responseType: 'arraybuffer',
        timeout: 30000
      }
    );

    // Convert response to base64 for frontend compatibility
    const base64Data = Buffer.from(response.data).toString('base64');
    const outputFilename = filename.replace(/\.pdf$/i, '.docx');

    // Return in the format expected by frontend
    res.status(200).json({
      base64: base64Data,
      filename: outputFilename,
      message: 'PDF converted to Word successfully'
    });

  } catch (error) {
    console.error('Conversion error:', error);
    
    if (error.response) {
      return res.status(error.response.status).json({ 
        error: `API Error: ${error.response.status}`,
        details: error.response.data?.toString() || 'Unknown API error'
      });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
        const fileStream = fs.createReadStream(file.filepath);
        const formData = new FormData();
        formData.append('file', fileStream, file.originalFilename);

        const response = await axios.post(
          'https://api.cloudmersive.com/convert/pdf/to/docx',
          formData,
          {
            headers: {
              'Apikey': apiKey,
              ...formData.getHeaders()
            },
            responseType: 'arraybuffer'
          }
        );
        const docxBase64 = Buffer.from(response.data).toString('base64');
        res.status(200).json({
          filename: file.originalFilename.replace(/\.pdf$/i, '.docx'),
          base64: docxBase64
        });
        resolve();
      } catch (err) {
        res.status(500).json({ error: 'Conversion failed', details: err.message });
        resolve();
      }
    });
  });
}
