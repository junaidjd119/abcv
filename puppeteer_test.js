const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
    
    const filePath = 'file://' + path.resolve('E:/gym/abcv-main/abcv-main/gym-empire-arcade.html');
    await page.goto(filePath);
    console.log("Page loaded.");
    
    // wait for 1 sec
    await new Promise(r => setTimeout(r, 1000));
    
    console.log("Switching to Boxing tab...");
    await page.evaluate(() => switchTab('boxing'));
    
    await new Promise(r => setTimeout(r, 500));
    console.log("Clicking Start Boxing...");
    try {
        await page.click('#boxing-start-btn');
        console.log("Start Boxing clicked.");
    } catch(e) {
        console.log("Failed to click Start Boxing:", e.message);
    }
    
    await new Promise(r => setTimeout(r, 1000));
    
    console.log("Switching to Catcher tab...");
    await page.evaluate(() => switchTab('catcher'));
    
    await new Promise(r => setTimeout(r, 500));
    console.log("Clicking Start Catcher...");
    try {
        // Catcher button doesn't have an ID, but it calls startCatcherGame()
        await page.evaluate(() => startCatcherGame());
        console.log("Start Catcher called.");
    } catch(e) {
        console.log("Failed to call startCatcherGame:", e.message);
    }
    
    await new Promise(r => setTimeout(r, 1000));
    
    await browser.close();
})();
