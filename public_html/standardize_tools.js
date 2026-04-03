const fs = require('fs');
const path = require('path');

const toolsDir = 'f:\\website\\PDFINDI\\18 march 2026\\public_html-20260318T092915Z-1-001\\public_html\\tools';
const files = fs.readdirSync(toolsDir);

const OLD_GRADIENT_RG = /background:\s*linear-gradient\(135deg,\s*#fa7220\s*0%,\s*#138808\s*100%\);/g;
const OLD_GRADIENT_SIMPLE = /background:\s*linear-gradient\(135deg,\s*#fa7220,\s*#138808\);/g;
const NEW_GRADIENT = 'background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);';

const OLD_PRIMARY_VAR = /--primary-gradient:\s*linear-gradient\(135deg,\s*#fa7220\s*0%,\s*#138808\s*100%\);/g;
const NEW_PRIMARY_VAR = '--primary-gradient: linear-gradient(135deg, #fa7220 0%, #fa7220 100%);';

files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(toolsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        if (content.match(OLD_GRADIENT_RG) || content.match(OLD_GRADIENT_SIMPLE)) {
            console.log(`Fixing background in ${file}...`);
            content = content.replace(OLD_GRADIENT_RG, NEW_GRADIENT);
            content = content.replace(OLD_GRADIENT_SIMPLE, NEW_GRADIENT);
            changed = true;
        }

        if (content.match(OLD_PRIMARY_VAR)) {
            console.log(`Fixing primary var in ${file}...`);
            content = content.replace(OLD_PRIMARY_VAR, NEW_PRIMARY_VAR);
            changed = true;
        }

        // Fix body padding and margin if it looks like the old tool style
        // Old tools often have margin: 0; without padding: 80px...
        if (changed && !content.includes('padding: 80px 0 0 0;')) {
            console.log(`Adding header padding to ${file}...`);
            content = content.replace(/body\s*{[^}]*}/, (match) => {
                if (!match.includes('padding: 80px 0 0 0;')) {
                    return match.replace(/margin:\s*0;/, 'margin: 0;\n            padding: 80px 0 0 0;');
                }
                return match;
            });
        }

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
        }
    }
});

console.log('Done standardizing tools.');
