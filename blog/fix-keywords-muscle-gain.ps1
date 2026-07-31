$base = "E:\gym\abcv-main\abcv-main\blog"

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
    $replacement = '"keywords": "' + $keywordMap[$p] + '"'
    $c = $c -replace '"keywords": "[^"]+"', $replacement
    [System.IO.File]::WriteAllBytes($path, [System.Text.Encoding]::UTF8.GetBytes($c))
    Write-Host ("Fixed keywords for part " + $p)
}

Write-Host "Keywords fix complete."
