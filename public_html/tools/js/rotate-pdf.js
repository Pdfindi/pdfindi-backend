let uploadedPdf = null;
        let selectedRotation = 90;
        let selectedPageSet = 'all';
        let rotatedBlob = null;

        const elements = {
            uploadZone: document.getElementById('upload-zone'),
            fileInput: document.getElementById('file-input'),
            rotationOptions: document.getElementById('rotation-options'),
            rotateBtn: document.getElementById('rotate-btn'),
            successMessage: document.getElementById('success-message'),
            downloadBtn: document.getElementById('download-btn'),
            fileNameDisplay: document.getElementById('file-name-display'),
            pdfInfo: document.getElementById('pdf-info')
        };

        elements.uploadZone.onclick = () => elements.fileInput.click();
        elements.fileInput.onchange = (e) => handleFile(e.target.files[0]);

        async function handleFile(file) {
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (e) => {
                uploadedPdf = e.target.result;
                elements.fileNameDisplay.textContent = `Selected: ${file.name}`;
                elements.uploadZone.style.display = 'none';
                elements.pdfInfo.style.display = 'block';
                elements.rotationOptions.style.display = 'block';
            };
            reader.readAsArrayBuffer(file);
        }

        document.querySelectorAll('.rotation-btn[data-rotation]').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.rotation-btn[data-rotation]').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedRotation = parseInt(btn.dataset.rotation);
            };
        });

        document.querySelectorAll('.rotation-btn[data-pages]').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.rotation-btn[data-pages]').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedPageSet = btn.dataset.pages;
            };
        });

        elements.rotateBtn.onclick = async () => {
            try {
                const pdfDoc = await PDFLib.PDFDocument.load(uploadedPdf);
                const pages = pdfDoc.getPages();
                pages.forEach((page, index) => {
                    let shouldRotate = false;
                    const pageNum = index + 1;
                    if (selectedPageSet === 'all') shouldRotate = true;
                    else if (selectedPageSet === 'odd' && pageNum % 2 !== 0) shouldRotate = true;
                    else if (selectedPageSet === 'even' && pageNum % 2 === 0) shouldRotate = true;

                    if (shouldRotate) {
                        const currentRotation = page.getRotation().angle;
                        page.setRotation(PDFLib.degrees((currentRotation + selectedRotation) % 360));
                    }
                });
                const bytes = await pdfDoc.save();
                rotatedBlob = new Blob([bytes], { type: 'application/pdf' });
                elements.rotationOptions.style.display = 'none';
                elements.successMessage.style.display = 'block';
            } catch (err) {
                alert('Error rotating PDF: ' + err.message);
            }
        };

        elements.downloadBtn.onclick = () => {
            const url = URL.createObjectURL(rotatedBlob);
            const a = document.createElement('a'); a.href = url; a.download = 'rotated.pdf'; a.click();
        };