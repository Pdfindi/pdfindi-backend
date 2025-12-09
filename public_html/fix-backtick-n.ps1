# Script to fix the `n issue in all tool pages

$toolFiles = Get-ChildItem -Path "tools/*.html" -File

foreach ($file in $toolFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if file has the `n issue
    if ($content -match '``n') {
        # Replace `n with proper newline
        $content = $content -replace '``n', [Environment]::NewLine
        
        # Write back to file
        Set-Content -Path $file.FullName -Value $content -NoNewline
        
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "No issue found: $($file.Name)" -ForegroundColor Gray
    }
}

Write-Host "`n✅ All files checked and fixed!" -ForegroundColor Cyan
