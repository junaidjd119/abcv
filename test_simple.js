const fs = require('fs');
const html = fs.readFileSync('E:/gym/abcv-main/abcv-main/gym-empire-arcade.html', 'utf8');
const js = html.match(/<script>([\s\S]*?)<\/script>/)[1];

global.window = { innerWidth: 800, innerHeight: 600, addEventListener: () => {} };
global.document = {
    getElementById: (id) => {
        return {
            getContext: () => ({
                fillRect:()=>{}, arc:()=>{}, fill:()=>{}, beginPath:()=>{},
                moveTo:()=>{}, lineTo:()=>{}, stroke:()=>{}, translate:()=>{},
                rotate:()=>{}, restore:()=>{}, save:()=>{}, fillText:()=>{},
                measureText:()=>({width:10}), createLinearGradient:()=>({addColorStop:()=>{}}),
                drawImage:()=>{}, ellipse:()=>{}
            }),
            classList: { add:()=>{}, remove:()=>{}, contains:()=>false, toggle:()=>{} },
            style: {},
            addEventListener: () => {},
            parentElement: { clientWidth: 800, clientHeight: 600 }
        }
    },
    querySelectorAll: () => [],
    addEventListener: () => {}
};
global.requestAnimationFrame = (cb) => { };
global.performance = { now: () => Date.now() };
global.AudioContext = class { createOscillator() { return {connect:()=>{}, start:()=>{}, stop:()=>{}, frequency:{setValueAtTime:()=>{}}}; } createGain() { return {connect:()=>{}, gain:{setValueAtTime:()=>{}, exponentialRampToValueAtTime:()=>{}}}; } };
global.localStorage = { getItem:()=>null, setItem:()=>null };
global.Image = class {};
global.Math.random = () => 0.5;

try {
    eval(js);
    console.log("EVAL OK");
    
    // Simulate onload
    try {
        if (typeof window.onload === 'function') window.onload();
        console.log("window.onload OK");
    } catch(e) {
        console.log("window.onload ERROR", e);
    }
    
    // Test games
    try {
        if (typeof startTruckGame === 'function') {
            startTruckGame();
            updateTruckLoop(100);
            console.log("Truck game runs 1 frame ok");
        } else {
            console.log("startTruckGame not found");
        }
    } catch(e) {
        console.log("Truck game ERROR", e);
    }
} catch (e) {
    console.error("Runtime Error: ", e);
}
