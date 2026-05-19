const elements = {
            uploadZone: document.getElementById('upload-zone'),
            fileInput: document.getElementById('file-input'),
            errorMessage: document.getElementById('error-message'),
            extractBtn: document.getElementById('extract-btn'),
            textOutput: document.getElementById('text-output'),
            extractedText: document.getElementById('extracted-text'),
            copyBtn: document.getElementById('copy-btn'),
            downloadBtn: document.getElementById('download-btn')
        };

        let selectedFile = null;
        let extractedTextContent = '';

        function showError(message) {
            elements.errorMessage.textContent = message;
            elements.errorMessage.style.display = 'block';
            setTimeout(() => {
                elements.errorMessage.style.display = 'none';
            }, 5000);
        }

        function handleFileSelect(file) {
            const supportedTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
                'image/bmp',
                'image/tiff',
                'image/webp'
            ];

            if (!supportedTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i)) {
                showError('Please select a valid image file (JPEG, PNG, GIF, BMP, TIFF, WebP).');
                return;
            }

            if (file.size > 50 * 1024 * 1024) { // 50MB limit
                showError('File size too large. Please select an image under 50MB.');
                return;
            }

            selectedFile = file;
            elements.extractBtn.disabled = false;
            elements.textOutput.style.display = 'none';
            elements.uploadZone.style.background = '#f0fff4';
            elements.uploadZone.style.borderColor = '#28a745';
            elements.uploadZone.innerHTML = `
                <div style="color: #28a745;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                    <h3>Image Selected: ${file.name}</h3>
                    <p>Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <p>Type: ${getFileTypeDisplay(file.name)}</p>
                    <p style="margin-top: 1rem; color: #28a745;">✅Ready for text extraction!</p>

            `;
        }

        function getFileTypeDisplay(fileName) {
            const extension = fileName.split('.').pop().toUpperCase();
            const typeMap = {
                'JPG': 'JPEG Image',
                'JPEG': 'JPEG Image', 
                'PNG': 'PNG Image',
                'GIF': 'GIF Image',
                'BMP': 'Bitmap Image',
                'TIFF': 'TIFF Image',
                'WEBP': 'WebP Image'
            };
            return typeMap[extension] || extension + ' Image';
        }

        function copyToClipboard() {
            navigator.clipboard.writeText(extractedTextContent).then(() => {
                const originalText = elements.copyBtn.textContent;
                elements.copyBtn.textContent = '✅Copied!';
                setTimeout(() => {
                    elements.copyBtn.textContent = originalText;
                }, 2000);
            }).catch(() => {
                showError('Failed to copy text to clipboard');
            });
        }

        function downloadAsText() {
            const blob = new Blob([extractedTextContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = selectedFile ? selectedFile.name.replace(/\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i, '.txt') : 'extracted-text.txt';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
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

        elements.copyBtn.addEventListener('click', copyToClipboard);
        elements.downloadBtn.addEventListener('click', downloadAsText);

        // OCR extraction
        elements.extractBtn.addEventListener('click', async () => {
            if (!selectedFile) {
                showError('Please select an image file first.');
                return;
            }
            
            const originalText = elements.extractBtn.textContent;
            showLoading(elements.extractBtn, 'Extracting text...');
            
            try {
                // Use the new extractTextFromImage function from script.js?v=1.3
                const result = await extractTextFromImage(selectedFile);
                
                extractedTextContent = result.extractedText;
                elements.extractedText.textContent = extractedTextContent || 'No text found in the image.';
                elements.textOutput.style.display = 'block';
                
                showSuccess(result.message);
                
                // Reset the button
                hideLoading(elements.extractBtn, originalText);
                
            } catch (error) {
                showError('Text extraction failed: ' + error.message);
                hideLoading(elements.extractBtn, originalText);
            }
        });