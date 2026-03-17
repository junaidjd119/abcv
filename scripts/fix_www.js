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
            if (fullPath.endsWith('.html') || fullPath.endsWith('.xml') || fullPath.endsWith('.js')) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

const files = walk(dir);
let updatedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace www.gymtranning.com with gymtranning.com globally
    const oldUrl1 = /https:\/\/www\.gymtranning\.com/g;
    const oldUrl2 = /http:\/\/www\.gymtranning\.com/g;
    const newUrl = 'https://gymtranning.com';

    let changed = false;
    
    if (content.match(oldUrl1)) {
        content = content.replace(oldUrl1, newUrl);
        changed = true;
    }
    if (content.match(oldUrl2)) {
        content = content.replace(oldUrl2, newUrl);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
    }
});

console.log(`Replaced www.gymtranning.com in ${updatedCount} files.`);
