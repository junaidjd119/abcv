# Phase 19.3 - AI Search Citation & LLM Optimization
# Adds Quick Answer + Definition block, "Who is this for", "Who should avoid"
# to all blog HTML articles

$rootDir = "E:\gym\abcv-main\abcv-main"
$blogDir = "$rootDir\blog"
$logFile = "$blogDir\phase19-3-report.txt"

$total = 0; $modified = 0; $skipped = 0
$quickAnswerAdded = 0; $whoForAdded = 0; $whoAvoidAdded = 0
$evidenceAdded = 0; $faqSchemaAdded = 0; $internalLinksAdded = 0
$disclaimerLinksAdded = 0

$templates = @{
    "Training" = @{
        def = "training concept that focuses on"
        for = "This guide is for lifters of all levels who want to improve their exercise technique, build functional strength, and optimize their training results."
        avoid = "Consult a healthcare professional before starting this program if you have existing joint or musculoskeletal injuries, or if you are recovering from surgery."
    }
    "Training Science" = @{
        def = "evidence-based training principle that explains"
        for = "This article is for fitness enthusiasts, coaches, and athletes who want to understand the physiological mechanisms behind effective training."
        avoid = "If you have a medical condition affecting your musculoskeletal system, consult your doctor before applying these advanced training concepts."
    }
    "Training Fundamentals" = @{
        def = "foundational training concept that forms the basis of"
        for = "This guide is for beginners and intermediate lifters who want to build a solid understanding of core training principles."
        avoid = "If you are recovering from injury or have a chronic health condition, seek medical advice before starting a new training program."
    }
    "Advanced Training" = @{
        def = "advanced training methodology designed for"
        for = "This content is for experienced lifters who have mastered basic techniques and are looking to break through plateaus with advanced methods."
        avoid = "Beginners should master fundamental movement patterns before attempting these advanced isolation and specialization techniques."
    }
    "Biomechanics" = @{
        def = "biomechanical principle that optimizes"
        for = "This article is for lifters and coaches who want to understand the mechanical science behind exercise selection and technique refinement."
        avoid = "If you have a history of joint injuries or chronic pain, consult a physical therapist before implementing these biomechanical adjustments."
    }
    "Nutrition" = @{
        def = "nutritional strategy that supports"
        for = "This guide is for anyone looking to optimize their diet for better performance, body composition, and overall health."
        avoid = "If you have a diagnosed medical condition such as diabetes, kidney disease, or an eating disorder, consult your healthcare provider before making significant dietary changes."
    }
    "Lifestyle" = @{
        def = "psychological and behavioral approach that enhances"
        for = "This article is for anyone pursuing fitness goals who wants to develop the mental skills and habits needed for long-term success."
        avoid = "If you are experiencing severe anxiety, depression, or other mental health concerns, please seek support from a qualified mental health professional."
    }
    "Recovery" = @{
        def = "recovery method that supports"
        for = "This guide is for athletes and active individuals who want to optimize their recovery between workouts for better performance and injury prevention."
        avoid = "If you have a chronic health condition, cardiovascular issues, or are recovering from an acute injury, consult your doctor before using these recovery techniques."
    }
    "Health" = @{
        def = "health and fitness practice that promotes"
        for = "This article is for anyone interested in improving their overall health and fitness through evidence-based lifestyle practices."
        avoid = "If you have a pre-existing medical condition or are taking medication, consult your healthcare provider before implementing these health strategies."
    }
    "Physiology" = @{
        def = "physiological process that governs"
        for = "This content is for fitness professionals, coaches, and science-minded athletes who want to understand the biological mechanisms behind training adaptations."
        avoid = "The information here is educational. If you have a specific medical concern, consult a qualified healthcare professional."
    }
    "Guide" = @{
        def = "practical guide that helps you"
        for = "This guide is for anyone looking for practical, actionable advice to improve their fitness setup, equipment choices, or workout approach."
        avoid = "Consider your individual needs and constraints before making significant purchases or changes to your fitness routine."
    }
    "Mobility" = @{
        def = "mobility and flexibility practice that improves"
        for = "This article is for lifters, athletes, and anyone experiencing joint stiffness or limited range of motion who wants to move better."
        avoid = "If you have an acute injury, herniated disc, or severe joint pain, consult a physical therapist before attempting these mobility exercises."
    }
    "Cardio" = @{
        def = "cardiovascular training method that improves"
        for = "This guide is for anyone looking to improve their cardiovascular fitness, endurance, and heart health through evidence-based cardio training."
        avoid = "If you have a heart condition, high blood pressure, or other cardiovascular concerns, consult your doctor before starting a new cardio program."
    }
    "Muscle Gain" = @{
        def = "muscle-building strategy that maximizes"
        for = "This article is for lifters focused on hypertrophy who want science-backed methods to increase muscle mass and improve physique."
        avoid = "If you have a metabolic disorder or are under medical supervision for weight management, consult your healthcare provider before following these muscle gain protocols."
    }
    "Strength" = @{
        def = "strength training principle that develops"
        for = "This guide is for lifters who want to increase their maximal strength through proper technique, programming, and progressive overload."
        avoid = "If you have a history of joint injuries, hernias, or cardiovascular conditions, get medical clearance before attempting heavy strength training."
    }
}

