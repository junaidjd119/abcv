const fs = require('fs');
const html = fs.readFileSync('E:/gym/abcv-main/abcv-main/gym-empire-arcade.html', 'utf8');

const m = html.match(/<script>(.*?)<\/script>/gs);
if (m) {
    let scriptContent = m[2].replace(/<\/?script>/g, '');
    fs.writeFileSync('E:/gym/abcv-main/abcv-main/debug-script.js', scriptContent, 'utf8');
}
