# Add FAQPage schema and FAQ sections to all blog articles
$blogDir = "E:\gym\abcv-main\abcv-main\blog"

# FAQ templates by category
$faqTemplates = @{
    "Training" = @{
        q1 = "What is {0}?"
        a1 = "{0} is a training method focused on improving exercise performance, muscle engagement, and overall strength development through proper technique and progressive programming."
        q2 = "How does {0} improve workout results?"
        a2 = "Research shows that {0} enhances muscle activation, improves movement efficiency, and reduces injury risk when performed correctly and consistently."
        q3 = "Is {0} suitable for beginners?"
        a3 = "Yes, beginners can benefit from {0} by starting with lighter loads, mastering proper form first, then progressively increasing intensity as they build strength and confidence."
        q4 = "What are common mistakes with {0}?"
        a4 = "Common mistakes include using too much weight too soon, neglecting proper form, skipping warm-ups, and not allowing adequate recovery between sessions."
    }
    "Training Science" = @{
        q1 = "What is {0}?"
        a1 = "{0} is an evidence-based training principle that explains the physiological and biomechanical mechanisms behind effective exercise programming and muscle adaptation."
        q2 = "How does {0} work?"
        a2 = "{0} works by applying scientific principles of muscle physiology, neural adaptation, and energy system development to optimize training outcomes."
        q3 = "Who should use {0}?"
        a3 = "This approach is ideal for coaches, experienced lifters, and fitness enthusiasts who want to understand the science behind their training for better results."
    }
    "Nutrition" = @{
        q1 = "What is {0}?"
        a1 = "{0} is a nutrition strategy designed to optimize energy intake, macronutrient distribution, and meal timing for better body composition and athletic performance."
        q2 = "How does {0} affect body composition?"
        a2 = "Studies show that {0} can significantly impact muscle preservation, fat loss, and metabolic health when properly aligned with individual goals and activity levels."
        q3 = "Is {0} safe for everyone?"
        a3 = "Most healthy individuals can safely follow {0}, but those with medical conditions, eating disorders, or specific dietary needs should consult a healthcare professional first."
        q4 = "What are common mistakes with {0}?"
        a4 = "Common mistakes include being too restrictive, ignoring hunger cues, not adjusting for activity levels, and expecting rapid results instead of sustainable progress."
    }
    "Recovery" = @{
        q1 = "What is {0}?"
        a1 = "{0} is a recovery technique that helps athletes and active individuals optimize their body's repair processes between training sessions for better performance and injury prevention."
        q2 = "How does {0} speed up recovery?"
        a2 = "Evidence indicates that {0} enhances blood flow, reduces inflammation, and promotes muscle tissue repair, allowing for more frequent and higher-quality training sessions."
        q3 = "Who should use {0}?"
        a3 = "Anyone engaged in regular physical activity can benefit from {0}, especially those training at moderate to high intensity multiple times per week."
        q4 = "What are the risks of {0}?"
        a4 = "While generally safe, improper application of {0} may lead to over-reliance on passive recovery methods rather than addressing underlying training or nutrition issues."
    }
    "Lifestyle" = @{
        q1 = "What is {0}?"
        a1 = "{0} is a psychological approach that helps individuals develop the mental skills, habits, and mindsets needed for consistent fitness success and long-term behavior change."
        q2 = "How does {0} improve fitness outcomes?"
        a2 = "Research demonstrates that {0} increases adherence to exercise programs, improves motivation sustainability, and helps overcome common psychological barriers to training."
        q3 = "Is {0} suitable for everyone?"
        a3 = "Yes, {0} principles can benefit anyone pursuing fitness goals, though individuals with mental health concerns should seek professional support alongside these strategies."
    }
    "Cardio" = @{
        q1 = "What is {0}?"
        a1 = "{0} is a cardiovascular training method that improves heart health, lung capacity, and endurance through targeted aerobic or anaerobic exercise protocols."
        q2 = "How does {0} benefit heart health?"
        a2 = "Studies show that {0} strengthens the cardiovascular system, lowers resting heart rate, improves blood pressure, and enhances overall cardiorespiratory fitness."
        q3 = "Is {0} safe for beginners?"
        a3 = "Yes, beginners can start {0} at lower intensities and gradually progress. Those with heart conditions or other health concerns should consult a doctor first."
    }
    "Muscle Gain" = @{
        q1 = "What is {0}?"
        a1 = "{0} is a hypertrophy-focused training strategy designed to maximize muscle fiber recruitment, metabolic stress, and mechanical tension for optimal muscle growth."
        q2 = "How does {0} stimulate muscle growth?"
        a2 = "Research indicates that {0} works through the three primary hypertrophy mechanisms: mechanical tension, metabolic stress, and muscle damage, triggering protein synthesis."
        q3 = "How often should I train for {0}?"
        a3 = "Evidence suggests training each muscle group 2-3 times per week with appropriate volume and intensity yields optimal results for most individuals."
    }
    "Strength" = @{
        q1 = "What is {0}?"
        a1 = "{0} is a strength development principle that focuses on improving neuromuscular efficiency, movement mechanics, and load-bearing capacity for maximal force production."
        q2 = "How does {0} build strength?"
        a2 = "Studies demonstrate that {0} enhances neural drive, improves intermuscular coordination, and increases cross-sectional area of muscle fibers over time."
        q3 = "Is {0} safe for beginners?"
        a3 = "Yes, when learned with proper technique and appropriate loads, {0} is safe and beneficial for beginners. Start with lighter weights and focus on form."
    }
    "Mobility" = @{
        q1 = "What is {0}?"
        a1 = "{0} is a movement practice designed to improve joint range of motion, tissue flexibility, and movement quality for better exercise performance and injury prevention."
        q2 = "How does {0} prevent injuries?"
        a2 = "Research shows that {0} improves tissue extensibility, enhances joint lubrication, and corrects movement imbalances that commonly lead to training-related injuries."
        q3 = "Who should practice {0}?"
        a3 = "Anyone experiencing joint stiffness, limited range of motion, or wanting to improve their exercise form can benefit from incorporating {0} into their routine."
    }
    "Guide" = @{
        q1 = "What is {0}?"
        a1 = "{0} provides practical, actionable advice to help you make informed decisions about your fitness setup, equipment, and training approach."
        q2 = "How do I get started with {0}?"
        a2 = "Start by assessing your current situation, setting clear goals, and following the step-by-step guidance provided in this comprehensive resource."
        q3 = "What budget do I need for {0}?"
        a3 = "The investment varies based on your specific needs and goals. This guide covers options across different price points to suit various budgets."
    }
    "Health" = @{
        q1 = "What is {0}?"
        a1 = "{0} is a health-focused practice that supports overall wellbeing through improved physiological function, better lifestyle habits, and evidence-based self-care strategies."
        q2 = "How does {0} improve health?"
        a2 = "Research indicates that {0} positively impacts multiple health markers including hormonal balance, immune function, metabolic health, and sleep quality."
        q3 = "Is {0} safe for everyone?"
        a3 = "While generally beneficial, individuals with specific health conditions should consult their healthcare provider before making significant changes to their routine."
    }
    "Physiology" = @{
        q1 = "What is {0}?"
        a1 = "{0} is a physiological process that explains how the body adapts to exercise stress, repairs tissue, and improves functional capacity over time."
        q2 = "How does the body adapt through {0}?"
        a2 = "The body adapts through complex cellular signaling pathways that regulate protein synthesis, mitochondrial biogenesis, and neural adaptations to training stimuli."
        q3 = "How long does {0} take to show results?"
        a3 = "Initial adaptations can occur within 2-4 weeks, while significant physiological changes typically require 8-12 weeks of consistent, progressive training."
    }
}

