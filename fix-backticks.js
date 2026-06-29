const fs = require('fs');
const currentPath = 'E:/gym/abcv-main/abcv-main/gym-empire-arcade.html';
let html = fs.readFileSync(currentPath, 'utf8');

// The problematic lines have "Power!\\" or "Power.\\" because of weird regex replacement escaping.
// Let's just fix them directly.
html = html.replace('Power!\\', 'Power!`');
html = html.replace('Power.\\', 'Power.`');
html = html.replace('Power!\\`;', 'Power!`;'); // Just in case
html = html.replace('Power.\\`;', 'Power.`;'); 

// Let's also check if there are other missing backticks.
// In truck:
html = html.replace('Power.\\\n', 'Power.`\n');
html = html.replace('Power!\\\n', 'Power!`\n');

// Wait, let's just use regex to fix any `Power!\` or `Power.\` that should be closed strings.
html = html.replace(/Power!\\(\s*)$/gm, 'Power!`$1');
html = html.replace(/Power\.\\(\s*)$/gm, 'Power.`$1');

fs.writeFileSync(currentPath, html, 'utf8');
console.log('Fixed broken backticks in HTML!');
