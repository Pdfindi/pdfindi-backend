/**
 * Action: generate-sitemap
 * Scans all HTML pages and rebuilds /public_html/sitemap.xml
 *
 * Usage: POST /api/action/generate-sitemap
 * Body (optional): { "baseUrl": "https://pdfindi.com" }
 */
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../../public_html');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');
const BASE_URL = 'https://pdfindi.com';

function findHtmlFiles(dir, baseDir = dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      results = results.concat(findHtmlFiles(fullPath, baseDir));
    } else if (entry.name.endsWith('.html') && entry.name !== '404.html') {
      results.push(path.relative(baseDir, fullPath).replace(/\\/g, '/'));
    }
  }
  return results;
}

async function run(params) {
  const baseUrl = params.baseUrl || BASE_URL;
  const files = findHtmlFiles(PUBLIC_DIR);
  const today = new Date().toISOString().split('T')[0];

  // Priority rules
  const getPriority = (file) => {
    if (file === 'index.html') return '1.0';
    if (file.startsWith('tools/')) return '0.9';
    if (file.startsWith('blog/')) return '0.7';
    return '0.5';
  };

  const getChangefreq = (file) => {
    if (file === 'index.html') return 'weekly';
    if (file.startsWith('tools/')) return 'monthly';
    if (file.startsWith('blog/')) return 'weekly';
    return 'monthly';
  };

  const urls = files.map(file => {
    const urlPath = '/' + file.replace(/\.html$/, '');
    const loc = urlPath === '/index' ? baseUrl + '/' : baseUrl + urlPath;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${getChangefreq(file)}</changefreq>
    <priority>${getPriority(file)}</priority>
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf8');

  return {
    message: `Sitemap generated with ${files.length} URLs.`,
    path: SITEMAP_PATH,
    urlCount: files.length,
    generatedAt: new Date().toISOString()
  };
}

module.exports = { run };
