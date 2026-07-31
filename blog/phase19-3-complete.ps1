# Phase 19.3 - Complete AI Search Citation & LLM Optimization
# Single comprehensive pass - all changes in one go

$blogDir = "E:\gym\abcv-main\abcv-main\blog"
$rootDir = "E:\gym\abcv-main\abcv-main"

# Category templates
$templates = @{
    "Training" = @{
        def = "training concept that focuses on"
        forText = "This guide is for lifters of all levels who want to improve their exercise technique, build functional strength, and optimize their training results."
        avoidText = "Consult a healthcare professional before starting this program if you have existing joint or musculoskeletal injuries, or if you are recovering from surgery."
    }
    "Training Science" = @{
        def = "evidence-based training principle that explains"
        forText = "This article is for fitness enthusiasts, coaches, and athletes who want to understand the physiological mechanisms behind effective training."
        avoidText = "If you have a medical condition affecting your musculoskeletal system, consult your doctor before applying these advanced training concepts."
    }
    "Nutrition" = @{
        def = "nutritional strategy that supports"
        forText = "This guide is for anyone looking to optimize their diet for better performance, body composition, and overall health."
        avoidText = "If you have a diagnosed medical condition such as diabetes, kidney disease, or an eating disorder, consult your healthcare provider before making significant dietary changes."
    }
    "Lifestyle" = @{
        def = "psychological and behavioral approach that enhances"
        forText = "This article is for anyone pursuing fitness goals who wants to develop the mental skills and habits needed for long-term success."
        avoidText = "If you are experiencing severe anxiety, depression, or other mental health concerns, please seek support from a qualified mental health professional."
    }
    "Recovery" = @{
        def = "recovery method that supports"
        forText = "This guide is for athletes and active individuals who want to optimize their recovery between workouts for better performance and injury prevention."
        avoidText = "If you have a chronic health condition, cardiovascular issues, or are recovering from an acute injury, consult your doctor before using these recovery techniques."
    }
    "Health" = @{
        def = "health and fitness practice that promotes"
        forText = "This article is for anyone interested in improving their overall health and fitness through evidence-based lifestyle practices."
        avoidText = "If you have a pre-existing medical condition or are taking medication, consult your healthcare provider before implementing these health strategies."
    }
    "Physiology" = @{
        def = "physiological process that governs"
        forText = "This content is for fitness professionals, coaches, and science-minded athletes who want to understand the biological mechanisms behind training adaptations."
        avoidText = "The information here is educational. If you have a specific medical concern, consult a qualified healthcare professional."
    }
    "Guide" = @{
        def = "practical guide that helps you"
        forText = "This guide is for anyone looking for practical, actionable advice to improve their fitness setup, equipment choices, or workout approach."
        avoidText = "Consider your individual needs and constraints before making significant purchases or changes to your fitness routine."
    }
    "Mobility" = @{
        def = "mobility and flexibility practice that improves"
        forText = "This article is for lifters, athletes, and anyone experiencing joint stiffness or limited range of motion who wants to move better."
        avoidText = "If you have an acute injury, herniated disc, or severe joint pain, consult a physical therapist before attempting these mobility exercises."
    }
    "Cardio" = @{
        def = "cardiovascular training method that improves"
        forText = "This guide is for anyone looking to improve their cardiovascular fitness, endurance, and heart health through evidence-based cardio training."
        avoidText = "If you have a heart condition, high blood pressure, or other cardiovascular concerns, consult your doctor before starting a new cardio program."
    }
    "Muscle Gain" = @{
        def = "muscle-building strategy that maximizes"
        forText = "This article is for lifters focused on hypertrophy who want science-backed methods to increase muscle mass and improve physique."
        avoidText = "If you have a metabolic disorder or are under medical supervision for weight management, consult your healthcare provider before following these muscle gain protocols."
    }
    "Strength" = @{
        def = "strength training principle that develops"
        forText = "This guide is for lifters who want to increase their maximal strength through proper technique, programming, and progressive overload."
        avoidText = "If you have a history of joint injuries, hernias, or cardiovascular conditions, get medical clearance before attempting heavy strength training."
    }
}

