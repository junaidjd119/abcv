const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '../blog');
const blogHtmlPath = path.join(__dirname, '../blog.html');

const allFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
console.log(`Found ${allFiles.length} HTML files in blog directory.`);

let blogCardsHTML = "";

allFiles.forEach(file => {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract Title (from <title> tag)
    let title = "GymTranning Article";
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].replace(' | GymTranning', '').trim();
    }

    // Extract Category (from blog-category span or default to Training)
    let category = "Training";
    const catMatch = content.match(/uppercase tracking-widest">(.*?)<\/span>/) || content.match(/data-category="(.*?)"/);
    if (catMatch && catMatch[1]) {
        category = catMatch[1].trim();
    } else {
        // Try to guess from filename if not found
        if (file.includes('cardio')) category = "Cardio";
        else if (file.includes('nutrition') || file.includes('fat-loss') || file.includes('diet')) category = "Nutrition";
        else if (file.includes('strength') || file.includes('muscle') || file.includes('deadlift') || file.includes('chest')) category = "Strength";
        else if (file.includes('recovery') || file.includes('flexibility') || file.includes('sleep') || file.includes('stretch')) category = "Recovery";
        else if (file.includes('mindset') || file.includes('motivation')) category = "Lifestyle";
    }

    // Extract Video Src
    let videoSrc = "";
    const videoMatch = content.match(/<source src="(.*?)"/);
    if (videoMatch && videoMatch[1]) {
        videoSrc = videoMatch[1];
        if (videoSrc.startsWith('../')) {
            videoSrc = videoSrc.replace('../', './');
        }
    } else {
        // Look for older iframe src if any (e.g. YouTube)
        const iframeMatch = content.match(/<iframe.*?src="(.*?)"/);
        if (iframeMatch && iframeMatch[1]) {
            videoSrc = iframeMatch[1];
        }
    }

    // Generate media block
    let mediaBlockHTML = "";
    if (videoSrc.endsWith('.mp4')) {
        mediaBlockHTML = `
                <div class="blog-card-image relative overflow-hidden bg-black flex items-center justify-center group" style="background-image: none; height: 230px;">
                    <video class="w-full h-full object-cover absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300" preload="metadata" muted>
                        <source src="${videoSrc}" type="video/mp4">
                    </video>
                    <i class="fas fa-play-circle text-5xl text-white/80 absolute z-10 group-hover:scale-110 group-hover:text-primary transition-all shadow-sm rounded-full drop-shadow-lg"></i>
                    <span class="blog-category relative z-20 absolute top-4 left-4" style="background-color: #00C9A7; margin:0;" >${category}</span>
                </div>`;
    } else if (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be')) {
        // YouTube thumbnail trick
        let ytId = "";
        const ytMatch = videoSrc.match(/(?:embed\/|v=|\/)([0-9A-Za-z_-]{11})/);
        if (ytMatch && ytMatch[1]) ytId = ytMatch[1];

        const ytThumb = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop";
        mediaBlockHTML = `
                <div class="blog-card-image" style="background-image: url('${ytThumb}');">
                    <span class="blog-category" style="background-color: #00C9A7;">${category}</span>
                </div>`;
    } else {
        // Default image
        const bgImage = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop";
        mediaBlockHTML = `
                <div class="blog-card-image" style="background-image: url('${bgImage}');">
                    <span class="blog-category" style="background-color: #00C9A7;">${category}</span>
                </div>`;
    }


    // Clean description text
    const desc = `A comprehensive guide covering everything you need to know about ${category}. Read on to learn more about training gracefully...`;

    // Regenerate the simple card
    blogCardsHTML += `
            <article class="blog-card flex flex-col" data-category="${category.toLowerCase()}">
${mediaBlockHTML}
                <div class="p-6 flex flex-grow flex-col">
                    <div class="flex items-center text-xs text-gray-500 mb-3 gap-4">
                        <span><i class="far fa-calendar-alt mr-1"></i> Mar 03, 2026</span>
                        <span><i class="far fa-user mr-1"></i> Editorial Team</span>
                    </div>
                    <h3 class="text-xl mb-3 hover:text-primary transition-colors line-clamp-2 font-bold">
                        <a href="/blog/${file}">${title}</a>
                    </h3>
                    <p class="text-gray-600 text-sm mb-6 flex-grow">${desc}</p>
                    <a href="/blog/${file}" class="text-primary font-bold uppercase tracking-wider text-sm hover:underline mt-auto">Read Full Article <i class="fas fa-arrow-right ml-1"></i></a>
                </div>
            </article>\n`;
});

let blogHtmlContent = fs.readFileSync(blogHtmlPath, 'utf8');
const gridRegex = /(<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="blog-grid">)([\s\S]*?)(<\/main>)/;

if (gridRegex.test(blogHtmlContent)) {
    blogHtmlContent = blogHtmlContent.replace(
        gridRegex,
        `$1\n${blogCardsHTML}\n        </div>\n    $3`
    );
    fs.writeFileSync(blogHtmlPath, blogHtmlContent);
    console.log(`Successfully updated blog.html index with all ${allFiles.length} blogs, using native video thumbnails.`);
} else {
    console.log("Error: Could not find the blog grid in blog.html to replace.");
}
