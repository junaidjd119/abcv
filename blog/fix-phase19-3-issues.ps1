# Fix structural issues from Phase 19.3 first pass
$blogDir = "E:\gym\abcv-main\abcv-main\blog"

Get-ChildItem "$blogDir\*.html" | ForEach-Object {
    $file = $_.FullName
    $content = [System.IO.File]::ReadAllText($file)
    $orig = $content
    $changed = $false

    # FIX 1: "Who Is This For" / "Who Should Avoid" blocks are INSIDE <p> tags
    # Pattern: <p>\n<div class="bg-green-50...">\n<div class="bg-red-50...">TEXT</p>
    # Should be: <div class="bg-green-50...">\n<div class="bg-red-50...">\n<p>TEXT</p>
    
    # Fix: Remove leading <p> that wraps the blocks
    if ($content -match '(?s)<p>\s*<div class="bg-green-50 border-l-4 border-green-500') {
        $content = $content -replace '(?s)<p>\s*(<div class="bg-green-50 border-l-4 border-green-500)', "`n`$1"
        $changed = $true
    }
    
    # Fix: Close the </p> that comes after the blocks but before actual paragraph text
    # Pattern: </div>\n</div>Walk into any gym... (no <p> before text)
    if ($content -match '(?s)(</div>\s*</div>)([A-Z][a-z]+ )') {
        $content = $content -replace [regex]::Escape($Matches[1]), "$($Matches[1])`n<p>"
        # Now we have: </div>\n</div>\n<p>Walk into any gym...
        # But there's likely a trailing </p> missing or extra
        $changed = $true
    }

    # Fix: Remove orphan </p> that closes too early
    # Pattern: ...text.</p> right before blocks
    if ($content -match '(?s)(\.</p>\s*<div class="bg-green-50)') {
        # This is actually OK - the blocks are outside <p> now
    }

    # FIX 2: Remove trailing </p> that may be wrapping the evidence sentence
    # If we find </p>\n<p> right after an evidence insertion, fix it
    if ($content -match '(?s)(evidence-based approaches to fitness yield superior results compared to anecdotal methods\.</p>\s*<p>)') {
        $content = $content -replace [regex]::Escape($Matches[1]), "evidence-based approaches to fitness yield superior results compared to anecdotal methods."
        $changed = $true
    }

    # FIX 3: Clean up Quick Answer topic - remove trailing questions
    # "What is HIIT vs LISS Cardio: Which Burns More Fat??" -> "What is HIIT vs LISS Cardio?"
    if ($content -match '(?s)(Quick Answer.*?<strong>What is )([^?]+?)(\?\s*</strong>)') {
        $topic = $Matches[2]
        # Clean up: remove "for X" or "to X" suffixes from the question
        $cleanTopic = $topic -replace '\s+for\s+\w+.*$', ''
        $cleanTopic = $cleanTopic -replace '\s+to\s+\w+.*$', ''
        $cleanTopic = $cleanTopic -replace ':.*$', ''
        if ($cleanTopic.Length -gt 5 -and $cleanTopic -ne $topic) {
            $oldQuestion = "What is $topic?"
            $newQuestion = "What is $cleanTopic?"
            $content = $content -replace [regex]::Escape($oldQuestion), $newQuestion
            $changed = $true
        }
    }

    # FIX 4: Remove duplicate question marks
    $content = $content -replace '\?\?', '?'

    if ($changed) {
        [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Fixed: $($_.Name)" -ForegroundColor Yellow
    }
}

Write-Host "`nStructural fixes applied." -ForegroundColor Cyan
