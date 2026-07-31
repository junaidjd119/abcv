$base = "E:\gym\abcv-main\abcv-main\blog"
$parts = @(2,14,25,32,35,48,70,78,84,91,100)

# Fix JSON-LD keywords
$keywordMap = @{
    2 = "neuromuscular adaptation, neural drive, size principle, motor units, rate coding, strength gains, cns adaptation, gymtranning"
    14 = "squat technique, squat form, barbell squat, squat programming, proper squat, leg strength, gymtranning"
    25 = "bench press, bench press accessories, weak point training, bench technique, bench programming, upper body strength, gymtranning"
    32 = "deadlift technique, deadlift form, conventional deadlift, sumo deadlift, heavy deadlift, pull technique, gymtranning"
    35 = "linear periodization, wave periodization, strength program, training progression, strength periodization, program design, gymtranning"
    48 = "valsalva maneuver, core bracing, heavy lifts, intra-abdominal pressure, lifting safety, core stability, gymtranning"
    70 = "neural excitation, cns warmup, activation warmup, priming cns, heavy lifting prep, nervous system activation, gymtranning"
    78 = "RPE, reps in reserve, autoregulation, training intensity, RIR training, lift smarter, gymtranning"
    84 = "powerbuilding, training split, strength and hypertrophy, powerlifting bodybuilding, combined training, muscle and strength, gymtranning"
    91 = "accessory lifts, weak points, main lifts, exercise selection, strength accessories, training weaknesses, gymtranning"
    100 = "neuromuscular adaptation, nervous system strength, neural adaptation, strength gains, cns training, motor unit recruitment, gymtranning"
}

foreach ($p in $parts) {
    $path = "$base\ultimate-guide-strength-training-part-$p.html"
    $c = [System.IO.File]::ReadAllText($path)
    $orig = $c
    
    $newKw = $keywordMap[$p]
    $replacement = '"keywords": "' + $newKw + '"'
    $c = $c -replace '"keywords": "[^"]+"', $replacement
    
    if ($c -ne $orig) {
        [System.IO.File]::WriteAllBytes($path, [System.Text.Encoding]::UTF8.GetBytes($c))
        Write-Host "Fixed metadata for part $p"
    }
}

Write-Host "Strength Training metadata fixes complete."
