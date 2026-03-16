const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../');
const BASE_URL = 'https://www.gymtranning.com';
const REPORT_FILE = path.join(ROOT_DIR, 'seo_video_report.json');
const SITEMAP_FILE = path.join(ROOT_DIR, 'video-sitemap.xml');

// Helper to get all HTML files recursively
function getHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === '.vscode') continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

// Function to extract basic information from HTML
function processFile(filePath, allVideos) {
    const htmlContent = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
    const pageUrl = `${BASE_URL}/${relativePath === 'index.html' ? '' : relativePath}`;
    
    // Extract page title for default naming
    const titleMatch = htmlContent.match(/<title>([^<]*?)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].trim() : 'Fitness Training Video';
    
    const videosInPage = [];
    
    // Regex to find raw video logic
    // Hosted Video
    const videoTagsMatch = htmlContent.match(/<video[^>]*>.*?<\/video>/gis);
    if (videoTagsMatch) {
        for (const videoTag of videoTagsMatch) {
            let srcMatch = videoTag.match(/src=["']([^"']+\.(?:mp4|webm))["']/i);
            if (!srcMatch) {
                // Check source tags
                const sourceMatch = videoTag.match(/<source[^>]+src=["']([^"']+\.(?:mp4|webm))["']/i);
                if (sourceMatch) srcMatch = sourceMatch;
            }
            if (srcMatch) {
                let videoUrl = srcMatch[1];
                if (!videoUrl.startsWith('http')) {
                    videoUrl = videoUrl.startsWith('/') ? `${BASE_URL}${videoUrl}` : `${BASE_URL}/${path.dirname(relativePath)}/${videoUrl}`.replace(/(?<!:)\/{2,}/g, '/');
                }
                videosInPage.push({ type: 'hosted', url: videoUrl, matchStr: videoTag });
            }
        }
    }
    
    // YouTube Embeds
    const iframeTagsMatch = htmlContent.match(/<iframe[^>]*src=["'](https?:\/\/(?:www\.)?youtube\.com\/embed\/[^"']+)["'][^>]*>.*?<\/iframe>/gis);
    if (iframeTagsMatch) {
        for (const iframeTag of iframeTagsMatch) {
            const srcMatch = iframeTag.match(/src=["'](https?:\/\/(?:www\.)?youtube\.com\/embed\/[^"']+)["']/i);
            if (srcMatch) {
                videosInPage.push({ type: 'youtube', url: srcMatch[1], matchStr: iframeTag });
            }
        }
    }

    let modifiedContent = htmlContent;
    let addedStructuredData = false;

    // Check if JSON-LD VideoObject exists
    for (let i = 0; i < videosInPage.length; i++) {
        const video = videosInPage[i];
        const isHosted = video.type === 'hosted';
        
        // Define exact VideoObject structure
        const videoObject = {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": `${pageTitle} - Part ${i+1}`,
            "description": `Watch this fitness video related to ${pageTitle} located at ${pageUrl}.`,
            "thumbnailUrl": [
                `${BASE_URL}/logo.png`
            ],
            "uploadDate": new Date().toISOString(), // Fallback to current script run time
        };

        if (isHosted) {
            videoObject.contentUrl = video.url;
        } else {
            videoObject.embedUrl = video.url;
        }

        const videoJsonStr = JSON.stringify(videoObject, null, 2);
        
        // Very basic deduplication: check if URL is already in page as part of VideoObject schema loosely
        const urlToSearch = video.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const urlRegex = new RegExp(`"@type"\\s*:\\s*"VideoObject".*?${urlToSearch}`, 'is');
        
        if (!urlRegex.test(htmlContent)) {
            // Add script tag to head
            const scriptTag = `\n<script type="application/ld+json">\n${videoJsonStr}\n</script>\n`;
            if (modifiedContent.includes('</head>')) {
                modifiedContent = modifiedContent.replace('</head>', `${scriptTag}</head>`);
            } else {
                modifiedContent += scriptTag;
            }
            addedStructuredData = true;
        }
        
        // Record for global tracking & sitemap
        allVideos.push({
            pageUrl,
            videoUrl: video.url,
            title: videoObject.name,
            description: videoObject.description,
            thumbnailUrl: videoObject.thumbnailUrl[0],
            uploadDate: videoObject.uploadDate,
            isHosted
        });
    }

    if (addedStructuredData) {
        fs.writeFileSync(filePath, modifiedContent, 'utf-8');
    }

    return {
        url: pageUrl,
        filePath: relativePath,
        indexed: "Assigned for Request (GSC)", // Placeholder simulating check
        videosDetected: videosInPage.length,
        structuredDataAdded: addedStructuredData,
        sitemapStatus: videosInPage.length > 0 ? "Included" : "N/A",
    };
}

