// Free serverless function for PDF to JPG conversion
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
    const { pdfBase64 } = req.body;
    
    if (!pdfBase64) {
      return res.status(400).json({ error: 'No PDF data provided' });
    }

    // Convert base64 to buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    
    // Load PDF
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pageCount = pdfDoc.getPageCount();
    
    // For serverless, we'll extract first page only (due to memory limits)
    const images = [];
    
    // Extract first page as an example
    const firstPage = pdfDoc.getPage(0);
    const { width, height } = firstPage.getSize();
    
    // Create a new PDF with just this page for conversion
    const singlePagePdf = await PDFDocument.create();
    const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [0]);
    singlePagePdf.addPage(copiedPage);
    
    const singlePageBytes = await singlePagePdf.save();
    
    // Note: Actual image conversion would require additional libraries
    // For now, return the page info for demonstration
    images.push({
      pageNumber: 1,
      width,
      height,
      // In real implementation, this would be the actual image data
      imageBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/wAAlgAB/9k='
    });
    
    res.status(200).json({
      success: true,
      pageCount,
      images,
      note: 'This is a demonstration. Full implementation requires additional image processing libraries.'
    });
    
  } catch (error) {
    console.error('PDF to JPG conversion error:', error);
    res.status(500).json({ 
      error: 'Failed to convert PDF to JPG',
      details: error.message 
    });
  }
}
