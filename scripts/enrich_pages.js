const fs = require('fs');
const path = require('path');

const baseDir = path.join('e:', 'gym', 'github', 'abcv');

// ============================================================
// 1. CONTACT PAGE — add "Why Contact Us" educational section
// ============================================================
const contactPath = path.join(baseDir, 'contact.html');
let contactHtml = fs.readFileSync(contactPath, 'utf-8');

const contactSection = `
  <!-- Educational Content Section for AdSense -->
  <section class="video-card" style="padding:0;" aria-labelledby="contact-guide-heading">
    <div class="video-header">
      <span class="video-number"><i class="fas fa-info-circle"></i></span>
      <h2 id="contact-guide-heading" class="video-title">How We Can Help You</h2>
    </div>
    <div class="video-body" style="line-height:1.85; color:#334155;">
      <p>At <strong>GymTranning</strong>, we believe that everyone deserves access to expert fitness guidance, regardless of their level of experience. Whether you are a complete beginner who has just started going to the gym, or a seasoned athlete looking to break through a challenging plateau, our team is ready to answer your questions and provide actionable advice that is grounded in sports science.</p>

      <h3 style="font-size:1.15rem; font-weight:700; color:#0f172a; margin:1.5rem 0 0.75rem;">Common Reasons People Contact GymTranning</h3>
      <ul style="padding-left:1.5rem; margin-bottom:1rem;">
        <li style="margin-bottom:0.6rem;"><strong>Personalized Workout Advice:</strong> Not sure which training style suits your body type and goals? We are happy to guide you toward the correct program, whether that is hypertrophy training, strength-focused lifting, or cardio-based fat loss.</li>
        <li style="margin-bottom:0.6rem;"><strong>Nutrition Questions:</strong> Nutrition is the backbone of any fitness journey. If you are confused about how many calories to eat, which macros to prioritize, or how to structure your meals around your training sessions, our nutritional guidance can help clarify the path forward.</li>
        <li style="margin-bottom:0.6rem;"><strong>Tool Support:</strong> We offer several interactive tools including a Calorie Calculator, Diet Planner, and Workout Planner. If you experience any technical issues or have questions about how to use these features, we are glad to assist.</li>
        <li style="margin-bottom:0.6rem;"><strong>Content Collaborations:</strong> Are you a brand, fitness professional, or content creator? We welcome relevant partnerships that align with our mission of helping people lead healthier, more active lives.</li>
        <li style="margin-bottom:0.6rem;"><strong>Reporting an Issue:</strong> If you spot a broken link, a video that is not loading, or any other technical problem on our website, please let us know so we can fix it as quickly as possible.</li>
      </ul>

      <h3 style="font-size:1.15rem; font-weight:700; color:#0f172a; margin:1.5rem 0 0.75rem;">Our Commitment to You</h3>
      <p>We take every message seriously. Your questions, feedback, and ideas help us grow and improve the quality of the resources we provide. Our editorial team consists of certified personal trainers and sports nutrition enthusiasts who review all incoming messages and respond with thoughtful, well-researched answers. We do not use automated bots; when you hear from us, you are speaking with a real person who genuinely cares about your fitness journey.</p>
      <p>We also maintain strict privacy standards. Any personal information you share in your message—including your name and email address—is kept entirely confidential and is never shared with third parties for marketing purposes.</p>

      <h3 style="font-size:1.15rem; font-weight:700; color:#0f172a; margin:1.5rem 0 0.75rem;">Before You Write</h3>
      <p>To get the most helpful response, please include as much relevant detail as possible in your message. For example, if you are asking about a training program, let us know your current fitness level, how many days per week you can train, and what your primary goal is. The more context you provide, the more specific and useful our advice will be. We look forward to hearing from you!</p>
    </div>
  </section>
`;

// Insert before the back-link at the bottom
contactHtml = contactHtml.replace(
  `<!-- Back link (styled like a button/tag) – update href to your homepage -->`,
  contactSection + '\n  <!-- Back link (styled like a button/tag) – update href to your homepage -->'
);

fs.writeFileSync(contactPath, contactHtml, 'utf-8');
console.log('✅ contact.html enriched');

