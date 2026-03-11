const fs = require('fs');

let sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const removeUrls = [
    'https://www.gymtranning.com/footer.html',
    'https://www.gymtranning.com/navbar.html',
    'https://www.gymtranning.com/status.html'
];
let removed = 0;

sitemap = sitemap.replace(/<url>[\s\S]*?<\/url>/g, match => {
    for (let u of removeUrls) {
        if (match.includes(`<loc>${u}</loc>`)) {
            removed++;
            return '';
        }
    }
    return match;
});

sitemap = sitemap.replace(/^\s*[\r\n]/gm, '');

fs.writeFileSync('sitemap.xml', sitemap);
console.log('Removed ' + removed + ' urls');
