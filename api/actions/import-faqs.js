/**
 * Action: import-faqs
 * Scans faq.html and imports them into the Agent API JSON store.
 */
const fs = require('fs');
const path = require('path');

const FAQ_HTML_PATH = path.join(__dirname, '../../public_html/faq.html');
const FAQ_DATA_DIR = path.join(__dirname, '../../data/faq');

async function run() {
  if (!fs.existsSync(FAQ_HTML_PATH)) throw new Error('faq.html not found.');
  if (!fs.existsSync(FAQ_DATA_DIR)) fs.mkdirSync(FAQ_DATA_DIR, { recursive: true });

  const html = fs.readFileSync(FAQ_HTML_PATH, 'utf8');
  
  // Find the faq-content div
  const startIdx = html.indexOf('<div class="faq-content">');
  const endIdx = html.indexOf('<div class="contact-cta">');
  if (startIdx === -1) throw new Error('Could not find faq-content container.');
  
  const faqContent = html.substring(startIdx, endIdx === -1 ? html.length : endIdx);
  
  // Split by faq-item
  const blocks = faqContent.split('<div class="faq-item">').slice(1);
  const imported = [];
  
  const existingFiles = fs.readdirSync(FAQ_DATA_DIR);
  const existingQuestions = existingFiles.map(ef => {
    return JSON.parse(fs.readFileSync(path.join(FAQ_DATA_DIR, ef), 'utf8')).question;
  });

  for (let block of blocks) {
    // Extract Question
    const qStart = block.indexOf('<div class="faq-question">');
    const qEnd = block.indexOf('</div>', qStart);
    if (qStart === -1 || qEnd === -1) continue;
    const question = block.substring(qStart + 26, qEnd).trim();

    // Extract Answer
    const aStart = block.indexOf('<div class="faq-answer">');
    const aEnd = block.lastIndexOf('</div>'); // Last div in the block should be the answer's close
    if (aStart === -1 || aEnd === -1) continue;
    
    let answer = block.substring(aStart + 24, aEnd).trim();
    // Clean up trailing div if it exists from the block split
    if (answer.endsWith('</div>')) answer = answer.slice(0, -6).trim();

    if (existingQuestions.includes(question)) continue;

    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const now = new Date().toISOString();

    const faqData = {
      id,
      type: 'faq',
      question,
      answer,
      category: 'General',
      status: 'published',
      createdAt: now,
      updatedAt: now
    };

    fs.writeFileSync(
      path.join(FAQ_DATA_DIR, `${id}.json`), 
      JSON.stringify(faqData, null, 2), 
      'utf8'
    );
    
    imported.push(question);
  }

  return {
    success: true,
    message: `Import complete. Imported ${imported.length} new entries.`,
    totalInDatabase: fs.readdirSync(FAQ_DATA_DIR).filter(f => f.endsWith('.json')).length
  };
}

module.exports = { run };
