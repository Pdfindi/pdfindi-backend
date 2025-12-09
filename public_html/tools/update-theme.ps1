# Script to update all tool pages with modern theme

$toolsDir = "d:\Amit\pdfindi.com-newsetup\public_html\tools"
$htmlFiles = Get-ChildItem -Path $toolsDir -Filter "*.html"

Write-Host "Found $($htmlFiles.Count) HTML files to update" -ForegroundColor Cyan

foreach ($file in $htmlFiles) {
    Write-Host ""
    Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content -Path $file.FullName -Raw
    $updated = $false
    
    # Replace tool-navigator.css with modern-header.css
    if ($content -match '<link rel="stylesheet" href="tool-navigator\.css">') {
        $content = $content -replace '<link rel="stylesheet" href="tool-navigator\.css">', '<link rel="stylesheet" href="../modern-header.css">'
        Write-Host "  ✓ Replaced tool-navigator.css with modern-header.css" -ForegroundColor Green
        $updated = $true
    }
    
    # Replace indian-theme.css with modern-theme.css
    if ($content -match '<link rel="stylesheet" href="indian-theme\.css">') {
        $content = $content -replace '<link rel="stylesheet" href="indian-theme\.css">', '<link rel="stylesheet" href="modern-theme.css">'
        Write-Host "  ✓ Replaced indian-theme.css with modern-theme.css" -ForegroundColor Green
        $updated = $true
    }
    
    # Replace tool-navigator.js with modern-header.js
    if ($content -match '<script src="tool-navigator\.js"></script>') {
        $content = $content -replace '<script src="tool-navigator\.js"></script>', '<script src="../modern-header.js"></script>'
        Write-Host "  ✓ Replaced tool-navigator.js with modern-header.js" -ForegroundColor Green
        $updated = $true
    }
    
    # Save the updated content
    if ($updated) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  ✓ Saved $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "  - No changes needed" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "All files updated successfully!" -ForegroundColor Cyan
Write-Host "Total files processed: $($htmlFiles.Count)" -ForegroundColor Cyan
