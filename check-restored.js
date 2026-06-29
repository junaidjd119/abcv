const fs = require('fs');
const html = fs.readFileSync('E:/gym/abcv-main/abcv-main/gym-empire-arcade.html', 'utf8');

console.log('Length:', html.length);
console.log('Runner:', html.includes('id="tab-runner"'));
console.log('Truck:', html.includes('id="tab-truck"'));
console.log('Boxing:', html.includes('id="tab-boxing"'));

const m = html.match(/<script>(.*?)<\/script>/gs);
if (m) {
    m.forEach((s, idx) => {
        try {
            new Function(s.replace(/<\/?script>/g, ''));
            console.log('JS Block', idx, 'OK');
        } catch(e) {
            console.error('JS Error in Block', idx, e);
            process.exit(1);
        }
    });
}
