const fs = require('fs');
let f = fs.readFileSync('blog.html', 'utf8');
f = f.replace('<button class="filter-btn" data-filter="training">Training</button>', '<button class="filter-btn" data-filter="strength">Strength</button>\n                    <button class="filter-btn" data-filter="cardio">Cardio</button>');
f = f.replace('<button class="filter-btn" data-filter="beginner">Beginner</button>', '');
f = f.replace('<button class="filter-btn" data-filter="lifestyle">Lifestyle</button>', '<button class="filter-btn" data-filter="mindset">Mindset</button>');
fs.writeFileSync('blog.html', f);
console.log('Filters updated!');
