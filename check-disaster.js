const fs = require('fs');

const origPath = 'E:/gym/temp_extract/abcv-main/gym-empire-arcade.html';
const currentPath = 'E:/gym/abcv-main/abcv-main/gym-empire-arcade.html';

let origHtml = fs.readFileSync(origPath, 'utf8');

// I also need to read the newGamesJs from the BROKEN file (the currentPath one wait! I overwrote currentPath! NO!)
// OH NO, I overwrote currentPath in the previous run!
// "fs.writeFileSync(currentPath, origHtml, 'utf8');"
// Wait, if I overwrote it, did I lose `newGamesJs`?
// Yes! 
