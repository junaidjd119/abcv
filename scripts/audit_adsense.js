const fs = require('fs');
const path = require('path');

const dir = 'e:\\gym\\github\\abcv';

function walk(directory) {
    let results = [];
    const list = fs.readdirSync(directory);
    list.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.git') && !fullPath.includes('downloads')) { 
            results = results.concat(walk(fullPath));
        } else { 
            if (fullPath.endsWith('.html')) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

const files = walk(dir);

let report = {
    totalFiles: files.length,
    missingTitles: 0,
    missingDescriptions: 0,
    missingH1: 0,
    multipleH1: 0,
    thinContent: 0, // Less than 300 words
    missingEssentialPages: []
};

const essentialPages = ['privacy.html', 'terms_of_service.html', 'contact.html', 'about.html'];
essentialPages.forEach(page => {
    if (!fs.existsSync(path.join(dir, page))) {
        report.missingEssentialPages.push(page);
    }
});

let thinContentFiles = [];
let seoIssues = [];

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = file.replace(dir, '');
    
    // Check Title
    const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
    if (!titleMatch || !titleMatch[1].trim()) {
        report.missingTitles++;
        seoIssues.push(`${relativePath}: Missing or empty <title> tag.`);
    }
    
    // Check Meta Description
    const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    if (!descMatch || !descMatch[1].trim()) {
        report.missingDescriptions++;
        seoIssues.push(`${relativePath}: Missing or empty meta description.`);
    }
    
    // Check H1
    const h1Matches = content.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi);
    if (!h1Matches) {
        report.missingH1++;
        seoIssues.push(`${relativePath}: Missing <h1> tag.`);
    } else if (h1Matches.length > 1) {
        report.multipleH1++;
        seoIssues.push(`${relativePath}: Multiple <h1> tags found (${h1Matches.length}). Best practice is exactly one.`);
    }
    
    // Approximate Word Count (stripping HTML tags)
    // Very basic strip:
    let textContent = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                             .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                             .replace(/<[^>]+>/g, ' ')
                             .replace(/\s+/g, ' ')
                             .trim();
                             
    const wordCount = textContent.split(' ').length;
    if (wordCount < 300) {
        report.thinContent++;
        thinContentFiles.push(`${relativePath} (${wordCount} words)`);
    }
});

console.log("--- Audit Results ---");
console.log(`Total HTML Pages Analyzed: ${report.totalFiles}`);
console.log(`Pages Missing Title: ${report.missingTitles}`);
console.log(`Pages Missing Meta Description: ${report.missingDescriptions}`);
console.log(`Pages Missing H1: ${report.missingH1}`);
console.log(`Pages with Multiple H1s: ${report.multipleH1}`);
console.log(`Pages with Thin Content (<300 words): ${report.thinContent}`);

if (report.missingEssentialPages.length > 0) {
    console.log(`\nMISSING Essential AdSense Pages: ${report.missingEssentialPages.join(', ')}`);
} else {
    console.log(`\nALL Essential AdSense Pages present (Privacy, Terms, Contact, About).`);
}

// Check robots.txt
if (fs.existsSync(path.join(dir, 'robots.txt'))) {
    console.log(`\nrobots.txt is present.`);
} else {
    console.log(`\nWARNING: robots.txt is MISSING.`);
}

console.log(`\nDetailed report written to audit_report.md`);

let mdReport = `# Detailed SEO & AdSense Audit Report\n\n`;
mdReport += `## Overview\n`;
mdReport += `- Total HTML Pages: ${report.totalFiles}\n`;
mdReport += `- Pages with Thin Content: ${report.thinContent}\n\n`;

if (seoIssues.length > 0) {
    mdReport += `## SEO Issues (Titles, Descriptions, H1s)\n`;
    seoIssues.forEach(issue => mdReport += `- ${issue}\n`);
    mdReport += `\n`;
}

if (thinContentFiles.length > 0) {
    mdReport += `## Thin Content Pages (May hurt AdSense approval)\n`;
    mdReport += `AdSense prefers unique, substantial content. Consider adding more text to these pages.\n`;
    thinContentFiles.forEach(file => mdReport += `- ${file}\n`);
}

fs.writeFileSync(path.join(dir, 'audit_report.md'), mdReport);
