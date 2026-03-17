const fs = require('fs');
const path = require('path');

const blogDir = path.join('e:', 'gym', 'github', 'abcv', 'blog');
const files = fs.readdirSync(blogDir).filter(f => f.startsWith('ultimate-guide-') && f.endsWith('.html'));

const intros = [
  '<p class="lead text-xl text-slate-700 italic border-l-4 border-primary pl-4 mb-4">Welcome to another deep dive into optimizing your health. In this session, we break down exactly how you can maximize your results using scientifically backed methods that apply to real-world training.</p>',
  '<p class="lead text-xl text-slate-700 italic border-l-4 border-primary pl-4 mb-4">Embarking on a fitness journey requires more than just showing up; it requires the right knowledge. Today, we are exploring the foundational principles that top athletes use to ensure they are making the most out of every single workout.</p>',
  '<p class="lead text-xl text-slate-700 italic border-l-4 border-primary pl-4 mb-4">If you have been struggling to see progress, you are not alone. This guide is crafted to cut through the noise and give you actionable, straightforward advice that you can implement in your routine starting today.</p>',
  '<p class="lead text-xl text-slate-700 italic border-l-4 border-primary pl-4 mb-4">The path to a stronger, healthier body is paved with consistent effort and continuous learning. Let’s dive deep into the mechanics of transforming your physique safely and efficiently.</p>'
];

const para1 = [
  '<p>The human body responds incredibly well to consistency and progressive overload. When you challenge your muscles just slightly more than you did last week, you force an adaptation. Understanding this biological process is the absolute key to breaking through plateaus.</p>',
  '<p>Nutrition plays a massive role in how quickly you recover. Without adequate protein intake, your muscles simply cannot repair the micro-tears caused by intense training. It is paramount that you prioritize your post-workout meals as much as the training itself.</p>',
  '<p>Cardiovascular health is often overlooked by those focusing solely on muscle gain. However, a strong heart allows for better oxygen delivery to working muscles, significantly improving your endurance and recovery capacity between heavy sets.</p>',
  '<p>Building true strength goes beyond just lifting heavy weights. It requires a deep understanding of body mechanics, leverage, and establishing a strong mind-muscle connection. When you focus on contracting the specific target muscle, your results skyrocket.</p>'
];

const para2 = [
  '<p>Rest and recovery are not optional; they are mandatory. Sleep is the state in which your body releases the most growth hormone. If you are consistently getting less than seven hours of sleep per night, you are severely handicapping your potential gains.</p>',
  '<p>Form should always take precedence over the weight lifted. Lifting with your ego often results in injuries that can set you back for months. Take the time to perfect your technique, ideally by recording your sets and analyzing your biomechanics.</p>',
  '<p>Hydration impacts everything from joint lubrication to energy levels. Even a slight drop in hydration can lead to a significant decrease in power output. Aim to drink water consistently throughout the day, not just during your workout window.</p>',
  '<p>Micronutrients are just as crucial as your macros. Vitamins and minerals govern thousands of enzymatic reactions in your body, from energy production to muscle contraction. A diet rich in colorful vegetables ensures you are firing on all cylinders.</p>'
];

const para3 = [
  '<p>Incorporating flexibility and mobility work into your routine can drastically improve your range of motion. A better range of motion allows for greater muscle fiber recruitment during compound exercises like squats and deadlifts.</p>',
  '<p>Mental resilience is built under the bar. The discipline required to stick to a training and nutrition plan bleeds into every other aspect of life. Cultivating this mindset is arguably the most valuable benefit of a consistent fitness regimen.</p>',
  '<p>Finally, always remember that fitness is a marathon, not a sprint. Setting localized, realistic goals will keep you motivated. Celebrate the small victories, like hitting a new personal record or simply feeling more energetic during your daily tasks.</p>',
  '<p>Proper warm-ups drastically reduce the risk of structural injuries while simultaneously priming your central nervous system for the heavy loads to come. Spending just five minutes elevating your core body temperature pays massive dividends.</p>'
];

const conclusions = [
  '<p>As we wrap up this topic, remember that application is everything. Take one or two points from this guide and integrate them into your routine this week. Small, consistent changes yield the biggest results over time.</p>',
  '<p>We hope this detailed breakdown has provided you with clarity. Fitness does not have to be overly complicated. Stick to these core principles, remain patient, and the results you are looking for will inevitably follow.</p>',
  '<p>Stay dedicated to your path. The journey of transforming your body and health is challenging but immensely rewarding. Keep pushing your limits safely, and do not hesitate to reach out if you need further guidance.</p>',
  '<p>Your journey is unique, and progress will not always be entirely linear. Embrace the setbacks as learning opportunities, stay consistent with the foundational habits outlined here, and the transformation will occur.</p>'
];

function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

let modifiedCount = 0;

for (const file of files) {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  let titleMatch = content.match(/<h1>(.*?)<\/h1>/i);
  let pageTitle = titleMatch ? titleMatch[1].replace(/\| GymTranning/i, '').trim() : "Fitness Guide";
  
  let uniqueBody = `
    <h2>1. Understanding the Fundamentals</h2>
    ${sample(intros)}
    ${sample(para1)}
    
    <h2>2. Practical Application</h2>
    <p>When it comes to <strong>${pageTitle}</strong>, theory must translate into action. Here is how you can apply these concepts directly:</p>
    ${sample(para2)}
    
    <h2>3. Advanced Considerations</h2>
    ${sample(para3)}
    
    <h2>4. Final Thoughts</h2>
    ${sample(conclusions)}
  `;

  // Define regexes to strip out the known heavy repetitive blocks from these generic files
  const badPatterns = [
      /<p>Understanding everything about Cardio takes patience.*?<\/p>/gs,
      /<p>When we look closer at how your body behaves.*?<\/p>/gs,
      /<p>It is very easy to fall into bad habits.*?<\/p>/gs,
      /<p>Once you are completely comfortable.*?<\/p>/gs,
      /<p>To wrap things up, mastering Cardio is an incredibly.*?<\/p>/gs,
      /<h2>.*?<\/h2>/g, // Clear out existing headers inside prose to replace them cleanly
      /<p class="lead text-xl.*?<\/p>/g // Clear out old lead paragraphs
  ];

  // We want to replace the content *inside* the <div class="prose...
  // First, find that div
  const proseRegex = /(<div class="prose max-w-none[^>]*>)([\s\S]*?)(<div class="text-center bg-slate-50)/i;
  let match = content.match(proseRegex);
  
  if (match) {
        let insideProse = match[2];
        
        // Remove known bad spam paragraphs
        badPatterns.forEach(regex => {
            insideProse = insideProse.replace(regex, '');
        });
        
        // Clean up empty lines and remaining text fragments to ensure it's not messy
        // Actually, the previous files were generated entirely of these spam blocks + some video blocks.
        // Let's preserve video blocks if they exist inside the prose, or just inject our new body at the top.
        
        let newProse = match[1] + '\n' + uniqueBody + '\n' + insideProse + '\n' + match[3];
        content = content.replace(match[0], newProse);
        
        fs.writeFileSync(filePath, content, 'utf-8');
        modifiedCount++;
  }
}

console.log(`Successfully rewrote ${modifiedCount} ultimate-guide blog posts with unique content.`);
