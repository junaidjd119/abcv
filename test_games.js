const fs = require('fs');
const vm = require('vm');
const text = fs.readFileSync('E:/gym/abcv-main/abcv-main/gym-empire-arcade.html', 'utf8');
const js = text.match(/<script>([\s\S]*?)<\/script>/)[1];

const listeners = {};
let domElements = {};

const sandbox = {
    console: console,
    setTimeout: setTimeout,
    setInterval: setInterval,
    clearTimeout: clearTimeout,
    clearInterval: clearInterval,
    window: { 
        innerWidth: 800, 
        innerHeight: 600, 
        addEventListener: (event, cb) => { listeners[event] = listeners[event] || []; listeners[event].push(cb); },
        devicePixelRatio: 1
    },
    document: {
        getElementById: (id) => {
            if(!domElements[id]) {
                domElements[id] = {
                    id: id,
                    getContext: () => ({
                        fillRect:()=>{}, arc:()=>{}, fill:()=>{}, beginPath:()=>{},
                        moveTo:()=>{}, lineTo:()=>{}, stroke:()=>{}, translate:()=>{},
                        rotate:()=>{}, restore:()=>{}, save:()=>{}, fillText:()=>{},
                        measureText:()=>({width:10}), createLinearGradient:()=>({addColorStop:()=>{}}),
                        drawImage:()=>{}, ellipse:()=>{}, setTransform:()=>{}, scale:()=>{},
                        clearRect:()=>{}
                    }),
                    classList: { add:()=>{}, remove:()=>{}, contains:()=>false, toggle:()=>{} },
                    style: {},
                    addEventListener: (event, cb) => { listeners[event] = listeners[event] || []; listeners[event].push(cb); },
                    parentElement: { clientWidth: 800, clientHeight: 600 },
                    getBoundingClientRect: () => ({ left:0, top:0, width:800, height:600 })
                };
            }
            return domElements[id];
        },
        querySelectorAll: () => [],
        addEventListener: (event, cb) => { listeners[event] = listeners[event] || []; listeners[event].push(cb); },
        querySelector: () => null,
        createElement: (tag) => {
            return {
                width: 800, height: 600,
                getContext: () => ({ scale:()=>{}, fillStyle:'', beginPath:()=>{}, moveTo:()=>{}, lineTo:()=>{}, fill:()=>{} })
            }
        }
    },
    requestAnimationFrame: (cb) => { },
    cancelAnimationFrame: () => {},
    performance: { now: () => Date.now() },
    AudioContext: class { createOscillator() { return {connect:()=>{}, start:()=>{}, stop:()=>{}, frequency:{setValueAtTime:()=>{}}}; } createGain() { return {connect:()=>{}, gain:{setValueAtTime:()=>{}, exponentialRampToValueAtTime:()=>{}}}; } },
    localStorage: { getItem:()=>null, setItem:()=>null },
    Image: class {},
    Math: Math,
    URL: URL,
    Blob: Blob
};
sandbox.window.parent = sandbox.window;
vm.createContext(sandbox);

try {
    const script = new vm.Script(js);
    script.runInContext(sandbox);
    console.log("VM LOAD OK");

    // trigger load
    if(listeners['DOMContentLoaded']) listeners['DOMContentLoaded'].forEach(cb => cb());

    console.log("Testing Boxing...");
    if (typeof sandbox.initBoxing === 'function') sandbox.initBoxing();
    if (typeof sandbox.startBoxingGame === 'function') sandbox.startBoxingGame();

    console.log("Testing Catcher...");
    if (typeof sandbox.initCatcher === 'function') sandbox.initCatcher();
    if (typeof sandbox.startCatcherGame === 'function') sandbox.startCatcherGame();
    
    console.log("ALL TESTS PASS");
    
} catch(e) {
    console.error("TEST ERROR:", e);
}
