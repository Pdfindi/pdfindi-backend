/**
 * Universal Agent API — Master Router
 * Mounts all agent sub-routes under /api/*
 * Add new routes here — server.js never needs touching again.
 */
const express = require('express');
const router = express.Router();

const auth = require('./middleware/auth');
const dataRoutes = require('./routes/data');
const actionRoutes = require('./routes/actions');
const siteRoutes = require('./routes/site');
const seoRoutes = require('./routes/seo');

// /api/site/status is public (no auth) — agents use it to check liveness
router.get('/site/status', siteRoutes.status);

// Protect specific Agent API routes rather than global interception
router.use('/data', auth, dataRoutes);
router.use('/action', auth, actionRoutes);
router.use('/site', auth, siteRoutes.router);
router.use('/seo', auth, seoRoutes);

module.exports = router;
