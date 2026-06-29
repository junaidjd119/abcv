const fs = require('fs');
const text = fs.readFileSync('E:/gym/abcv-main/abcv-main/gym-empire-arcade.html', 'utf8');
const js = text.match(/<script>([\s\S]*?)<\/script>/)[1];

const windowMock = {
    innerWidth: 800,
    innerHeight: 600,
    addEventListener: () => {}
};
const documentMock = {
    getElementById: (id) => ({
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
    }),
    querySelectorAll: () => [],
    addEventListener: () => {}
};

global.window = windowMock;
global.document = documentMock;
global.requestAnimationFrame = (cb) => { };
global.performance = { now: () => Date.now() };
global.AudioContext = class { createOscillator() { return {connect:()=>{}, start:()=>{}, stop:()=>{}, frequency:{setValueAtTime:()=>{}}}; } createGain() { return {connect:()=>{}, gain:{setValueAtTime:()=>{}, exponentialRampToValueAtTime:()=>{}}}; } };
global.localStorage = { getItem:()=>null, setItem:()=>null };
global.Image = class {};

try {
    eval(js);
    console.log("EVAL OK");
    initEmpire();
    console.log("Empire OK");
    initTruck();
    console.log("Truck OK");
    initBoxing();
    console.log("Boxing OK");
    initCatcher();
    console.log("Catcher OK");
    initMath();
    console.log("Math OK");
    
    // Simulate game loops
    startTruckGame();
    truckState.gas = true;
    updateTruckLoop(100);
    console.log("Truck Loop OK");
    
    startBoxingGame();
    updateBoxingLoop(100);
    console.log("Boxing Loop OK");

    startCatcherGame();
    updateCatcherLoop(100);
    console.log("Catcher Loop OK");
    
    startMathGame();
    console.log("Math Loop OK");
    
} catch(e) {
    console.error("ERROR: ", e);
}
