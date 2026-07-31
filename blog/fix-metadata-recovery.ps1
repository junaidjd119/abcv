$base = "E:\gym\abcv-main\abcv-main\blog"
$parts = @(3,15,16,17,22,58,59,79,86,89,90)

# Fix Part X of 11 -> Part X &mdash; Recovery Series
foreach ($p in $parts) {
    $path = "$base\ultimate-guide-recovery-part-$p.html"
    $c = [System.IO.File]::ReadAllText($path)
    $orig = $c
    
    # Fix series label
    $c = $c -replace '(Part \d+) of 11', '$1 &mdash; Recovery Series'
    
    # Fix JSON-LD keywords
    $keywordMap = @{
        3 = "muscle repair, muscle recovery physiology, satellite cells, muscle protein synthesis, damage repair cycle, muscle adaptation, gymtranning"
        15 = "sleep science, sleep hygiene, deep sleep, growth hormone, circadian rhythm, athlete sleep, recovery sleep, gymtranning"
        16 = "active recovery, blood flow, muscle recovery, light exercise, walking recovery, recovery mobility, gymtranning"
        17 = "DOMS, delayed onset muscle soreness, muscle soreness recovery, eccentric exercise recovery, soreness management, gymtranning"
        22 = "cold water immersion, ice bath, heat therapy, sauna recovery, contrast therapy, temperature recovery, gymtranning"
        58 = "cortisol, stress hormone, cortisol recovery, catabolic hormone, stress management, overtraining cortisol, gymtranning"
        59 = "CNS fatigue, central nervous system recovery, neural fatigue, overtraining CNS, fatigue management, gymtranning"
        79 = "trigger point, self massage, muscle knots, foam rolling, lacrosse ball, myofascial release, gymtranning"
        86 = "deload week, training deload, recovery week, periodization, training fatigue, deload protocol, gymtranning"
        89 = "rest days, recovery mindset, training rest, muscle repair rest, active rest, mental recovery, gymtranning"
        90 = "cold vs heat therapy, recovery modalities, ice bath vs sauna, muscle recovery, temperature therapy, gymtranning"
    }
    $newKw = $keywordMap[$p]
    $replacement = '"keywords": "' + $newKw + '"'
    $c = $c -replace '"keywords": "[^"]+"', $replacement
    
    # Fix video descriptions
    if ($c -match '<meta name="description" content="([^"]+)"') {
        $metaDesc = $matches[1]
        $safeDesc = [regex]::Escape($metaDesc)
        $c = $c -replace $safeDesc, 'Watch this exercise demonstration to improve your form and technique.'
    }
    
    if ($c -ne $orig) {
        [System.IO.File]::WriteAllBytes($path, [System.Text.Encoding]::UTF8.GetBytes($c))
        Write-Host "Fixed metadata for part $p"
    }
}

# Fix specific issues
$fixes = @(
    @{part=58; find='twitter:title" content="[^"]+'; replace='twitter:title" content="Cortisol &amp; Recovery Blockers: How Stress Affects Muscle | GymTranning"'}
    @{part=59; find='twitter:title" content="[^"]+'; replace='twitter:title" content="Identifying CNS Exhaustion: Signs, Prevention, and Recovery | GymTranning"'}
    @{part=89; find='twitter:title" content="[^"]+'; replace='twitter:title" content="Rest Days: Mental Acceptance &amp; Why Taking Breaks Builds Lean Muscle | GymTranning"'}
)

foreach ($fix in $fixes) {
    $path = "$base\ultimate-guide-recovery-part-$($fix.part).html"
    $c = [System.IO.File]::ReadAllText($path)
    $c = $c -replace $fix.find, $fix.replace
    [System.IO.File]::WriteAllBytes($path, [System.Text.Encoding]::UTF8.GetBytes($c))
    Write-Host "Fixed twitter:title for part $($fix.part)"
}

# Fix part 90 og:title (currently wrong article)
$path90 = "$base\ultimate-guide-recovery-part-90.html"
$c90 = [System.IO.File]::ReadAllText($path90)
$c90 = $c90 -replace 'og:title" content="[^"]+', 'og:title" content="Cold Water Immersion vs Heat Therapy for Workout Recovery | GymTranning"'
$c90 = $c90 -replace 'twitter:title" content="[^"]+', 'twitter:title" content="Cold Water Immersion vs Heat Therapy for Workout Recovery | GymTranning"'
# Fix JSON-LD description too if it references wrong article
$c90 = $c90 -replace 'How long does muscle recovery actually take\?[^"]+', 'Compare cold water immersion vs heat therapy for workout recovery. Learn when ice baths help and when heat therapy is superior for your goals.'
[System.IO.File]::WriteAllBytes($path90, [System.Text.Encoding]::UTF8.GetBytes($c90))
Write-Host "Fixed og:title, twitter:title, and JSON-LD description for part 90"

Write-Host "Recovery metadata fixes complete."
