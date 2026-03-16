const fs = require('fs');
const path = require('path');

const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const urls = sitemap.match(/<loc>(.*?)<\/loc>/g).map(u => u.replace(/<\/?loc>/g, ''));

const broken = [];
urls.forEach(urlAttr => {
    const url = new URL(urlAttr);
    let relPath = url.pathname.substring(1); // remove leading /
    if (relPath === '') relPath = 'index.html';
    
    // Support nested blog files
    const fullPath = path.join(__dirname, relPath);
    if (!fs.existsSync(fullPath)) {
        broken.push(urlAttr);
    }
});

console.log('Broken Links Found:');
broken.forEach(b => console.log(b));
console.log('\nTotal broken: ' + broken.length);
