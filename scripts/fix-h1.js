const fs = require('fs');
const file = 'workoutplanner.html';
let content = fs.readFileSync(file, 'utf8');

// Replace second H1 (prog-title) to H2
content = content.replace(/<h1 id="prog-title"/g, '<h2 id="prog-title"');
content = content.replace(/mb-6 font-heading uppercase leading-none">--\s*<\/h1>/g, 'mb-6 font-heading uppercase leading-none">--</h2>');

fs.writeFileSync(file, content);
console.log('Fixed H1 in workoutplanner.html');
