const fs = require('fs');
const path = require('path');
const https = require('https');

const rootDir = __dirname;
const reportFile = path.join(rootDir, 'final_audit_data.json');

// AdSense mandatory pages patterns
const mandatoryPages = {
    'contact': /contact/i,
    'privacy': /privacy/i,
    'terms': /terms|tos/i,
    'about': /about/i,
    'cookie': /cookie/i
};

// Configuration
const config = {
    minWordCount: 300,
    titleMaxLength: 60,
    descMaxLength: 160
};

let files = [];
let auditResults = {
    pages: [],
    brokenLinks: [],
    missingPages: [],
    summary: {
        totalFiles: 0,
        totalErrors: 0,
        adSenseReady: false
    }
};

function getAllFiles(dirPath, arrayOfFiles) {
    const fileList = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    fileList.forEach(function (file) {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.vscode' && file !== 'css' && file !== 'js') {
                arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
            }
        } else {
            if (path.extname(file) === '.html') {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        }
    });

    return arrayOfFiles;
}

function parseHtml(content) {
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '';

    const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    const description = descMatch ? descMatch[1] : '';

    const h1Matches = content.match(/<h1.*?>.*?<\/h1>/gi) || [];

    // Simple word count: remove tags, split by space
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textContent.split(' ').length;

    // Images
    const imgMatches = content.match(/<img\s+[^>]*>/gi) || [];
    const images = imgMatches.map(img => {
        const altMatch = img.match(/alt=["'](.*?)["']/i);
        return {
            tag: img,
            hasAlt: !!altMatch,
            alt: altMatch ? altMatch[1] : ''
        };
    });

    // Links
    const linkMatches = [];
    const linkRegex = /href=["'](.*?)["']/gi;
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
        linkMatches.push(match[1]);
    }

    return { title, description, h1Count: h1Matches.length, wordCount, images, links: linkMatches };
}

function runAudit() {
    files = getAllFiles(rootDir);
    auditResults.summary.totalFiles = files.length;

    const pageExistence = {
        contact: false,
        privacy: false,
        terms: false,
        about: false,
        cookie: false
    };

    files.forEach(filePath => {
        const relativePath = path.relative(rootDir, filePath);
        const content = fs.readFileSync(filePath, 'utf8');
        const data = parseHtml(content);

        // Check mandatory pages
        for (const [key, regex] of Object.entries(mandatoryPages)) {
            if (regex.test(relativePath)) pageExistence[key] = true;
        }

        const pageResult = {
            file: relativePath,
            title: data.title,
            description: data.description,
            h1Count: data.h1Count,
            wordCount: data.wordCount,
            images: data.images.length,
            missingAlt: data.images.filter(i => !i.hasAlt).length,
            linksToCheck: []
        };

        // Link Validation
        data.links.forEach(link => {
            if (link.startsWith('http') || link.startsWith('//') || link.startsWith('#') || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('javascript:')) {
                // External or special: skip validation for now or just mark as external
            } else {
                // Internal link
                const currentDir = path.dirname(filePath);

                // Handle absolute vs relative
                let targetPath;
                if (link.startsWith('/')) {
                    targetPath = path.join(rootDir, link);
                } else {
                    targetPath = path.join(currentDir, link);
                }

                // Remove anchors and query params
                targetPath = targetPath.split('#')[0].split('?')[0];

                if (!fs.existsSync(targetPath)) {
                    auditResults.brokenLinks.push({
                        source: relativePath,
                        link: link,
                        reason: 'File not found'
                    });
                    pageResult.linksToCheck.push({ link, status: 'broken' });
                }
            }
        });

        auditResults.pages.push(pageResult);
    });

    // Determine missing pages
    for (const [key, exists] of Object.entries(pageExistence)) {
        if (!exists) auditResults.missingPages.push(key);
    }

    // Summary calculation
    auditResults.summary.totalErrors = auditResults.brokenLinks.length + auditResults.missingPages.length;
    auditResults.summary.adSenseReady = auditResults.summary.totalErrors === 0 && auditResults.pages.every(p => p.wordCount > config.minWordCount); // simplistic check

    fs.writeFileSync(reportFile, JSON.stringify(auditResults, null, 2));
    console.log('Audit complete. Results saved to ' + reportFile);
}

runAudit();
