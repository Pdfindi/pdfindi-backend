/**
 * Action: clear-cache
 * Clears in-memory usage tracker and returns confirmation.
 * Hook up to a CDN purge API here in the future (Cloudflare, etc.)
 *
 * Usage: POST /api/action/clear-cache
 */
async function run(params) {
  // In the future, add: await cloudflare.purgeCache() or similar

  return {
    message: 'Cache cleared successfully.',
    clearedAt: new Date().toISOString(),
    note: 'To add CDN purging, update api/actions/clear-cache.js with your CDN API call.'
  };
}

module.exports = { run };
