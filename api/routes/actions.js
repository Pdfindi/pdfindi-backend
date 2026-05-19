/**
 * Actions Router
 * POST /api/action/:name  → run any named action
 *
 * To add a new action: drop a file in /api/actions/<name>.js
 * that exports: async function run(params, req) {}
 * No changes needed here — auto-discovery!
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const ACTIONS_DIR = path.join(__dirname, '../actions');

router.post('/:name', async (req, res) => {
  const actionName = req.params.name;
  const actionFile = path.join(ACTIONS_DIR, `${actionName}.js`);

  if (!fs.existsSync(actionFile)) {
    return res.status(404).json({
      success: false,
      data: null,
      error: `Action "${actionName}" not found. Available actions: ${getAvailableActions()}`
    });
  }

  try {
    // Clear require cache so new actions can be added without server restart
    delete require.cache[require.resolve(actionFile)];
    const action = require(actionFile);

    if (typeof action.run !== 'function') {
      return res.status(500).json({
        success: false,
        data: null,
        error: `Action "${actionName}" must export a run() function.`
      });
    }

    const result = await action.run(req.body || {}, req);
    res.json({ success: true, data: result, error: '' });

  } catch (err) {
    console.error(`[Action Error] ${actionName}:`, err.message);
    res.status(500).json({ success: false, data: null, error: err.message });
  }
});

function getAvailableActions() {
  if (!fs.existsSync(ACTIONS_DIR)) return 'none';
  return fs.readdirSync(ACTIONS_DIR)
    .filter(f => f.endsWith('.js'))
    .map(f => f.replace('.js', ''))
    .join(', ');
}

module.exports = router;
