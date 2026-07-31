$base = "E:\gym\abcv-main\abcv-main\blog"
$parts = @(1,8,61,85,92)

$keywordMap = @{
    1 = "supplement hierarchy, supplements, evidence based supplements, creatine, whey protein, caffeine, supplement guide, gymtranning"
    8 = "creatine dosage, creatine saturation, creatine monohydrate, creatine loading, muscle saturation, creatine protocol, gymtranning"
    61 = "whey protein, casein protein, plant protein, protein powder, pea protein, protein comparison, gymtranning"
    85 = "caffeine timing, pre workout caffeine, caffeine dosage, caffeine tolerance, caffeine cycling, performance caffeine, gymtranning"
    92 = "omega-3, fish oil, EPA DHA, joint health, inflammation, omega-3 dosage, gymtranning"
}

foreach ($p in $parts) {
    $path = "$base\ultimate-guide-supplements-part-$p.html"
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

Write-Host "Supplements metadata fixes complete."
