// Free serverless function for PDF compression
import { PDFDocument } from 'pdf-lib';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get base64 PDF from request
    const { pdfBase64 } = req.body;
    
    if (!pdfBase64) {
      return res.status(400).json({ error: 'No PDF data provided' });
    }

    // Convert base64 to buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    
    // Load PDF with pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    // Basic compression: remove metadata and optimize
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('PDFINDI');
    pdfDoc.setCreator('PDFINDI');
    
    // Save with optimization
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false
    });
    
    // Convert back to base64
    const compressedBase64 = Buffer.from(compressedPdfBytes).toString('base64');
    
    // Calculate compression ratio
    const originalSize = pdfBuffer.length;
    const compressedSize = compressedPdfBytes.length;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    res.status(200).json({
      success: true,
      compressedPdf: compressedBase64,
      originalSize,
      compressedSize,
      compressionRatio: `${compressionRatio}%`
    });
    
  } catch (error) {
    console.error('PDF compression error:', error);
    res.status(500).json({ 
      error: 'Failed to compress PDF',
      details: error.message 
    });
  }
}
