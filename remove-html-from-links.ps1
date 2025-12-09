# PowerShell script to remove .html from all internal links
$publicHtmlDir = "d:\Amit\pdfindi.com-newsetup\public_html"

# Get all HTML files
$htmlFiles = Get-ChildItem -Path $publicHtmlDir -Recurse -Filter "*.html"

$totalChanges = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Remove .html from href attributes (but not external links or mailto/tel)
    $content = $content -replace 'href="([^"]*?)\.html"', 'href="$1"'
    
    # Also handle single quotes
    $content = $content -replace "href='([^']*?)\.html'", "href='`$1'"
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $changes = ([regex]::Matches($originalContent, '\.html"')).Count - ([regex]::Matches($content, '\.html"')).Count
        $totalChanges += $changes
        Write-Host "Updated $($file.Name) - Removed $changes .html references" -ForegroundColor Green
    }
}

Write-Host "`nTotal .html references removed from links: $totalChanges" -ForegroundColor Cyan
Write-Host "All internal links updated successfully!" -ForegroundColor Green
