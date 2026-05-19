/**
 * Action: send-email
 * Sends an email using the existing Nodemailer config from server.js .env
 *
 * Usage: POST /api/action/send-email
 * Body: {
 *   "to": "recipient@example.com",
 *   "subject": "Hello from PDFIndi Agent",
 *   "html": "<p>Email body here</p>",
 *   "text": "Plain text fallback (optional)"
 * }
 */
const nodemailer = require('nodemailer');

async function run(params) {
  const { to, subject, html, text } = params;

  if (!to || !subject || !html) {
    throw new Error('Missing required fields: to, subject, html');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const info = await transporter.sendMail({
    from: `"PDFIndi" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, '') // strip HTML for plain text fallback
  });

  return {
    message: 'Email sent successfully.',
    messageId: info.messageId,
    to,
    subject,
    sentAt: new Date().toISOString()
  };
}

module.exports = { run };
