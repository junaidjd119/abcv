$files = Get-ChildItem -Path . -Recurse -Filter *.html

$brokenLinks = @()

foreach ($file in $files) {
    if ($file.FullName -match 'node_modules') { continue }
    
    $content = Get-Content $file.FullName -Raw
    # Find all hrefs
    $links = [regex]::Matches($content, 'href=["''](.*?)["'']', 'IgnoreCase')

    foreach ($linkMatch in $links) {
        $url = $linkMatch.Groups[1].Value.Trim()
        
        # Skip empty, mailto, tel, javascript
        if ([string]::IsNullOrWhiteSpace($url) -or $url -match '^(mailto:|tel:|javascript:|#)') { continue }

        $status = "OK"
        $statusCode = 200
        $isExternal = $false

        if ($url -match '^http') {
            $isExternal = $true
            try {
                $response = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 5 -ErrorAction Stop
                $statusCode = $response.StatusCode
            }
            catch {
                try {
                    # Retry with GET in case HEAD is blocked
                    $response = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec 5 -ErrorAction Stop
                    $statusCode = $response.StatusCode
                }
                catch {
                    $status = "Broken"
                    $statusCode = $_.Exception.Response.StatusCode.value__
                    if (-not $statusCode) { $statusCode = 0 } # Network error
                }
            }
        }
        else {
            # Internal link
            # Handle root relative /...
            $targetPath = ""
            if ($url.StartsWith("/")) {
                $targetPath = Join-Path $(Get-Location).Path $url.TrimStart("/")
            }
            else {
                # Relative to current file
                $targetPath = Join-Path $file.DirectoryName $url
            }
            
            # Remove anchor #...
            if ($targetPath -match '#') {
                $targetPath = $targetPath -replace '#.*$', ''
            }
            # Remove query params ?...
            if ($targetPath -match '\?') {
                $targetPath = $targetPath -replace '\?.*$', ''
            }

            if (-not (Test-Path $targetPath)) {
                $status = "Broken"
                $statusCode = 404
            }
        }

        if ($status -eq "Broken") {
            $brokenLinks += [PSCustomObject]@{
                SourceFile = $file.Name
                Link       = $url
                StatusCode = $statusCode
                IsExternal = $isExternal
            }
            Write-Host "Found Broken Link in $($file.Name): $url ($statusCode)" -ForegroundColor Red
        }
    }
}

$brokenLinks | ConvertTo-Json -Depth 2 | Out-File "broken_links.json" -Encoding utf8
Write-Host "Link check complete. Results saved to broken_links.json"
