$base = "E:\gym\abcv-main\abcv-main\blog"
$parts = @(4,7,18,30,44,46,52,54,55,72,88,94,95,99)

function Fix-File {
    param($path)
    $c = [System.IO.File]::ReadAllText($path)
    $changed = $false
    
    # Fix 1: "Part X of 14" -> "Part X — Mindset Series" (remove stale total count)
    if ($c -match 'Part \d+ of 14') {
        $c = $c -replace '(Part \d+) of 14', '$1 &mdash; Mindset Series'
        $changed = $true
        Write-Host "  Fixed Part X of 14 label"
    }
    
    # Fix 2: Visual breadcrumb "Lifestyle (Part X)" -> "Mindset (Part X)"
    if ($c -match 'Lifestyle \(Part \d+\)') {
        $c = $c -replace 'Lifestyle \(Part (\d+)\)', 'Mindset (Part $1)'
        $changed = $true
        Write-Host "  Fixed breadcrumb Lifestyle -> Mindset"
    }
    
    # Fix 3: Category badge "Lifestyle" -> "Mindset"
    if ($c -match '<span class="[^"]*">Lifestyle</span>') {
        $c = $c -replace '(<span class="[^"]*">)Lifestyle(</span>)', '${1}Mindset${2}'
        $changed = $true
        Write-Host "  Fixed category badge Lifestyle -> Mindset"
    }
    
    # Fix 4: Related article alt text "... - Lifestyle Guide" -> "... - Mindset Series"
    if ($c -match '- Lifestyle Guide"') {
        $c = $c -replace '- Lifestyle Guide"', '- Mindset Series"'
        $changed = $true
        Write-Host "  Fixed related alt text Lifestyle Guide -> Mindset Series"
    }
    
    if ($changed) {
        [System.IO.File]::WriteAllBytes($path, [System.Text.Encoding]::UTF8.GetBytes($c))
        Write-Host "  Saved changes"
    } else {
        Write-Host "  No changes needed"
    }
}

foreach ($p in $parts) {
    $path = "$base\ultimate-guide-mindset-part-$p.html"
    if (-not (Test-Path $path)) { Write-Host "MISSING part-$p"; continue }
    Write-Host ("Part " + $p + ":")
    Fix-File -path $path
    Write-Host ""
}

Write-Host "Metadata fixes complete for all 14 Mindset articles."
