// Clean PDF to Word conversion using backend
        const elements = {
            uploadZone: document.getElementById('upload-zone'),
            fileInput: document.getElementById('file-input'),
            errorMessage: document.getElementById('error-message'),
            convertBtn: document.getElementById('convert-btn'),
            downloadLinkContainer: document.createElement('div')
        };
        elements.downloadLinkContainer.id = 'download-link-container';
        elements.uploadZone.parentNode.appendChild(elements.downloadLinkContainer);

        let selectedFile = null;

        function handleFileSelect(file) {
            if (file.type !== 'application/pdf') {
                showError('Please select a valid PDF file.');
                return;
            }
            if (file.size > 50 * 1024 * 1024) {
                showError('File size too large. Please select a PDF under 50MB.');
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
                    <h3>PDF Selected: ${file.name}</h3>
                    <p>Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
            `;
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
                showError('Please select a PDF file first.');
                return;
            }
            
            const originalText = elements.convertBtn.textContent;
            showLoading(elements.convertBtn, 'Converting PDF to Word...');
            elements.downloadLinkContainer.innerHTML = '';
            
            try {
                // Use the clean convertPDFToWord function from script.js?v=1.3
                const result = await convertPDFToWord(selectedFile);
                showSuccess(result.message + ' Please review the document for any formatting issues.');
                
                // Reset the button
                hideLoading(elements.convertBtn, originalText);
                
            } catch (error) {
                showError('Conversion failed: ' + error.message);
                hideLoading(elements.convertBtn, originalText);
            }
        });