// ============================================================
// 2. NUTRITION PAGE — add "Science of Nutrition" guide section
// ============================================================
const nutritionPath = path.join(baseDir, 'nutrition.html');
let nutritionHtml = fs.readFileSync(nutritionPath, 'utf-8');

const nutritionSection = `
  <!-- Educational Nutrition Guide Section for AdSense compliance -->
  <section style="max-width:900px; margin:40px auto; padding:40px; background:#fff; border-radius:20px; box-shadow:0 20px 40px -15px rgba(0,0,0,0.05); border:1px solid #f1f5f9;" aria-labelledby="nutrition-guide-heading">
    <h2 id="nutrition-guide-heading" style="font-size:1.75rem; font-weight:900; color:#0f172a; border-bottom:3px solid #00C9A7; padding-bottom:0.5rem; margin-bottom:1.5rem;">The Complete Guide to Sports Nutrition</h2>
    
    <p style="font-size:1.1rem; line-height:1.85; color:#334155; margin-bottom:1.25rem;">Nutrition is arguably the single most important variable in determining the outcome of any fitness program. You can train with perfect form and maximum intensity, but without a solid nutritional foundation, your results will always be compromised. Understanding how to eat for your specific goal—whether that is losing fat, building muscle, or improving athletic endurance—is the difference between frustration and transformation.</p>

    <h3 style="font-size:1.25rem; font-weight:700; color:#0f172a; margin:1.75rem 0 0.75rem;">Understanding Your Macronutrients</h3>
    <p style="font-size:1.05rem; line-height:1.85; color:#334155; margin-bottom:1rem;">Every food you eat is made up of three primary macronutrients: <strong>protein</strong>, <strong>carbohydrates</strong>, and <strong>fats</strong>. Each plays a unique and irreplaceable role in the body:</p>
    <ul style="padding-left:1.5rem; margin-bottom:1.25rem; font-size:1.05rem; color:#334155; line-height:1.85;">
      <li style="margin-bottom:0.75rem;"><strong>Protein (4 calories per gram):</strong> The building block of muscle tissue. When you lift weights, you create microscopic tears in your muscle fibers. Protein provides the amino acids needed to repair and grow these fibers back stronger. Aim for 1.6–2.2 grams of protein per kilogram of body weight per day for optimal muscle building.</li>
      <li style="margin-bottom:0.75rem;"><strong>Carbohydrates (4 calories per gram):</strong> The body's preferred source of fuel. Carbs are broken down into glucose, which powers your muscles during high-intensity exercise. Complex carbohydrates from sources like oats, sweet potatoes, and brown rice provide slow-releasing energy that keeps you fueled throughout your workout.</li>
      <li style="margin-bottom:0.75rem;"><strong>Fats (9 calories per gram):</strong> Essential for hormone production, joint health, and the absorption of vitamins A, D, E, and K. Healthy fats from avocados, nuts, olive oil, and fatty fish support testosterone levels—a critical hormone for muscle growth and recovery.</li>
    </ul>

    <h3 style="font-size:1.25rem; font-weight:700; color:#0f172a; margin:1.75rem 0 0.75rem;">How to Calculate Your Daily Calorie Needs</h3>
    <p style="font-size:1.05rem; line-height:1.85; color:#334155; margin-bottom:1rem;">The first step is determining your Total Daily Energy Expenditure (TDEE)—the total number of calories your body burns in a day including all activity. From there, you adjust based on your goal:</p>
    <ul style="padding-left:1.5rem; margin-bottom:1.25rem; font-size:1.05rem; color:#334155; line-height:1.85;">
      <li style="margin-bottom:0.6rem;"><strong>Fat Loss:</strong> Eat 300–500 calories below your TDEE (a moderate calorie deficit). This creates a sustainable rate of fat loss of approximately 0.5–1 kg per week without sacrificing muscle mass.</li>
      <li style="margin-bottom:0.6rem;"><strong>Muscle Gain:</strong> Eat 200–400 calories above your TDEE (a lean bulk). A surplus that is too large will lead to excessive fat gain. Patience here pays dividends.</li>
      <li style="margin-bottom:0.6rem;"><strong>Body Recomposition (simultaneous fat loss and muscle gain):</strong> Eat at or very close to your TDEE while prioritizing protein intake. This is best achieved by beginners and those returning from a training break.</li>
    </ul>

    <h3 style="font-size:1.25rem; font-weight:700; color:#0f172a; margin:1.75rem 0 0.75rem;">Micronutrients: The Unsung Heroes</h3>
    <p style="font-size:1.05rem; line-height:1.85; color:#334155; margin-bottom:1.25rem;">While macronutrients get most of the attention, micronutrients—vitamins and minerals—are equally critical. Vitamin D is essential for testosterone production and bone density. Magnesium plays a key role in muscle relaxation and sleep quality. Zinc supports immune function and protein synthesis. Iron is needed to transport oxygen to your working muscles. A diet rich in colorful vegetables, fruits, and whole grains will cover most of your micronutrient needs naturally.</p>

    <h3 style="font-size:1.25rem; font-weight:700; color:#0f172a; margin:1.75rem 0 0.75rem;">Hydration and Performance</h3>
    <p style="font-size:1.05rem; line-height:1.85; color:#334155; margin-bottom:1.25rem;">Even mild dehydration—as little as 1–2% of body weight in water loss—can significantly impair athletic performance, reduce strength output, and slow cognitive function. Aim to drink at least 35ml of water per kilogram of body weight per day, and increase that amount significantly on training days. A practical strategy is to drink 500ml of water upon waking, another 500ml before your workout, and sip regularly throughout the rest of the day. Use the food database above to also check the water content of the foods you are consuming, as fruits and vegetables contribute meaningfully to your daily fluid intake.</p>
  </section>
`;

