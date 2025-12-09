# PowerShell script to add SEO meta tags to all tool pages
$toolsDir = "d:\Amit\pdfindi.com-newsetup\public_html\tools"

# Define tool-specific SEO data
$toolData = @{
    "merge-pdf.html" = @{
        title = "Merge PDF - Combine Multiple PDFs Online Free | PDFINDI"
        description = "Merge multiple PDF files into one document online. Free, fast, and secure PDF merger tool made in India. No registration required."
        keywords = "merge pdf, combine pdf, pdf merger india, merge pdf online free, join pdf files"
    }
    "split-pdf.html" = @{
        title = "Split PDF - Separate PDF Pages Online Free | PDFINDI"
        description = "Split PDF files into multiple documents or extract specific pages. Free online PDF splitter tool. Secure and easy to use."
        keywords = "split pdf, divide pdf, extract pdf pages, pdf splitter india, separate pdf online free"
    }
    "compress-pdf.html" = @{
        title = "Compress PDF - Reduce PDF File Size Online | PDFINDI"
        description = "Compress PDF files to reduce size while maintaining quality. Free online PDF compressor tool made in India. Fast and secure."
        keywords = "compress pdf, reduce pdf size, pdf compressor india, shrink pdf online free, minimize pdf"
    }
    "pdf-to-word.html" = @{
        title = "PDF to Word - Convert PDF to DOCX Online Free | PDFINDI"
        description = "Convert PDF to Word (DOCX) online for free. Maintain formatting and edit your documents easily. Secure PDF to Word converter."
        keywords = "pdf to word, pdf to docx, convert pdf word india, pdf word converter free, pdf editable"
    }
    "word-to-pdf.html" = @{
        title = "Word to PDF - Convert DOCX to PDF Online Free | PDFINDI"
        description = "Convert Word documents (DOCX) to PDF format online. Free, fast, and maintains formatting perfectly. Made in India."
        keywords = "word to pdf, docx to pdf, convert word pdf india, word pdf converter free, document converter"
    }
    "pdf-to-jpg.html" = @{
        title = "PDF to JPG - Convert PDF to Images Online Free | PDFINDI"
        description = "Convert PDF pages to JPG images online. Free PDF to image converter. Extract images from PDF documents easily."
        keywords = "pdf to jpg, pdf to image, convert pdf jpg india, pdf image converter free, extract pdf images"
    }
    "jpeg-to-pdf.html" = @{
        title = "JPEG to PDF - Convert Images to PDF Online Free | PDFINDI"
        description = "Convert JPEG, PNG images to PDF format online. Free image to PDF converter. Create PDF from multiple images."
        keywords = "jpeg to pdf, jpg to pdf, image to pdf india, photo pdf converter free, convert pictures pdf"
    }
    "rotate-pdf.html" = @{
        title = "Rotate PDF - Rotate PDF Pages Online Free | PDFINDI"
        description = "Rotate PDF pages clockwise or counterclockwise. Free online PDF rotation tool. Fix PDF orientation easily."
        keywords = "rotate pdf, turn pdf pages, pdf rotation india, rotate pdf online free, fix pdf orientation"
    }
    "protect-pdf.html" = @{
        title = "Protect PDF - Add Password to PDF Online Free | PDFINDI"
        description = "Protect PDF files with password encryption. Add security to your documents online. Free PDF password protector."
        keywords = "protect pdf, password protect pdf, secure pdf india, encrypt pdf online free, pdf security"
    }
    "unlock-pdf.html" = @{
        title = "Unlock PDF - Remove PDF Password Online Free | PDFINDI"
        description = "Remove password protection from PDF files. Unlock secured PDFs online for free. Quick and easy PDF unlock tool."
        keywords = "unlock pdf, remove pdf password, decrypt pdf india, unlock pdf online free, pdf password remover"
    }
    "organize-pdf.html" = @{
        title = "Organize PDF - Rearrange PDF Pages Online Free | PDFINDI"
        description = "Organize and rearrange PDF pages with drag and drop. Free online PDF page organizer tool. Reorder pages easily."
        keywords = "organize pdf, rearrange pdf pages, reorder pdf india, organize pdf online free, sort pdf pages"
    }
    "edit-pdf.html" = @{
        title = "Edit PDF - Modify PDF Documents Online Free | PDFINDI"
        description = "Edit PDF documents online. Add text, images, and annotations to PDFs. Free PDF editor made in India."
        keywords = "edit pdf, modify pdf, pdf editor india, edit pdf online free, add text pdf"
    }
    "add-watermark.html" = @{
        title = "Add Watermark to PDF - PDF Watermark Tool Online | PDFINDI"
        description = "Add text or image watermarks to PDF files. Free online PDF watermark tool. Protect your documents with custom watermarks."
        keywords = "add watermark pdf, pdf watermark india, watermark pdf online free, pdf stamp tool, brand pdf"
    }
    "qr-code-generator.html" = @{
        title = "QR Code Generator - Create QR Codes Online Free | PDFINDI"
        description = "Generate QR codes for URLs, text, contact info, and more. Free online QR code maker. Download QR codes instantly."
        keywords = "qr code generator, create qr code india, qr code maker free, generate qr code online, custom qr code"
    }
    "password-generator.html" = @{
        title = "Password Generator - Create Strong Passwords Online | PDFINDI"
        description = "Generate strong, secure passwords online. Customizable password generator with special characters. Free and safe."
        keywords = "password generator, strong password india, password creator free, secure password generator, random password"
    }
    "word-counter.html" = @{
        title = "Word Counter - Count Words and Characters Online | PDFINDI"
        description = "Count words, characters, sentences, and paragraphs. Free online word counter tool. Real-time text analysis."
        keywords = "word counter, character counter india, count words online free, text counter, word calculator"
    }
    "case-converter.html" = @{
        title = "Case Converter - Change Text Case Online Free | PDFINDI"
        description = "Convert text to uppercase, lowercase, title case, or sentence case. Free online case converter tool."
        keywords = "case converter, text case changer india, uppercase lowercase free, title case converter, text transformer"
    }
    "base64-encoderdecoder.html" = @{
        title = "Base64 Encoder Decoder - Encode Decode Base64 Online | PDFINDI"
        description = "Encode and decode Base64 strings online. Free Base64 converter tool. Support for text and file encoding."
        keywords = "base64 encoder, base64 decoder india, encode decode base64 free, base64 converter, base64 tool"
    }
    "json-formatter.html" = @{
        title = "JSON Formatter - Format and Validate JSON Online | PDFINDI"
        description = "Format, validate, and beautify JSON data online. Free JSON formatter and validator tool. Fix JSON syntax errors."
        keywords = "json formatter, json validator india, format json online free, json beautifier, json parser"
    }
    "color-picker.html" = @{
        title = "Color Picker - HTML Color Picker Tool Online | PDFINDI"
        description = "Pick colors and get HEX, RGB, HSL codes. Free online color picker tool. Perfect for designers and developers."
        keywords = "color picker, hex color picker india, rgb color picker free, color code generator, html color tool"
    }
    "unit-converter.html" = @{
        title = "Unit Converter - Convert Units Online Free | PDFINDI"
        description = "Convert length, weight, temperature, and more. Free online unit converter tool. Accurate conversion calculator."
        keywords = "unit converter, metric converter india, convert units online free, measurement converter, unit calculator"
    }
    "age-calculator.html" = @{
        title = "Age Calculator - Calculate Age Online Free | PDFINDI"
        description = "Calculate age in years, months, and days. Free online age calculator. Find exact age from birth date."
        keywords = "age calculator, calculate age india, age calculator online free, date calculator, age counter"
    }
    "bmi-calculator.html" = @{
        title = "BMI Calculator - Calculate Body Mass Index Online | PDFINDI"
        description = "Calculate your BMI (Body Mass Index) online. Free BMI calculator with weight and height input. Check your health status."
        keywords = "bmi calculator, body mass index india, bmi calculator online free, weight calculator, health calculator"
    }
    "lorem-ipsum-generator.html" = @{
        title = "Lorem Ipsum Generator - Generate Dummy Text Online | PDFINDI"
        description = "Generate Lorem Ipsum placeholder text online. Free dummy text generator for design and development projects."
        keywords = "lorem ipsum generator, dummy text india, placeholder text free, lorem ipsum online, text generator"
    }
    "image-compressor.html" = @{
        title = "Image Compressor - Compress Images Online Free | PDFINDI"
        description = "Compress JPG, PNG images online without losing quality. Free image compression tool. Reduce image file size."
        keywords = "image compressor, compress jpg india, reduce image size free, photo compressor online, shrink image"
    }
    "image-converter.html" = @{
        title = "Image Converter - Convert Image Formats Online | PDFINDI"
        description = "Convert images between JPG, PNG, WebP formats. Free online image converter tool. Fast and high-quality conversion."
        keywords = "image converter, convert jpg png india, image format converter free, photo converter online, change image type"
    }
    "file-converter.html" = @{
        title = "File Converter - Convert Files Online Free | PDFINDI"
        description = "Convert various file formats online. Free universal file converter tool. Support for documents, images, and more."
        keywords = "file converter, convert files india, file format converter free, universal converter online, document converter"
    }
    "speech-to-text.html" = @{
        title = "Speech to Text - Voice to Text Converter Online | PDFINDI"
        description = "Convert speech to text online. Free voice to text converter. Accurate speech recognition tool."
        keywords = "speech to text, voice to text india, speech recognition free, audio to text online, voice typing"
    }
    "text-to-speech.html" = @{
        title = "Text to Speech - Convert Text to Voice Online | PDFINDI"
        description = "Convert text to speech online. Free text to voice converter. Natural-sounding voice synthesis."
        keywords = "text to speech, text to voice india, tts converter free, voice generator online, read aloud text"
    }
    "image-ocr.html" = @{
        title = "Image OCR - Extract Text from Images Online | PDFINDI"
        description = "Extract text from images using OCR technology. Free online optical character recognition tool. Convert image to text."
        keywords = "image ocr, extract text image india, ocr online free, image to text converter, photo text extractor"
    }
}

