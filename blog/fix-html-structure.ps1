# Fix HTML structure issues from Phase 19.3
$blogDir = "E:\gym\abcv-main\abcv-main\blog"
$count = 0

Get-ChildItem "$blogDir\*.html" | ForEach-Object {
    $file = $_.FullName
    $content = [System.IO.File]::ReadAllText($file)
    $orig = $content

    # FIX 1: <p> wraps the green/red div blocks
    # Pattern: article-content div > <p> > green div > red div > TEXT > </p>
    # Fix: Remove the leading <p>, place <p> before TEXT, keep </p> at end
    if ($content -match '(?s)(<div class="article-content text-lg text-slate-700">)\s*<p>\s*(<div class="bg-green-50 border-l-4 border-green-500.*?</div>\s*<div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">.*?</div>)(\s*)([A-Z][a-z]+)') {
        $articleDiv = $Matches[1]
        $blocks = $Matches[2]
        $space = $Matches[3]
        $textStart = $Matches[4]
        
        $fixed = "$articleDiv`n$blocks`n<p>$textStart"
        $content = $content -replace [regex]::Escape($Matches[0]), $fixed
        Write-Host "Fixed div/p nesting in: $($_.Name)"
        $count++
    }
    
    # FIX 2: Fix evidence sentence injected mid-paragraph
    # Pattern: "To maximize your Research consistently shows... arm growth."
    # Should be: "To maximize your arm growth."
    $content = $content -replace 'Research consistently shows that evidence-based approaches to fitness yield superior results compared to anecdotal methods\.\s*', ''
    
    # FIX 3: Fix "What is" question in Quick Answer - clean up long topics
    if ($content -match '(?s)(<strong>What is )([^<]{30,}?)(\?</strong>)') {
        $topic = $Matches[2]
        # Try to shorten the topic
        $shortTopic = $topic
        # Remove common verbose patterns
        $shortTopic = $shortTopic -replace '\s*:.*$', ''
        $shortTopic = $shortTopic -replace '\s+for\s+.*$', ''
        $shortTopic = $shortTopic -replace '\s+to\s+.*$', ''
        $shortTopic = $shortTopic -replace '\s*\|\s*.*$', ''
        $shortTopic = $shortTopic.Trim()
        
        if ($shortTopic.Length -gt 5 -and $shortTopic.Length -lt $topic.Length) {
            $oldQ = "What is $topic?"
            $newQ = "What is $shortTopic?"
            $content = $content -replace [regex]::Escape($oldQ), $newQ
            Write-Host "Shortened topic in: $($_.Name)"
        }
    }

    if ($content -ne $orig) {
        [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
    }
}

Write-Host "`nFixed $count files with structural issues." -ForegroundColor Cyan