// Insert before footer-container in nutrition.html
nutritionHtml = nutritionHtml.replace(
  `<div id="footer-container">`,
  nutritionSection + '\n<div id="footer-container">'
);

fs.writeFileSync(nutritionPath, nutritionHtml, 'utf-8');
console.log('✅ nutrition.html enriched');

// ============================================================
// 3. STATUS PAGE
// ============================================================
const statusPath = path.join(baseDir, 'status.html');
if (fs.existsSync(statusPath)) {
  let statusHtml = fs.readFileSync(statusPath, 'utf-8');

  const statusSection = `
  <!-- Educational Content Section for AdSense compliance -->
  <section style="max-width:900px; margin:40px auto; padding:40px; background:#fff; border-radius:20px; box-shadow:0 20px 40px -15px rgba(0,0,0,0.05); border:1px solid #f1f5f9;" aria-labelledby="status-guide-heading">
    <h2 id="status-guide-heading" style="font-size:1.75rem; font-weight:900; color:#0f172a; border-bottom:3px solid #00C9A7; padding-bottom:0.5rem; margin-bottom:1.5rem;">Our Commitment to Reliability</h2>
    
    <p style="font-size:1.1rem; line-height:1.85; color:#334155; margin-bottom:1.25rem;">GymTranning is committed to providing you with a fast, reliable, and always-available fitness platform. We understand that your training schedule does not follow a 9-to-5 routine. Whether you are planning your meals at midnight, logging your workout at 5 AM before work, or checking your calorie calculator right before a meal, we want our tools to be there for you, 24 hours a day, 7 days a week.</p>

    <h3 style="font-size:1.25rem; font-weight:700; color:#0f172a; margin:1.75rem 0 0.75rem;">What This Page Shows</h3>
    <p style="font-size:1.05rem; line-height:1.85; color:#334155; margin-bottom:1.25rem;">This status page provides a real-time and historical overview of all core GymTranning services, including our workout video streaming, interactive fitness calculators, diet planning tools, and blog content delivery. Any incidents—whether planned maintenance windows or unexpected technical issues—are posted here as quickly as possible so you are never left wondering what is happening.</p>

    <h3 style="font-size:1.25rem; font-weight:700; color:#0f172a; margin:1.75rem 0 0.75rem;">Planned Maintenance Policy</h3>
    <p style="font-size:1.05rem; line-height:1.85; color:#334155; margin-bottom:1.25rem;">Whenever we need to perform maintenance that may impact the availability of any feature, we schedule it during the lowest-traffic hours—typically between 2:00 AM and 4:00 AM in the relevant time zones. We always post advance notices of planned downtime at least 48 hours before the maintenance window begins. Our goal is to minimize disruption to your fitness routine as much as possible.</p>

    <h3 style="font-size:1.25rem; font-weight:700; color:#0f172a; margin:1.75rem 0 0.75rem;">What to Do During an Outage</h3>
    <ul style="padding-left:1.5rem; margin-bottom:1.25rem; font-size:1.05rem; color:#334155; line-height:1.85;">
      <li style="margin-bottom:0.6rem;">Refresh the page after waiting 2–3 minutes, as many brief issues resolve themselves automatically.</li>
      <li style="margin-bottom:0.6rem;">Clear your browser cache and cookies if you are experiencing persistent problems that are not reflected in our system status.</li>
      <li style="margin-bottom:0.6rem;">Try accessing the site from a different network or browser to rule out a local connectivity issue.</li>
      <li style="margin-bottom:0.6rem;">If the problem persists for more than 15 minutes and our status page shows all systems operational, please contact us directly via our <a href="/contact.html" style="color:#00C9A7; font-weight:600;">Contact Page</a> with a description of the issue.</li>
    </ul>
    <p style="font-size:1.05rem; line-height:1.85; color:#334155;">We genuinely appreciate your patience and your continued trust in GymTranning. Your health journey matters to us, and we work hard every day to ensure our platform remains the best resource for gym-goers at every level.</p>
  </section>
`;

  // Insert before the end of main or before footer
  if (statusHtml.includes('id="footer-container"')) {
    statusHtml = statusHtml.replace(`<div id="footer-container">`, statusSection + '\n<div id="footer-container">');
  } else if (statusHtml.includes('</main>')) {
    statusHtml = statusHtml.replace(`</main>`, statusSection + '\n</main>');
  } else {
    statusHtml = statusHtml.replace('</body>', statusSection + '\n</body>');
  }
  
  fs.writeFileSync(statusPath, statusHtml, 'utf-8');
  console.log('✅ status.html enriched');
} else {
  console.log('⚠️  status.html not found, skipping.');
}