# Find the right FAQ template for a given category
function Get-FAQTemplate($category) {
    if ($faqTemplates.ContainsKey($category)) {
        return $faqTemplates[$category]
    }
    return $faqTemplates["Training"]
}

$total = 0; $faqSchemaAdded = 0; $faqSectionAdded = 0

Get-ChildItem "$blogDir\*.html" | ForEach-Object {
    $file = $_.FullName
    $content = [System.IO.File]::ReadAllText($file)
    $orig = $content
    $total++
    $fileChanged = $false

    # Extract title and category
    $title = ""
    if ($content -match '<title>([^<]+)</title>') { $title = $Matches[1] }
    $title = $title -replace '\s*\|\s*GymTranning$', ''
    
    $category = "Training"
    if ($content -match 'rounded-full text-sm font-bold mb-4 uppercase tracking-widest">([^<]+)</span>') {
        $catText = $Matches[1].Trim()
        $catMap = @{
            "Training" = "Training"; "Training Science" = "Training Science"; "Training Fundamentals" = "Training"
            "Advanced Training" = "Training"; "Biomechanics" = "Training Science"
            "Nutrition" = "Nutrition"; "Lifestyle" = "Lifestyle"
            "Recovery" = "Recovery"; "Health" = "Health"; "Physiology" = "Physiology"
            "Guide" = "Guide"; "Mobility" = "Mobility"
            "Cardio" = "Cardio"; "Muscle Gain" = "Muscle Gain"; "Strength" = "Strength"
        }
        if ($catMap.ContainsKey($catText)) { $category = $catMap[$catText] }
    }

    # Extract clean topic from Quick Answer if available
    $topic = $title
    if ($content -match '(?s)<strong>What is ([^<]+?)\?</strong> ([^<]+) is a ') {
        $topic = $Matches[1].Trim()
    } else {
        # Fallback: extract from title
        $topic = $title
        if ($topic -match '^([^:]+):') { $topic = $Matches[1].Trim() }
        if ($topic.Length -gt 50) { $topic = $topic.Substring(0, 50) }
    }

    $faq = Get-FAQTemplate $category
    
    # Build FAQ items
    $questions = @()
    for ($i = 1; $i -le 4; $i++) {
        $qKey = "q$i"
        $aKey = "a$i"
        if ($faq.ContainsKey($qKey) -and $faq.ContainsKey($aKey)) {
            $question = $faq[$qKey] -f $topic
            $answer = $faq[$aKey] -f $topic
            $questions += @{q = $question; a = $answer}
        }
    }
    
    if ($questions.Count -eq 0) { return }

    # 1. Add FAQPage JSON-LD schema
    if ($content -notmatch '"@type":\s*"FAQPage"') {
        $faqJson = @"
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
"@
        $faqItems = @()
        foreach ($item in $questions) {
            $escQ = $item.q -replace '"', '\"'
            $escA = $item.a -replace '"', '\"'
            $faqItems += @"
        {
            "@type": "Question",
            "name": "$escQ",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "$escA"
            }
        }
"@
        }
        $faqJson += ($faqItems -join ",") + "`n    ]`n}</script>"
        
        # Insert before </head>
        if ($content -match '(?s)(.*)(</head>)') {
            $headContent = $Matches[1]
            $headEnd = $Matches[2]
            $content = $headContent + "`n$faqJson`n$headEnd"
            $faqSchemaAdded++
            $fileChanged = $true
        }
    }

    # 2. Add visible FAQ section at end of article-content
    if ($content -notmatch 'class="faq-section"|id="faq"|Frequently Asked Questions') {
        $faqHtml = @"

<div class="faq-section mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
<h2 class="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
"@
        foreach ($item in $questions) {
            $faqHtml += @"

<div class="mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
<h3 class="font-bold text-lg mb-2">$($item.q)</h3>
<p>$($item.a)</p>
</div>
"@
        }
        $faqHtml += @"
</div>
"@
        
        # Insert before the disclaimer block or at end of article-content
        if ($content -match '(?s)(<div class="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">)') {
            # Insert before disclaimer
            $content = $content -replace [regex]::Escape($Matches[1]), "$faqHtml`n`n$($Matches[1])"
            $faqSectionAdded++
            $fileChanged = $true
        } elseif ($content -match '(?s)(</div>\s*</article>)') {
            # Insert before article end
            $content = $content -replace [regex]::Escape($Matches[1]), "$faqHtml`n`n$($Matches[1])"
            $faqSectionAdded++
            $fileChanged = $true
        }
    }

    if ($fileChanged) {
        [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
    }
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "FAQ Schema & Section Results" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Files scanned:           $total"
Write-Host "FAQPage schema added:    $faqSchemaAdded"
Write-Host "FAQ sections added:      $faqSectionAdded"
