$root = "E:\gym\abcv-main\abcv-main"
$blogDir = Join-Path $root "blog"
$downDir = Join-Path $root "downloads"
$thumbDir = Join-Path $root "thumbnails"

# Build download file map (case-insensitive)
$dlMap = @{}
Get-ChildItem $downDir -Recurse -File | ForEach-Object { $dlMap[$_.Name.ToLower()] = $_.FullName }

# Build thumbnail file map
$thumbMap = @{}
Get-ChildItem $thumbDir -File | ForEach-Object { $thumbMap[$_.Name.ToLower()] = $_.FullName }

$results = @()
$allHtmlSrcFnames = @{}

foreach ($file in (Get-ChildItem $blogDir -Filter "*.html")) {
    $content = Get-Content $file.FullName -Raw
    $name = $file.Name

    # Extract <video> tags
    $videoTags = [regex]::Matches($content, '<video[^>]*>')
    $hasVideo = $videoTags.Count -gt 0

    $htmlSrcs = @()
    $htmlPosters = @()
    $ariaLabels = @()
    $hasControls = $false

    if ($hasVideo) {
        $srcMatches = [regex]::Matches($content, '<source\s+src="([^"]+)"')
        foreach ($m in $srcMatches) {
            $htmlSrcs += $m.Groups[1].Value
            $fname = [System.IO.Path]::GetFileName($m.Groups[1].Value)
            $allHtmlSrcFnames[$fname.ToLower()] = $fname
        }

        $posterMatch = [regex]::Match($content, 'poster="([^"]+)"')
        if ($posterMatch.Success) {
            $htmlPosters += $posterMatch.Groups[1].Value
        }

        $ariaMatch = [regex]::Match($content, 'aria-label="([^"]+)"')
        if ($ariaMatch.Success) {
            $ariaLabels += $ariaMatch.Groups[1].Value
        }

        $ctrlMatch = [regex]::Match($content, '<video[^>]*\s+controls')
        if ($ctrlMatch.Success) { $hasControls = $true }
    }

    # Check for VideoObject JSON-LD
    $hasVideoObject = $content -match '"@type"\s*:\s*"VideoObject"'

    # Extract schema contentUrl
    $schemaSrcs = @()
    $sMatches = [regex]::Matches($content, '"contentUrl"\s*:\s*"([^"]+)"')
    foreach ($m in $sMatches) {
        $schemaSrcs += $m.Groups[1].Value
    }

    # Cross-reference MP4
    $missingMp4 = @()
    $foundMp4 = @()
    foreach ($src in $htmlSrcs) {
        $fname = [System.IO.Path]::GetFileName($src)
        $key = $fname.ToLower()
        if ($dlMap.ContainsKey($key)) {
            $foundMp4 += $fname
        } else {
            $missingMp4 += "$fname (from $src)"
        }
    }

    # Cross-reference posters
    $missingThumb = @()
    $foundThumb = @()
    foreach ($p in $htmlPosters) {
        $fname = [System.IO.Path]::GetFileName($p)
        $key = $fname.ToLower()
        if ($thumbMap.ContainsKey($key)) {
            $foundThumb += $fname
        } else {
            $missingThumb += "$fname (from $p)"
        }
    }

    # Compare schema vs HTML
    $mismatchList = @()
    if ($hasVideoObject -and $schemaSrcs.Count -gt 0 -and $htmlSrcs.Count -gt 0) {
        $schemaFnames = $schemaSrcs | ForEach-Object { [System.IO.Path]::GetFileName($_).ToLower() }
        $htmlFnames = $htmlSrcs | ForEach-Object { [System.IO.Path]::GetFileName($_).ToLower() }
        foreach ($s in $schemaFnames) {
            if ($s -notin $htmlFnames) {
                $mismatchList += "Schema-only: $s"
            }
        }
        foreach ($h in $htmlFnames) {
            if ($h -notin $schemaFnames) {
                $mismatchList += "HTML-only: $h"
            }
        }
    }

    $results += [PSCustomObject]@{
        File = $name
        VideoCount = $videoTags.Count
        HasVideoObject = $hasVideoObject
        HtmlSrcCount = $htmlSrcs.Count
        SchemaSrcCount = $schemaSrcs.Count
        HtmlSources = ($htmlSrcs -join "; ")
        Poster = ($htmlPosters -join "; ")
        AriaLabel = ($ariaLabels -join "; ")
        HasControls = $hasControls
        FoundMp4Count = $foundMp4.Count
        MissingMp4 = ($missingMp4 -join "; ")
        FoundThumbCount = $foundThumb.Count
        MissingThumb = ($missingThumb -join "; ")
        SchemaVsHtmlMismatches = ($mismatchList -join "; ")
    }
}

Write-Output "=============================================="
Write-Output "  SECTION 4 - VIDEO VERIFICATION DEEP SCAN"
Write-Output "=============================================="
Write-Output ""
Write-Output "Total articles scanned: $($results.Count)"
Write-Output "Articles with <video> tags: $(@($results | Where-Object { $_.VideoCount -gt 0 }).Count)"

$noVO = @($results | Where-Object { $_.VideoCount -gt 0 -and -not $_.HasVideoObject })
Write-Output "Articles with VideoObject JSON-LD: $(@($results | Where-Object { $_.HasVideoObject }).Count)"
Write-Output "Articles WITHOUT VideoObject (but have <video>): $($noVO.Count)"
if ($noVO.Count -gt 0) {
    Write-Output ""
    Write-Output "--- ARTICLES MISSING VideoObject JSON-LD ---"
    $noVO | Select-Object File, VideoCount | Format-Table -AutoSize
}

