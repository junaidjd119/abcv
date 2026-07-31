$base = "E:\gym\abcv-main\abcv-main\blog"
$files = @(
    "top-10-supplements.html",
    "ultimate-guide-supplements-part-1.html",
    "ultimate-guide-supplements-part-8.html",
    "ultimate-guide-supplements-part-61.html",
    "ultimate-guide-supplements-part-85.html",
    "ultimate-guide-supplements-part-92.html"
)

$stalePhrases = @(
    "Pillar 1:", "Pillar 2:", "Pillar 3:", "Pillar 4:",
    "Understanding the Core Science",
    "Step-by-Step Action Plan",
    "Advanced Considerations",
    "Summary and Final Thoughts",
    "Your Action Checklist",
    "Expert Pro-Tip",
    "2.comparison",
    "comparison &amp; Data"
)

$requiredSections = @(
    "Expert Tip",
    "Checklist",
    "Key Takeaways",
    "Frequently Asked Questions",
    "Common Myths",
    "Safety"
)

Write-Host "=== PHASE 13.5 SUPPLEMENTS QA REPORT ===" -ForegroundColor Cyan
Write-Host ""

$totalWC = 0
$totalFaq = 0
$passed = 0
$failed = 0
$totalLinks = 0

foreach ($f in $files) {
    $path = "$base\$f"
    if (-not (Test-Path $path)) { Write-Host "MISSING $f"; continue }
    $c = Get-Content $path -Raw
    $wc = $c.Split(' ', [StringSplitOptions]::RemoveEmptyEntries).Count
    $faq = [regex]::Matches($c, '<h4 class="font-bold text-slate-800">').Count
    $hasTable = $c -match '<table'
    $hasExpert = $c -match 'Expert Tip'
    $hasChecklist = $c -match 'Checklist'
    $hasTakeaways = $c -match 'Key Takeaways'
    $hasMyths = $c -match 'Common Myths'
    $hasSafety = $c -match 'Safety'
    $h1Count = [regex]::Matches($c, '<h1[^>]*>').Count
    $internalLinks = [regex]::Matches($c, 'href="(?!http)(?:\.\./)?(?:dietplanner|workoutplanner|caloriecalculator|nutrition)').Count
    
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
    if (-not $hasMyths) { $issues += "NOMYTHS" }
    if (-not $hasSafety) { $issues += "NOSAFETY" }
    if ($h1Count -ne 1) { $issues += "H1($h1Count)" }
    if ($internalLinks -eq 0) { $issues += "NOLINKS" }
    
    $statusStr = "PASS"
    $color = "Green"
    if ($issues.Count -gt 0) { 
        $statusStr = $issues -join "|"
        $color = "Red"
        $failed++
    } else {
        $passed++
    }
    
    $name = ($f -replace '\.html$','').PadRight(42)
    Write-Host $name -NoNewline
    Write-Host ("WC:" + $wc.ToString().PadRight(12)) -NoNewline
    Write-Host ("FAQ:" + $faq.ToString().PadRight(8)) -NoNewline
    Write-Host ("Tbl:" + $hasTable.ToString().PadRight(8)) -NoNewline
    Write-Host $statusStr -ForegroundColor $color
    
    $totalWC += $wc
    $totalFaq += $faq
    $totalLinks += $internalLinks
}

Write-Host ""
Write-Host ("Total articles: " + $files.Count) -ForegroundColor Cyan
Write-Host ("Passed: " + $passed) -ForegroundColor Green
Write-Host ("Failed: " + $failed) -ForegroundColor Red
Write-Host ("Avg word count: " + [math]::Round($totalWC / $files.Count)) -ForegroundColor Cyan
Write-Host ("Avg FAQ count: " + [math]::Round($totalFaq / $files.Count, 1)) -ForegroundColor Cyan
Write-Host ("Total internal links: " + $totalLinks) -ForegroundColor Cyan
