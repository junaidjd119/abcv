const fs = require('fs');
const currentPath = 'E:/gym/abcv-main/abcv-main/gym-empire-arcade.html';
let html = fs.readFileSync(currentPath, 'utf8');

// I already have HTML for truck and boxing injected properly!
// I just need to add the JS, because they were dropped.

const injectJeep = fs.readFileSync('E:/gym/abcv-main/abcv-main/inject-jeep.js', 'utf8');
const truckJsMatch = injectJeep.match(/const jeepJS = \`([\s\S]*?)\`;/);
const truckJs = truckJsMatch[1];

const injectBoxingJs = fs.readFileSync('E:/gym/abcv-main/abcv-main/inject-boxing-js.js', 'utf8');
let boxingJsMatch = injectBoxingJs.match(/const boxingJs = \`([\s\S]*?)\`;/);
let boxingJs = boxingJsMatch[1];
const fixBoxingBugs = fs.readFileSync('E:/gym/abcv-main/abcv-main/fix-boxing-bugs.js', 'utf8');
let fixMatch1 = fixBoxingBugs.match(/html = html.replace\(\`([\s\S]*?)\`,\n\`([\s\S]*?)\`\);/);
if(fixMatch1) {
    boxingJs = boxingJs.replace(fixMatch1[1], fixMatch1[2]);
}

// Inject JS right before // Window resize handler
html = html.replace(/\s*\/\/ Window resize handler/, '\n' + truckJs + '\n' + boxingJs + '\n        // Window resize handler');

// Keyup events
let keyupAdditions = `
        document.addEventListener('keyup', (e) => {
            const isTruckVisible = !document.getElementById('tab-truck').classList.contains('hidden');
            if (isTruckVisible && typeof truckState !== 'undefined' && truckState.active) {
                if (e.code === 'ArrowRight' || e.code === 'KeyD') { e.preventDefault(); truckState.gas = false; }
                if (e.code === 'ArrowLeft' || e.code === 'KeyA') { e.preventDefault(); truckState.brake = false; }
            }
        });
`;
html = html.replace(/\s*\/\/ Window resize handler/, keyupAdditions + '\n        // Window resize handler');

fs.writeFileSync(currentPath, html, 'utf8');
console.log('Fixed JS injections!');