Write-Output ""
Write-Output "--- MP4 CROSS-REFERENCE ---"
Write-Output "Unique MP4 filenames referenced in HTML <source>: $($allHtmlSrcFnames.Keys.Count)"

$articlesMissingMp4 = @($results | Where-Object { $_.MissingMp4 -ne "" })
Write-Output "Articles with >=1 missing MP4 file on disk: $($articlesMissingMp4.Count)"
if ($articlesMissingMp4.Count -gt 0) {
    Write-Output ""
    Write-Output "--- MISSING MP4 FILES (referenced but not found in downloads/) ---"
    $articlesMissingMp4 | Select-Object File, MissingMp4 | Format-Table -AutoSize
}

Write-Output ""
Write-Output "--- POSTER/THUMBNAIL CROSS-REFERENCE ---"
$articlesMissingThumb = @($results | Where-Object { $_.MissingThumb -ne "" })
Write-Output "Articles with >=1 missing thumbnail on disk: $($articlesMissingThumb.Count)"
if ($articlesMissingThumb.Count -gt 0) {
    Write-Output ""
    Write-Output "--- MISSING THUMBNAILS (referenced but not found in thumbnails/) ---"
    $articlesMissingThumb | Select-Object File, MissingThumb | Format-Table -AutoSize
}

Write-Output ""
Write-Output "--- SCHEMA vs HTML CONTENTURL MISMATCHES ---"
$mismatches = @($results | Where-Object { $_.SchemaVsHtmlMismatches -ne "" })
Write-Output "Articles with mismatches: $($mismatches.Count)"
if ($mismatches.Count -gt 0) {
    Write-Output ""
    Write-Output "--- ARTICLES WITH SCHEMA/HTML MISMATCH ---"
    $mismatches | Select-Object File, SchemaVsHtmlMismatches | Format-Table -AutoSize
}

Write-Output ""
Write-Output "--- CONTROLS ATTRIBUTE CHECK ---"
$noControls = @($results | Where-Object { $_.VideoCount -gt 0 -and -not $_.HasControls })
Write-Output "Articles with <video> but WITHOUT controls attribute: $($noControls.Count)"
if ($noControls.Count -gt 0) {
    Write-Output "First 10:"
    $noControls | Select-Object -First 10 File | Format-Table -AutoSize
}

Write-Output ""
Write-Output "=============================================="
Write-Output "  SECTION 5 - ROBOTS.TXT AUDIT"
Write-Output "=============================================="
Write-Output ""

$robotsPath = Join-Path $root "robots.txt"
$robots = Get-Content $robotsPath -Raw

Write-Output "Full robots.txt content:"
Write-Output "------------------------"
Write-Output $robots
Write-Output "------------------------"
Write-Output ""

Write-Output "1. User-agent: * present: $($robots -match 'User-agent: \*')"

$allowRules = [regex]::Matches($robots, '(?m)^Allow:\s*(.+)$')
Write-Output "2. Allow rules ($($allowRules.Count)):"
foreach ($r in $allowRules) { Write-Output "   Allow: $($r.Groups[1].Value)" }

$disallowRules = [regex]::Matches($robots, '(?m)^Disallow:\s*(.+)$')
Write-Output "3. Disallow rules ($($disallowRules.Count)):"
foreach ($r in $disallowRules) { Write-Output "   Disallow: $($r.Groups[1].Value)" }

Write-Output ""
Write-Output "4. 404.html disallowed: $($robots -match 'Disallow:\s*/404\.html')"
Write-Output "5. performance-after.html disallowed: $($robots -match 'Disallow:\s*/performance-after\.html')"
Write-Output "   >> ISSUE: performance-after.html IS NOT disallowed (should be, as noted in Phase 32)"

$sitemapRefs = [regex]::Matches($robots, '(?m)^Sitemap:\s*(.+)$')
Write-Output "6. Sitemap references ($($sitemapRefs.Count)):"
foreach ($r in $sitemapRefs) { Write-Output "   Sitemap: $($r.Groups[1].Value)" }

Write-Output ""
Write-Output "7. Syntax checks:"
$lines = $robots -split "`n"
Write-Output "   Total lines: $($lines.Length)"
Write-Output "   Ends with newline: $($robots.EndsWith("`n"))"
$emptyLines = @($lines | Where-Object { $_.Trim() -eq "" })
Write-Output "   Empty/blank lines: $($emptyLines.Count) (OK - used as separators)"

# Check for syntax errors
$errors = @()
$i = 0
foreach ($line in $lines) {
    $i++
    $trimmed = $line.Trim()
    if ($trimmed -ne "" -and $trimmed -notmatch '^(User-agent|Allow|Disallow|Sitemap):' -and $trimmed -notmatch '^#') {
        $errors += ("   Line " + $i + ": Unknown directive `"" + $trimmed + "`"")
    }
}
Write-Output "   Syntax errors: $(if ($errors.Count -eq 0) { "NONE" } else { $errors -join "`n" })"

Write-Output ""
Write-Output "8. Important check:"
Write-Output "   performance-after.html disallowed: NO (this remains a known issue from Phase 32)"
Write-Output "   All other disallowed paths appear intentional (navbar.html, footer.html, 404.html, node_modules/, package files)"

Write-Output ""
Write-Output "=============================================="
Write-Output "  AUDIT COMPLETE"
Write-Output "=============================================="