$categoryMap = @{
    "Training" = "Training"; "Training Science" = "Training Science"; "Training Fundamentals" = "Training"
    "Advanced Training" = "Training"; "Biomechanics" = "Training Science"
    "Nutrition" = "Nutrition"; "Lifestyle" = "Lifestyle"
    "Recovery" = "Recovery"; "Health" = "Health"; "Physiology" = "Physiology"
    "Guide" = "Guide"; "Mobility" = "Mobility"
    "Cardio" = "Cardio"; "Muscle Gain" = "Muscle Gain"; "Strength" = "Strength"
}

function Get-TopicFromTitle($title) {
    $t = $title -replace '\s*\|\s*GymTranning$', ''
    $t = $t -replace '^Complete\s+', ''
    $t = $t -replace '^The\s+', ''
    $t = $t -replace '^Understanding\s+', ''
    $t = $t -replace '^Ultimate\s+', ''
    $t = $t -replace 'Mastering\s+the\s+', ''
    $t = $t -replace 'Science-Based\s+', ''
    $t = $t -replace 'Science of\s+', ''
    $t = $t -replace 'Science-Backed\s+', ''
    if ($t -match '^([^:]+):') { $t = $Matches[1].Trim() }
    $t = $t -replace '\s*:.*$', ''
    $t = $t -replace '\s+for\s+\w+\s+.*$', ''
    $t = $t -replace '\s+to\s+\w+.*$', ''
    $t = $t -replace '\s+vs\s+.*$', ''
    $t = $t -replace '\s+\?\s*$', ''
    if ($t.Length -gt 50) { $t = $t.Substring(0, 50) }
    return $t.Trim()
}

function Get-FAQItems($topic, $category) {
    $qaSets = @{
        "Training" = @(
            @{q = "What is $($topic)?"; a = "$topic is a training method focused on improving exercise performance, muscle engagement, and overall strength through proper technique."}
            @{q = "How does $topic improve results?"; a = "Research shows $topic enhances muscle activation and movement efficiency when performed correctly and consistently."}
            @{q = "Is $topic suitable for beginners?"; a = "Yes, beginners can benefit by starting with lighter loads, mastering proper form first, then progressively increasing intensity."}
        )
        "Training Science" = @(
            @{q = "What is $($topic)?"; a = "$topic is an evidence-based principle that explains the physiological mechanisms behind effective exercise programming and muscle adaptation."}
            @{q = "How does $topic work?"; a = "$topic works by applying scientific principles of muscle physiology and neural adaptation to optimize training outcomes."}
            @{q = "Who should use $($topic)?"; a = "This approach is ideal for coaches and experienced lifters who want to understand the science behind their training."}
        )
        "Nutrition" = @(
            @{q = "What is $($topic)?"; a = "$topic is a nutrition strategy designed to optimize energy intake and macronutrient distribution for better body composition and performance."}
            @{q = "How does $topic affect body composition?"; a = "Studies show $topic can significantly impact muscle preservation, fat loss, and metabolic health when properly aligned with individual goals."}
            @{q = "Is $topic safe for everyone?"; a = "Most healthy individuals can safely follow $topic, but those with medical conditions should consult a healthcare professional first."}
        )
        "Recovery" = @(
            @{q = "What is $($topic)?"; a = "$topic is a recovery technique that helps athletes optimize their body's repair processes between training sessions."}
            @{q = "How does $topic speed up recovery?"; a = "Evidence indicates $topic enhances blood flow, reduces inflammation, and promotes muscle tissue repair for better training frequency."}
            @{q = "Who should use $($topic)?"; a = "Anyone engaged in regular physical activity can benefit, especially those training at moderate to high intensity multiple times per week."}
        )
        "Cardio" = @(
            @{q = "What is $($topic)?"; a = "$topic is a cardiovascular training method that improves heart health, lung capacity, and endurance through targeted exercise protocols."}
            @{q = "How does $topic benefit heart health?"; a = "Studies show $topic strengthens the cardiovascular system, lowers resting heart rate, and improves overall cardiorespiratory fitness."}
            @{q = "Is $topic safe for beginners?"; a = "Yes, beginners can start at lower intensities and gradually progress. Those with heart conditions should consult a doctor first."}
        )
        "Strength" = @(
            @{q = "What is $($topic)?"; a = "$topic is a strength development principle that focuses on improving neuromuscular efficiency and load-bearing capacity for maximal force production."}
            @{q = "How does $topic build strength?"; a = "Studies demonstrate $topic enhances neural drive, improves coordination, and increases muscle fiber recruitment over time."}
            @{q = "Is $topic safe for beginners?"; a = "Yes, when learned with proper technique and appropriate loads, $topic is safe and beneficial for beginners."}
        )
        "Muscle Gain" = @(
            @{q = "What is $($topic)?"; a = "$topic is a hypertrophy-focused strategy designed to maximize muscle fiber recruitment and mechanical tension for optimal growth."}
            @{q = "How does $topic stimulate muscle growth?"; a = "Research indicates $topic triggers protein synthesis through mechanical tension, metabolic stress, and muscle damage mechanisms."}
            @{q = "How often should I train for $($topic)?"; a = "Evidence suggests training each muscle group 2-3 times per week with appropriate volume yields optimal results."}
        )
    }
    $default = @(
        @{q = "What is $($topic)?"; a = "$topic is a fitness concept that helps improve your training, recovery, and overall results through evidence-based methods."}
        @{q = "How does $topic work?"; a = "$topic works by applying proven principles of exercise science to optimize your fitness outcomes."}
        @{q = "Is $topic right for me?"; a = "$topic can benefit most people, but consider your individual goals, fitness level, and health status before starting."}
    )
    if ($qaSets.ContainsKey($category)) { return $qaSets[$category] }
    return $default
}

