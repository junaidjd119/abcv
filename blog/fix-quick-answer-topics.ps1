# Fix Quick Answer topics across all blog files
$blogDir = "E:\gym\abcv-main\abcv-main\blog"
$count = 0

Get-ChildItem "$blogDir\*.html" | ForEach-Object {
    $file = $_.FullName
    $content = [System.IO.File]::ReadAllText($file)
    $orig = $content

    # Find Quick Answer block and extract the topic
    if ($content -match '(?s)(<p><strong>What is )([^<]{5,}?)(\?</strong>)') {
        $prefix = $Matches[1]
        $topic = $Matches[2]
        $suffix = $Matches[3]
        
        # Aggressively clean the topic
        $clean = $topic
        # Remove everything after ":" or "?" 
        if ($clean -match '^([^:?]+)[:?]') { $clean = $Matches[1].Trim() }
        # Remove "for X" suffixes ("for Muscle Growth", "for Athletes", etc.)
        $clean = $clean -replace '\s+for\s+\w+.*$', ''
        # Remove "to X" suffixes
        $clean = $clean -replace '\s+to\s+\w+.*$', ''
        # Remove "vs X" if it's part of a comparison title
        $clean = $clean -replace '\s+vs\s+.*$', ''
        # Remove trailing "The", "A", "An"
        $clean = $clean -replace '\s+(The|A|An)$', ''
        # Remove "| GymTranning" 
        $clean = $clean -replace '\s*\|\s*GymTranning\s*$', ''
        # Remove ":" that survived
        $clean = $clean -replace ':', ''
        $clean = $clean.Trim()
        
        # Limit to 50 chars
        if ($clean.Length -gt 50) { $clean = $clean.Substring(0, 50).Trim() }
        
        if ($clean.Length -gt 3 -and $clean -ne $topic) {
            # Replace the question - also fix the definition text that uses the same topic
            $oldQ = "What is $topic?"
            $newQ = "What is $clean?"
            
            # Handle double/triple question marks
            $oldQ2 = "What is $topic??"
            
            $content = $content -replace [regex]::Escape($oldQ2), $newQ
            $content = $content -replace [regex]::Escape($oldQ), $newQ
            
            # Also fix the definition text: "$topic is a..." -> "$clean is a..."
            $defOld = "$topic is a "
            $defNew = "$clean is a "
            $content = $content -replace [regex]::Escape($defOld), $defNew
            
            $count++
            Write-Host "Fixed: $($_.Name) - '$clean'" -ForegroundColor Green
        } elseif ($clean.Length -gt 3) {
            # Still clean up double/triple question marks even if topic unchanged
            $content = $content -replace '\?\?+', '?'
        }
    }
    
    # Clean up any remaining multiple question marks
    $content = $content -replace '(\?\s*)+', '?'
    # Fix "?." -> "?." (question mark followed by period is fine, leave it)
    # Fix trailing " ?" -> "?"
    $content = $content -replace '\s+\?', '?'
    
    if ($content -ne $orig) {
        [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
    }
}

Write-Host "`nFixed topics in $count files." -ForegroundColor Cyan
