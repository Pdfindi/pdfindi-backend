/**
 * Universal CRUD Routes
 * Works for ANY content type: blog, faq, meta, pages, tickets, etc.
 * Data is stored as JSON files in /data/:type/:id.json
 *
 * GET    /api/data/:type          → list all
 * GET    /api/data/:type/:id      → read one
 * POST   /api/data/:type          → create (auto UUID + timestamps)
 * PUT    /api/data/:type/:id      → update (partial merge)
 * DELETE /api/data/:type/:id      → delete
 */
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

// Ensure a type folder exists, creating it if needed
function ensureTypeDir(type) {
  const dir = path.join(DATA_DIR, type);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

// Generate a simple unique ID: timestamp + random suffix
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── LIST all items of a type ────────────────────────────────────
router.get('/:type', (req, res) => {
  try {
    const dir = ensureTypeDir(req.params.type);
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    const items = files.map(f => {
      try {
        return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      } catch {
        return null;
      }
    }).filter(Boolean);

    // Sort by createdAt descending (newest first)
    items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    res.json({ success: true, data: items, error: '' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

// ── READ one item ───────────────────────────────────────────────
router.get('/:type/:id', (req, res) => {
  try {
    const filePath = path.join(DATA_DIR, req.params.type, `${req.params.id}.json`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, data: null, error: 'Item not found.' });
    }
    const item = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json({ success: true, data: item, error: '' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

// ── CREATE new item ─────────────────────────────────────────────
router.post('/:type', (req, res) => {
  try {
    const dir = ensureTypeDir(req.params.type);
    const id = generateId();
    const now = new Date().toISOString();
    const item = {
      id,
      type: req.params.type,
      createdAt: now,
      updatedAt: now,
      ...req.body
    };
    fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(item, null, 2), 'utf8');
    res.status(201).json({ success: true, data: item, error: '' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

// ── UPDATE item (partial merge) ─────────────────────────────────
router.put('/:type/:id', (req, res) => {
  try {
    const filePath = path.join(DATA_DIR, req.params.type, `${req.params.id}.json`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, data: null, error: 'Item not found.' });
    }
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const updated = {
      ...existing,
      ...req.body,
      id: existing.id,           // never allow ID to change
      type: existing.type,        // never allow type to change
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf8');
    res.json({ success: true, data: updated, error: '' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

// ── DELETE item ─────────────────────────────────────────────────
router.delete('/:type/:id', (req, res) => {
  try {
    const filePath = path.join(DATA_DIR, req.params.type, `${req.params.id}.json`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, data: null, error: 'Item not found.' });
    }
    fs.unlinkSync(filePath);
    res.json({ success: true, data: { id: req.params.id, deleted: true }, error: '' });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

module.exports = router;
