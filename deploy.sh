#!/bin/bash

echo "🚀 PDFINDI FREE BACKEND DEPLOYMENT"
echo "=================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""

# Navigate to backend directory
cd backend

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🚀 Deploying to Vercel..."
echo "   This will:"
echo "   - Create a free Vercel account (if needed)"
echo "   - Deploy your backend API"
echo "   - Give you a free .vercel.app URL"
echo ""

vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy the deployment URL from above"
echo "2. Update API_BASE in your frontend files"
echo "3. Test your compression tool!"
echo ""
echo "💰 Cost: $0 (completely free)"
echo "📊 Limits: 100,000 calls/month, 100GB bandwidth"
echo ""
