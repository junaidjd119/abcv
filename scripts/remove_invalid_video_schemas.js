const fs = require('fs');
const path = require('path');

const filePath = path.join('e:\\gym\\github\\abcv', 'blog.html');

let content = fs.readFileSync(filePath, 'utf8');

// Use regex to locate and remove any <script type="application/ld+json"> blocks 
// that contain "@type": "VideoObject" anywhere inside them.
const scriptRegex = /<script type="application\/ld\+json">[\s\S]*?<\/script>/gi;

let match;
let matchCount = 0;
let cleanContent = content;

while ((match = scriptRegex.exec(content)) !== null) {
    if (match[0].includes('"@type": "VideoObject"')) {
        cleanContent = cleanContent.replace(match[0], '');
        matchCount++;
    }
}

// Clean up any lingering empty lines
cleanContent = cleanContent.replace(/^\s*\n/gm, '');

fs.writeFileSync(filePath, cleanContent, 'utf8');

console.log(`Successfully removed ${matchCount} invalid VideoObject schemas from blog.html`);
