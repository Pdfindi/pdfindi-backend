const elements = {
            fromFormat: document.getElementById('from-format'),
            toFormat: document.getElementById('to-format'),
            uploadZone: document.getElementById('upload-zone'),
            fileInput: document.getElementById('file-input'),
            errorMessage: document.getElementById('error-message'),
            convertBtn: document.getElementById('convert-btn')
        };

        let selectedFile = null;

        // Placeholder conversion functions - these will be implemented with backend API
        async function convertPDFToWord(file) {
            return await convertViaAPI(file, 'pdf-to-word');
        }

        async function convertWordToPDF(file) {
            return await convertViaAPI(file, 'word-to-pdf');
        }

        async function convertImageToPDF(file) {
            return await convertViaAPI(file, 'image-to-pdf');
        }

        async function convertPDFToJPG(file) {
            return await convertViaAPI(file, 'pdf-to-jpg');
        }

        async function extractTextFromImage(file) {
            return await convertViaAPI(file, 'image-ocr');
        }

        // Backend API integration
        async function convertViaAPI(file, conversionType) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('conversionType', conversionType);
            const API_ENDPOINT = 'https://pdfindi-backend.onrender.com/api/convert';
            
            try {
                const response = await fetch(API_ENDPOINT, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Conversion failed on server');
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                
                // Trigger download
                const a = document.createElement('a');
                a.href = url;
                a.download = getConvertedFileName(file.name, conversionType);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                return true;
            } catch (error) {
                console.error('Conversion error:', error);
                throw new Error('This feature requires a backend server. Please check back soon!');
            }
        }

        function getConvertedFileName(originalName, conversionType) {
            const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
            const extensionMap = {
                'pdf-to-word': '.docx',
                'word-to-pdf': '.pdf',
                'image-to-pdf': '.pdf',
                'pdf-to-jpg': '.jpg',
                'image-ocr': '.txt'
            };
            return baseName + '_converted' + (extensionMap[conversionType] || '.pdf');
        }

        // Conversion mapping to available functions
        const conversionMap = {
            'pdf-docx': convertPDFToWord,
            'docx-pdf': convertWordToPDF,
            'jpg-pdf': convertImageToPDF,
            'jpeg-pdf': convertImageToPDF,
            'png-pdf': convertImageToPDF,
            'gif-pdf': convertImageToPDF,
            'bmp-pdf': convertImageToPDF,
            'tiff-pdf': convertImageToPDF,
            'webp-pdf': convertImageToPDF,
            'pdf-jpg': convertPDFToJPG,
            'pdf-jpeg': convertPDFToJPG,
            'jpg-txt': extractTextFromImage,
            'jpeg-txt': extractTextFromImage,
            'png-txt': extractTextFromImage,
            'gif-txt': extractTextFromImage,
            'bmp-txt': extractTextFromImage,
            'tiff-txt': extractTextFromImage,
            'webp-txt': extractTextFromImage
        };

        function showError(message) {
            elements.errorMessage.textContent = message;
            elements.errorMessage.style.display = 'block';
            setTimeout(() => {
                elements.errorMessage.style.display = 'none';
            }, 5000);
        }

        function updateToFormat() {
            const fromFormat = elements.fromFormat.value;
            const toFormat = elements.toFormat;
            
            // Clear current options
            toFormat.innerHTML = '<option value="">Select format...</option>';
            
            if (!fromFormat) return;
            
            // Define available conversions for each format
            const availableConversions = {
                'pdf': ['docx', 'jpg'],
                'docx': ['pdf'],
                'doc': ['pdf'],
                'rtf': ['pdf'],
                'jpg': ['pdf', 'txt'],
                'jpeg': ['pdf', 'txt'],
                'png': ['pdf', 'txt'],
                'gif': ['pdf', 'txt'],
                'bmp': ['pdf', 'txt'],
                'tiff': ['pdf', 'txt'],
                'webp': ['pdf', 'txt']
            };
            
            const available = availableConversions[fromFormat] || [];
            
            // Add available options
            if (available.includes('pdf')) {
                toFormat.innerHTML += '<option value="pdf">PDF Document</option>';
            }
            if (available.includes('docx')) {
                toFormat.innerHTML += '<option value="docx">Word Document (.docx)</option>';
            }
            if (available.includes('jpg')) {
                toFormat.innerHTML += '<option value="jpg">JPEG Image</option>';
            }
            if (available.includes('txt')) {
                toFormat.innerHTML += '<option value="txt">Text File (.txt) - OCR</option>';
            }
            
            updateConvertButton();
        }

        function updateConvertButton() {
            const fromFormat = elements.fromFormat.value;
            const toFormat = elements.toFormat.value;
            const hasFile = selectedFile !== null;
            
            const conversionKey = `${fromFormat}-${toFormat}`;
            const isSupported = conversionMap.hasOwnProperty(conversionKey);
            
            elements.convertBtn.disabled = !(hasFile && fromFormat && toFormat && isSupported);
        }

        function handleFileSelect(file) {
            selectedFile = file;
            updateConvertButton();
            
            elements.uploadZone.style.background = '#f0fff4';
            elements.uploadZone.style.borderColor = '#28a745';
            elements.uploadZone.innerHTML = `
                <div style="color: #28a745;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                    <h3>File Selected: ${file.name}</h3>
                    <p>Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <p>Type: ${getFileTypeDisplay(file.name)}</p>
                    <p style="margin-top: 1rem; color: #28a745;">✅Ready for conversion!</p>

            `;
        }

        function getFileTypeDisplay(fileName) {
            const extension = fileName.split('.').pop().toUpperCase();
            const typeMap = {
                'PDF': 'PDF Document',
                'DOCX': 'Word Document',
                'DOC': 'Word Document',
                'RTF': 'Rich Text Format',
                'JPG': 'JPEG Image',
                'JPEG': 'JPEG Image', 
                'PNG': 'PNG Image',
                'GIF': 'GIF Image',
                'BMP': 'Bitmap Image',
                'TIFF': 'TIFF Image',
                'WEBP': 'WebP Image'
            };
            return typeMap[extension] || extension + ' File';
        }

        // Event listeners
        elements.fromFormat.addEventListener('change', updateToFormat);
        elements.toFormat.addEventListener('change', updateConvertButton);

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

        // Quick select shortcuts
        document.querySelectorAll('.shortcut-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const fromFormat = btn.dataset.from;
                const toFormat = btn.dataset.to;
                
                elements.fromFormat.value = fromFormat;
                updateToFormat();
                elements.toFormat.value = toFormat;
                updateConvertButton();
                
                // Highlight the selection
                btn.style.background = '#28a745';
                btn.style.color = 'white';
                setTimeout(() => {
                    btn.style.background = '';
                    btn.style.color = '';
                }, 1000);
            });
        });

        // Conversion logic
        elements.convertBtn.addEventListener('click', async () => {
            if (!selectedFile) {
                showError('Please select a file first.');
                return;
            }
            
            const fromFormat = elements.fromFormat.value;
            const toFormat = elements.toFormat.value;
            const conversionKey = `${fromFormat}-${toFormat}`;
            
            if (!conversionMap[conversionKey]) {
                showError(`Conversion from ${fromFormat.toUpperCase()} to ${toFormat.toUpperCase()} is not supported yet.`);
                return;
            }
            
            const originalText = elements.convertBtn.textContent;
            showLoading(elements.convertBtn, 'Converting...');
            
            try {
                const conversionFunction = conversionMap[conversionKey];
                const result = await conversionFunction(selectedFile);
                
                if (toFormat === 'txt') {
                    // For OCR text extraction, show the result differently
                    showSuccess('Text extracted successfully! Check the download.');
                } else {
                    showSuccess('File converted successfully!');
                }
                
                hideLoading(elements.convertBtn, originalText);
                
            } catch (error) {
                showError('Conversion failed: ' + error.message);
                hideLoading(elements.convertBtn, originalText);
            }
        });