// Health check endpoint for Vercel serverless function
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'PDFINDI Backend'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
