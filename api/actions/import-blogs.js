/**
 * Action: import-blogs
 * Scans public_html/blog/ for .html files and imports them into the Agent API JSON store.
 * 
 * Usage: POST /api/action/import-blogs
 */
const fs = require('fs');
const path = require('path');

const BLOG_HTML_DIR = path.join(__dirname, '../../public_html/blog');
const BLOG_DATA_DIR = path.join(__dirname, '../../data/blog');

// Helper to extract content between tags
function extractTag(html, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : '';
}

// Helper to extract meta description
function extractMeta(html, name) {
  const regex = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : '';
}

async function run() {
  if (!fs.existsSync(BLOG_HTML_DIR)) {
    throw new Error('Public blog directory not found.');
  }

  if (!fs.existsSync(BLOG_DATA_DIR)) {
    fs.mkdirSync(BLOG_DATA_DIR, { recursive: true });
  }

  const files = fs.readdirSync(BLOG_HTML_DIR).filter(f => f.endsWith('.html'));
  const imported = [];

  for (const file of files) {
    const html = fs.readFileSync(path.join(BLOG_HTML_DIR, file), 'utf8');
    
    // Check if already imported (based on filename/slug)
    const slug = file.replace('.html', '');
    const existingFiles = fs.readdirSync(BLOG_DATA_DIR);
    const isAlreadyImported = existingFiles.some(ef => {
      const content = JSON.parse(fs.readFileSync(path.join(BLOG_DATA_DIR, ef), 'utf8'));
      return content.slug === slug;
    });

    if (isAlreadyImported) continue;

    const title = extractTag(html, 'title').replace(' - PDFIndi', '') || slug.replace(/-/g, ' ');
    const description = extractMeta(html, 'description');
    
    // Simple content extraction: just grab the first <h1> and first few <p>s
    const h1 = extractTag(html, 'h1');
    const firstP = extractTag(html, 'p');

    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const now = new Date().toISOString();

    const blogData = {
      id,
      type: 'blog',
      slug,
      title: title || h1,
      summary: description || firstP.substring(0, 200),
      originalFile: `/blog/${file}`,
      status: 'published',
      createdAt: now,
      updatedAt: now
    };

    fs.writeFileSync(
      path.join(BLOG_DATA_DIR, `${id}.json`), 
      JSON.stringify(blogData, null, 2), 
      'utf8'
    );
    
    imported.push(blogData.title);
  }

  return {
    message: `Import complete. Found ${files.length} files, imported ${imported.length} new entries.`,
    importedItems: imported,
    totalInDatabase: fs.readdirSync(BLOG_DATA_DIR).filter(f => f.endsWith('.json')).length
  };
}

module.exports = { run };
