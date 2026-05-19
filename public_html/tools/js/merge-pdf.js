let selectedFiles = [];

        const elements = {
            uploadZone: document.getElementById('upload-zone'),
            fileInput: document.getElementById('file-input'),
            pdfFilesInfo: document.getElementById('pdf-files-info'),
            filesList: document.getElementById('files-list'),
            statusArea: document.getElementById('status-area'),
            processBtn: document.getElementById('process-btn'),
            processing: document.getElementById('processing'),
            processingText: document.getElementById('processing-text'),
            downloadSection: document.getElementById('download-section'),
            resultInfo: document.getElementById('result-info'),
            downloadBtn: document.getElementById('download-btn'),
            mergeNewBtn: document.getElementById('merge-new-btn')
        };

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        function showStatus(message, type = 'info') {
            elements.statusArea.textContent = message;
            elements.statusArea.className = `status-area status-${type}`;
            elements.statusArea.style.display = 'block';
            
            setTimeout(() => {
                elements.statusArea.style.display = 'none';
            }, 5000);
        }

        function updateFilesList() {
            if (selectedFiles.length === 0) {
                elements.pdfFilesInfo.style.display = 'none';
                return;
            }

            elements.pdfFilesInfo.style.display = 'block';
            elements.filesList.innerHTML = '';

            selectedFiles.forEach((file, index) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <div class="file-icon">📄</div>
                    <div class="file-details">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${formatFileSize(file.size)}</div>
                    </div>
                    <div class="file-number">${index + 1}</div>
                `;
                elements.filesList.appendChild(fileItem);
            });
        }

        function handleFileSelect(files) {
            selectedFiles = Array.from(files);
            
            // Validate files
            const invalidFiles = selectedFiles.filter(file => file.type !== 'application/pdf');
            if (invalidFiles.length > 0) {
                showStatus('Please select only PDF files.', 'error');
                return;
            }

            const oversizedFiles = selectedFiles.filter(file => file.size > 50 * 1024 * 1024);
            if (oversizedFiles.length > 0) {
                showStatus('Some files are too large. Maximum size is 50MB per file.', 'error');
                return;
            }

            if (selectedFiles.length < 2) {
                showStatus('Please select at least 2 PDF files to merge.', 'error');
                elements.processBtn.disabled = true;
                return;
            }

            elements.processBtn.disabled = false;
            updateFilesList();
            showStatus(`Ready to merge ${selectedFiles.length} PDF files.`, 'success');
        }

        async function mergePDFs() {
            if (selectedFiles.length < 2) {
                showStatus('Please select at least 2 PDF files.', 'error');
                return;
            }

            const btnText = elements.processBtn.querySelector('.btn-text');
            const spinner = elements.processBtn.querySelector('.spinner');
            const progressBar = document.getElementById('progress-bar');
            const progressText = document.getElementById('progress-text');
            
            elements.processBtn.disabled = true;
            spinner.hidden = false;
            btnText.textContent = 'Merging...';
            elements.processing.style.display = 'block';
            elements.pdfFilesInfo.style.display = 'none';

            try {
                const { PDFDocument } = PDFLib;
                const mergedPdf = await PDFDocument.create();

                for (let i = 0; i < selectedFiles.length; i++) {
                    const file = selectedFiles[i];
                    const progress = Math.round(((i + 1) / selectedFiles.length) * 100);
                    
                    elements.processingText.textContent = `Processing file ${i + 1} of ${selectedFiles.length}: ${file.name}`;
                    progressBar.style.width = progress + '%';
                    progressText.textContent = progress + '%';
                    
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await PDFDocument.load(arrayBuffer);
                    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                    copiedPages.forEach((page) => mergedPdf.addPage(page));
                }

                elements.processingText.textContent = 'Finalizing merged PDF...';
                progressBar.style.width = '100%';
                progressText.textContent = '100%';
                
                const mergedPdfFile = await mergedPdf.save();
                const mergedBlob = new Blob([mergedPdfFile], { type: 'application/pdf' });

                elements.processing.style.display = 'none';
                
                const totalSize = mergedBlob.size;
                elements.resultInfo.textContent = `Successfully merged ${selectedFiles.length} PDFs • ${formatFileSize(totalSize)}`;
                elements.downloadSection.style.display = 'block';

                // Create download function
                elements.downloadBtn.onclick = () => {
                    const url = URL.createObjectURL(mergedBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'pdfindi-merged.pdf';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                };

                showStatus('PDFs merged successfully!', 'success');

            } catch (error) {
                console.error('Merge error:', error);
                showStatus('Failed to merge PDFs. Please try again.', 'error');
                elements.processing.style.display = 'none';
                elements.pdfFilesInfo.style.display = 'block';
            } finally {
                elements.processBtn.disabled = false;
                spinner.hidden = true;
                btnText.textContent = '📄 Merge PDFs';
            }
        }

        function resetTool() {
            selectedFiles = [];
            elements.pdfFilesInfo.style.display = 'none';
            elements.downloadSection.style.display = 'none';
            elements.processing.style.display = 'none';
            elements.statusArea.style.display = 'none';
            elements.processBtn.disabled = true;
            elements.fileInput.value = '';
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
                handleFileSelect(files);
            }
        });

        elements.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files);
            }
        });

        elements.processBtn.addEventListener('click', mergePDFs);
        elements.mergeNewBtn.addEventListener('click', resetTool);
        
        // Back to Tools button functionality
        document.getElementById('back-to-tools-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#pdf-tools-section';
        });
