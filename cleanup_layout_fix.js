const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (file !== '.git' && file !== 'node_modules' && file !== 'downloads') {
                results = results.concat(walk(fullPath));
            }
        } else {
            if (file.endsWith('.html')) {
                results.push(fullPath);
            }
        }
    });
    return results;
};

const rootDir = process.cwd();
const htmlFiles = walk(rootDir);

console.log(`Cleaning up ${htmlFiles.length} HTML files.`);

htmlFiles.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. Fix the rogue "$2}" from the previous failed regex
    content = content.replace(/justify-content:\s*flex-start;\$2}/g, 'justify-content: flex-start; }');

    // 2. Fix any double braces or malformed body styles
    content = content.replace(/justify-content:\s*flex-start;\s*}/g, 'justify-content: flex-start; }');

    // 3. Ensure body has justify-content: flex-start; if it doesn't have it
    // We target the internal <style> block for body
    if (content.match(/body\s*{/) && !content.includes('justify-content: flex-start')) {
        // Find the body block and insert it before the closing brace
        content = content.replace(/(body\s*{[^}]*?)}/i, (match, p1) => {
            return p1.trim() + '\n            justify-content: flex-start;\n        }';
        });
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Cleaned up: ${path.relative(rootDir, file)}`);
    }
});

console.log('Cleanup and correction complete.');
