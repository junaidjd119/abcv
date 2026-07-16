$files = Get-ChildItem -Path "downloads" -Recurse -Filter *.mp4
foreach ($f in $files) {
    $tempFile = [System.IO.Path]::ChangeExtension($f.FullName, ".tmp.mp4")
    # -an flag removes audio
    ffmpeg -i "$($f.FullName)" -c:v copy -an "$tempFile" -y
    if ($?) {
        Move-Item -Path "$tempFile" -Destination "$($f.FullName)" -Force
    }
}
git add downloads
git commit -m "Mute all videos in downloads"
git push
