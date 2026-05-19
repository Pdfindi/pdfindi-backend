let uploadedPDFBytes = null;
        let uploadedFileName = '';
        let unlockedPDFBlob = null;

        const elements = {
            uploadZone: document.getElementById('upload-zone'),
            fileInput: document.getElementById('file-input'),
            errorMessage: document.getElementById('error-message'),
            successMessage: document.getElementById('success-message'),
            pdfInfo: document.getElementById('pdf-info'),
            unlockSection: document.getElementById('unlock-section'),
            unlockPassword: document.getElementById('unlock-password'),
            unlockBtn: document.getElementById('unlock-pdf-btn'),
            processing: document.getElementById('processing'),
            downloadSection: document.getElementById('download-section'),
            downloadBtn: document.getElementById('download-btn'),
            unlockNewBtn: document.getElementById('unlock-new-btn'),
            fileName: document.getElementById('file-name'),
            fileSize: document.getElementById('file-size'),
            totalPages: document.getElementById('total-pages'),
            pdfStatus: document.getElementById('pdf-status'),
            resultInfo: document.getElementById('result-info'),
            processingText: document.getElementById('processing-text')
        };

        elements.uploadZone.addEventListener('click', () => elements.fileInput.click());
        elements.uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); elements.uploadZone.style.borderColor = '#fa7220'; });
        elements.uploadZone.addEventListener('dragleave', () => { elements.uploadZone.style.borderColor = 'rgba(250,114,32,0.3)'; });
        elements.uploadZone.addEventListener('drop', (e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
        elements.fileInput.addEventListener('change', (e) => { if (e.target.files[0]) handleFile(e.target.files[0]); });
        elements.unlockBtn.addEventListener('click', unlockPDF);
        elements.downloadBtn.addEventListener('click', downloadPDF);
        elements.unlockNewBtn.addEventListener('click', resetTool);

        function handleFile(file) {
            if (file.type !== 'application/pdf') { showError('Please select a valid PDF file.'); return; }
            if (file.size > 50 * 1024 * 1024) { showError('File size must be less than 50MB.'); return; }
            uploadedFileName = file.name;
            elements.fileName.textContent = file.name;
            elements.fileSize.textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';
            elements.totalPages.textContent = 'Checking...';
            elements.uploadZone.style.display = 'none';
            elements.pdfInfo.style.display = 'block';
            checkPDFProtection(file);
        }

        async function checkPDFProtection(file) {
            const arrayBuffer = await file.arrayBuffer();
            uploadedPDFBytes = arrayBuffer;
            try {
                const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
                elements.totalPages.textContent = pdfDoc.getPageCount();
                elements.pdfStatus.innerHTML = '<div style="background:#f0fdf4; color:#16a34a; padding:0.75rem 1rem; border-radius:8px; margin-top:1rem; font-weight:600;">✅This PDF is not password protected.</div>';
            } catch (error) {
                if (error.message.toLowerCase().includes('password') || error.message.toLowerCase().includes('encrypt')) {
                    elements.totalPages.textContent = 'Protected';
                    elements.pdfStatus.innerHTML = '<div style="background:#fffbeb; border:1px solid #fbbf24; color:#92400e; padding:0.75rem 1rem; border-radius:8px; margin-top:1rem;">🔒 This PDF is password protected. Enter the password below to unlock it.</div>';
                    elements.unlockSection.style.display = 'block';
                } else {
                    showError('Unable to read PDF file. Please try a different file.');
                }
            }
        }

        async function unlockPDF() {
            if (!uploadedPDFBytes) { showError('Please select a PDF file first.'); return; }
            const password = elements.unlockPassword.value.trim();
            if (!password) { showError('Please enter the PDF password.'); return; }

            elements.processing.style.display = 'block';
            elements.unlockSection.style.display = 'none';

            try {
                const formData = new FormData();
                formData.append('file', new Blob([uploadedPDFBytes], { type: 'application/pdf' }), uploadedFileName);
                formData.append('password', password);

                const response = await fetch('https://pdfindi-backend.onrender.com/api/unlock-pdf', { method: 'POST', body: formData });
                if (!response.ok) { const err = await response.json(); throw new Error(err.details || 'Failed to unlock PDF'); }

                const unlockedBytes = await response.arrayBuffer();
                unlockedPDFBlob = new Blob([unlockedBytes], { type: 'application/pdf' });
                elements.processing.style.display = 'none';
                elements.resultInfo.textContent = `Unlocked PDF is ready: ${uploadedFileName.replace('.pdf', '_unlocked.pdf')}`;
                elements.downloadSection.style.display = 'block';
            } catch (error) {
                elements.processing.style.display = 'none';
                elements.unlockSection.style.display = 'block';
                showError('Incorrect password or unable to unlock this PDF. Please verify the password and try again.');
            }
        }

        function downloadPDF() {
            if (!unlockedPDFBlob) return;
            const url = URL.createObjectURL(unlockedPDFBlob);
            const a = document.createElement('a');
            a.href = url; a.download = uploadedFileName.replace('.pdf', '_unlocked.pdf');
            document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        }

        function resetTool() {
            uploadedPDFBytes = null; uploadedFileName = ''; unlockedPDFBlob = null;
            elements.uploadZone.style.display = 'block'; elements.fileInput.value = '';
            elements.unlockPassword.value = ''; elements.pdfInfo.style.display = 'none';
            elements.unlockSection.style.display = 'none'; elements.downloadSection.style.display = 'none';
            elements.errorMessage.style.display = 'none'; elements.successMessage.style.display = 'none';
            elements.processing.style.display = 'none';
        }

        function showError(msg) { elements.errorMessage.textContent = msg; elements.errorMessage.style.display = 'block'; }