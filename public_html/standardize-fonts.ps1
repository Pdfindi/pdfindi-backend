# Script to standardize font to Inter across all pages

# Update main pages (index, about, contact, privacy, faq)
$mainPages = @("index.html", "about.html", "contact.html", "privacy.html", "faq.html")

foreach ($page in $mainPages) {
    $content = Get-Content $page -Raw
    
    # Replace Roboto with Inter
    $content = $content -replace "family=Roboto:[^&]+", "family=Inter:wght@300;400;500;600;700;800;900"
    $content = $content -replace "'Roboto'", "'Inter'"
    $content = $content -replace '"Roboto"', '"Inter"'
    
    Set-Content -Path $page -Value $content -NoNewline
    Write-Host "Updated: $page" -ForegroundColor Green
}

# Update tool pages with inconsistent Roboto fonts
$toolFiles = Get-ChildItem -Path "tools/*.html" -File

foreach ($file in $toolFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Standardize all to Inter with full weights
    $content = $content -replace "family=Roboto:[^&]+", "family=Inter:wght@300;400;500;600;700;800;900"
    $content = $content -replace "family=Inter:[^&]+", "family=Inter:wght@300;400;500;600;700;800;900"
    $content = $content -replace "'Roboto'", "'Inter'"
    $content = $content -replace '"Roboto"', '"Inter"'
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "`n✅ All pages now use Inter font consistently!" -ForegroundColor Cyan
