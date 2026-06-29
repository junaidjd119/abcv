const fs = require('fs');
const html = fs.readFileSync('E:/gym/abcv-main/abcv-main/gym-empire-arcade.html', 'utf8');

console.log('--- Tabs ---');
console.log('Runner:', html.includes('id="tab-runner"'));
console.log('Slam:', html.includes('id="tab-slam"'));
console.log('Catcher:', html.includes('id="tab-catcher"'));
console.log('Boxing:', html.includes('id="tab-boxing"'));
console.log('Truck:', html.includes('id="tab-truck"'));

console.log('--- SwitchTab ---');
let start = html.indexOf('function switchTab(tabId) {');
console.log(html.substring(start, start + 1500));