# Read each tool file and add SEO meta tags
foreach ($fileName in $toolData.Keys) {
    $filePath = Join-Path $toolsDir $fileName
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        $data = $toolData[$fileName]
        
        # Check if SEO tags already exist
        if ($content -notmatch 'rel="canonical"') {
            # Find the closing </title> tag and add SEO tags after description
            $pattern = '(<meta name="description" content="[^"]*">)'
            $toolSlug = $fileName -replace '\.html$', ''
            
            $seoTags = @"

    <meta name="keywords" content="$($data.keywords)">
    <link rel="canonical" href="https://pdfindi.com/tools/$fileName">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://pdfindi.com/tools/$fileName">
    <meta property="og:title" content="$($data.title)">
    <meta property="og:description" content="$($data.description)">
    <meta property="og:image" content="https://pdfindi.com/og-image.jpg">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="$($data.title)">
    <meta name="twitter:description" content="$($data.description)">
    
    <meta name="robots" content="index, follow">
"@
            
            $replacement = "`$1$seoTags"
            $newContent = $content -replace $pattern, $replacement
            
            # Write back to file
            Set-Content -Path $filePath -Value $newContent -NoNewline
            Write-Host "Added SEO tags to $fileName" -ForegroundColor Green
        } else {
            Write-Host "SEO tags already exist in $fileName" -ForegroundColor Yellow
        }
    }
}

Write-Host "`nSEO optimization completed for all tool pages!" -ForegroundColor Cyan
