$files = Get-ChildItem -Path . -Recurse -Filter *.html

$results = @()

foreach ($file in $files) {
    if ($file.FullName -match 'node_modules') { continue }
    
    $content = Get-Content $file.FullName -Raw
    
    # Title
    $title = ""
    if ($content -match '<title>(.*?)</title>') {
        $title = $matches[1].Trim()
    }

    # Description
    $desc = ""
    if ($content -match '<meta\s+name=["'']description["'']\s+content=["''](.*?)["'']') {
        $desc = $matches[1].Trim()
    }

    # H1
    $h1Matches = [regex]::Matches($content, '<h1.*?>(.*?)</h1>', 'IgnoreCase')
    $h1Count = $h1Matches.Count
    $h1Text = if ($h1Count -gt 0) { $h1Matches[0].Groups[1].Value.Trim() } else { "" }

    # Images
    $imgMatches = [regex]::Matches($content, '<img\s+[^>]*?>', 'IgnoreCase')
    $imgCount = $imgMatches.Count
    $missingAlt = 0
    foreach ($match in $imgMatches) {
        if ($match.Value -notmatch 'alt=["''][^"'']*["'']') {
            $missingAlt++
        }
    }

    # Word Count (rough)
    # Remove script and style blocks first
    $cleanContent = $content -replace '(?s)<script.*?</script>', '' 
    $cleanContent = $cleanContent -replace '(?s)<style.*?</style>', ''
    # Remove HTML tags
    $cleanContent = $cleanContent -replace '<[^>]+>', ' '
    # Normalize whitespace
    $wordCount = ($cleanContent -split '\s+').Count

    # Links (Internal/External) - Just counting for now
    $internalLinks = ([regex]::Matches($content, 'href=["''](?!http|//|mailto|tel)(.*?)["'']', 'IgnoreCase')).Count
    $externalLinks = ([regex]::Matches($content, 'href=["''](http|//)(.*?)["'']', 'IgnoreCase')).Count

    $results += [PSCustomObject]@{
        File = $file.Name
        Path = $file.FullName
        Title = $title
        MetaDescription = $desc
        H1Count = $h1Count
        H1Text = $h1Text
        ImageCount = $imgCount
        MissingAlt = $missingAlt
        WordCount = $wordCount
        InternalLinks = $internalLinks
        ExternalLinks = $externalLinks
    }
}

$results | ConvertTo-Json -Depth 2 | Out-File "audit_results.json" -Encoding utf8
