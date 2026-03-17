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

const gaSnippet = `
    <!-- Google Consent Mode & Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-J3YYRQ301T"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-J3YYRQ301T');
        
        gtag('consent', 'default', {
            'ad_storage': 'denied',
            'analytics_storage': 'denied',
            'wait_for_update': 500
        });

        const consent = localStorage.getItem('cookieConsent');
        if (consent === 'accepted') {
            gtag('consent', 'update', {
                'ad_storage': 'granted',
                'analytics_storage': 'granted'
            });
        }
    </script>
</head>`;

let modifiedCount = 0;

for (const file of htmlFiles) {
    let content = fs.readFileSync(file, "utf8");
    
    // Check if the file already contains this specific ID to avoid duplicates
    if (!content.includes("G-J3YYRQ301T")) {
        // Find the closing head tag
        if (content.includes("</head>")) {
            content = content.replace("</head>", gaSnippet);
            fs.writeFileSync(file, content, "utf8");
            modifiedCount++;
            console.log(`Inserted GA code into ${file}`);
        }
    }
}

console.log(`Modified ${modifiedCount} files.`);