# Category mapping based on badge text
$categoryMap = @{
    "Training" = "Training"
    "Training Science" = "Training Science"
    "Training Fundamentals" = "Training Fundamentals"
    "Advanced Training" = "Advanced Training"
    "Biomechanics" = "Biomechanics"
    "Nutrition" = "Nutrition"
    "Lifestyle" = "Lifestyle"
    "Recovery" = "Recovery"
    "Health" = "Health"
    "Physiology" = "Physiology"
    "Guide" = "Guide"
    "Mobility" = "Mobility"
    "Cardio" = "Cardio"
    "Muscle Gain" = "Muscle Gain"
    "Strength" = "Strength"
}

function Get-Template($category, $title, $topic) {
    $t = $templates[$category]
    if (-not $t) { $t = $templates["Training"] }
    
    $def = $t.def
    $forText = $t.for
    $avoidText = $t.avoid
    
    return @{
        def = $def
        forText = $forText
        avoidText = $avoidText
    }
}

function Get-TopicFromTitle($title) {
    # Remove site name suffix
    $t = $title -replace '\s*\|\s*GymTranning$', ''
    # Remove common prefixes for clean topic
    $t = $t -replace '^Complete\s+', ''
    $t = $t -replace '^The\s+', ''
    $t = $t -replace '^Understanding\s+', ''
    $t = $t -replace '^Ultimate\s+', ''
    $t = $t -replace 'Mastering\s+the\s+', ''
    $t = $t -replace 'Science-Based\s+', ''
    $t = $t -replace 'Science of\s+', ''
    $t = $t -replace 'Science-Backed\s+', ''
    # For comparison titles like "HIIT vs LISS Cardio: Which Burns More Fat?"
    # Extract only the part before the colon
    if ($t -match '^([^:]+):') {
        $t = $Matches[1].Trim()
    }
    # For titles with "for" or "to", extract the main concept
    $t = $t -replace '\s*:.*$', ''  # Remove everything after colon (including colon)
    $t = $t -replace '\s+for\s+.*$', ''  # Remove "for X" suffix
    $t = $t -replace '\s+to\s+.*$', ''  # Remove "to X" suffix
    if ($t.Length -gt 60) { $t = $t.Substring(0, 60) }
    return $t.Trim()
}

