const fs = require('fs');
const html = fs.readFileSync('E:/gym/abcv-main/abcv-main/gym-empire-arcade.html', 'utf8');
const tabs = ['tab-runner','tab-slam','tab-truck','tab-boxing','tab-catcher','tab-locker'];
tabs.forEach(t => {
    let count = (html.match(new RegExp('id="' + t + '"', 'g')) || []).length;
    console.log(t, '- found', count, 'time(s)');
});
