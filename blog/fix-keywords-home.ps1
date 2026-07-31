$base = "E:\gym\abcv-main\abcv-main\blog"

$map = @{
    "6" = @{
        Keywords = "calisthenics, leverage, bodyweight training, bodyweight progressions, home workout routine, gymtranning"
    }
    "12" = @{
        Keywords = "pushup progressions, advanced pushups, archer pushup, one arm pushup, diamond pushup, home chest workout, gymtranning"
    }
    "34" = @{
        Keywords = "home pullup alternatives, bodyweight rows, door frame rows, table rows, home back workout, pullup hacks, gymtranning"
    }
    "45" = @{
        Keywords = "bodyweight leg exercises, Bulgarian split squat, pistol squat, home leg workout, unilateral leg training, gymtranning"
    }
    "53" = @{
        Keywords = "resistance bands home workouts, choosing resistance bands, upper body band exercises, full body band workout, gymtranning"
    }
    "63" = @{
        Keywords = "budget home gym setup, essential home gym equipment, adjustable dumbbells, home gym under 200, gymtranning"
    }
    "66" = @{
        Keywords = "core stability bracing, home workouts core, 360 degree breathing, anti extension exercises, intra abdominal pressure, gymtranning"
    }
    "93" = @{
        Keywords = "metabolic conditioning circuits, home HIIT workouts, metcon workouts, home conditioning, gymtranning"
    }
}

foreach ($num in @("6","12","34","45","53","63","66","93")) {
    $path = "$base\ultimate-guide-home-workouts-part-$num.html"
    $c = [System.IO.File]::ReadAllText($path)
    $info = $map[$num]
    $newKW = $info.Keywords

    # Fix BlogPosting JSON-LD keywords - replace the entire value between "keywords": " and the closing "
    $idx = $c.IndexOf('"keywords": "')
    if ($idx -ge 0) {
        $start = $idx + '"keywords": "'.Length
        $end = $c.IndexOf('"', $start)
        if ($end -gt $start) {
            $c = $c.Substring(0, $start) + $newKW + $c.Substring($end)
        }
    }

    [System.IO.File]::WriteAllBytes($path, [System.Text.Encoding]::UTF8.GetBytes($c))
    Write-Host "Fixed keywords for part $num"
}
Write-Host "Done!"