Get-ChildItem "$blogDir\*.html" | ForEach-Object {
    $file = $_.FullName
    $total++
    $content = [System.IO.File]::ReadAllText($file)
    $origContent = $content
    $changed = $false
    
    # Extract title
    $title = ""
    if ($content -match '<title>([^<]+)</title>') {
        $title = $Matches[1]
    }
    
    # Extract category badge
    $category = "Training"
    if ($content -match 'rounded-full text-sm font-bold mb-4 uppercase tracking-widest">([^<]+)</span>') {
        $catText = $Matches[1].Trim()
        if ($categoryMap.ContainsKey($catText)) {
            $category = $categoryMap[$catText]
        }
    }
    
    $topic = Get-TopicFromTitle $title
    if ($topic.Length -eq 0) { $topic = $title }
    
    $template = Get-Template $category $title $topic
    
    # --- INSERT POINT: Quick Answer + Definition block ---
    # Insert right before <div class="article-content text-lg text-slate-700">
    
    $quickAnswerBlock = @"
<div class="bg-blue-50 border-l-4 border-primary p-4 mb-6 rounded-r-lg">
<p class="font-bold text-lg mb-1">Quick Answer</p>
<p><strong>What is $($topic)?</strong> $($topic) is a $($template.def) how you train smarter, recover faster, and achieve measurable fitness results. In short, mastering this concept helps you maximize your progress while minimizing wasted effort and injury risk.</p>
</div>
"@
    
    if ($content -notmatch 'Quick Answer' -and $content -notmatch 'class="quick-answer"') {
        # Insert after the toc-widget closing </nav> but before the closing </div> of the container
        $insertPoint = '</nav>'
        $replaceWith = "$insertPoint`n$quickAnswerBlock"
        $content = $content -replace [regex]::Escape($insertPoint), $replaceWith
        $quickAnswerAdded++
        $changed = $true
        Write-Host "  Added Quick Answer to: $($_.Name)" -ForegroundColor Green
    }
    
    # --- "Who is this for?" + "Who should avoid?" sections ---
    # Insert before the first <h2> in article-content
    
    if ($content -notmatch 'Who Is This For|Who is this for|who this is for|Ideal for') {
        $whoBlock = @"

<div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
<p class="font-bold text-lg mb-1">Who Is This For?</p>
<p>$($template.forText)</p>
</div>
"@
        # Insert right after the article-content opening div, before the first <p>
        if ($content -match '(?s)(<div class="article-content text-lg text-slate-700">)\s*<p') {
            $content = $content -replace [regex]::Escape($Matches[0]), "$($Matches[1])`n$whoBlock`n<p"
            $whoForAdded++
            $changed = $true
            Write-Host "  Added Who Is This For to: $($_.Name)" -ForegroundColor Green
        }
    }
    
    # --- "Who should avoid this?" ---
    if ($content -notmatch 'Who Should Avoid|who should avoid|Contraindications|Not for everyone') {
        $avoidBlock = @"

<div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
<p class="font-bold text-lg mb-1">Who Should Avoid This?</p>
<p>$($template.avoidText)</p>
</div>
"@
        # Insert right after the "Who Is This For" section div
        if ($content -match '(?s)(<div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">.*?</div>\s*)') {
            $content = $content -replace [regex]::Escape($Matches[1]), "$($Matches[1])$avoidBlock"
            $whoAvoidAdded++
            $changed = $true
            Write-Host "  Added Who Should Avoid to: $($_.Name)" -ForegroundColor Green
        }
    }
    
    # --- Evidence Statements ---
    if ($content -notmatch 'studies show|research indicates|evidence suggests|scientific studies|research shows|evidence-based fitness|Evidence-Based') {
        # Add evidence statement as a standalone sentence at end of first paragraph
        if ($content -match '(?s)(<div class="article-content text-lg text-slate-700">.*?<p>[^<]*(?:science|research|evidence|training|fitness|growth|fat|muscle)[^<]*\.)') {
            $firstPSentence = $Matches[1]
            $evidenceSentence = ' Research consistently shows that evidence-based approaches to fitness yield superior results compared to anecdotal methods.'
            # Find the end of the last sentence in this paragraph
            $content = $content -replace [regex]::Escape($firstPSentence), "$firstPSentence$evidenceSentence"
            $evidenceAdded++
            $changed = $true
            Write-Host "  Added Evidence Statement to: $($_.Name)" -ForegroundColor Green
        }
    }
    
    # --- Medical Disclaimer & Editorial Policy Links at end of article-content ---
    if ($content -match '(?s)(<div class="article-content.*?</div>\s*)(?=</article>)') {
        if ($content -notmatch 'Medical Disclaimer|medical_disclaimer|medical disclaimer' -or $content -notmatch 'Editorial Policy|editorial-policy') {
            $disclaimerBlock = @"

<div class="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
<p><strong>Disclaimer:</strong> This article is for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional before starting any fitness program. Read our <a class="text-primary hover:underline" href="../medical_disclaimer.html">Medical Disclaimer</a> and <a class="text-primary hover:underline" href="../editorial-policy.html">Editorial Policy</a> for more information.</p>
</div>
"@
            $articleContentEnd = $Matches[1]
            $content = $content -replace [regex]::Escape($articleContentEnd), "$articleContentEnd$disclaimerBlock"
            $disclaimerLinksAdded++
            $changed = $true
            Write-Host "  Added Disclaimer Links to: $($_.Name)" -ForegroundColor Green
        }
    }
    
    # --- Internal links to tools ---
    if ($content -notmatch 'href="(\.\./)?workoutplanner\.html"' -and $content -notmatch 'href="(\.\./)?dietplanner\.html"') {
        # Add internal link block before the first <h2> in article-content
        $linkText = ""
        if ($content -match 'Training|Workout|Exercise|Lift|Strength|Muscle|Gym|Cardio') {
            $linkText = "Use our <a class="text-primary font-bold hover:underline" href="`"../workoutplanner.html`"">Workout Planner</a> to apply these principles to your personalized training program."
        }
        if ($content -match 'Nutrition|Diet|Meal|Eat|Food|Calorie|Macro|Protein|Fat|Carb') {
            if ($linkText.Length -gt 0) { $linkText += " " }
            $linkText += "Pair this with our <a class="`"text-primary font-bold hover:underline`"" href="`"../dietplanner.html`"">Diet Planner</a> and <a class="`"text-primary font-bold hover:underline`"" href="`"../caloriecalculator.html`"">Calorie Calculator</a> for a complete approach."
        }
        if ($linkText.Length -eq 0) {
            $linkText = "Use our <a class="`"text-primary font-bold hover:underline`"" href="`"../workoutplanner.html`"">Workout Planner</a>, <a class="`"text-primary font-bold hover:underline`"" href="`"../dietplanner.html`"">Diet Planner</a>, and <a class="`"text-primary font-bold hover:underline`"" href="`"../caloriecalculator.html`"">Calorie Calculator</a> to build a complete fitness system."
        }
        $linkBlock = @"

<p>$linkText</p>
"@
        # Insert before the first <h2> in article-content
        if ($content -match '(?s)(<div class="article-content.*?</div>\s*<h2)') {
            $content = $content -replace [regex]::Escape($Matches[1]), $Matches[1].Substring(0, $Matches[1].Length - 4) + "$linkBlock`n<h2"
            $internalLinksAdded++
            $changed = $true
            Write-Host "  Added Internal Links to: $($_.Name)" -ForegroundColor Green
        }
    }
    
    if ($changed) {
        [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
        $modified++
    } else {
        $skipped++
    }
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "Phase 19.3 - AI Optimization Summary" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Files scanned:  $total"
Write-Host "Files modified: $modified"
Write-Host "Files skipped:  $skipped"
Write-Host ""
Write-Host "Changes made:"
Write-Host "  Quick Answer + Definition:  $quickAnswerAdded"
Write-Host "  Who Is This For sections:   $whoForAdded"
Write-Host "  Who Should Avoid sections:  $whoAvoidAdded"
Write-Host "  Evidence Statements:        $evidenceAdded"
Write-Host "  Disclaimer/Policy Links:    $disclaimerLinksAdded"
Write-Host "  Internal Tool Links:        $internalLinksAdded"

# Write report file
@"
Phase 19.3 - AI Search Citation & LLM Optimization Report
Date: $(Get-Date -Format "yyyy-MM-dd HH:mm")
====================================================

Files scanned:  $total
Files modified: $modified
Files skipped:  $skipped

Changes made:
  Quick Answer + Definition:  $quickAnswerAdded
  Who Is This For sections:   $whoForAdded
  Who Should Avoid sections:  $whoAvoidAdded
  Evidence Statements:        $evidenceAdded
  Disclaimer/Policy Links:    $disclaimerLinksAdded
  Internal Tool Links:        $internalLinksAdded
"@ | Set-Content -Path $logFile -Encoding UTF8

Write-Host "`nReport saved to: $logFile" -ForegroundColor Cyan
