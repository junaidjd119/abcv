$sourceDir = "E:\gym\github\abcv\downloads"
$logoPath = "E:\gym\github\abcv\logo.png"

# Find the first video to test
$testVideo = Get-ChildItem -Path $sourceDir -Recurse -Filter "*.mp4" | Select-Object -First 1
$inputFile = $testVideo.FullName

# Output file in the same directory as the test script
$outputFile = "E:\gym\github\abcv\test_watermarked.mp4"

# Use ffmpeg to apply a scaled watermark (width: 250px) in the bottom right corner (0px padding)
# And set max bitrate to ensure it's under 500kb. (Assumes short video. Setting maxrate=250k)
Write-Host "Testing on: $inputFile"
ffmpeg -y -i "$inputFile" -i "$logoPath" -filter_complex "[1:v]scale=250:-1[watermark];[0:v][watermark]overlay=W-w:H-h" -c:v libx264 -maxrate 200k -bufsize 400k -codec:a copy "$outputFile"

Write-Host "Test complete. Output saved to $outputFile"
