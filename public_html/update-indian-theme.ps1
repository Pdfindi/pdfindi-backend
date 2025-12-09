# Script to update all tool pages with Indian tricolor theme

$toolFiles = Get-ChildItem -Path "tools/*.html" -File

foreach ($file in $toolFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Add indian-theme.css link after tool-navigator.css if not already present
    if ($content -notmatch 'indian-theme.css') {
        $content = $content -replace '(<link rel="stylesheet" href="tool-navigator.css">)', ('$1' + [Environment]::NewLine + '    <link rel="stylesheet" href="indian-theme.css">')
    }
    
    # Replace old color variables with Indian tricolor colors
    $content = $content -replace '#667eea', '#FF9933'
    $content = $content -replace '#764ba2', '#138808'
    $content = $content -replace '#4facfe', '#138808'
    $content = $content -replace '#00f2fe', '#34d399'
    $content = $content -replace '#fa709a', '#FFB84D'
    $content = $content -replace '#fee140', '#FF9933'
    $content = $content -replace '#ff6b6b', '#000080'
    $content = $content -replace '#ee5a52', '#FF9933'
    $content = $content -replace '#10b981', '#138808'
    $content = $content -replace '#34d399', '#34d399'
    $content = $content -replace '#d9232d', '#FF9933'
    $content = $content -replace '#e74c3c', '#138808'
    $content = $content -replace '#b81c25', '#138808'
    $content = $content -replace 'rgba\(99, 102, 241,', 'rgba(255, 153, 51,'
    
    # Write back to file
    Set-Content -Path $file.FullName -Value $content -NoNewline
    
    Write-Host "Updated: $($file.Name)" -ForegroundColor Green
}

Write-Host "`n✅ All tool pages updated with Indian tricolor theme!" -ForegroundColor Cyan