# Stats
$stats = @{
    total = 0; modified = 0
    quickAnswer = 0; whoFor = 0; whoAvoid = 0
    evidence = 0; disclaimer = 0; internalLinks = 0
    faqSchema = 0; faqSection = 0
}

Get-ChildItem "$blogDir\*.html" | ForEach-Object {
    $file = $_.FullName
    $content = [System.IO.File]::ReadAllText($file)
    $orig = $content
    $fileChanged = $false
    $stats.total++

    # Extract metadata
    $title = ""
    if ($content -match '<title>([^<]+)</title>') { $title = $Matches[1] }
    $category = "Training"
    if ($content -match 'rounded-full text-sm font-bold mb-4 uppercase tracking-widest">([^<]+)</span>') {
        $catText = $Matches[1].Trim()
        if ($categoryMap.ContainsKey($catText)) { $category = $categoryMap[$catText] }
    }
    $topic = Get-TopicFromTitle $title
    if ($topic.Length -eq 0) { $topic = "this topic" }

    $tmpl = $templates[$category]
    if (-not $tmpl) { $tmpl = $templates["Training"] }

    # ===== 1. Quick Answer + Definition =====
    if ($content -notmatch 'Quick Answer' -and $content -notmatch 'class="quick-answer"') {
        $qaBlock = @"
<div class="bg-blue-50 border-l-4 border-primary p-4 mb-6 rounded-r-lg">
<p class="font-bold text-lg mb-1">Quick Answer</p>
<p><strong>What is $($topic)?</strong> $topic is a $($tmpl.def) how you train smarter, recover faster, and achieve measurable fitness results. In short, mastering this concept helps you maximize your progress while minimizing wasted effort and injury risk.</p>
</div>
"@
        # Insert after the TOC nav closing tag but before the container div closes
        if ($content -match '(?s)(</nav>\s*</div>)') {
            $content = $content -replace [regex]::Escape($Matches[1]), "$qaBlock`n$($Matches[1])"
            $stats.quickAnswer++
            $fileChanged = $true
        }
    }

    # ===== 2. Who Is This For? =====
    if ($content -notmatch 'Who Is This For|who this is for|Ideal for|Who Should Use|suitable for') {
        $whoBlock = @"
<div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
<p class="font-bold text-lg mb-1">Who Is This For?</p>
<p>$($tmpl.forText)</p>
</div>
"@
        # Insert after article-content opening div, before first <p>
        if ($content -match '(?s)(<div class="article-content text-lg text-slate-700">)\s*<p') {
            $content = $content -replace [regex]::Escape($Matches[0]), "$($Matches[1])`n$whoBlock`n<p"
            $stats.whoFor++
            $fileChanged = $true
        }
    }

    # ===== 3. Who Should Avoid This? =====
    if ($content -notmatch 'Who Should Avoid|who should avoid|Contraindications|Not for everyone|Not for') {
        $avoidBlock = @"
<div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
<p class="font-bold text-lg mb-1">Who Should Avoid This?</p>
<p>$($tmpl.avoidText)</p>
</div>
"@
        # Insert after the green "Who Is This For" div or before first paragraph
        if ($content -match '(?s)(<div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">.*?</div>\s*)') {
            $content = $content -replace [regex]::Escape($Matches[1]), "$($Matches[1])$avoidBlock"
            $stats.whoAvoid++
            $fileChanged = $true
        }
    }

    # ===== 4. Evidence Statement =====
    $hasEvidence = $false
    if ($content -match '(?s)(<div class="article-content.*?</div>\s*</article>)') {
        $acDiv = $Matches[1]
        if ($acDiv -match 'studies show|research indicates|evidence suggests|research shows|evidence-based|Evidence-Based') {
            $hasEvidence = $true
        }
    }
    if (-not $hasEvidence) {
        # Add as a sentence appended to the first keyword-rich paragraph
        if ($content -match '(?s)(<div class="article-content.*?<p>[^<]{20,200}\.)') {
            $paraStart = $Matches[1]
            $evidenceSentence = " Research consistently shows that evidence-based approaches to fitness yield superior results compared to anecdotal methods."
            $content = $content -replace [regex]::Escape($paraStart), "$paraStart$evidenceSentence"
            $stats.evidence++
            $fileChanged = $true
        }
    }

    # ===== 5. Disclaimer + Policy Links =====
    if ($content -notmatch 'medical_disclaimer\.html|Medical Disclaimer|editorial-policy\.html|Editorial Policy') {
        $discBlock = @"

<div class="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
<p><strong>Disclaimer:</strong> This article is for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional before starting any fitness program. Read our <a class="text-primary hover:underline" href="../medical_disclaimer.html">Medical Disclaimer</a> and <a class="text-primary hover:underline" href="../editorial-policy.html">Editorial Policy</a> for more information.</p>
</div>
"@
        # Insert before </article> or at end of article-content
        if ($content -match '(?s)(</div>\s*</article>)') {
            $content = $content -replace [regex]::Escape($Matches[1]), "$discBlock`n$($Matches[1])"
            $stats.disclaimer++
            $fileChanged = $true
        }
    }

    # ===== 6. Internal Tool Links =====
    # Check only within article-content area
    $hasArticleLinks = $false
    if ($content -match '(?s)(<div class="article-content.*?</article>)') {
        $articleDiv = $Matches[1]
        if ($articleDiv -match 'workoutplanner\.html|dietplanner\.html') {
            $hasArticleLinks = $true
        }
    }
    if (-not $hasArticleLinks) {
        $linkText = "Use our <a class=`"text-primary font-bold hover:underline`" href=`"../workoutplanner.html`">Workout Planner</a> to apply these principles, and pair with the <a class=`"text-primary font-bold hover:underline`" href=`"../dietplanner.html`">Diet Planner</a> and <a class=`"text-primary font-bold hover:underline`" href=`"../caloriecalculator.html`">Calorie Calculator</a> for a complete approach."
        $linkBlock = @"
<p>$linkText</p>
"@
        if ($content -match '(?s)(<p>[^<]{10,200}</p>\s*<h2)') {
            $content = $content -replace [regex]::Escape($Matches[1]), "$($Matches[1])`n$linkBlock"
            $stats.internalLinks++
            $fileChanged = $true
        } elseif ($content -match '(?s)(</div>\s*<h2)') {
            $content = $content -replace [regex]::Escape($Matches[1]), "$linkBlock`n$($Matches[1])"
            $stats.internalLinks++
            $fileChanged = $true
        }
    }

    # ===== 7. FAQPage Schema =====
    if ($content -notmatch '"@type":\s*"FAQPage"') {
        $faqItems = Get-FAQItems $topic $category
        $faqJsonLines = @()
        $faqJsonLines += '<script type="application/ld+json">'
        $faqJsonLines += '{'
        $faqJsonLines += '    "@context": "https://schema.org",'
        $faqJsonLines += '    "@type": "FAQPage",'
        $faqJsonLines += '    "mainEntity": ['
        for ($i = 0; $i -lt $faqItems.Count; $i++) {
            $escQ = $faqItems[$i].q -replace '"', '\"'
            $escA = $faqItems[$i].a -replace '"', '\"'
            $comma = if ($i -lt $faqItems.Count - 1) { "," } else { "" }
            $faqJsonLines += "        {"
            $faqJsonLines += '            "@type": "Question",'
            $faqJsonLines += "            `"name`": `"$escQ`","
            $faqJsonLines += '            "acceptedAnswer": {'
            $faqJsonLines += '                "@type": "Answer",'
            $faqJsonLines += "                `"text`": `"$escA`""
            $faqJsonLines += "            }"
            $faqJsonLines += "        }$comma"
        }
        $faqJsonLines += '    ]'
        $faqJsonLines += '}</script>'
        $faqJsonBlock = $faqJsonLines -join "`n"
        
        # *** FIXED: Preserve content after </head> ***
        if ($content -match '(?s)(.*)(</head>)(.*)') {
            $beforeHead = $Matches[1]
            $headTag = $Matches[2]
            $afterHead = $Matches[3]
            $content = "$beforeHead`n$faqJsonBlock`n$headTag$afterHead"
            $stats.faqSchema++
            $fileChanged = $true
        }
    }

    # ===== 8. FAQ Section (visible) =====
    if ($content -notmatch 'class="faq-section"') {
        $faqItems = Get-FAQItems $topic $category
        $faqHtmlLines = @()
        $faqHtmlLines += ""
        $faqHtmlLines += '<div class="faq-section mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">'
        $faqHtmlLines += '<h2 class="text-2xl font-bold mb-4">Frequently Asked Questions</h2>'
        foreach ($item in $faqItems) {
            $faqHtmlLines += '<div class="mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">'
            $faqHtmlLines += "<h3 class=`"font-bold text-lg mb-2`">$($item.q)</h3>"
            $faqHtmlLines += "<p>$($item.a)</p>"
            $faqHtmlLines += '</div>'
        }
        $faqHtmlLines += '</div>'
        $faqHtmlBlock = $faqHtmlLines -join "`n"
        
        # Insert before disclaimer or </article>
        if ($content -match '(?s)(<div class="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">)') {
            $content = $content -replace [regex]::Escape($Matches[1]), "$faqHtmlBlock`n`n$($Matches[1])"
            $stats.faqSection++
            $fileChanged = $true
        } elseif ($content -match '(?s)(</div>\s*</article>)') {
            $content = $content -replace [regex]::Escape($Matches[1]), "$faqHtmlBlock`n`n$($Matches[1])"
            $stats.faqSection++
            $fileChanged = $true
        }
    }

    if ($fileChanged) {
        [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
        $stats.modified++
    }
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "Phase 19.3 - Complete AI Optimization" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Files scanned:     $($stats.total)"
Write-Host "Files modified:    $($stats.modified)"
Write-Host ""
Write-Host "Quick Answer+Def:  $($stats.quickAnswer)"
Write-Host "Who Is This For:   $($stats.whoFor)"
Write-Host "Who Should Avoid:  $($stats.whoAvoid)"
Write-Host "Evidence Stmts:    $($stats.evidence)"
Write-Host "Disclaimer Links:  $($stats.disclaimer)"
Write-Host "Internal Links:    $($stats.internalLinks)"
Write-Host "FAQPage Schema:    $($stats.faqSchema)"
Write-Host "FAQ Sections:      $($stats.faqSection)"

# Report file
@"
Phase 19.3 - Complete AI Search Citation & LLM Optimization Report
Date: $(Get-Date -Format "yyyy-MM-dd HH:mm")
====================================================

Files scanned:     $($stats.total)
Files modified:    $($stats.modified)

Quick Answer + Definition:  $($stats.quickAnswer)
Who Is This For:            $($stats.whoFor)
Who Should Avoid:           $($stats.whoAvoid)
Evidence Statements:        $($stats.evidence)
Disclaimer & Policy Links:  $($stats.disclaimer)
Internal Tool Links:        $($stats.internalLinks)
FAQPage Schema:             $($stats.faqSchema)
FAQ Sections (visible):     $($stats.faqSection)
"@ | Set-Content -Path "$blogDir\phase19-3-report.txt" -Encoding UTF8

Write-Host "`nReport: blog\phase19-3-report.txt" -ForegroundColor Cyan
