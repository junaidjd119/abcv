$base = "E:\gym\abcv-main\abcv-main\blog"

# Fix 1: Part X of 11 -> Part X — Muscle Gain Series (in all 11 files)
$parts = @(19,23,39,51,60,62,64,65,81,83,96)
foreach ($p in $parts) {
    $path = "$base\ultimate-guide-muscle-gain-part-$p.html"
    $c = [System.IO.File]::ReadAllText($path)
    $orig = $c
    
    # Fix Part X of 11 series label
    $c = $c -replace '(Part \d+) of 11', '$1 &mdash; Muscle Gain Series'
    
    # Fix breadcrumb "Strength (Part X)" -> "Muscle Gain (Part X)"
    $c = $c -replace 'Strength \(Part (\d+)\)', 'Muscle Gain (Part $1)'
    
    # Fix category badge "Strength" -> "Muscle Gain"
    $c = $c -replace '(<span class="[^"]*">)Strength(</span>)', '${1}Muscle Gain${2}'
    
    # Fix "Strength Guide" in hero alt text -> "Muscle Gain Series"
    $c = $c -replace '- Strength Guide', '- Muscle Gain Series'
    $c = $c -replace '- Strength Guide \|', '- Muscle Gain Series |'
    $c = $c -replace 'Strength Guide \|', 'Muscle Gain Series |'
    
    # Fix "Strength .." in related article titles
    $c = $c -replace '- Strength \.\.', '- Muscle Gain..'
    $c = $c -replace '"Strength Guide"', '"Muscle Gain Series"'
    
    if ($c -ne $orig) {
        [System.IO.File]::WriteAllBytes($path, [System.Text.Encoding]::UTF8.GetBytes($c))
        Write-Host ("Fixed metadata for part " + $p)
    }
}

# Fix 2: Replace JSON-LD keywords with topic-specific ones
$keywordMap = @{
    19 = "progressive overload, training volume, load progression, muscle hypertrophy, set volume, resistance training, gymtranning"
    23 = "optimal training volume, hypertrophy sets per week, MEV MRV, weekly set volume, muscle growth volume, gymtranning"
    39 = "rest intervals, rest between sets, muscle hypertrophy, short vs long rest, training rest periods, gymtranning"
    51 = "training frequency, muscle group frequency, upper lower split, PPL split, hypertrophy frequency, gymtranning"
    60 = "rep ranges hypertrophy, training to failure, load management, reps in reserve, muscle growth reps, gymtranning"
    62 = "mechanical tension, time under tension, tempo control, muscle tension hypertrophy, stretch mediated hypertrophy, gymtranning"
    64 = "compound exercises, isolation exercises, training split design, exercise selection, compound vs isolation, gymtranning"
    65 = "DOMS management, CNS fatigue, muscle soreness recovery, overtraining prevention, active recovery, gymtranning"
    81 = "deload week, strategic recovery, training deload, volume reduction, fatigue management, periodization, gymtranning"
    83 = "hardgainer, muscle building strategies, calorie surplus, ectomorph muscle gain, hardgainer training, gymtranning"
    96 = "hypertrophy mechanisms, mechanical tension, muscle damage, metabolic stress, muscle growth science, gymtranning"
}

foreach ($p in $keywordMap.Keys) {
    $path = "$base\ultimate-guide-muscle-gain-part-$p.html"
    $c = [System.IO.File]::ReadAllText($path)
    $newKw = $keywordMap[$p]
    $c = $c -replace '"keywords": "[^"]+"', '"keywords": "' + $newKw + '"'
    [System.IO.File]::WriteAllBytes($path, [System.Text.Encoding]::UTF8.GetBytes($c))
    Write-Host ("Fixed keywords for part " + $p)
}

# Fix 3: Video descriptions for parts 60,62,64,65,81,83,96 (replace article-meta copy with exercise-specific)
$videoDescFix = @{
    60 = @{
        oldDesc = "Should you train to failure on every set\? Learn how rep ranges, proximity to failure, and load management impact hypertrophy and how to periodize intensity for maximum growth\."
        newDesc = "Isolate the chest with cable flyes for a deep stretch and peak contraction."
    }
}

# Fix 3: Use a simpler regex approach for video descriptions
$videoArticles = @{60=1; 62=1; 64=1; 65=1; 81=1; 83=1; 96=1}
foreach ($p in $videoArticles.Keys) {
    $path = "$base\ultimate-guide-muscle-gain-part-$p.html"
    $c = [System.IO.File]::ReadAllText($path)
    $orig = $c
    
    # Get the article's meta description to find/replace in video blocks
    if ($c -match '<meta name="description" content="([^"]+)"') {
        $metaDesc = $matches[1]
        # Replace the meta description text in video description fields with a generic exercise description
        $safeDesc = [regex]::Escape($metaDesc)
        $c = $c -replace $safeDesc, 'Watch this exercise demonstration to improve your form and technique.'
        if ($c -ne $orig) {
            [System.IO.File]::WriteAllBytes($path, [System.Text.Encoding]::UTF8.GetBytes($c))
            Write-Host ("Fixed video descriptions for part " + $p)
        }
    }
}

Write-Host "All metadata fixes complete."
