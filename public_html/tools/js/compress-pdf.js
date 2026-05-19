// PDF compression functionality
        let pdfFile = null;
        let selectedCompressionLevel = 'low';

        // DOM Elements
        const elements = {
            uploadZone: document.getElementById('upload-zone'),
            fileInput: document.getElementById('file-input'),
            pdfInfo: document.getElementById('pdf-info'),
            compressionSettings: document.getElementById('compression-settings'),
            compressionLevels: document.querySelectorAll('.level-option'),
            originalSize: document.getElementById('original-size'),
            compressedSize: document.getElementById('compressed-size'),
            compressBtn: document.getElementById('compress-btn'),
            progressContainer: document.getElementById('progress-container'),
            successMessage: document.getElementById('success-message'),
            errorMessage: document.getElementById('error-message'),
            downloadBtn: document.getElementById('download-btn'),
            fileName: document.getElementById('file-name'),
            fileSize: document.getElementById('file-size'),
            totalPages: document.getElementById('total-pages'),
            progressFill: document.getElementById('progress-fill'),
            progressText: document.getElementById('progress-text'),
            errorText: document.getElementById('error-text'),
            compressionPercentage: document.getElementById('compression-percentage'),
            originalSizeDisplay: document.getElementById('original-size-display'),
            compressedSizeDisplay: document.getElementById('compressed-size-display')
        };

        // Initialize event listeners
        function init() {
            elements.uploadZone.addEventListener('click', () => elements.fileInput.click());
            elements.uploadZone.addEventListener('dragover', handleDragOver);
            elements.uploadZone.addEventListener('dragleave', handleDragLeave);
            elements.uploadZone.addEventListener('drop', handleDrop);
            elements.fileInput.addEventListener('change', handleFileSelect);
            
            elements.compressionLevels.forEach(level => {
                level.addEventListener('click', () => selectCompressionLevel(level.dataset.level));
            });
            
            elements.compressBtn.addEventListener('click', compressPDF);
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

        function handleFile(file) {
            if (file.type !== 'application/pdf') {
                showError('Please select a valid PDF file.');
                return;
            }

            if (file.size > 50 * 1024 * 1024) { // 50MB limit
                showError('File size must be less than 50MB.');
                return;
            }

            pdfFile = file;
            
            // Hide upload zone when file is uploaded
            elements.uploadZone.style.display = 'none';
            
            showPDFInfo(file);
            calculateEstimatedSize(file.size);
            loadPDFPages(file);
        }

        // Load PDF and count pages
        async function loadPDFPages(file) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
                const pageCount = pdfDoc.getPageCount();
                elements.totalPages.textContent = pageCount;
            } catch (error) {
                console.error('Error loading PDF pages:', error);
                elements.totalPages.textContent = 'N/A';
            }
        }

        // Show PDF information
        function showPDFInfo(file) {
            elements.fileName.textContent = file.name;
            elements.fileSize.textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';
            elements.totalPages.textContent = 'Calculating...';
                
                elements.pdfInfo.style.display = 'block';
                elements.compressionSettings.style.display = 'block';
        }

        // Calculate estimated compressed size
        function calculateEstimatedSize(originalSize) {
            const reductionRates = {
                low: 0.15,    // 15% reduction
                medium: 0.4,  // 40% reduction
                high: 0.6     // 60% reduction
            };
            
            const reduction = reductionRates[selectedCompressionLevel];
            const compressedSize = originalSize * (1 - reduction);
            
            elements.originalSize.textContent = (originalSize / 1024 / 1024).toFixed(2) + ' MB';
            elements.compressedSize.textContent = (compressedSize / 1024 / 1024).toFixed(2) + ' MB';
        }

        // Select compression level
        function selectCompressionLevel(level) {
            selectedCompressionLevel = level;
            elements.compressionLevels.forEach(option => {
                option.classList.remove('selected');
            });
            document.querySelector(`[data-level="${level}"]`).classList.add('selected');
            
            if (pdfFile) {
                calculateEstimatedSize(pdfFile.size);
            }
        }

        // Compress PDF
        async function compressPDF() {
            if (!pdfFile) {
                showError('Please select a PDF file first.');
                return;
            }

            try {
                showProgress('Compressing PDF...');
                
                const formData = new FormData();
                formData.append('file', pdfFile);
                formData.append('level', selectedCompressionLevel);

                const response = await fetch('https://pdfindi-backend.onrender.com/api/compress-pdf', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to compress PDF');
                }

                const result = await response.json();
                
                console.log('✅Backend response received:', result);
                console.log('Compression ratio:', result.compressionRatio);
                console.log('Base64 data length:', result.base64?.length);

                hideProgress();
                showSuccess(result.base64, result.filename, result.compressionRatio);
                
            } catch (error) {
                hideProgress();
                showError('Failed to compress PDF. Please try again.');
                console.error('Compression error:', error);
            }
        }

        // Download PDF
        function downloadPDF() {
            console.log('📥 Download button clicked');
            console.log('Download URL:', elements.successMessage.dataset.downloadUrl);
            console.log('Filename:', elements.successMessage.dataset.filename);
            
            const link = document.createElement('a');
            link.href = elements.successMessage.dataset.downloadUrl;
            link.download = elements.successMessage.dataset.filename || 'compressed-pdf.pdf';
            
            console.log('📎 Triggering download...');
            link.click();
            
            // Clean up the object URL after download
            setTimeout(() => {
                window.URL.revokeObjectURL(link.href);
                console.log('🧹 Cleaned up download URL');
            }, 1000);
        }

        // UI helpers
        function showProgress(message) {
            elements.progressContainer.style.display = 'block';
            elements.progressText.textContent = message;
            elements.progressFill.style.animation = 'indeterminate 1.5s infinite';
            elements.compressionSettings.style.display = 'none';
            elements.pdfInfo.style.display = 'none';
        }

        function hideProgress() {
            elements.progressContainer.style.display = 'none';
            elements.progressFill.style.animation = 'none';
        }

        function showSuccess(base64Data, filename, compressionRatio) {
            try {
                console.log('🎯 showSuccess called with:', { base64Data: base64Data?.length, filename, compressionRatio });

                elements.successMessage.innerHTML = `
                    <h4>✅Compression Complete!</h4>
                    <p>Your PDF has been compressed by <span id="compression-percentage">${Math.round(parseFloat(compressionRatio))}</span>%!</p>
                    <p>Original: <span id="original-size-display">${elements.originalSize.textContent}</span> → Compressed: <span id="compressed-size-display">${elements.compressedSize.textContent}</span></p>
                    <button onclick="downloadPDF()" class="btn btn-primary" style="margin-top: 1rem;">
                        <span>📥</span> Download Compressed PDF
                    </button>
                    <button onclick="resetTool()" class="btn" style="margin-top: 1rem; margin-left: 1rem; background: #6c757d;">
                        <span>🔄</span> Compress Another PDF
                    </button>
                `;

                console.log('📝 Success message HTML set');

                // Convert base64 to blob and create download URL
                console.log('🔄 Converting base64 to blob...');
                const byteCharacters = atob(base64Data);
                console.log('✅Base64 decoded, length:', byteCharacters.length);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const downloadUrl = window.URL.createObjectURL(blob);
                
                elements.successMessage.dataset.downloadUrl = downloadUrl;
                elements.successMessage.dataset.filename = filename;
                elements.successMessage.style.display = 'block';
                elements.errorMessage.style.display = 'none';

                console.log('✅Success message should now be visible!');
                console.log('Success message element:', elements.successMessage);
                console.log('Success message display style:', elements.successMessage.style.display);
            } catch (e) {
                console.error('Error in showSuccess:', e);
                showError('Failed to process compressed PDF for download.');
            }
        }

        function showError(message) {
            elements.errorMessage.style.display = 'block';
            elements.errorText.textContent = message;
            elements.successMessage.style.display = 'none';
        }

        function resetTool() {
            // Reset variables
            pdfFile = null;
            selectedCompressionLevel = 'low';
            
            // Reset file input
            elements.fileInput.value = '';
            
            // Show upload zone
            elements.uploadZone.style.display = 'block';
            
            // Hide other sections
            elements.pdfInfo.style.display = 'none';
            elements.compressionSettings.style.display = 'none';
            elements.successMessage.style.display = 'none';
            elements.errorMessage.style.display = 'none';
            elements.progressContainer.style.display = 'none';
            
            // Reset compression level selection
            elements.compressionLevels.forEach(option => {
                option.classList.remove('selected');
            });
            document.querySelector('[data-level="low"]').classList.add('selected');
            
            console.log('🔄 Tool reset completed');
        }

        // Initialize when DOM is ready
        document.addEventListener('DOMContentLoaded', init);