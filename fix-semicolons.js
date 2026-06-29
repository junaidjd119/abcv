const fs = require('fs');
let html = fs.readFileSync('E:/gym/abcv-main/abcv-main/gym-empire-arcade.html', 'utf8');

// I will just replace the exact broken lines!
html = html.replace(
    'document.getElementById(\'boxing-overlay-desc\').innerHTML = `Max Combo: <span class="text-rose-400 font-bold">${boxingState.maxCombo}</span><br>Earned <span class="text-emerald-400 font-bold">+${pointsEarned}</span> Power!`',
    'document.getElementById(\'boxing-overlay-desc\').innerHTML = `Max Combo: <span class="text-rose-400 font-bold">${boxingState.maxCombo}</span><br>Earned <span class="text-emerald-400 font-bold">+${pointsEarned}</span> Power!`;'
);

html = html.replace(
    'document.getElementById(\'truck-overlay-desc\').innerHTML = `Awesome driving! Earned <span class="text-emerald-400 font-bold">+${pts}</span> Power.`',
    'document.getElementById(\'truck-overlay-desc\').innerHTML = `Awesome driving! Earned <span class="text-emerald-400 font-bold">+${pts}</span> Power!`;'
);

// I will also make sure the keydown event is perfectly formatted.
fs.writeFileSync('E:/gym/abcv-main/abcv-main/gym-empire-arcade.html', html, 'utf8');
console.log('Fixed semicolons!');
