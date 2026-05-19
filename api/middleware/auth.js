/**
 * Auth Middleware — Bearer Token Validation
 * All protected routes use this middleware.
 * Set AGENT_API_KEY in your .env file.
 */
module.exports = function auth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Missing Authorization header. Use: Authorization: Bearer <AGENT_API_KEY>'
    });
  }

  if (token !== process.env.AGENT_API_KEY) {
    return res.status(403).json({
      success: false,
      data: null,
      error: 'Invalid API key.'
    });
  }

  next();
};
