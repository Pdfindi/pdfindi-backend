const fs = require('fs');
const path = require('path');

const baseDir = 'f:\\website\\PDFINDI\\18 march 2026\\public_html-20260318T092915Z-1-001\\public_html';
const dirsToCheck = [baseDir, path.join(baseDir, 'tools')];

dirsToCheck.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        if (file.endsWith('.html')) {
            const filePath = path.join(dir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Remove the replacement character at the beginning if it exists
            if (content.startsWith('\uFFFD')) {
                console.log(`Fixing ${dir === baseDir ? 'Root' : 'Tools'}/${file}...`);
                content = content.substring(1);
                fs.writeFileSync(filePath, content, 'utf8');
            } else if (content.charCodeAt(0) > 127 && !content.startsWith('<!DOCTYPE')) {
                console.log(`Cleaning weird start in ${file} (char code: ${content.charCodeAt(0)})...`);
                content = content.replace(/^[^\s<]+/, ''); 
                fs.writeFileSync(filePath, content, 'utf8');
            }
        }
    });
});

console.log('Done cleaning directories.');
