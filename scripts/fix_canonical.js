const fs = require('fs');
const path = require('path');

const dir = 'e:\\gym\\github\\abcv';

function walk(directory) {
    let results = [];
    const list = fs.readdirSync(directory);
    list.forEach(file => {
        file = path.join(directory, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.html')) results.push(file);
        }
    });
    return results;
}

const files = walk(dir);
let updatedHtmlCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let relativePath = file.substring(dir.length + 1).replace(/\\/g, '/');
    
    // Convert index.html in subdirectories or root appropriately
    let canonicalPath = relativePath;
    if (relativePath === 'index.html') {
        canonicalPath = '';
    }
    
    let canonicalUrl = canonicalPath ? `https://gymtranning.com/${canonicalPath}` : 'https://gymtranning.com/';
    
    const canonicalRegex = /<link\s+rel=["']canonical["'][^>]*>/i;
    const canonicalRegex2 = /<link\s+href=["'][^"']+["']\s+rel=["']canonical["'][^>]*>/i;
    const newCanonical = `<link rel="canonical" href="${canonicalUrl}">`;
    
    let changed = false;
    let match = content.match(canonicalRegex) || content.match(canonicalRegex2);
    
    if (match) {
        if (!match[0].includes(canonicalUrl)) {
            content = content.replace(match[0], newCanonical);
            changed = true;
        }
    } else {
        if (content.includes('</head>')) {
            content = content.replace('</head>', `  ${newCanonical}\n</head>`);
            changed = true;
        }
    }
    
    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        updatedHtmlCount++;
    }
});
console.log(`Updated ${updatedHtmlCount} HTML files.`);
