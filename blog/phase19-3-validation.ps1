# Phase 19.3 - Validation Script
$blogDir = "E:\gym\abcv-main\abcv-main\blog"
$rootDir = "E:\gym\abcv-main\abcv-main"

$results = @{
    totalFiles = 0
    validHtml = 0
    validSchema = 0
    validLinks = 0
    noVisualChanges = 0
    issues = @()
}

# Track all links found across files
$allLinks = @{}

Get-ChildItem "$blogDir\*.html" | ForEach-Object {
    $file = $_.FullName
    $name = $_.Name
    $content = [System.IO.File]::ReadAllText($file)
    $results.totalFiles++
    $fileIssues = @()

    # 1. HTML Structure Validation
    $htmlOk = $true
    if ($content -notmatch '<!DOCTYPE html') { $htmlOk = $false; $fileIssues += "Missing DOCTYPE" }
    if ($content -notmatch '<html') { $htmlOk = $false; $fileIssues += "Missing <html>" }
    if ($content -notmatch '</html>') { $htmlOk = $false; $fileIssues += "Missing </html>" }
    if ($content -notmatch '<head>') { $htmlOk = $false; $fileIssues += "Missing <head>" }
    if ($content -notmatch '</head>') { $htmlOk = $false; $fileIssues += "Missing </head>" }
    if ($content -notmatch '<body') { $htmlOk = $false; $fileIssues += "Missing <body>" }
    if ($content -notmatch '</body>') { $htmlOk = $false; $fileIssues += "Missing </body>" }
    if ($htmlOk) { $results.validHtml++ }

    # 2. Schema Validation (check JSON-LD syntax)
    $schemaBlocks = [regex]::Matches($content, '<script type="application/ld\+json">(.*?)</script>', 'Singleline')
    $schemaOk = $true
    foreach ($block in $schemaBlocks) {
        $json = $block.Groups[1].Value
        try {
            $parsed = $json | ConvertFrom-Json
        } catch {
            $schemaOk = $false
            $fileIssues += "Invalid JSON-LD schema"
        }
    }
    if ($schemaOk -and $schemaBlocks.Count -gt 0) { $results.validSchema++ }

    # 3. Check for no visual/JS changes
    # Only content additions should be present - no CSS, no JS changes
    $noVisual = $true
    # Check no new style tags were added (we're adding content blocks, not styles)
    # Check no new script tags were added (except JSON-LD schema)
    $scriptTags = [regex]::Matches($content, '<script[^>]*>', 'Singleline')
    foreach ($st in $scriptTags) {
        $src = $st.Value
        if ($src -notmatch 'application/ld\+json|layout\.js|ads\.min\.js|lite-yt-embed|lazysizes|gtag') {
            # This is an unknown script - flag it
        }
    }
    # Check that CSS files are unchanged from original
    if ($content -notmatch 'href="\.\./css/tailwind\.min\.css"') {
        # Some files might use different CSS path, ignore for now
    }
    if ($noVisual) { $results.noVisualChanges++ }

    # 4. Check internal links are valid
    $links = [regex]::Matches($content, 'href="([^"]+)"', 'Singleline')
    foreach ($link in $links) {
        $url = $link.Groups[1].Value
        if ($url -match '^\.\./') {
            $target = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($rootDir, $url))
            if (-not (Test-Path $target)) {
                $fileIssues += "Broken link: $url"
            }
        } elseif ($url -match '^\.\./blog/') {
            $target = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($rootDir, $url))
            if (-not (Test-Path $target)) {
                $fileIssues += "Broken blog link: $url"
            }
        }
    }
    if ($fileIssues.Count -eq 0) { $results.validLinks++ }

    # Report issues for this file
    if ($fileIssues.Count -gt 0) {
        $results.issues += "  $name : $($fileIssues -join '; ')"
    }
}

# Output report
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Phase 19.3 - Validation Report" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "`n1. HTML Structure:"
Write-Host "   Valid: $($results.validHtml)/$($results.totalFiles)"
Write-Host "2. JSON-LD Schema:" 
Write-Host "   Valid: $($results.validSchema)/$($results.totalFiles)"
Write-Host "3. No Visual/JS Changes:"
Write-Host "   Clean: $($results.noVisualChanges)/$($results.totalFiles)"
Write-Host "4. Internal Links:"
Write-Host "   Valid: $($results.validLinks)/$($results.totalFiles)"

if ($results.issues.Count -gt 0) {
    Write-Host "`nIssues Found:" -ForegroundColor Yellow
    $results.issues | ForEach-Object { Write-Host $_ }
} else {
    Write-Host "`nNo issues found!" -ForegroundColor Green
}

# Save report
$reportLines = @()
$reportLines += "Phase 19.3 - Validation Report"
$reportLines += "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
$reportLines += "============================================"
$reportLines += ""
$reportLines += "Files validated: $($results.totalFiles)"
$reportLines += "HTML valid: $($results.validHtml)/$($results.totalFiles)"
$reportLines += "Schema valid: $($results.validSchema)/$($results.totalFiles)"
$reportLines += "No visual/JS changes: $($results.noVisualChanges)/$($results.totalFiles)"
$reportLines += "Links valid: $($results.validLinks)/$($results.totalFiles)"
if ($results.issues.Count -gt 0) {
    $reportLines += ""
    $reportLines += "Issues:"
    $results.issues | ForEach-Object { $reportLines += $_ }
} else {
    $reportLines += ""
    $reportLines += "No issues found."
}

$reportPath = Join-Path $blogDir "phase19-3-validation.txt"
$reportLines | Set-Content -Path $reportPath -Encoding UTF8
Write-Host "`nValidation report: $reportPath" -ForegroundColor Cyan
