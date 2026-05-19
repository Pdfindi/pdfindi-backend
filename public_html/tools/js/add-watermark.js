// Watermark functionality
        let pdfFile = null;
        let pdfDoc = null;
        let watermarkedPdfBlob = null;
        let watermarkSettings = {
            type: 'text',
            text: 'CONFIDENTIAL',
            image: null,
            fontSize: 36,
            fontColor: '#ff0000',
            fontFamily: 'Helvetica',
            position: 'center',
            opacity: 0.5,
            rotation: 0,
            pageRange: ''
        };

        // DOM Elements
        const elements = {
            uploadZone: document.getElementById('upload-zone'),
            fileInput: document.getElementById('file-input'),
            pdfInfo: document.getElementById('pdf-info'),
            watermarkSettings: document.getElementById('watermark-settings'),
            textWatermark: document.getElementById('text-watermark'),
            imageWatermark: document.getElementById('image-watermark'),
            textSettings: document.getElementById('text-settings'),
            imageSettings: document.getElementById('image-settings'),
            watermarkText: document.getElementById('watermark-text'),
            watermarkImage: document.getElementById('watermark-image'),
            fontSize: document.getElementById('font-size'),
            fontSizeValue: document.getElementById('font-size-value'),
            textColor: document.getElementById('text-color'),
            fontFamily: document.getElementById('font-family'),
            position: document.getElementById('position'),
            opacity: document.getElementById('opacity'),
            opacityValue: document.getElementById('opacity-value'),
            rotation: document.getElementById('rotation'),
            rotationValue: document.getElementById('rotation-value'),
            pageRange: document.getElementById('page-range'),
            addWatermarkBtn: document.getElementById('add-watermark-btn'),
            progressContainer: document.getElementById('progress-container'),
            successMessage: document.getElementById('success-message'),
            errorMessage: document.getElementById('error-message'),
            downloadBtn: document.getElementById('download-btn'),
            fileName: document.getElementById('file-name'),
            fileSize: document.getElementById('file-size'),
            totalPages: document.getElementById('total-pages'),
            progressFill: document.getElementById('progress-fill'),
            progressText: document.getElementById('progress-text'),
            errorText: document.getElementById('error-text')
        };

        // Initialize event listeners
        function init() {
            elements.uploadZone.addEventListener('click', () => elements.fileInput.click());
            elements.uploadZone.addEventListener('dragover', handleDragOver);
            elements.uploadZone.addEventListener('dragleave', handleDragLeave);
            elements.uploadZone.addEventListener('drop', handleDrop);
            elements.fileInput.addEventListener('change', handleFileSelect);
            
            elements.textWatermark.addEventListener('change', toggleWatermarkType);
            elements.imageWatermark.addEventListener('change', toggleWatermarkType);
            
            elements.watermarkText.addEventListener('input', updateSettings);
            elements.watermarkImage.addEventListener('change', handleImageSelect);
            elements.fontSize.addEventListener('input', updateFontSize);
            elements.textColor.addEventListener('input', updateSettings);
            elements.fontFamily.addEventListener('change', updateSettings);
            elements.position.addEventListener('change', updateSettings);
            elements.opacity.addEventListener('input', updateOpacity);
            elements.rotation.addEventListener('input', updateRotation);
            elements.pageRange.addEventListener('input', updateSettings);
            
            elements.addWatermarkBtn.addEventListener('click', addWatermark);
            elements.downloadBtn.addEventListener('click', downloadPDF);
        }

        // Handle drag and drop
        function handleDragOver(e) {
            e.preventDefault();
            elements.uploadZone.classList.add('dragover');
        }

        function handleDragLeave() {
            elements.uploadZone.classList.remove('dragover');
        }

        function handleDrop(e) {
            e.preventDefault();
            elements.uploadZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        }

        // Handle file selection
        function handleFileSelect(e) {
            const file = e.target.files[0];
            if (file) {
                handleFile(file);
            }
        }

        async function handleFile(file) {
            // Validate file type
            const isPDF = file.type === 'application/pdf' || 
                         file.type === '' && file.name.toLowerCase().endsWith('.pdf') || 
                         file.name.toLowerCase().endsWith('.pdf');
            
            if (!isPDF) {
                showError('Please select a valid PDF file.');
                return;
            }

            if (file.size > 50 * 1024 * 1024) { // 50MB limit
                showError('File size must be less than 50MB.');
                return;
            }

            pdfFile = file;
            await showPDFInfo(file);
        }

        // Format file size
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        // Show PDF information
        async function showPDFInfo(file) {
            try {
                showProgress('Loading PDF...');
                
                const arrayBuffer = await file.arrayBuffer();
                pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer, { 
                    ignoreEncryption: true,
                    updateMetadata: false 
                });
                
                const pageCount = pdfDoc.getPageCount();
                
                elements.fileName.textContent = file.name;
                elements.fileSize.textContent = formatFileSize(file.size);
                elements.totalPages.textContent = pageCount;
                
                elements.uploadZone.style.display = 'none';
                elements.pdfInfo.style.display = 'block';
                elements.watermarkSettings.style.display = 'block';
                hideProgress();
                
                showSuccessTemp(`PDF loaded successfully with ${pageCount} pages!`);
                
            } catch (error) {
                console.error('Error loading PDF:', error);
                showError('Failed to load PDF. Please ensure it\'s a valid PDF file.');
                hideProgress();
            }
        }

        // Toggle watermark type
        function toggleWatermarkType() {
            const radioItems = document.querySelectorAll('.radio-item');
            radioItems.forEach(item => item.classList.remove('selected'));
            
            if (elements.textWatermark.checked) {
                elements.textWatermark.closest('.radio-item').classList.add('selected');
                elements.textSettings.style.display = 'block';
                elements.imageSettings.style.display = 'none';
                watermarkSettings.type = 'text';
            } else {
                elements.imageWatermark.closest('.radio-item').classList.add('selected');
                elements.textSettings.style.display = 'none';
                elements.imageSettings.style.display = 'block';
                watermarkSettings.type = 'image';
            }
        }

        // Handle image selection
        function handleImageSelect(e) {
            const file = e.target.files[0];
            if (file) {
                watermarkSettings.image = file;
            }
        }

        // Update settings
        function updateSettings() {
            watermarkSettings.text = elements.watermarkText.value;
            watermarkSettings.fontColor = elements.textColor.value;
            watermarkSettings.fontFamily = elements.fontFamily.value;
            watermarkSettings.position = elements.position.value;
            watermarkSettings.pageRange = elements.pageRange.value;
        }

        // Update font size
        function updateFontSize() {
            watermarkSettings.fontSize = parseInt(elements.fontSize.value);
            elements.fontSizeValue.textContent = watermarkSettings.fontSize;
        }

        // Update opacity
        function updateOpacity() {
            watermarkSettings.opacity = parseFloat(elements.opacity.value);
            elements.opacityValue.textContent = Math.round(watermarkSettings.opacity * 100) + '%';
        }

        // Update rotation
        function updateRotation() {
            watermarkSettings.rotation = parseInt(elements.rotation.value);
            elements.rotationValue.textContent = watermarkSettings.rotation + '°';
        }

        // Add watermark
        async function addWatermark() {
            if (!pdfFile) {
                showError('Please select a PDF file first.');
                return;
            }

            if (watermarkSettings.type === 'text' && !watermarkSettings.text.trim()) {
                showError('Please enter watermark text.');
                return;
            }

            if (watermarkSettings.type === 'image' && !watermarkSettings.image) {
                showError('Please select a watermark image.');
                return;
            }

            try {
                showProgress('Uploading and processing...');
                elements.progressFill.style.width = '30%';
                
                const formData = new FormData();
                formData.append('pdf', pdfFile);
                formData.append('type', watermarkSettings.type);
                formData.append('text', watermarkSettings.text);
                formData.append('fontSize', watermarkSettings.fontSize);
                formData.append('fontColor', watermarkSettings.fontColor);
                formData.append('fontFamily', watermarkSettings.fontFamily);
                formData.append('position', watermarkSettings.position);
                formData.append('opacity', watermarkSettings.opacity);
                formData.append('rotation', watermarkSettings.rotation);
                formData.append('pageRange', watermarkSettings.pageRange);
                
                if (watermarkSettings.image) {
                    formData.append('image', watermarkSettings.image);
                }

                elements.progressText.textContent = 'Adding watermark...';
                elements.progressFill.style.width = '60%';

                const response = await fetch('https://pdfindi-backend.onrender.com/api/add-watermark', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Failed to add watermark');
                }

                elements.progressText.textContent = 'Downloading watermarked PDF...';
                elements.progressFill.style.width = '90%';

                // Get the PDF blob from response
                const blob = await response.blob();
                watermarkedPdfBlob = blob;

                elements.progressFill.style.width = '100%';
                
                hideProgress();
                showSuccessMessage();

            } catch (error) {
                hideProgress();
                console.error('Watermark error:', error);
                
                if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    showError('Unable to connect to server. Please check your internet connection and try again.');
                } else {
                    showError(error.message || 'Failed to add watermark. Please try again.');
                }
            }
        }

        // Download PDF
        function downloadPDF() {
            if (!watermarkedPdfBlob) {
                showError('No watermarked PDF available to download.');
                return;
            }

            const url = URL.createObjectURL(watermarkedPdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'pdfindi-watermarked.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }

        // UI helpers
        function showProgress(message) {
            elements.progressContainer.style.display = 'block';
            elements.progressText.textContent = message;
            elements.progressFill.style.width = '0%';
            elements.watermarkSettings.style.display = 'none';
            elements.successMessage.style.display = 'none';
            elements.errorMessage.style.display = 'none';
        }

        function hideProgress() {
            elements.progressContainer.style.display = 'none';
            elements.progressFill.style.width = '0%';
        }

        function showSuccessMessage() {
            const watermarkType = watermarkSettings.type === 'text' ? 'text' : 'image';
            const pageInfo = watermarkSettings.pageRange.trim() 
                ? `selected pages` 
                : `all pages`;
            
            elements.successMessage.innerHTML = `
                <h4>✅Success!</h4>
                <p>Watermark added to ${pageInfo} successfully!</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Type: ${watermarkType === 'text' ? watermarkSettings.text : 'Image'} • File size: ${formatFileSize(watermarkedPdfBlob.size)}</p>
                <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap;">
                    <button id="download-btn" class="btn">📥 Download Watermarked PDF</button>
                    <button id="reset-btn" class="btn" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);">💧 Watermark Another PDF</button>
                </div>
            `;
            
            // Re-attach button listeners
            document.getElementById('download-btn').addEventListener('click', downloadPDF);
            document.getElementById('reset-btn').addEventListener('click', resetTool);
            
            elements.successMessage.style.display = 'block';
            elements.errorMessage.style.display = 'none';
        }
        
        function resetTool() {
            pdfFile = null;
            pdfDoc = null;
            watermarkedPdfBlob = null;
            
            elements.uploadZone.style.display = 'block';
            elements.pdfInfo.style.display = 'none';
            elements.watermarkSettings.style.display = 'none';
            elements.successMessage.style.display = 'none';
            elements.errorMessage.style.display = 'none';
            elements.progressContainer.style.display = 'none';
            
            elements.fileInput.value = '';
            elements.watermarkText.value = 'CONFIDENTIAL';
            elements.watermarkImage.value = '';
            elements.fontSize.value = 36;
            elements.textColor.value = '#ff0000';
            elements.fontFamily.value = 'Helvetica';
            elements.position.value = 'center';
            elements.opacity.value = 0.5;
            elements.rotation.value = 0;
            elements.pageRange.value = '';
            
            watermarkSettings = {
                type: 'text',
                text: 'CONFIDENTIAL',
                image: null,
                fontSize: 36,
                fontColor: '#ff0000',
                fontFamily: 'Helvetica',
                position: 'center',
                opacity: 0.5,
                rotation: 0,
                pageRange: ''
            };
            
            updateFontSize();
            updateOpacity();
            updateRotation();
        }

        function showSuccessTemp(message) {
            const tempDiv = document.createElement('div');
            tempDiv.className = 'success-message';
            tempDiv.innerHTML = `<p>${message}</p>`;
            tempDiv.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; max-width: 500px;';
            document.body.appendChild(tempDiv);
            
            setTimeout(() => {
                tempDiv.remove();
            }, 3000);
        }

        function showError(message) {
            elements.errorMessage.innerHTML = `
                <h4>❌ Error</h4>
                <p>${message}</p>
            `;
            elements.errorMessage.style.display = 'block';
            elements.successMessage.style.display = 'none';
        }

        // Initialize when DOM is ready
        document.addEventListener('DOMContentLoaded', init);