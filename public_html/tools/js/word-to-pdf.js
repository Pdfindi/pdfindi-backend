const elements = {
            uploadZone: document.getElementById('upload-zone'),
            fileInput: document.getElementById('file-input'),
            errorMessage: document.getElementById('error-message'),
            convertBtn: document.getElementById('convert-btn'),
            downloadLinkContainer: document.getElementById('download-link-container')
        };

        let selectedFile = null;

        function showError(message) {
            elements.errorMessage.textContent = message;
            elements.errorMessage.style.display = 'block';
            setTimeout(() => {
                elements.errorMessage.style.display = 'none';
            }, 5000);
        }

        function handleFileSelect(file) {
            const supportedTypes = [
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/rtf',
                'application/vnd.oasis.opendocument.text'
            ];

            if (!supportedTypes.includes(file.type) && !file.name.match(/\.(doc|docx|rtf|odt)$/i)) {
                showError('Please select a valid Word document (DOC, DOCX, RTF, or ODT).');
                return;
            }

            if (file.size > 50 * 1024 * 1024) { // 50MB limit
                showError('File size too large. Please select a document under 50MB.');
                return;
            }

            selectedFile = file;
            elements.convertBtn.disabled = false;
            elements.downloadLinkContainer.innerHTML = '';
            elements.uploadZone.style.background = '#f0fff4';
            elements.uploadZone.style.borderColor = '#28a745';
            elements.uploadZone.innerHTML = `
                <div style="color: #28a745;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                    <h3>Document Selected: ${file.name}</h3>
                    <p>Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <p>Type: ${getFileTypeDisplay(file.name)}</p>
                    <p style="margin-top: 1rem; color: #28a745;">✅Ready for conversion!</p>
                </div>
            `;
        }

        function getFileTypeDisplay(fileName) {
            const extension = fileName.split('.').pop().toUpperCase();
            const typeMap = {
                'DOC': 'Microsoft Word 97-2003',
                'DOCX': 'Microsoft Word',
                'RTF': 'Rich Text Format',
                'ODT': 'OpenDocument Text'
            };
            return typeMap[extension] || extension;
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

        // Clean backend conversion
        elements.convertBtn.addEventListener('click', async () => {
            if (!selectedFile) {
                showError('Please select a Word document first.');
                return;
            }
            
            const originalText = elements.convertBtn.textContent;
            showLoading(elements.convertBtn, 'Converting Word to PDF...');
            elements.downloadLinkContainer.innerHTML = '';
            
            try {
                // Use the clean convertWordToPDF function from script.js?v=1.3
                const result = await convertWordToPDF(selectedFile);
                showSuccess(result.message);
                
                // Reset the button
                hideLoading(elements.convertBtn, originalText);
                
            } catch (error) {
                showError('Conversion failed: ' + error.message);
                hideLoading(elements.convertBtn, originalText);
            }
        });