const fs = require('fs');
const path = require('path');

const dir = 'e:\\gym\\github\\abcv';

function walk(directory) {
    let results = [];
    const list = fs.readdirSync(directory);
    list.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('downloads')) { 
            results = results.concat(walk(fullPath));
        } else { 
            if (fullPath.endsWith('.html')) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

const files = walk(dir);
const brokenLinks = new Set();
let totalLinksChecked = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Simple regex to extract href
    const hrefRegex = /href=["']([^"']+)["']/g;
    let match;
    
    while ((match = hrefRegex.exec(content)) !== null) {
        let link = match[1];
        
        // Ignore external links, mailto, tel, empty links, id links
        if (link.startsWith('http') || link.startsWith('//') || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('#') || link === '') {
            
            // If it's an absolute URL pointing to gymtranning.com, check it as an internal link
            if (link.startsWith('https://gymtranning.com/')) {
                 link = link.replace('https://gymtranning.com/', '/');
                 if (link === '') link = '/';
            } else {
                continue;
            }
        }
        
        // Attempt to resolve the path on disk
        let targetPath;
        if (link.startsWith('/')) {
            targetPath = path.join(dir, link);
        } else {
            targetPath = path.join(path.dirname(file), link);
        }
        
        // Remove query params and hash from local path
        targetPath = targetPath.split('?')[0].split('#')[0];
        
        // Directory index resolution
        if (targetPath.endsWith('/') || targetPath.endsWith('\\')) {
             targetPath = path.join(targetPath, 'index.html');
        } else if (!targetPath.endsWith('.html') && !targetPath.match(/\.[a-zA-Z0-9]+$/)) { // no extension
             let targetHtml = targetPath + '.html';
             if (fs.existsSync(targetHtml)) {
                 targetPath = targetHtml;
             } else if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
                 targetPath = path.join(targetPath, 'index.html');
             }
        } else if (targetPath === dir) {
             targetPath = path.join(dir, 'index.html');
        }
        
        totalLinksChecked++;
        
        if (!fs.existsSync(targetPath)) {
            brokenLinks.add(`File: ${file.replace(dir, '')} -> Linked to: ${match[1]} (Not found at: ${targetPath.replace(dir, '')})`);
        }
    }
});

console.log(`Total internal links checked: ${totalLinksChecked}`);
console.log(`Broken links found: ${brokenLinks.size}`);
if (brokenLinks.size > 0) {
    console.log('--- Broken Links ---');
    brokenLinks.forEach(link => console.log(link));
}
