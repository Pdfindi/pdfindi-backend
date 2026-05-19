/**
 * Site Info Routes
 * Helps agents understand the structure of the PDFIndi website.
 *
 * GET /api/site/status  → public health check (no auth)
 * GET /api/site/pages   → all pages on the website (auth required)
 */
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../../public_html');
const TOOLS_DIR = path.join(PUBLIC_DIR, 'tools');

// Recursively find all .html files under a directory
function findHtmlFiles(dir, baseDir = dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip hidden dirs, node_modules, and backup/versioned dirs (e.g. tools.75, blog.5890)
      const isBackup = /\.\d+$/.test(entry.name);
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules' && !isBackup) {
        results = results.concat(findHtmlFiles(fullPath, baseDir));
      }
    } else if (entry.name.endsWith('.html') && entry.name !== '404.html') {
      results.push(path.relative(baseDir, fullPath).replace(/\\/g, '/'));
    }
  }
  return results;
}

// ── PUBLIC: Health check ─────────────────────────────────────────
// Exported separately so api/index.js can mount it without auth
function statusHandler(req, res) {
  res.json({
    success: true,
    data: {
      status: 'ok',
      service: 'PDFIndi Agent API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: Math.floor(process.uptime()) + 's',
      timestamp: new Date().toISOString()
    },
    error: ''
  });
}

// ── PROTECTED: List all pages ────────────────────────────────────
router.get('/pages', (req, res) => {
  try {
    const htmlFiles = findHtmlFiles(PUBLIC_DIR);

    const pages = htmlFiles.map(file => {
      const urlPath = '/' + file.replace(/\.html$/, '');
      return {
        file,
        url: urlPath,
        isToolPage: file.startsWith('tools/'),
        fullUrl: `https://pdfindi.com${urlPath}`
      };
    });

    // Also include tool JS files for reference
    const toolJsFiles = fs.existsSync(path.join(TOOLS_DIR, 'js'))
      ? fs.readdirSync(path.join(TOOLS_DIR, 'js')).filter(f => f.endsWith('.js'))
      : [];

    res.json({
      success: true,
      data: {
        totalPages: pages.length,
        toolPages: pages.filter(p => p.isToolPage).length,
        otherPages: pages.filter(p => !p.isToolPage).length,
        pages,
        toolScripts: toolJsFiles
      },
      error: ''
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

module.exports = {
  status: statusHandler,
  router
};
