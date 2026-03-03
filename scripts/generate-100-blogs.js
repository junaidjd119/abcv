const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '../blog');

// Ensure directory exists
if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
}

// Topics for variation
const topics = ["Strength Training", "Cardio", "Nutrition", "Recovery", "Supplements", "Mindset", "Flexibility", "Home Workouts", "Fat Loss", "Muscle Gain"];

const template = (id, topic, title) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | GymTranning Blog</title>
    <meta name="description" content="A comprehensive guide on ${title}. Discover the best practices, tips, and science-backed strategies for optimal results.">
    <meta name="keywords" content="${topic.toLowerCase()}, fitness, gym, workout, health">
    <meta name="author" content="GymTranning">
    
    <!-- Open Graph & Twitter -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${title} | GymTranning">
    <meta property="og:description" content="Discover the best practices, tips, and science-backed strategies for optimal results.">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: { colors: { primary: '#00C9A7', secondary: '#FF6B6B', accent: '#4A90E2' } }
            }
        }
    </script>
    
    <!-- Schema.org for Article -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${title}",
      "author": { "@type": "Organization", "name": "GymTranning" },
      "publisher": { "@type": "Organization", "name": "GymTranning" },
      "datePublished": "2026-03-03"
    }
    </script>
    
    <!-- Layout scripts (Includes Ads) -->
    <script src="../layout.js" defer></script>
    <script src="../js/ads.js" defer></script>
    <style>
        #footer-container { width: 100%; display: flex; justify-content: center; padding: 20px 0; }
        body { font-family: 'Poppins', sans-serif; background-color: #f8fafc; }
        article { padding: 40px; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin: 40px auto; max-width: 800px; }
        h1 { font-size: 2.5rem; font-weight: bold; margin-bottom: 20px; color: #1e293b; }
        p { margin-bottom: 20px; line-height: 1.8; color: #475569; font-size: 1.1rem; }
        h2 { font-size: 1.8rem; font-weight: bold; margin-top: 30px; margin-bottom: 15px; color: #0f172a; border-bottom: 2px solid #00C9A7; padding-bottom: 5px; }
    </style>
</head>
<body>
    <div id="navbar-container"></div>
    
    <main class="container mx-auto px-4 py-8">
        <!-- Breadcrumbs -->
        <nav class="text-sm mb-6 flex gap-2 text-gray-500 max-w-4xl mx-auto">
            <a href="/" class="hover:text-primary">Home</a> / 
            <a href="../blog.html" class="hover:text-primary">Blog</a> / 
            <span class="text-gray-400">${title}</span>
        </nav>

        <article>
            <span class="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">${topic}</span>
            <h1>${title}</h1>
            <div class="flex items-center gap-3 mb-8 border-b pb-6">
                <img src="https://ui-avatars.com/api/?name=Gym+Trainer&background=00C9A7&color=fff" class="w-10 h-10 rounded-full" alt="Author">
                <div>
                    <p class="font-bold text-gray-900 text-sm">GymTranning Expert</p>
                    <p class="text-xs text-gray-500">Published on March 3, 2026 • 5 min read</p>
                </div>
            </div>
            
            <p>Welcome to our comprehensive guide on <strong>${title}</strong>. When it comes to improving your health, mastering ${topic.toLowerCase()} is crucial for long-term success.</p>
            
            <h2>The Science Behind ${topic}</h2>
            <p>Recent studies suggest that incorporating consistent routines built around ${topic.toLowerCase()} can dramatically improve your overall fitness markers. Whether you are aiming for fat loss, muscle hypertrophy, or just general wellness, the principles remain the same.</p>
            <p>Our bodies adapt to the stimulus we provide. By systematically applying pressure and allowing for adequate recovery, we force physiological adaptations.</p>
            
            <h2>Key Strategies for Success</h2>
            <p>To get the most out of your efforts, focus on these core pillars:</p>
            <ul class="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li><strong>Consistency:</strong> Showing up is half the battle. Regular application beats sporadic intensity.</li>
                <li><strong>Progressive Overload:</strong> Gradually increasing the challenge to force continuous adaptation.</li>
                <li><strong>Proper Form:</strong> Executing movements correctly prevents injury and ensures the target muscles are stimulated.</li>
            </ul>
            
            <h2>Conclusion</h2>
            <p>Integrating these concepts takes time and patience. Remember that fitness is a marathon, not a sprint. Take the insights from this guide on <em>${title}</em> and apply them incrementally to your daily routine for massive long-term results.</p>
        </article>
    </main>

    <div id="footer-container"></div>
</body>
</html>`;

function generateBlogs() {
    let generatedCount = 0;

    for (let i = 1; i <= 100; i++) {
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const title = `The Ultimate Guide to ${topic} Mastery (Part ${i})`;
        const filename = `ultimate-guide-${topic.toLowerCase().replace(/ /g, '-')}-part-${i}.html`;
        const filePath = path.join(blogDir, filename);

        // Write the file
        fs.writeFileSync(filePath, template(i, topic, title));
        generatedCount++;
    }

    console.log(`Successfully generated ${generatedCount} blog posts in ${blogDir}`);
}

generateBlogs();