function generateSitemap(videos) {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n`;
    
    // Group videos by Page URL
    const pageMap = new Map();
    videos.forEach(v => {
        if (!pageMap.has(v.pageUrl)) pageMap.set(v.pageUrl, []);
        pageMap.get(v.pageUrl).push(v);
    });

    for (const [pageUrl, pageVideos] of pageMap.entries()) {
        xml += `  <url>\n    <loc>${pageUrl}</loc>\n`;
        for (const v of pageVideos) {
            xml += `    <video:video>\n`;
            xml += `      <video:thumbnail_loc>${v.thumbnailUrl}</video:thumbnail_loc>\n`;
            xml += `      <video:title><![CDATA[${v.title}]]></video:title>\n`;
            xml += `      <video:description><![CDATA[${v.description}]]></video:description>\n`;
            if (v.isHosted) {
                xml += `      <video:content_loc>${v.videoUrl}</video:content_loc>\n`;
            } else {
                xml += `      <video:player_loc>${v.videoUrl}</video:player_loc>\n`;
            }
            xml += `      <video:publication_date>${v.uploadDate}</video:publication_date>\n`;
            xml += `    </video:video>\n`;
        }
        xml += `  </url>\n`;
    }
    
    xml += `</urlset>`;
    fs.writeFileSync(SITEMAP_FILE, xml, 'utf-8');
    return true;
}

function updateRobotsTxt() {
    const robotsPath = path.join(ROOT_DIR, 'robots.txt');
    if (!fs.existsSync(robotsPath)) {
        fs.writeFileSync(robotsPath, 'User-agent: *\nAllow: /\n', 'utf-8');
    }
    
    let robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    const sitemapUrl = `${BASE_URL}/video-sitemap.xml`;
    if (!robotsContent.includes(sitemapUrl)) {
        robotsContent += `\nSitemap: ${sitemapUrl}\n`;
        fs.writeFileSync(robotsPath, robotsContent, 'utf-8');
        return "Updated";
    }
    return "Already exists";
}

function main() {
    console.log("Starting SEO Video Indexing Job...");
    
    const htmlFiles = getHtmlFiles(ROOT_DIR);
    console.log(`Found ${htmlFiles.length} HTML pages.`);

    const allVideos = [];
    const reportData = [];

    htmlFiles.forEach(file => {
        const report = processFile(file, allVideos);
        reportData.push(report);
    });
    
    console.log(`Found ${allVideos.length} total videos across the site.`);

    // Generate Sitemap
    generateSitemap(allVideos);
    console.log(`video-sitemap.xml generated with ${allVideos.length} videos.`);
    
    // Update robots.txt
    const robotsStatus = updateRobotsTxt();
    console.log(`robots.txt status: ${robotsStatus}`);

    // Generate Report
    fs.writeFileSync(REPORT_FILE, JSON.stringify(reportData, null, 2), 'utf-8');
    console.log(`Full report saved to ${REPORT_FILE}`);
    console.log("Job completed successfully.");
}

main();
