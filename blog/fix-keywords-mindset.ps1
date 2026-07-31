$base = "E:\gym\abcv-main\abcv-main\blog"

$keywordMap = @{
    4  = "motivation vs habit, fitness discipline, workout consistency, habit formation, gym motivation, behavioral psychology, exercise routine, fitness mindset, gymtranning"
    7  = "SMART goals fitness, micro habits, goal setting exercise, fitness planning, workout goals, habit building, fitness progress, gymtranning"
    18 = "workout friction, exercise excuses, fitness consistency, workout barriers, gym motivation, training discipline, fitness habits, gymtranning"
    30 = "mind muscle connection, muscle activation, neural drive exercise, EMG training, muscle engagement, workout focus, gymtranning"
    44 = "travel workout, fitness setbacks, training contingency, home workout travel, bodyweight travel, illness recovery fitness, gymtranning"
    46 = "gym anxiety, gymtimidation, beginner gym fear, workout confidence, social anxiety gym, gym nervousness, starting gym, gymtranning"
    52 = "training autoregulation, RPE scale, RIR training, reps in reserve, workout intensity adjustment, fatigue management, gymtranning"
    54 = "consistency tracking, habit tracker fitness, workout calendar, streak method, visual habit tracking, fitness consistency, gymtranning"
    55 = "CNS fatigue, central nervous system recovery, overtraining signs, deload week, stress management training, recovery fitness, gymtranning"
    72 = "champion mindset fitness, lifelong fitness, identity habits, elite athlete mindset, fitness lifestyle, mental resilience training, gymtranning"
    88 = "motivation vs systems, habit loop fitness, dopamine fitness, environment design, automatic habits, cue craving response reward, gymtranning"
    94 = "implementation intentions, if then plans, precommitment fitness, accountability workout, goal execution, habit stacking, gymtranning"
    95 = "exercise excuses psychology, cognitive reframing, workout resistance, emotional barriers fitness, overcoming gym excuses, gymtranning"
    99 = "advanced mind muscle connection, proprioception training, unilateral training, tempo manipulation, muscle activation cues, gymtranning"
}

foreach ($p in $keywordMap.Keys) {
    $path = "$base\ultimate-guide-mindset-part-$p.html"
    if (-not (Test-Path $path)) { Write-Host "MISSING part-$p"; continue }
    
    $c = [System.IO.File]::ReadAllText($path)
    $newKw = $keywordMap[$p]
    
    # Replace keywords line
    $pattern = '"keywords": "([^"]+)"'
    $replacement = '"keywords": "' + $newKw + '"'
    $c = $c -replace $pattern, $replacement
    
    [System.IO.File]::WriteAllBytes($path, [System.Text.Encoding]::UTF8.GetBytes($c))
    Write-Host ("Fixed keywords for part " + $p)
}

Write-Host "All keyword fixes complete."
