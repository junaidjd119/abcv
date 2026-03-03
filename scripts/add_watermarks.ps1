$sourceDir = "E:\gym\github\abcv\downloads"
$logoPath = "E:\gym\github\abcv\logo.png"

$videos = Get-ChildItem -Path $sourceDir -Recurse -Filter "*.mp4"
$total = $videos.Count
$current = 0

foreach ($video in $videos) {
    $current++
    $inputFile = $video.FullName
    $tempFile = $video.DirectoryName + "\~~" + $video.BaseName + "_temp.mp4"

    Write-Host "[$current/$total] Processing: $inputFile"
    
    # Run ffmpeg
    $ffmpegArgs = @(
        "-y",
        "-i", "`"$inputFile`"",
        "-i", "`"$logoPath`"",
        "-filter_complex", "`"[1:v]scale=250:-1[watermark];[0:v][watermark]overlay=W-w:H-h`"",
        "-c:v", "libx264",
        "-maxrate", "200k",
        "-bufsize", "400k",
        "-codec:a", "copy",
        "`"$tempFile`""
    )
    
    $pinfo = New-Object System.Diagnostics.ProcessStartInfo
    $pinfo.FileName = "ffmpeg"
    $pinfo.Arguments = $ffmpegArgs -join ' '
    $pinfo.UseShellExecute = $false
    $pinfo.CreateNoWindow = $true
    
    $p = New-Object System.Diagnostics.Process
    $p.StartInfo = $pinfo
    $p.Start() | Out-Null
    $p.WaitForExit()
    
    if ($p.ExitCode -eq 0 -and (Test-Path $tempFile)) {
        Move-Item -Path $tempFile -Destination $inputFile -Force
        Write-Host "  -> Success"
    }
    else {
        Write-Host "  -> Failed. Exit code: $($p.ExitCode)"
        if (Test-Path $tempFile) {
            Remove-Item $tempFile -Force
        }
    }
}
Write-Host "All done!"
