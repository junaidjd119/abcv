/*
 * update-sitemap.js
 * Appends all HTML files from the 'blog/' directory to 'sitemap.xml' if they are not already there.
 */

const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

const blogDir = path.join(__dirname, '..', 'blog');
const blogFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.html'));

const BASE_URL = 'https://www.gymtranning.com/blog/';

let addedCount = 0;
let newUrls = '';

blogFiles.forEach(file => {
    const fileUrl = `${BASE_URL}${file}`;
    if (!sitemapContent.includes(`<loc>${fileUrl}</loc>`)) {
        newUrls += `
  <url>
    <loc>${fileUrl}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
        addedCount++;
    }
});

if (addedCount > 0) {
    // Insert new URLs before the closing </urlset> tag
    sitemapContent = sitemapContent.replace('</urlset>', `${newUrls}\n</urlset>`);
    fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
    console.log(`Successfully added ${addedCount} new blog URLs to sitemap.xml`);
} else {
    console.log('No new blog URLs to add to sitemap.xml');
}
