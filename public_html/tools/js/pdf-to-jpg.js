console.log('?? PDF to JPG tool initializing...');
        
        const elements = {
            uploadZone: document.getElementById('upload-zone'),
            fileInput: document.getElementById('file-input'),
            errorMessage: document.getElementById('error-message'),
            resultMessage: document.getElementById('result-message'),
            convertBtn: document.getElementById('convert-btn')
        };

        let selectedFormat = 'jpg';
        let selectedFile = null;

        function showError(message) {
            console.error('? Error:', message);
            elements.errorMessage.textContent = message;
            elements.errorMessage.style.display = 'block';
            setTimeout(() => {
                elements.errorMessage.style.display = 'none';
            }, 5000);
        }

        function showLoading(button, loadingText) {
            button.disabled = true;
            button.innerHTML = `<span style="display: inline-block; width: 16px; height: 16px; border: 2px solid #ffffff; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite; margin-right: 8px;"></span>${loadingText}`;
        }

        function hideLoading(button, originalText) {
            button.disabled = false;
            button.innerHTML = originalText;
        }

        function showSuccess(message) {
            console.log('✅Success:', message);
            elements.resultMessage.textContent = message;
            elements.resultMessage.style.display = 'block';
            setTimeout(() => {
                elements.resultMessage.style.display = 'none';
            }, 10000);
        }

        // Client-side PDF to Image conversion using pdf.js
        async function convertPDFToImageFallback(file, format = 'jpg') {
            console.log('🎨 Using client-side PDF to Image conversion (pdf.js)');
            
            // Configure pdf.js worker
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            
            // Read file as ArrayBuffer
            const arrayBuffer = await file.arrayBuffer();
            
            // Load PDF document
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;
            
            console.log(`📄 PDF loaded: ${numPages} page(s)`);
            
            // Quality settings based on format
            const quality = format === 'jpg' ? 0.92 : 1.0;
            const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
            const extension = format;
            
            const baseFileName = file.name.replace(/\.pdf$/i, '');
            let convertedCount = 0;
            
            // Convert each page
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                try {
                    // Get page
                    const page = await pdf.getPage(pageNum);
                    
                    // Set scale for better quality (2x = 144 DPI)
                    const scale = 2.0;
                    const viewport = page.getViewport({ scale });
                    
                    // Create canvas
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    
                    // Render PDF page to canvas
                    await page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise;
                    
                    console.log(`✅Page ${pageNum} rendered to canvas`);
                    
                    // Convert canvas to blob
                    const blob = await new Promise(resolve => {
                        canvas.toBlob(resolve, mimeType, quality);
                    });
                    
                    // Create download link
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    
                    // Filename format: original_name_page_1.jpg
                    if (numPages > 1) {
                        a.download = `${baseFileName}_page_${pageNum}.${extension}`;
                    } else {
                        a.download = `${baseFileName}.${extension}`;
                    }
                    
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    
                    console.log(`💾 Downloading: ${a.download} (${(blob.size / 1024).toFixed(1)} KB)`);
                    
                    // Trigger download
                    a.click();
                    
                    // Clean up
                    setTimeout(() => {
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    }, 100);
                    
                    convertedCount++;
                    
                    // Small delay between downloads
                    if (pageNum < numPages) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                    
                } catch (pageError) {
                    console.error(`❌ Error converting page ${pageNum}:`, pageError);
                    throw new Error(`Failed to convert page ${pageNum}: ${pageError.message}`);
                }
            }
            
            console.log(`✅All ${convertedCount} page(s) converted successfully!`);
            
            return {
                success: true,
                pages: convertedCount,
                format: format.toUpperCase()
            };
        }

        function handleFileSelect(file) {
            console.log('?? File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
            
            if (file.type !== 'application/pdf') {
                showError('Please select a valid PDF file.');
                return;
            }
            if (file.size > 50 * 1024 * 1024) {
                showError('File size too large. Please select a PDF under 50MB.');
                return;
            }
            
            selectedFile = file;
            elements.uploadZone.style.background = '#f0fff4';
            elements.uploadZone.style.borderColor = '#28a745';
            elements.uploadZone.innerHTML = `
                <div style="color: #28a745;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                    <h3>PDF Selected: ${file.name}</h3>
                    <p>Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <p>Output: Individual ${selectedFormat.toUpperCase()} images per page</p>
                    <p style="margin-top: 1rem; color: #28a745;">✅Ready for conversion!</p>
                </div>
            `;
            
            // Enable convert button
            elements.convertBtn.disabled = false;
            console.log('? Convert button enabled');
        }

        function selectFormat(format) {
            console.log('?? Format selected:', format);
            selectedFormat = format;
            document.querySelectorAll('.format-option').forEach(option => {
                option.classList.remove('selected');
            });
            document.querySelector(`[data-format="${format}"]`).classList.add('selected');
        }

        async function convertPDF() {
            if (!selectedFile) {
                showError('Please select a PDF file first.');
                return;
            }
            
            console.log('🚀 Starting client-side PDF conversion...', selectedFile.name, 'to', selectedFormat);
            const originalText = elements.convertBtn.textContent;
            showLoading(elements.convertBtn, 'Converting PDF to ' + selectedFormat.toUpperCase() + '...');
            
            try {
                // Always use client-side conversion (pdf.js)
                console.log('🎨 Using pdf.js client-side conversion');
                const result = await convertPDFToImageFallback(selectedFile, selectedFormat);
                
                // Show success message with details
                if (result && result.pages) {
                    showSuccess(`✅Successfully converted ${result.pages} page(s) to ${selectedFormat.toUpperCase()}! Check your Downloads folder.`);
                } else {
                    showSuccess(`✅PDF successfully converted to ${selectedFormat.toUpperCase()}! Check your Downloads folder.`);
                }
                hideLoading(elements.convertBtn, originalText);
                
            } catch (error) {
                console.error('? Conversion failed:', error);
                showError('Conversion failed: ' + error.message);
                hideLoading(elements.convertBtn, originalText);
            }
        }

        // Event listeners
        elements.uploadZone.addEventListener('click', () => elements.fileInput.click());
        elements.uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            elements.uploadZone.classList.add('dragover');
        });
        elements.uploadZone.addEventListener('dragleave', () => {
            elements.uploadZone.classList.remove('dragover');
        });
        elements.uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            elements.uploadZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelect(files[0]);
            }
        });
        elements.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });

        // Format selection
        document.querySelectorAll('.format-option').forEach(option => {
            option.addEventListener('click', () => {
                selectFormat(option.dataset.format);
            });
        });

        // Convert button
        elements.convertBtn.addEventListener('click', convertPDF);
        
        console.log('? PDF to JPG tool ready!');