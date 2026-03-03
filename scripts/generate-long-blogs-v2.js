const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, '../blog');
const blogHtmlPath = path.join(__dirname, '../blog.html');

// Ensure directory exists
if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
}

// Categories, topics, and images
const topicsData = [
    { cat: 'Strength', titlePrefix: 'Complete Guide to', topic: 'Strength Training', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop' },
    { cat: 'Cardio', titlePrefix: 'Ultimate Guide to', topic: 'Cardio Exercises', img: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=2069&auto=format&fit=crop' },
    { cat: 'Nutrition', titlePrefix: 'Mastering', topic: 'Gym Nutrition', img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop' },
    { cat: 'Recovery', titlePrefix: 'The Best Rules for', topic: 'Muscle Recovery', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop' },
    { cat: 'Mindset', titlePrefix: 'Unlocking Focus into', topic: 'Fitness Mindset', img: 'https://images.unsplash.com/photo-1552196564-972d24f0c407?q=80&w=2070&auto=format&fit=crop' },
];

const paragraphs = {
    intro: [
        "Welcome to this comprehensive guide. Achieving your fitness goals requires dedication, the right knowledge, and consistent action. Whether your goal is to lose weight, gain muscle, or simply improve your everyday health, understanding the fundamentals is key. In this article, we'll break down everything in very simple words so you can apply it easily.",
        "Fitness is a journey, not a destination. It is important to remember that progress takes time. Today, we are going to dive deep into exactly how you can manage your daily routine, improve your overall health, and see incredible transformations over time without getting confused by complex science."
    ],
    science: [
        "Let's talk about how the body actually works. When you exercise, you are simply signaling your body to adapt. This adaptation is what causes muscles to grow, fat to burn, and your heart to become stronger. Science proves that a mixture of resistance training and healthy eating yields the best long-term results.",
        "The human body is an amazing machine. It responds to the challenges we put it through. By gradually increasing the difficulty of your workouts—a principle known as progressive overload—you force your muscles to adapt and grow stronger. This process is highly dependent on your nutrition and recovery."
    ],
    tips: [
        "Here are some essential tips you must follow: First, always stay hydrated. Second, prioritize your sleep. Third, never skip your warm-up. Consistency is your best friend when trying to build a new habit. Also, tracking what you eat is crucial.",
        "Success leaves clues. Most people who achieve their dream physique follow a few simple rules: they plan their workouts ahead of time, they eat whole foods mostly, and they do not let a 'bad day' ruin their entire week. Start small and build up."
    ],
    nutrition: [
        "Nutrition is 80% of the battle. You can train as hard as you want, but if you do not feed your body correctly, you will not see the results you desire. Focus on high-protein foods, healthy fats, and complex carbohydrates to give you sustained energy throughout the day.",
        "Eating right doesn't mean eating boring food. It just means being mindful of your macros. Protein is essential for repairing muscles, carbs are your primary energy source, and fats help regulate your hormones. Finding the balance is the secret."
    ],
    mistakes: [
        "One of the biggest mistakes beginners make is trying to do too much, too soon. This leads to burnout and injury. Instead, focus on mastering the basic movements with proper form before adding heavy weights. Leave your ego at the door.",
        "A common error is neglecting recovery. Muscles do not grow in the gym; they grow while you sleep. If you are constantly training without giving your body the time it needs to repair itself, you are actually slowing down your progress."
    ]
};

// Generate 2000-3000 words by repeating and shuffling content intelligently
function generateLongContent(title, topic) {
    let content = "";

    // Add Intro
    content += `<h2>Introduction to ${topic}</h2>`;
    content += `<p>${paragraphs.intro[0]} ${paragraphs.intro[1]}</p>`;
    content += `<p>For the best start, check out our home page tools at <a href="/index.html" class="text-primary font-bold hover:underline">Gymtranning.com</a> to see what we offer.</p>`;

    // Expand to ~500 words
    for (let i = 0; i < 4; i++) {
        content += `<p>Understanding ${topic} takes patience. Many people rush into it expecting overnight results, but the truth is that biological changes happen slowly. ${paragraphs.science[i % 2]} You must be willing to commit to the process for at least 12 weeks to see significant changes. ${paragraphs.tips[i % 2]}</p>`;
    }

    // Add Video
    content += `
    <div class="my-10 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative">
        <div class="p-4 bg-gray-800 text-white text-center font-bold">Watch: How to Master ${topic}</div>
        <video class="w-full object-cover max-h-[500px]" controls poster="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop">
            <!-- Using a standard open source placeholder video for the example -->
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <p class="p-4 text-gray-400 text-sm text-center">Video demonstration for perfect form and understanding.</p>
    </div>`;

    // Add Deep Dive 1
    content += `<h2>The Deep Science Behind ${topic}</h2>`;
    for (let i = 0; i < 5; i++) {
        content += `<p>When we look closer at how your muscles behave, we see fascinating patterns. ${paragraphs.nutrition[i % 2]} Every time you exercise, microscopic tears form in your muscle fibers. ${paragraphs.mistakes[i % 2]} To heal these tears, your body needs building blocks. This is exactly why you must manage your diet carefully.</p>`;
    }

    content += `<div class="bg-blue-50 border-l-4 border-primary p-6 my-8 rounded-r-lg">
        <h3 class="text-xl font-bold mb-2">Pro Tool Alert</h3>
        <p>Don't guess what your body needs! Use our absolutely free <a href="/dietplanner.html" class="text-accent font-bold hover:underline">Custom Diet Planner</a> to generate a meal plan tailored perfectly to your goals.</p>
    </div>`;

    // Add Deep Dive 2
    content += `<h2>Common Pitfalls and How to Avoid Them</h2>`;
    for (let i = 0; i < 6; i++) {
        content += `<p>It is very easy to fall into bad habits. ${paragraphs.mistakes[i % 2]} If you want to succeed long-term, you need to track your progress. ${paragraphs.tips[i % 2]} Always remember that fitness is about feeling good, moving pain-free, and enjoying your life. Don't restrict yourself so much that you hate the process.</p>`;
    }

    // Add Deep Dive 3
    content += `<h2>Advanced Strategies for ${topic}</h2>`;
    for (let i = 0; i < 6; i++) {
        content += `<p>Once you master the basics, you can move on to advanced techniques. ${paragraphs.science[i % 2]} Some people like to change their workout split from full-body to push-pull-legs. ${paragraphs.nutrition[i % 2]} This allows for more targeted muscle damage and focused recovery. But it also requires more careful planning of your daily calories.</p>`;
    }

    content += `<div class="bg-slate-100 p-6 my-8 rounded-lg text-center">
        <h3 class="text-xl font-bold mb-2">Track Your Calories</h3>
        <p>Knowing your daily energy expenditure is step one. Check out our <a href="/caloriecalculator.html" class="text-primary font-bold hover:underline">Calorie Calculator</a> to find your exact maintenance and deficit numbers.</p>
    </div>`;

    // Add Conclusion
    content += `<h2>Conclusion and Final Thoughts</h2>`;
    for (let i = 0; i < 4; i++) {
        content += `<p>To wrap things up, ${topic} is an essential part of your journey. ${paragraphs.intro[i % 2]} Take it one day at a time, stay consistent, and remember that we are here to support you. ${paragraphs.tips[i % 2]}</p>`;
    }

    content += `<p>Thank you for reading this ultimate guide. If you have any questions or want personalized advice, don't hesitate to visit our <a href="/contact.html" class="text-primary font-bold hover:underline">Contact Page</a> or read our story on the <a href="/about.html" class="text-primary font-bold hover:underline">About Us Page</a>.</p>`;

    return content;
}

const template = (id, topicData, title, contentHTML) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | GymTranning</title>
    <meta name="description" content="A 3000-word deep dive into ${topicData.topic}. Learn exactly how to optimize your training and nutrition with video guides.">
    <meta name="keywords" content="${topicData.cat.toLowerCase()}, fitness, gym, workout, health">
    
    <!-- Open Graph & Twitter -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${title} | GymTranning">
    <meta property="og:description" content="A deep dive into ${topicData.topic}. Learn exactly how to optimize your training and nutrition with video guides.">
    <meta property="og:image" content="${topicData.img}">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: { colors: { primary: '#00C9A7', secondary: '#FF6B6B', accent: '#4A90E2' } }
            }
        }
    </script>
    <!-- AdSense & Layout -->
    <script src="../layout.js" defer></script>
    <script src="../js/ads.js" defer></script>
    <style>
        #footer-container { width: 100%; display: flex; justify-content: center; padding: 20px 0; }
        body { font-family: 'Poppins', sans-serif; background-color: #f8fafc; color: #1e293b; }
        article { padding: 40px; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin: 40px auto; max-width: 900px; }
        h1 { font-size: 2.5rem; font-weight: bold; margin-bottom: 20px; color: #0f172a; line-height: 1.2; }
        h2 { font-size: 1.8rem; font-weight: bold; margin-top: 40px; margin-bottom: 20px; color: #0f172a; border-bottom: 3px solid #00C9A7; padding-bottom: 10px; display: inline-block; }
        p { margin-bottom: 24px; line-height: 1.8; color: #334155; font-size: 1.15rem; }
    </style>
</head>
<body>
    <div id="navbar-container"></div>
    
    <main class="container mx-auto px-4 py-8">
        <!-- Breadcrumbs -->
        <nav class="text-sm mb-6 flex gap-2 text-gray-500 max-w-4xl mx-auto">
            <a href="/index.html" class="hover:text-primary transition-colors">Home</a> / 
            <a href="/blog.html" class="hover:text-primary transition-colors">Blog</a> / 
            <span class="text-gray-400 truncate">${title}</span>
        </nav>

        <article>
            <span class="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold mb-6 uppercase tracking-widest">${topicData.cat}</span>
            <h1>${title}</h1>
            
            <div class="flex items-center gap-4 mb-8 border-b border-gray-100 pb-8">
                <img src="https://ui-avatars.com/api/?name=Admin&background=00C9A7&color=fff" class="w-12 h-12 rounded-full shadow-md" alt="Author" loading="lazy">
                <div>
                    <p class="font-bold text-gray-900">GymTranning Expert Coaching</p>
                    <p class="text-sm text-gray-500">Published on March 3, 2026 • 15 min read</p>
                </div>
            </div>
            
            <img src="${topicData.img}" class="w-full h-[400px] object-cover rounded-xl shadow-lg mb-10" alt="${title}" loading="lazy">
            
            <div class="prose max-w-none">
                ${contentHTML}
            </div>
        </article>
    </main>

    <div id="footer-container"></div>
</body>
</html>`;

function generateAll() {
    let generatedCount = 0;
    let blogCardsHTML = "";

    for (let i = 1; i <= 100; i++) {
        const topicData = topicsData[i % topicsData.length];
        const title = `${topicData.titlePrefix} ${topicData.topic} (Part ${i}): Comprehensive Overview`;
        const filename = `deep-dive-${topicData.cat.toLowerCase()}-p${i}.html`;
        const filePath = path.join(blogDir, filename);

        const longContent = generateLongContent(title, topicData.topic);
        const fileData = template(i, topicData, title, longContent);

        fs.writeFileSync(filePath, fileData);

        // Build the card for blog.html
        blogCardsHTML += `
            <article class="blog-card" data-category="${topicData.cat.toLowerCase()}">
                <div class="blog-card-image" style="background-image: url('${topicData.img}');">
                    <span class="blog-category">${topicData.cat}</span>
                </div>
                <div class="p-6 flex flex-grow flex-col">
                    <div class="flex items-center text-xs text-gray-500 mb-3 gap-4">
                        <span><i class="far fa-calendar-alt mr-1"></i> Mar 03, 2026</span>
                        <span><i class="far fa-user mr-1"></i> Admin</span>
                    </div>
                    <h3 class="text-xl mb-3 hover:text-primary transition-colors line-clamp-2 font-bold">
                        <a href="/blog/${filename}">${title}</a>
                    </h3>
                    <p class="text-gray-600 text-sm mb-6 flex-grow">A 3000+ word deep dive explaining everything you need to know in simple, easy-to-understand language. Includes free video guide...</p>
                    <a href="/blog/${filename}" class="text-primary font-bold uppercase tracking-wider text-sm hover:underline mt-auto">Read Full Article <i class="fas fa-arrow-right ml-1"></i></a>
                </div>
            </article>\n`;

        generatedCount++;
    }

    // Now inject these cards into blog.html
    let blogHtmlContent = fs.readFileSync(blogHtmlPath, 'utf8');

    // Find where the grid starts and inject
    const gridStartMarker = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="blog-grid">';

    if (blogHtmlContent.includes(gridStartMarker)) {
        blogHtmlContent = blogHtmlContent.replace(
            gridStartMarker,
            gridStartMarker + '\n' + blogCardsHTML
        );
        fs.writeFileSync(blogHtmlPath, blogHtmlContent);
        console.log("Updated blog.html with 100 new cards!");
    } else {
        console.log("Could not find grid marker in blog.html");
    }

    console.log(`Successfully generated ${generatedCount} long-form blog posts with videos in ${blogDir}`);
}

generateAll();
