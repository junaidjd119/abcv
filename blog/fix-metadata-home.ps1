$base = "E:\gym\abcv-main\abcv-main\blog"

# Mapping of part number to breadcrumb short name, H1, and keywords
$map = @{
    "6" = @{
        Breadcrumb = "Calisthenics Leverage Basics"
        Keywords = "calisthenics leverage, bodyweight training, pushup progression, home workout basics, progressive overload calisthenics, gymtranning"
    }
    "12" = @{
        Breadcrumb = "Advanced Pushup Progressions"
        Keywords = "pushup progressions, advanced pushups, archer pushup, one arm pushup, diamond pushup, home chest workout, gymtranning"
    }
    "34" = @{
        Breadcrumb = "Home Pullup and Row Hacks"
        Keywords = "home pullup alternatives, bodyweight rows, door frame rows, table rows, home back workout, pullup hacks, gymtranning"
    }
    "45" = @{
        Breadcrumb = "Bodyweight Leg Builders"
        Keywords = "bodyweight leg exercises, Bulgarian split squat, pistol squat, home leg workout, unilateral leg training, gymtranning"
    }
    "53" = @{
        Breadcrumb = "Using Resistance Bands"
        Keywords = "resistance bands home workouts, choosing resistance bands, upper body band exercises, full body band workout, gymtranning"
    }
    "63" = @{
        Breadcrumb = "Budget Home Gym Setup"
        Keywords = "budget home gym setup, essential home gym equipment, adjustable dumbbells, home gym under 200, gymtranning"
    }
    "66" = @{
        Breadcrumb = "Core Stability and Bracing"
        Keywords = "core stability bracing, home workouts core, 360 degree breathing, anti extension exercises, intra abdominal pressure, gymtranning"
    }
    "93" = @{
        Breadcrumb = "Metabolic Conditioning Circuits"
        Keywords = "metabolic conditioning circuits, home HIIT workouts, metcon workouts, home conditioning, gymtranning"
    }
}

function Fix-Metadata {
    param($path, $partNum)
    $info = $map[$partNum]
    $c = [System.IO.File]::ReadAllText($path)

    # 1. Fix breadcrumb visible text
    $oldBreadcrumb = '<span class="text-gray-400 truncate max-w-[200px]">Training (Part ' + $partNum + ')</span>'
    $newBreadcrumb = '<span class="text-gray-400 truncate max-w-[200px]">' + $info.Breadcrumb + '</span>'
    $c = $c.Replace($oldBreadcrumb, $newBreadcrumb)

    # 2. Fix BlogPosting JSON-LD keywords
    $oldKeywords = '"ultimate, guide, training, part, ' + $partNum + ','
    $newKeywords = '"' + $info.Keywords
    $c = $c.Replace($oldKeywords, $newKeywords)

    # 3. Fix VideoObject descriptions to match meta description
    # Find the meta description content
    $idx = $c.IndexOf('<meta name="description" content="')
    if ($idx -ge 0) {
        $start = $idx + '<meta name="description" content="'.Length
        $end = $c.IndexOf('"', $start)
        $metaDesc = $c.Substring($start, $end - $start)

        # Find all VideoObject description fields and replace them
        # Pattern: "description": "old generic text",
        # We need to find each VideoObject block's description
        $videoPatternStart = '"description": "'
        $searchFrom = 0
        while ($true) {
            $vIdx = $c.IndexOf($videoPatternStart, $searchFrom)
            if ($vIdx -lt 0 -or $vIdx -gt $c.IndexOf('</script>', $searchFrom)) { break }
            $vStart = $vIdx + $videoPatternStart.Length
            $vEnd = $c.IndexOf('"', $vStart)
            if ($vEnd -lt 0) { break }
            $oldVideoDesc = $c.Substring($vStart, $vEnd - $vStart)
            # Only replace if it's a generic description (contains "Learn how" or "Build a" etc that matches meta)
            # Actually just replace all VideoObject descriptions with the meta description
            $c = $c.Substring(0, $vStart) + $metaDesc + $c.Substring($vEnd)
            $searchFrom = $vStart + $metaDesc.Length
        }
    }

    [System.IO.File]::WriteAllBytes($path, [System.Text.Encoding]::UTF8.GetBytes($c))
    Write-Host "Fixed metadata for part $partNum"
}

# Apply to all 8 parts
foreach ($num in @("6","12","34","45","53","63","66","93")) {
    $path = "$base\ultimate-guide-home-workouts-part-$num.html"
    Fix-Metadata -path $path -partNum $num
}

Write-Host "All metadata fixed!"
