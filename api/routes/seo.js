/**
 * Dedicated SEO Agent API Router
 * Built specifically for SEO AI agents to easily read, inspect, and update metadata
 * for all static pages and tools on PDFINDI without struggling with random IDs.
 *
 * GET    /api/seo          → List all pages with baseline HTML and override metadata
 * GET    /api/seo/:slug    → Get SEO details for a specific page (supports ?url=/path)
 * POST   /api/seo          → Create or update SEO metadata for a page (resolves slug or URL)
 * PUT    /api/seo/:slug    → Update SEO metadata for a specific slug
 * DELETE /api/seo/:slug    → Revert/Delete the dynamic override (falls back to raw HTML)
 */
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../../public_html');
const DATA_DIR = path.join(__dirname, '../../data');
const SEO_DIR = path.join(DATA_DIR, 'seo');

// Ensure SEO override directory exists
function ensureSeoDir() {
  if (!fs.existsSync(SEO_DIR)) {
    fs.mkdirSync(SEO_DIR, { recursive: true });
  }
}

// Helper: Find all HTML files recursively in public_html (ignoring hidden / backup / node_modules)
function findHtmlFiles(dir, baseDir = dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
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

// Helper: Parse original title, description, and keywords directly from HTML markup
function parseHtmlMetadata(filePath) {
  try {
    if (!fs.existsSync(filePath)) return { title: '', description: '', keywords: '' };
    const html = fs.readFileSync(filePath, 'utf8');

    // Parse <title>
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Parse Description meta (robust regex supporting various tag orderings)
    const descRegex = /<meta[^>]*(?:name|property)=["']description["'][^>]*content=["']([^"']*)["']|<meta[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']description["']/i;
    const descMatch = html.match(descRegex);
    const description = descMatch ? (descMatch[1] || descMatch[2] || '').trim() : '';

    // Parse Keywords meta
    const keyRegex = /<meta[^>]*(?:name|property)=["']keywords["'][^>]*content=["']([^"']*)["']|<meta[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']keywords["']/i;
    const keyMatch = html.match(keyRegex);
    const keywords = keyMatch ? (keyMatch[1] || keyMatch[2] || '').trim() : '';

    return { title, description, keywords };
  } catch (err) {
    console.error('Error parsing HTML metadata:', filePath, err.message);
    return { title: '', description: '', keywords: '' };
  }
}

// Helper: Resolves any slug, URL, or filepath back to its actual file & slug
function resolvePage(input) {
  if (!input) return null;
  let clean = input.trim();

  // Strip leading slash
  if (clean.startsWith('/')) clean = clean.slice(1);
  // Strip trailing .html
  if (clean.endsWith('.html')) clean = clean.slice(0, -5);

  const possiblePaths = [
    // 1. If it was already a URL path (e.g. tools/compress-pdf)
    { relPath: clean + '.html', slug: clean.replace(/\//g, '-') },
    // 2. Index fallback
    { relPath: (clean === 'index' || clean === '' ? 'index.html' : clean + '.html'), slug: (clean === 'index' || clean === '' ? 'index' : clean.replace(/\//g, '-')) },
    // 3. If it was a slug (e.g. tools-compress-pdf), convert only the first dash to a slash (e.g. tools/compress-pdf.html)
    { relPath: (clean === 'index' ? 'index.html' : clean.replace('-', '/') + '.html'), slug: clean },
    // 4. If it was a slug, try converting all dashes to slashes (fallback)
    { relPath: (clean === 'index' ? 'index.html' : clean.replace(/-/g, '/') + '.html'), slug: clean }
  ];

  for (const pos of possiblePaths) {
    const fullPath = path.join(PUBLIC_DIR, pos.relPath);
    if (fs.existsSync(fullPath)) {
      return {
        file: pos.relPath,
        slug: pos.slug,
        url: pos.slug === 'index' ? '/' : '/' + pos.relPath.replace(/\.html$/, ''),
        fullPath
      };
    }
  }

  // Final fallback check for absolute exact matching files
  const exactPath = path.join(PUBLIC_DIR, clean.endsWith('.html') ? clean : clean + '.html');
  if (fs.existsSync(exactPath)) {
    const rel = path.relative(PUBLIC_DIR, exactPath).replace(/\\/g, '/');
    return {
      file: rel,
      slug: rel.replace('.html', '').replace(/\//g, '-'),
      url: '/' + rel.replace(/\.html$/, ''),
      fullPath: exactPath
    };
  }

  return null;
}

// ── GET /api/seo ─────────────────────────────────────────────────
// Lists all pages with both original and override/active tags
router.get('/', (req, res) => {
  try {
    ensureSeoDir();
    const files = findHtmlFiles(PUBLIC_DIR);
    
    const pages = files.map(file => {
      const slug = file === 'index.html' ? 'index' : file.replace('.html', '').replace(/\//g, '-');
      const url = file === 'index.html' ? '/' : '/' + file.replace(/\.html$/, '');
      const fullPath = path.join(PUBLIC_DIR, file);

      // Parse raw HTML metadata
      const original = parseHtmlMetadata(fullPath);

      // Fetch override if it exists
      const overridePath = path.join(SEO_DIR, `${slug}.json`);
      let override = null;
      let hasOverride = false;

      if (fs.existsSync(overridePath)) {
        try {
          const content = JSON.parse(fs.readFileSync(overridePath, 'utf8'));
          override = {
            title: content.title || '',
            description: content.description || '',
            keywords: content.keywords || ''
          };
          hasOverride = true;
        } catch (err) {
          console.error(`Failed to parse override JSON for ${slug}:`, err.message);
        }
      }

      return {
        slug,
        url,
        file,
        isToolPage: file.startsWith('tools/'),
        hasOverride,
        original,
        override,
        active: {
          title: (override && override.title) ? override.title : original.title,
          description: (override && override.description) ? override.description : original.description,
          keywords: (override && override.keywords) ? override.keywords : original.keywords
        }
      };
    });

    res.json({
      success: true,
      data: {
        totalPages: pages.length,
        pages
      },
      error: ''
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

// ── GET /api/seo/:slug ───────────────────────────────────────────
// Gets SEO details for a specific page by slug (e.g. tools-compress-pdf)
// Also supports ?url=/tools/compress-pdf in query string
router.get('/:slug', (req, res) => {
  try {
    ensureSeoDir();
    
    let resolved = null;

    // Check if query string URL is passed, otherwise resolve parameter
    if (req.query.url) {
      resolved = resolvePage(req.query.url);
    } else {
      resolved = resolvePage(req.params.slug);
    }

    if (!resolved) {
      return res.status(404).json({
        success: false,
        data: null,
        error: `Could not resolve page by slug/URL: "${req.query.url || req.params.slug}"`
      });
    }

    const original = parseHtmlMetadata(resolved.fullPath);
    const overridePath = path.join(SEO_DIR, `${resolved.slug}.json`);
    let override = null;
    let hasOverride = false;

    if (fs.existsSync(overridePath)) {
      try {
        override = JSON.parse(fs.readFileSync(overridePath, 'utf8'));
        hasOverride = true;
      } catch (err) {
        console.error(`Failed to read override JSON for ${resolved.slug}:`, err.message);
      }
    }

    res.json({
      success: true,
      data: {
        slug: resolved.slug,
        url: resolved.url,
        file: resolved.file,
        hasOverride,
        original,
        override,
        active: {
          title: (override && override.title) ? override.title : original.title,
          description: (override && override.description) ? override.description : original.description,
          keywords: (override && override.keywords) ? override.keywords : original.keywords
        }
      },
      error: ''
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

// ── POST /api/seo ────────────────────────────────────────────────
// Upsert SEO overrides. Accepts 'slug' or 'url' in payload body
router.post('/', (req, res) => {
  try {
    ensureSeoDir();
    const { slug, url, title, description, keywords } = req.body;

    const queryInput = slug || url;
    if (!queryInput) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Missing identifier in body. Please provide either "slug" or "url".'
      });
    }

    const resolved = resolvePage(queryInput);
    if (!resolved) {
      return res.status(404).json({
        success: false,
        data: null,
        error: `Could not resolve a matching HTML page for identifier: "${queryInput}"`
      });
    }

    const targetFile = path.join(SEO_DIR, `${resolved.slug}.json`);
    const original = parseHtmlMetadata(resolved.fullPath);

    const override = {
      id: resolved.slug,
      type: 'seo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: title !== undefined ? title : (original.title || ''),
      description: description !== undefined ? description : (original.description || ''),
      keywords: keywords !== undefined ? keywords : (original.keywords || '')
    };

    // If file already exists, preserve createdAt
    if (fs.existsSync(targetFile)) {
      try {
        const existing = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
        override.createdAt = existing.createdAt || override.createdAt;
      } catch {}
    }

    fs.writeFileSync(targetFile, JSON.stringify(override, null, 2), 'utf8');

    res.json({
      success: true,
      data: {
        slug: resolved.slug,
        url: resolved.url,
        file: resolved.file,
        override,
        active: {
          title: override.title,
          description: override.description,
          keywords: override.keywords
        }
      },
      error: ''
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

// ── PUT /api/seo/:slug ───────────────────────────────────────────
// Directly updates SEO by slug (equivalent to POST /api/seo but with slug in URL)
router.put('/:slug', (req, res) => {
  try {
    ensureSeoDir();
    const targetSlug = req.params.slug;
    const resolved = resolvePage(targetSlug);

    if (!resolved) {
      return res.status(404).json({
        success: false,
        data: null,
        error: `Could not resolve page by slug: "${targetSlug}"`
      });
    }

    const targetFile = path.join(SEO_DIR, `${resolved.slug}.json`);
    const original = parseHtmlMetadata(resolved.fullPath);

    let existing = {};
    if (fs.existsSync(targetFile)) {
      try {
        existing = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
      } catch {}
    }

    const { title, description, keywords } = req.body;
    
    const override = {
      id: resolved.slug,
      type: 'seo',
      createdAt: existing.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: title !== undefined ? title : (existing.title !== undefined ? existing.title : original.title),
      description: description !== undefined ? description : (existing.description !== undefined ? existing.description : original.description),
      keywords: keywords !== undefined ? keywords : (existing.keywords !== undefined ? existing.keywords : original.keywords)
    };

    fs.writeFileSync(targetFile, JSON.stringify(override, null, 2), 'utf8');

    res.json({
      success: true,
      data: {
        slug: resolved.slug,
        url: resolved.url,
        file: resolved.file,
        override,
        active: {
          title: override.title,
          description: override.description,
          keywords: override.keywords
        }
      },
      error: ''
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

// ── DELETE /api/seo/:slug ────────────────────────────────────────
// Deletes SEO overrides and resets to baseline HTML metadata
router.delete('/:slug', (req, res) => {
  try {
    ensureSeoDir();
    const resolved = resolvePage(req.params.slug);

    if (!resolved) {
      return res.status(404).json({
        success: false,
        data: null,
        error: `Could not resolve page by slug: "${req.params.slug}"`
      });
    }

    const targetFile = path.join(SEO_DIR, `${resolved.slug}.json`);

    if (!fs.existsSync(targetFile)) {
      return res.status(404).json({
        success: false,
        data: null,
        error: `No SEO override found for: "${resolved.slug}"`
      });
    }

    fs.unlinkSync(targetFile);

    const baseline = parseHtmlMetadata(resolved.fullPath);

    res.json({
      success: true,
      data: {
        slug: resolved.slug,
        url: resolved.url,
        deleted: true,
        active: baseline
      },
      error: ''
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

module.exports = router;
