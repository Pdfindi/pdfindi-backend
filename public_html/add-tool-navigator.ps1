# Script to add Tool Navigator to all tool pages
# Run this in PowerShell from the public_html directory

$toolFiles = Get-ChildItem -Path "tools/*.html" -File

foreach ($file in $toolFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if tool-navigator.css is already added or has the `n issue
    if (($content -notmatch 'tool-navigator.css') -or ($content -match '``n')) {
        # Remove any existing broken links first
        $content = $content -replace '``n\s*<link rel="stylesheet" href="tool-navigator.css">', ''
        $content = $content -replace '<link rel="stylesheet" href="tool-navigator.css">', ''
        $content = $content -replace '``n\s*<script src="tool-navigator.js"></script>', ''
        $content = $content -replace '<script src="tool-navigator.js"></script>', ''
        
        # Add CSS link after style.css with proper newline
        $content = $content -replace '(<link rel="stylesheet" href="\.\./style\.css">)', ('$1' + [Environment]::NewLine + '    <link rel="stylesheet" href="tool-navigator.css">')
        
        # Add JS script before closing body tag with proper newline
        $content = $content -replace '(</body>\s*</html>)', ('    <script src="tool-navigator.js"></script>' + [Environment]::NewLine + '$1')
        
        # Write back to file
        Set-Content -Path $file.FullName -Value $content -NoNewline
        
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "Skipped (already updated): $($file.Name)" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Tool Navigator added to all tool pages!" -ForegroundColor Cyan
