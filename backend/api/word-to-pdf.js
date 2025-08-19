// Demo serverless function for Word to PDF conversion
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Cloudmersive API key (set as environment variable for security)
  const apiKey = process.env.CLOUDMERSIVE_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Cloudmersive API key not set' });
    return;
  }

  // Parse file upload using formidable
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).json({ error: 'Content-Type must be multipart/form-data' });
    return;
  }

  const formidable = require('formidable');
  const axios = require('axios');
  const FormData = require('form-data');

  const form = new formidable.IncomingForm();
  form.maxFileSize = 50 * 1024 * 1024; // 50MB

  await new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400).json({ error: 'File upload error', details: err.message });
        return reject();
      }
      const file = files.file;
      if (!file) {
        res.status(400).json({ error: 'No file uploaded' });
        return resolve();
      }
      try {
        const fs = require('fs');
        const fileStream = fs.createReadStream(file.filepath);
        const formData = new FormData();
        formData.append('file', fileStream, file.originalFilename);

        const response = await axios.post(
          'https://api.cloudmersive.com/convert/docx/to/pdf',
          formData,
          {
            headers: {
              'Apikey': apiKey,
              ...formData.getHeaders()
            },
            responseType: 'arraybuffer'
          }
        );
        const pdfBase64 = Buffer.from(response.data).toString('base64');
        res.status(200).json({
          filename: file.originalFilename.replace(/\.(docx?|rtf|odt)$/i, '.pdf'),
          base64: pdfBase64
        });
        resolve();
      } catch (err) {
        res.status(500).json({ error: 'Conversion failed', details: err.message });
        resolve();
      }
    });
  });
}
