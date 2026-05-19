let originalFile = null;
        let originalImage = null;
        let convertedBlob = null;
        let selectedFormat = null;

        const elements = {
            uploadZone: document.getElementById('upload-zone'),
            fileInput: document.getElementById('file-input'),
            errorMessage: document.getElementById('error-message'),
            conversionOptions: document.getElementById('conversion-options'),
            formatOptions: document.querySelectorAll('.format-option'),
            qualitySettings: document.getElementById('quality-settings'),
            qualitySlider: document.getElementById('quality-slider'),
            qualityDisplay: document.getElementById('quality-display'),
            processing: document.getElementById('processing'),
            imagePreview: document.getElementById('image-preview'),
            originalImage: document.getElementById('original-image'),
            convertedImage: document.getElementById('converted-image'),
            originalFormat: document.getElementById('original-format'),
            originalSize: document.getElementById('original-size'),
            originalDimensions: document.getElementById('original-dimensions'),
            convertedFormat: document.getElementById('converted-format'),
            convertedSize: document.getElementById('converted-size'),
            convertedDimensions: document.getElementById('converted-dimensions'),
            conversionActions: document.getElementById('conversion-actions'),
            convertBtn: document.getElementById('convert-btn'),
            downloadSection: document.getElementById('download-section'),
            downloadBtn: document.getElementById('download-btn'),
            convertNewBtn: document.getElementById('convert-new-btn')
        };

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        function showError(message) {
            elements.errorMessage.textContent = message;
            elements.errorMessage.style.display = 'block';
            setTimeout(() => {
                elements.errorMessage.style.display = 'none';
            }, 5000);
        }

        function updateQualityDisplay() {
            elements.qualityDisplay.textContent = elements.qualitySlider.value + '%';
        }

        function updateQualityVisibility() {
            const showQuality = selectedFormat === 'jpeg' || selectedFormat === 'webp';
            elements.qualitySettings.style.display = showQuality ? 'block' : 'none';
        }

        function handleFileSelect(file) {
            if (!file.type.startsWith('image/')) {
                showError('Please select a valid image file.');
                return;
            }

            if (file.size > 50 * 1024 * 1024) { // 50MB limit
                showError('File size too large. Please select an image under 50MB.');
                return;
            }

            originalFile = file;
            loadOriginalImage(file);
        }

        function loadOriginalImage(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                originalImage = new Image();
                originalImage.onload = () => {
                    elements.originalImage.src = e.target.result;
                    elements.originalFormat.textContent = file.type.split('/')[1].toUpperCase();
                    elements.originalSize.textContent = formatFileSize(file.size);
                    elements.originalDimensions.textContent = `${originalImage.width} í— ${originalImage.height}`;
                    
                    updateUploadZone(); // Show uploaded file in upload zone
                    elements.conversionOptions.style.display = 'block';
                    elements.imagePreview.style.display = 'grid';
                    
                    // Auto-select a different format
                    const currentFormat = file.type.split('/')[1].toLowerCase();
                    const suggestedFormat = currentFormat === 'jpeg' ? 'png' : 'jpeg';
                    selectFormat(suggestedFormat);
                };
                originalImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        function updateUploadZone() {
            // Update upload zone to show uploaded file with thumbnail
            const uploadZone = elements.uploadZone;
            uploadZone.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 1.5rem;">
                    <img src="${URL.createObjectURL(originalFile)}" 
                         alt="Uploaded" 
                         style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" loading="lazy">
                    <div style="text-align: left;">
                        <h3 style="margin: 0; font-size: 1.1rem; color: #28a745;">✅${originalFile.name}</h3>
                        <p style="margin: 0.5rem 0 0 0; color: #6c757d; font-size: 0.9rem;">
                            ${formatFileSize(originalFile.size)} • ${originalImage.width} í— ${originalImage.height}px
                        </p>
                        <button onclick="resetUpload()" 
                                style="margin-top: 0.75rem; padding: 0.4rem 1rem; background: #fa7220; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; transition: all 0.3s;"
                                onmouseover="this.style.background='#ff8555'"
                                onmouseout="this.style.background='#fa7220'">
                            🔄 Change Image
                        </button>
                    </div>
                </div>
            `;
        }

        function resetUpload() {
            // Reset to initial upload state
            const uploadZone = elements.uploadZone;
            uploadZone.innerHTML = `
                <div class="upload-icon">ðŸ–¼ï¸</div>
                <h3>Click to upload or drag & drop</h3>
                <p>Supports JPG, PNG, WebP, GIF, BMP images</p>
                <input type="file" id="file-input" accept="image/*" style="display: none;">
            `;
            
            // Re-attach event listeners
            const newFileInput = document.getElementById('file-input');
            newFileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    handleFileSelect(e.target.files[0]);
                }
            });
            uploadZone.addEventListener('click', () => newFileInput.click());
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('dragover');
            });
            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('dragover');
            });
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    handleFileSelect(files[0]);
                }
            });
            
            // Reset state
            resetTool();
        }

        function selectFormat(format) {
            selectedFormat = format;
            
            // Update UI
            elements.formatOptions.forEach(option => {
                option.classList.remove('selected');
                if (option.dataset.format === format) {
                    option.classList.add('selected');
                }
            });

            updateQualityVisibility();
            elements.conversionActions.style.display = 'block';
        }

        function convertImage() {
            if (!originalImage || !selectedFormat) return;

            elements.processing.style.display = 'block';
            elements.downloadSection.style.display = 'none';

            setTimeout(() => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    canvas.width = originalImage.width;
                    canvas.height = originalImage.height;

                    // Draw image
                    ctx.drawImage(originalImage, 0, 0);

                    // Determine MIME type and quality
                    let mimeType, quality;
                    switch (selectedFormat) {
                        case 'jpeg':
                            mimeType = 'image/jpeg';
                            quality = elements.qualitySlider.value / 100;
                            break;
                        case 'png':
                            mimeType = 'image/png';
                            quality = undefined; // PNG is lossless
                            break;
                        case 'webp':
                            mimeType = 'image/webp';
                            quality = elements.qualitySlider.value / 100;
                            break;
                        case 'gif':
                            mimeType = 'image/gif';
                            quality = undefined;
                            break;
                        default:
                            mimeType = 'image/png';
                    }

                    canvas.toBlob((blob) => {
                        if (blob) {
                            convertedBlob = blob;
                            displayConvertedImage(blob);
                        } else {
                            showError('Failed to convert image. This format may not be supported.');
                            elements.processing.style.display = 'none';
                        }
                    }, mimeType, quality);

                } catch (error) {
                    console.error('Conversion error:', error);
                    showError('Failed to convert image. Please try again.');
                    elements.processing.style.display = 'none';
                }
            }, 100);
        }

        function displayConvertedImage(blob) {
            const url = URL.createObjectURL(blob);
            elements.convertedImage.src = url;
            
            elements.convertedFormat.textContent = selectedFormat.toUpperCase();
            elements.convertedSize.textContent = formatFileSize(blob.size);
            elements.convertedDimensions.textContent = `${originalImage.width} í— ${originalImage.height}`;

            elements.processing.style.display = 'none';
            elements.downloadSection.style.display = 'block';
        }

        function downloadConverted() {
            if (!convertedBlob) return;

            const url = URL.createObjectURL(convertedBlob);
            const a = document.createElement('a');
            a.href = url;
            
            const extension = selectedFormat === 'jpeg' ? 'jpg' : selectedFormat;
            const originalName = originalFile.name.split('.')[0];
            a.download = `${originalName}_converted.${extension}`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function resetTool() {
            originalFile = null;
            originalImage = null;
            convertedBlob = null;
            selectedFormat = null;
            
            elements.conversionOptions.style.display = 'none';
            elements.imagePreview.style.display = 'none';
            elements.conversionActions.style.display = 'none';
            elements.downloadSection.style.display = 'none';
            elements.processing.style.display = 'none';
            
            elements.formatOptions.forEach(option => {
                option.classList.remove('selected');
            });
            
            elements.qualitySlider.value = 90;
            updateQualityDisplay();
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

        elements.formatOptions.forEach(option => {
            option.addEventListener('click', () => {
                selectFormat(option.dataset.format);
            });
        });

        elements.qualitySlider.addEventListener('input', updateQualityDisplay);

        elements.convertBtn.addEventListener('click', convertImage);
        elements.downloadBtn.addEventListener('click', downloadConverted);
        elements.convertNewBtn.addEventListener('click', resetTool);

        // Initialize
        updateQualityDisplay();
        
        // Back to Tools button functionality
        document.getElementById('back-to-tools-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#utility-tools-section';
        });