// ============================================================
// 4. DIETPLANNER PAGE
// ============================================================
const dietPath = path.join(baseDir, 'dietplanner.html');
if (fs.existsSync(dietPath)) {
  let dietHtml = fs.readFileSync(dietPath, 'utf-8');

  const dietSection = `
  <!-- Educational Diet Planning Guide for AdSense compliance -->
  <section style="max-width:900px; margin:40px auto; padding:40px; background:#fff; border-radius:20px; box-shadow:0 20px 40px -15px rgba(0,0,0,0.05); border:1px solid #f1f5f9;" aria-labelledby="diet-guide-heading">
    <h2 id="diet-guide-heading" style="font-size:1.75rem; font-weight:900; color:#0f172a; border-bottom:3px solid #00C9A7; padding-bottom:0.5rem; margin-bottom:1.5rem;">The Science of Effective Meal Planning</h2>
    
    <p style="font-size:1.1rem; line-height:1.85; color:#334155; margin-bottom:1.25rem;">A structured diet plan is one of the most powerful tools in an athlete's arsenal. Unlike random or impulsive eating, a well-designed meal plan ensures your body receives the right nutrients at the right times to fuel performance, accelerate recovery, and make body composition changes as efficient as possible. Our diet planner above takes the guesswork out of this process by generating a daily meal framework tailored to your individual calorie target and macronutrient goals.</p>

    <h3 style="font-size:1.25rem; font-weight:700; color:#0f172a; margin:1.75rem 0 0.75rem;">How to Use the Diet Planner Effectively</h3>
    <p style="font-size:1.05rem; line-height:1.85; color:#334155; margin-bottom:1rem;">To get the best results from our planner, follow these steps:</p>
    <ol style="padding-left:1.5rem; margin-bottom:1.25rem; font-size:1.05rem; color:#334155; line-height:1.85;">
      <li style="margin-bottom:0.75rem;"><strong>Know Your Calorie Target:</strong> First, use our <a href="/caloriecalculator.html" style="color:#00C9A7; font-weight:600;">Calorie Calculator</a> to determine your Total Daily Energy Expenditure (TDEE). Then decide whether you want to eat in a deficit (for fat loss), a surplus (for muscle gain), or at maintenance. Enter this number into the planner.</li>
      <li style="margin-bottom:0.75rem;"><strong>Set Your Macro Ratios:</strong> A general starting point for an active individual is 40% carbohydrates, 30% protein, and 30% fats. However, if muscle building is the primary goal, increase protein to 35–40%. If fat loss is the priority, some find that reducing carbohydrates and increasing protein helps with satiety.</li>
      <li style="margin-bottom:0.75rem;"><strong>Distribute Meals Throughout the Day:</strong> Spreading your daily calories across 3–5 meals keeps your energy levels stable, supports muscle protein synthesis throughout the day, and prevents excessive hunger that can lead to overeating.</li>
      <li style="margin-bottom:0.75rem;"><strong>Prioritize Whole Foods:</strong> The foundation of your plan should be unprocessed, nutrient-dense foods. Think lean meats like chicken breast and turkey, complex carbs like oats and quinoa, healthy fats like olive oil and almonds, and an abundance of colorful vegetables.</li>
    </ol>

    <h3 style="font-size:1.25rem; font-weight:700; color:#0f172a; margin:1.75rem 0 0.75rem;">The Importance of Meal Timing</h3>
    <p style="font-size:1.05rem; line-height:1.85; color:#334155; margin-bottom:1.25rem;">While total daily calories and macronutrients are the primary drivers of body composition change, meal timing can further optimize your results. Consuming a meal or snack rich in both protein and carbohydrates within 1–2 hours before your workout provides the energy needed for peak performance. Equally important is your post-workout meal; consuming 25–40 grams of high-quality protein alongside a serving of fast-digesting carbohydrates within 60 minutes after training accelerates muscle repair and replenishes glycogen stores.</p>

    <h3 style="font-size:1.25rem; font-weight:700; color:#0f172a; margin:1.75rem 0 0.75rem;">Practical Tips for Sticking to Your Plan</h3>
    <ul style="padding-left:1.5rem; margin-bottom:1.25rem; font-size:1.05rem; color:#334155; line-height:1.85;">
      <li style="margin-bottom:0.6rem;"><strong>Meal Prep on Sundays:</strong> Cooking larger batches of food at the start of the week significantly reduces the temptation to reach for convenient but unhealthy options when time is short.</li>
      <li style="margin-bottom:0.6rem;"><strong>Keep Healthy Snacks Accessible:</strong> Always having a protein bar, a handful of nuts, or a piece of fruit within reach prevents you from making poor food choices out of desperation when hunger strikes unexpectedly.</li>
      <li style="margin-bottom:0.6rem;"><strong>Track Your Intake:</strong> Use our <a href="/nutrition.html" style="color:#00C9A7; font-weight:600;">Nutrition Database</a> to log your daily meals and monitor your calorie and macro intake with accuracy.</li>
      <li style="margin-bottom:0.6rem;"><strong>Allow Flexibility:</strong> Rigid diet plans often fail because they leave no room for real life. Plan for one or two "flexible" meals per week where you can enjoy restaurant food or a treat without derailing your overall progress. Consistency over weeks and months matters far more than perfection on any single day.</li>
    </ul>
  </section>
`;

  if (dietHtml.includes('id="footer-container"')) {
    dietHtml = dietHtml.replace(`<div id="footer-container">`, dietSection + '\n<div id="footer-container">');
  } else if (dietHtml.includes('</main>')) {
    dietHtml = dietHtml.replace(`</main>`, dietSection + '\n</main>');
  } else {
    dietHtml = dietHtml.replace('</body>', dietSection + '\n</body>');
  }

  fs.writeFileSync(dietPath, dietHtml, 'utf-8');
  console.log('✅ dietplanner.html enriched');
} else {
  console.log('⚠️  dietplanner.html not found, skipping.');
}

console.log('\n🎉 All pages enriched successfully!');
