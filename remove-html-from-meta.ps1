# PowerShell script to remove .html from canonical URLs and Open Graph URLs
$publicHtmlDir = "d:\Amit\pdfindi.com-newsetup\public_html"

# Get all HTML files
$htmlFiles = Get-ChildItem -Path $publicHtmlDir -Recurse -Filter "*.html"

$totalChanges = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Remove .html from canonical URLs
    $content = $content -replace '(<link rel="canonical" href="https://pdfindi\.com/[^"]*?)\.html(")', '$1$2'
    
    # Remove .html from Open Graph URLs
    $content = $content -replace '(<meta property="og:url" content="https://pdfindi\.com/[^"]*?)\.html(")', '$1$2'
    
    # Remove .html from Twitter URLs
    $content = $content -replace '(<meta name="twitter:url" content="https://pdfindi\.com/[^"]*?)\.html(")', '$1$2'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated meta tags in $($file.Name)" -ForegroundColor Green
        $totalChanges++
    }
}

Write-Host "`nTotal files updated: $totalChanges" -ForegroundColor Cyan
Write-Host "All canonical and Open Graph URLs updated!" -ForegroundColor Green
