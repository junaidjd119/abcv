const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '..', 'blog');

function optimizeBlogPage(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Extract the primary heading or title text
    let h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    let currentTitleMatch = content.match(/<title>([^<]+)<\/title>/i);
    
    let baseTopic = "Expert Fitness Guide";
    
    if (h1Match && h1Match[1]) {
        baseTopic = h1Match[1].trim();
    } else if (currentTitleMatch && currentTitleMatch[1]) {
        baseTopic = currentTitleMatch[1].replace(/\|.*$/, '').trim();
    }

    // Prepare optimized texts
    // Using long-tail keywords based on our strategy: "Expert Fitness Guide | GymTranning"
    const newTitle = `${baseTopic} | Expert Fitness Guide | GymTranning`;
    const newDescription = `Read about ${baseTopic} in our expert fitness transformation guides. Discover the best free online gym workout plans, nutrition tips, and science-based muscle building advice on GymTranning.`;

    let changed = false;

    // 2. Replace <title>
    if (currentTitleMatch) {
        let newTitleTag = `<title>${newTitle}</title>`;
        if (currentTitleMatch[0] !== newTitleTag) {
            content = content.replace(currentTitleMatch[0], newTitleTag);
            changed = true;
        }
    } else {
        // If no title tag exists, inject one in <head>
        content = content.replace(/<head>/i, `<head>\n    <title>${newTitle}</title>`);
        changed = true;
    }

    // 3. Replace or inject <meta name="description">
    let descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
                    content.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
    
    let newDescTag = `<meta name="description" content="${newDescription}">`;
                    
    if (descMatch) {
        if (!descMatch[1].includes("expert fitness transformation guides")) {
            // Replace the entire existing tag to ensure proper formatting
            content = content.replace(descMatch[0], newDescTag);
            changed = true;
        }
    } else {
        // Inject below <title> if possible
        if (content.includes('</title>')) {
            content = content.replace('</title>', `</title>\n    ${newDescTag}`);
            changed = true;
        } else {
            content = content.replace(/<head>/i, `<head>\n    ${newDescTag}`);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }
    return false;
}

function processDirectory(directory) {
    let updatedCount = 0;
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            updatedCount += processDirectory(fullPath);
        } else if (file.endsWith('.html')) {
            if (optimizeBlogPage(fullPath)) {
                updatedCount++;
            }
        }
    }
    return updatedCount;
}

console.log('Starting blog optimization...');
const updatedCount = processDirectory(BLOG_DIR);
console.log(`Successfully SEO optimized ${updatedCount} blog files.`);
