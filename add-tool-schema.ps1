# PowerShell script to add JSON-LD structured data to all tool pages
$toolsDir = "d:\Amit\pdfindi.com-newsetup\public_html\tools"

# Define tool-specific structured data
$toolSchemas = @{
    "merge-pdf.html" = @{
        name = "Merge PDF"
        description = "Merge multiple PDF files into one document online. Free, fast, and secure PDF merger tool."
        category = "PDF Tool"
    }
    "split-pdf.html" = @{
        name = "Split PDF"
        description = "Split PDF files into multiple documents or extract specific pages online."
        category = "PDF Tool"
    }
    "compress-pdf.html" = @{
        name = "Compress PDF"
        description = "Compress PDF files to reduce size while maintaining quality online."
        category = "PDF Tool"
    }
    "pdf-to-word.html" = @{
        name = "PDF to Word Converter"
        description = "Convert PDF to Word (DOCX) online for free with formatting maintained."
        category = "PDF Converter"
    }
    "word-to-pdf.html" = @{
        name = "Word to PDF Converter"
        description = "Convert Word documents (DOCX) to PDF format online."
        category = "PDF Converter"
    }
    "pdf-to-jpg.html" = @{
        name = "PDF to JPG Converter"
        description = "Convert PDF pages to JPG images online for free."
        category = "PDF Converter"
    }
    "jpeg-to-pdf.html" = @{
        name = "JPEG to PDF Converter"
        description = "Convert JPEG, PNG images to PDF format online."
        category = "Image Converter"
    }
    "rotate-pdf.html" = @{
        name = "Rotate PDF"
        description = "Rotate PDF pages clockwise or counterclockwise online."
        category = "PDF Tool"
    }
    "protect-pdf.html" = @{
        name = "Protect PDF"
        description = "Protect PDF files with password encryption online."
        category = "PDF Security"
    }
    "unlock-pdf.html" = @{
        name = "Unlock PDF"
        description = "Remove password protection from PDF files online."
        category = "PDF Security"
    }
    "organize-pdf.html" = @{
        name = "Organize PDF"
        description = "Organize and rearrange PDF pages with drag and drop."
        category = "PDF Tool"
    }
    "edit-pdf.html" = @{
        name = "Edit PDF"
        description = "Edit PDF documents online with text and image additions."
        category = "PDF Editor"
    }
    "add-watermark.html" = @{
        name = "Add Watermark to PDF"
        description = "Add text or image watermarks to PDF files online."
        category = "PDF Tool"
    }
    "qr-code-generator.html" = @{
        name = "QR Code Generator"
        description = "Generate QR codes for URLs, text, contact info online."
        category = "Utility Tool"
    }
    "password-generator.html" = @{
        name = "Password Generator"
        description = "Generate strong, secure passwords with customizable options."
        category = "Security Tool"
    }
    "word-counter.html" = @{
        name = "Word Counter"
        description = "Count words, characters, sentences, and paragraphs online."
        category = "Text Tool"
    }
    "case-converter.html" = @{
        name = "Case Converter"
        description = "Convert text to uppercase, lowercase, title case online."
        category = "Text Tool"
    }
    "base64-encoderdecoder.html" = @{
        name = "Base64 Encoder Decoder"
        description = "Encode and decode Base64 strings and files online."
        category = "Developer Tool"
    }
    "json-formatter.html" = @{
        name = "JSON Formatter"
        description = "Format, validate, and beautify JSON data online."
        category = "Developer Tool"
    }
    "color-picker.html" = @{
        name = "Color Picker"
        description = "Pick colors and get HEX, RGB, HSL codes for design."
        category = "Design Tool"
    }
    "unit-converter.html" = @{
        name = "Unit Converter"
        description = "Convert length, weight, temperature, and more online."
        category = "Calculator"
    }
    "age-calculator.html" = @{
        name = "Age Calculator"
        description = "Calculate age in years, months, and days from birth date."
        category = "Calculator"
    }
    "bmi-calculator.html" = @{
        name = "BMI Calculator"
        description = "Calculate Body Mass Index (BMI) with height and weight."
        category = "Health Tool"
    }
    "lorem-ipsum-generator.html" = @{
        name = "Lorem Ipsum Generator"
        description = "Generate Lorem Ipsum placeholder text for design projects."
        category = "Text Tool"
    }
    "image-compressor.html" = @{
        name = "Image Compressor"
        description = "Compress JPG, PNG images online without losing quality."
        category = "Image Tool"
    }
    "image-converter.html" = @{
        name = "Image Converter"
        description = "Convert images between JPG, PNG, WebP formats online."
        category = "Image Converter"
    }
    "file-converter.html" = @{
        name = "File Converter"
        description = "Convert various file formats online with universal converter."
        category = "Converter Tool"
    }
    "speech-to-text.html" = @{
        name = "Speech to Text"
        description = "Convert speech to text with voice recognition online."
        category = "AI Tool"
    }
    "text-to-speech.html" = @{
        name = "Text to Speech"
        description = "Convert text to speech with natural-sounding voices."
        category = "AI Tool"
    }
    "image-ocr.html" = @{
        name = "Image OCR"
        description = "Extract text from images using OCR technology online."
        category = "AI Tool"
    }
}

# Function to generate JSON-LD structured data
function Get-StructuredData {
    param($toolName, $description, $category, $url)
    
    return @"
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "$toolName",
  "description": "$description",
  "url": "$url",
  "applicationCategory": "$category",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  },
  "provider": {
    "@type": "Organization",
    "name": "PDFINDI",
    "url": "https://pdfindi.com"
  }
}
</script>
"@
}

# Process each tool file
foreach ($fileName in $toolSchemas.Keys) {
    $filePath = Join-Path $toolsDir $fileName
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        $schema = $toolSchemas[$fileName]
        
        # Check if structured data already exists
        if ($content -notmatch 'application/ld\+json') {
            $url = "https://pdfindi.com/tools/$fileName"
            $structuredData = Get-StructuredData -toolName $schema.name -description $schema.description -category $schema.category -url $url
            
            # Find closing </head> tag and insert before it
            $pattern = '(\s*</head>)'
            $replacement = "`n$structuredData`n`$1"
            $newContent = $content -replace $pattern, $replacement
            
            # Write back to file
            Set-Content -Path $filePath -Value $newContent -NoNewline
            Write-Host "Added structured data to $fileName" -ForegroundColor Green
        } else {
            Write-Host "Structured data already exists in $fileName" -ForegroundColor Yellow
        }
    }
}

Write-Host "`nJSON-LD structured data added to all tool pages!" -ForegroundColor Cyan
