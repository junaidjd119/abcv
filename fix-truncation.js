const fs = require('fs');
let html = fs.readFileSync('E:/gym/abcv-main/abcv-main/gym-empire-arcade.html', 'utf8');

// The exact string that is currently broken in Boxing
let brokenBoxing = `            document.getElementById('boxing-overlay-desc').innerHTML = \`Max Combo: <span class="text-rose-400 font-bold">\${boxingState.maxCombo}</span><br>Earned <span class="text-emerald-400 font-bold">+\${pointsEarned}</span> Power!\\`;
let fixedBoxing = `            document.getElementById('boxing-overlay-desc').innerHTML = \`Max Combo: <span class="text-rose-400 font-bold">\${boxingState.maxCombo}</span><br>Earned <span class="text-emerald-400 font-bold">+\${pointsEarned}</span> Power!\`;\n        }`;
html = html.replace(brokenBoxing, fixedBoxing);

// The exact string that is currently broken in Truck
let brokenTruck = `            document.getElementById('truck-overlay-desc').innerHTML = \`Awesome driving! Earned <span class="text-emerald-400 font-bold">+\${pts}</span> Power.\\`;
let fixedTruck = `            document.getElementById('truck-overlay-desc').innerHTML = \`Awesome driving! Earned <span class="text-emerald-400 font-bold">+\${pts}</span> Power!\`;\n        }`;
html = html.replace(brokenTruck, fixedTruck);

fs.writeFileSync('E:/gym/abcv-main/abcv-main/gym-empire-arcade.html', html, 'utf8');
console.log('Fixed truncation!');
