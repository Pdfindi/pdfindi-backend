// Image Compressor functionality
        const elements = {
            uploadZone: document.getElementById('upload-zone'),
            fileInput: document.getElementById('file-input'),
            errorMessage: document.getElementById('error-message'),
            compressionSettings: document.getElementById('compression-settings'),
            qualitySlider: document.getElementById('quality-slider'),
            qualityValue: document.getElementById('quality-value'),
            qualityDisplay: document.getElementById('quality-display'),
            formatSelect: document.getElementById('format-select'),
            resizeOption: document.getElementById('resize-option'),
            customSizeGroup: document.getElementById('custom-size-group'),
            customWidth: document.getElementById('custom-width'),
            customHeight: document.getElementById('custom-height'),
            compressBtn: document.getElementById('compress-btn'),
            processing: document.getElementById('processing'),
            imagePreview: document.getElementById('image-preview'),
            originalImage: document.getElementById('original-image'),
            compressedImage: document.getElementById('compressed-image'),
            originalSize: document.getElementById('original-size'),
            originalDimensions: document.getElementById('original-dimensions'),
            originalFormat: document.getElementById('original-format'),
            compressedSize: document.getElementById('compressed-size'),
            compressedDimensions: document.getElementById('compressed-dimensions'),
            compressedFormat: document.getElementById('compressed-format'),
            savingsDisplay: document.getElementById('savings-display'),
            savingsText: document.getElementById('savings-text'),
            downloadSection: document.getElementById('download-section'),
            downloadBtn: document.getElementById('download-btn'),
            compressNewBtn: document.getElementById('compress-new-btn')
        };

        let originalFile = null;
        let originalImage = null;
        let compressedBlob = null;

        // Quality slider functionality
        elements.qualitySlider.addEventListener('input', () => {
            const quality = elements.qualitySlider.value;
            elements.qualityValue.textContent = quality;
            
            let qualityText = 'Balanced';
            if (quality <= 30) qualityText = 'Low (Small file)';
            else if (quality <= 60) qualityText = 'Medium';
            else if (quality <= 80) qualityText = 'Balanced';
            else qualityText = 'High (Large file)';
            
            elements.qualityDisplay.textContent = `${quality}% - ${qualityText}`;
        });

        // Resize option functionality
        elements.resizeOption.addEventListener('change', () => {
            if (elements.resizeOption.value === 'custom') {
                elements.customSizeGroup.style.display = 'block';
            } else {
                elements.customSizeGroup.style.display = 'none';
            }
        });

        // Upload zone functionality
        elements.uploadZone.addEventListener('click', () => elements.fileInput.click());
        elements.fileInput.addEventListener('change', handleFileSelect);

        // Drag and drop functionality
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
                handleFile(files[0]);
            }
        });

        function handleFileSelect(e) {
            const file = e.target.files[0];
            if (file) {
                handleFile(file);
            }
        }

        function handleFile(file) {
            // Validate file
            if (!file.type.startsWith('image/')) {
                showError('Please select a valid image file.');
                return;
            }

            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                showError('File size too large. Please select an image under 10MB.');
                return;
            }

            originalFile = file;
            hideError();

            // Load image
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    originalImage = img;
                    displayOriginalImage();
                    updateUploadZone(); // Show uploaded file in upload zone
                    elements.compressionSettings.classList.add('show');
                    
                    // Auto-fill custom dimensions
                    elements.customWidth.value = img.width;
                    elements.customHeight.value = img.height;
                };
                img.src = e.target.result;
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
                <div class="upload-icon">📂</div>
                <h3>Click to upload or drag & drop</h3>
                <p>Supports JPG, PNG, WebP images up to 10MB</p>
                <input type="file" id="file-input" accept="image/*" style="display: none;">
            `;
            
            // Re-attach event listeners
            const newFileInput = document.getElementById('file-input');
            newFileInput.addEventListener('change', handleFileSelect);
            uploadZone.addEventListener('click', () => newFileInput.click());
            
            // Reset state
            originalFile = null;
            originalImage = null;
            elements.compressionSettings.classList.remove('show');
            elements.imagePreview.classList.remove('show');
            elements.savingsDisplay.classList.remove('show');
        }

        function displayOriginalImage() {
            elements.originalImage.src = URL.createObjectURL(originalFile);
            elements.originalSize.textContent = formatFileSize(originalFile.size);
            elements.originalDimensions.textContent = `${originalImage.width} í— ${originalImage.height}`;
            elements.originalFormat.textContent = originalFile.type.split('/')[1].toUpperCase();
        }

        function compressImage() {
            if (!originalImage) return;

            elements.processing.classList.add('show');
            elements.imagePreview.classList.remove('show');
            elements.savingsDisplay.classList.remove('show');
            elements.downloadSection.classList.remove('show');

            setTimeout(() => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Calculate dimensions
                    let { width, height } = calculateDimensions();
                    canvas.width = width;
                    canvas.height = height;

                    // Draw and compress
                    ctx.drawImage(originalImage, 0, 0, width, height);

                    const quality = elements.qualitySlider.value / 100;
                    const format = elements.formatSelect.value;
                    const mimeType = `image/${format}`;

                    canvas.toBlob((blob) => {
                        if (blob) {
                            compressedBlob = blob;
                            displayCompressedImage(blob, width, height);
                        } else {
                            showError('Failed to compress image. Please try different settings.');
                            elements.processing.classList.remove('show');
                        }
                    }, mimeType, quality);

                } catch (error) {
                    console.error('Compression error:', error);
                    showError('Failed to compress image. Please try again.');
                    elements.processing.classList.remove('show');
                }
            }, 100);
        }

        function calculateDimensions() {
            let width = originalImage.width;
            let height = originalImage.height;

            const resizeValue = elements.resizeOption.value;
            
            if (resizeValue === 'custom') {
                width = parseInt(elements.customWidth.value) || width;
                height = parseInt(elements.customHeight.value) || height;
            } else if (resizeValue !== 'none') {
                const scale = parseInt(resizeValue) / 100;
                width = Math.round(width * scale);
                height = Math.round(height * scale);
            }

            return { width, height };
        }

        function displayCompressedImage(blob, width, height) {
            const url = URL.createObjectURL(blob);
            elements.compressedImage.src = url;
            
            elements.compressedSize.textContent = formatFileSize(blob.size);
            elements.compressedDimensions.textContent = `${width} í— ${height}`;
            elements.compressedFormat.textContent = elements.formatSelect.value.toUpperCase();

            // Calculate savings
            const originalSize = originalFile.size;
            const compressedSize = blob.size;
            const savings = originalSize - compressedSize;
            const savingsPercent = Math.round((savings / originalSize) * 100);

            if (savings > 0) {
                elements.savingsText.textContent = 
                    `Saved ${savingsPercent}% (${formatFileSize(savings)} reduction)`;
                elements.savingsDisplay.classList.add('show');
            } else {
                elements.savingsDisplay.classList.remove('show');
            }

            elements.processing.classList.remove('show');
            elements.imagePreview.classList.add('show');
            elements.downloadSection.classList.add('show');
        }

        function downloadCompressed() {
            if (!compressedBlob) return;

            const url = URL.createObjectURL(compressedBlob);
            const a = document.createElement('a');
            a.href = url;
            
            const extension = elements.formatSelect.value === 'jpeg' ? 'jpg' : elements.formatSelect.value;
            const originalName = originalFile.name.split('.')[0];
            a.download = `${originalName}_compressed.${extension}`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function compressNew() {
            // Reset everything
            elements.fileInput.value = '';
            elements.compressionSettings.classList.remove('show');
            elements.imagePreview.classList.remove('show');
            elements.savingsDisplay.classList.remove('show');
            elements.downloadSection.classList.remove('show');
            elements.processing.classList.remove('show');
            
            // Reset form
            elements.qualitySlider.value = 80;
            elements.resizeOption.value = 'none';
            elements.customSizeGroup.style.display = 'none';
            elements.formatSelect.value = 'jpeg';
            
            // Update displays
            elements.qualityValue.textContent = '80';
            elements.qualityDisplay.textContent = '80% - Balanced';
            
            // Clear variables
            originalFile = null;
            originalImage = null;
            compressedBlob = null;
            
            // Hide error if any
            hideError();
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        function showError(message) {
            elements.errorMessage.textContent = message;
            elements.errorMessage.classList.add('show');
        }

        function hideError() {
            elements.errorMessage.classList.remove('show');
        }

        // Event listeners
        elements.compressBtn.addEventListener('click', compressImage);
        elements.downloadBtn.addEventListener('click', downloadCompressed);
        elements.compressNewBtn.addEventListener('click', compressNew);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (elements.compressBtn.style.display !== 'none') {
                        compressImage();
                    }
                }
            }
        });
        
        // Back to Tools button functionality
        document.getElementById('back-to-tools-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#utility-tools-section';
        });
