$base = "E:\gym\abcv-main\abcv-main\blog"
$parts = @(19,23,39,51,60,62,64,65,81,83,96)
$stalePhrases = @(
    "Pillar 1:", "Pillar 2:", "Pillar 3:", "Pillar 4:",
    "Understanding the Core Science",
    "Scuplting your mind",
    "2.comparison",
    "Step-by-Step Action Plan",
    "Advanced Considerations",
    "Summary and Final Thoughts",
    "Your Action Checklist",
    "Expert Pro-Tip"
)
Write-Host "=== MUSCLE GAIN CLUSTER QA REPORT ===" -ForegroundColor Cyan
Write-Host ""

$totalWC = 0
$totalFaq = 0
$passed = 0
$failed = 0

foreach ($p in $parts) {
    $path = "$base\ultimate-guide-muscle-gain-part-$p.html"
    if (-not (Test-Path $path)) { Write-Host "MISSING part-$p"; continue }
    $c = Get-Content $path -Raw
    $wc = $c.Split(' ', [StringSplitOptions]::RemoveEmptyEntries).Count
    $faq = [regex]::Matches($c, '<h4 class="font-bold text-slate-800">').Count
    $hasTable = $c -match '<table'
    $hasExpert = $c -match 'Expert Tip'
    $hasChecklist = $c -match 'Action Checklist'
    $hasTakeaways = $c -match 'Key Takeaways'
    
    $stale = @()
    foreach ($phrase in $stalePhrases) {
        if ($c -match [regex]::Escape($phrase)) { $stale += $phrase }
    }
    
    $issues = @()
    if ($stale.Count -gt 0) { $issues += "STALE($($stale.Count))" }
    if ($faq -lt 4) { $issues += "LOWFAQ($faq)" }
    if (-not $hasTable) { $issues += "NOTABLE" }
    if (-not $hasExpert) { $issues += "NOEXPERT" }
    if (-not $hasChecklist) { $issues += "NOCHECK" }
    if (-not $hasTakeaways) { $issues += "NOTAKE" }
    
    $statusStr = "PASS"
    $color = "Green"
    if ($issues.Count -gt 0) { 
        $statusStr = $issues -join "|"
        $color = "Red"
        $failed++
    } else {
        $passed++
    }
    
    Write-Host ("Part " + $p.ToString().PadRight(6)) -NoNewline
    Write-Host ("WC:" + $wc.ToString().PadRight(12)) -NoNewline
    Write-Host ("FAQ:" + $faq.ToString().PadRight(8)) -NoNewline
    Write-Host ("Tbl:" + $hasTable.ToString().PadRight(8)) -NoNewline
    Write-Host $statusStr -ForegroundColor $color
    
    $totalWC += $wc
    $totalFaq += $faq
}

Write-Host ""
Write-Host ("Total articles: " + $parts.Count) -ForegroundColor Cyan
Write-Host ("Passed: " + $passed) -ForegroundColor Green
Write-Host ("Failed: " + $failed) -ForegroundColor Red
Write-Host ("Avg word count: " + [math]::Round($totalWC / $parts.Count)) -ForegroundColor Cyan
Write-Host ("Avg FAQ count: " + [math]::Round($totalFaq / $parts.Count, 1)) -ForegroundColor Cyan
