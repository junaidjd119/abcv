$rootDir = Get-Location
$reportFile = Join-Path $rootDir "final_audit_data.json"

# Mandatory pages patterns
$mandatoryPages = @{
    "contact" = "contact"
    "privacy" = "privacy"
    "terms" = "terms|tos"
    "about" = "about"
    "cookie" = "cookie"
}

# Configuration
$config = @{
    minWordCount = 300
    titleMaxLength = 60
    descMaxLength = 160
}

$auditResults = @{
    pages = @()
    brokenLinks = @()
    missingPages = @()
    summary = @{
        totalFiles = 0
        totalErrors = 0
        adSenseReady = $false
    }
}

# Get all HTML files
$files = Get-ChildItem -Path $rootDir -Recurse -Filter *.html | Where-Object { $_.FullName -notmatch 'node_modules|\.git|\.vscode' }
$auditResults.summary.totalFiles = $files.Count

$pageExistence = @{
    "contact" = $false
    "privacy" = $false
    "terms" = $false
    "about" = $false
    "cookie" = $false
}

Write-Host "Starting audit of $($files.Count) files..."

foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($rootDir.Path.Length + 1)
    $content = Get-Content $file.FullName -Raw

    # Check mandatory pages
    foreach ($key in $mandatoryPages.Keys) {
        if ($relativePath -match $mandatoryPages[$key]) {
            $pageExistence[$key] = $true
        }
    }

    # Meta extraction
    $title = ""
    if ($content -match '<title>(.*?)</title>') {
        $title = $Matches[1].Trim()
    }

    $description = ""
    if ($content -match '<meta\s+name=["'']description["'']\s+content=["''](.*?)["'']') {
        $description = $Matches[1].Trim()
    }

    $h1Count = ([regex]::Matches($content, '<h1.*?>.*?</h1>', 'IgnoreCase')).Count

    # Word count (rough)
    $cleanContent = $content -replace '<script.*?</script>', '' -replace '<style.*?</style>', '' -replace '<[^>]+>', ' ' -replace '\s+', ' '
    $wordCount = ($cleanContent.Trim().Split(" ")).Count

    # Images
    $imgMatches = [regex]::Matches($content, '<img\s+[^>]*>', 'IgnoreCase')
    $images = @()
    $missingAltCount = 0
    foreach ($match in $imgMatches) {
        $hasAlt = $match.Value -match 'alt=["''](.*?)["'']'
        $altText = if ($hasAlt) { $Matches[1] } else { "" }
        if (-not $hasAlt -or [string]::IsNullOrWhiteSpace($altText)) {
            $missingAltCount++
        }
    }

    # Links
    $links = [regex]::Matches($content, 'href=["''](.*?)["'']', 'IgnoreCase')
    foreach ($linkMatch in $links) {
        $link = $linkMatch.Groups[1].Value.Trim()
        
        if ([string]::IsNullOrWhiteSpace($link) -or $link -match '^(mailto:|tel:|javascript:|#)') { continue }

        if ($link -match '^http') {
            # External link - skipping deep check for speed, mostly checking format
        } else {
            # Internal check
            $targetPath = ""
            if ($link.StartsWith("/")) {
                $targetPath = Join-Path $rootDir $link.TrimStart("/")
            } else {
                $targetPath = Join-Path $file.DirectoryName $link
            }
            
            # Remove anchors/query
            $targetPath = $targetPath.Split("#")[0].Split("?")[0]

            if (-not (Test-Path $targetPath)) {
                $auditResults.brokenLinks += @{
                    source = $relativePath
                    link = $link
                    reason = "File not found"
                }
            }
        }
    }

    $auditResults.pages += @{
        file = $relativePath
        title = $title
        description = $description
        h1Count = $h1Count
        wordCount = $wordCount
        imagesCount = $imgMatches.Count
        missingAlt = $missingAltCount
    }
}

# Missing pages check
foreach ($key in $pageExistence.Keys) {
    if (-not $pageExistence[$key]) {
        $auditResults.missingPages += $key
    }
}

# Summary
$auditResults.summary.totalErrors = $auditResults.brokenLinks.Count + $auditResults.missingPages.Count
# Simple AdSense check logic
$validWordCounts = $auditResults.pages | Where-Object { $_.wordCount -ge $config.minWordCount }
if ($auditResults.summary.totalErrors -eq 0 -and $validWordCounts.Count -eq $auditResults.pages.Count) {
    $auditResults.summary.adSenseReady = $true
} else {
     $auditResults.summary.adSenseReady = $false
}

$auditResults | ConvertTo-Json -Depth 4 | Out-File $reportFile -Encoding utf8
Write-Host "Audit complete. Results saved to $reportFile"
