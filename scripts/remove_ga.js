const fs = require("fs");
const path = require("path");

const htmlFiles = [];
function findFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== ".git" && file !== "node_modules") {
                findFiles(fullPath);
            }
        } else if (file.endsWith(".html")) {
            htmlFiles.push(fullPath);
        }
    }
}

findFiles(".");

let modifiedCount = 0;

for (const file of htmlFiles) {
    let content = fs.readFileSync(file, "utf8");
    
    // Pattern to match the specific GA block with flexible async/attributes
    const pattern = /\s*<!-- Google Consent Mode -->\s*<script[^>]*src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-YOUR_GA_ID_HERE"[^>]*><\/script>\s*<script>[\s\S]*?gtag\('config', 'G-YOUR_GA_ID_HERE'\);[\s\S]*?<\/script>\s*/g;
    
    const initialContent = content;
    content = content.replace(pattern, "\n    "); // replace with some newline to preserve formatting
    
    // Also try to match without the consent mode comment just in case
    const pattern2 = /\s*<script[^>]*src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-YOUR_GA_ID_HERE"[^>]*><\/script>\s*<script>[\s\S]*?gtag\('config', 'G-YOUR_GA_ID_HERE'\);[\s\S]*?<\/script>\s*/g;
    content = content.replace(pattern2, "\n    ");

    if (content !== initialContent) {
        fs.writeFileSync(file, content, "utf8");
        modifiedCount++;
        console.log(`Removed GA from ${file}`);
    }
}

console.log(`Modified ${modifiedCount} files.`);
