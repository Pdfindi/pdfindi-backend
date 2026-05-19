let uploadedPDF = null;
        let totalPages = 0;
        let pages = [];
        let organizedPDFBlob = null;

        const elements = {
            uploadZone: document.getElementById('upload-zone'),
            fileInput: document.getElementById('file-input'),
            organizeSection: document.getElementById('organize-section'),
            pagesGrid: document.getElementById('pages-grid'),
            applyChangesBtn: document.getElementById('apply-changes'),
            downloadSection: document.getElementById('download-section'),
            downloadBtn: document.getElementById('download-btn'),
            resultInfo: document.getElementById('result-info'),
            selectAllBtn: document.getElementById('select-all'),
            selectNoneBtn: document.getElementById('select-none'),
            duplicateSelectedBtn: document.getElementById('duplicate-selected'),
            deleteSelectedBtn: document.getElementById('delete-selected'),
            reverseOrderBtn: document.getElementById('reverse-order')
        };

        function handleFileSelect(file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    uploadedPDF = await PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                    totalPages = uploadedPDF.getPageCount();
                    pages = Array.from({ length: totalPages }, (_, i) => ({
                        originalIndex: i,
                        selected: false,
                        deleted: false
                    }));
                    
                    elements.uploadZone.style.display = 'none';
                    elements.organizeSection.style.display = 'block';
                    renderPages();
                } catch (err) {
                    alert('Error loading PDF: ' + err.message);
                }
            };
            reader.readAsArrayBuffer(file);
        }

        function renderPages() {
            elements.pagesGrid.innerHTML = '';
            pages.forEach((page, index) => {
                if (page.deleted) return;
                const item = document.createElement('div');
                item.className = `page-item ${page.selected ? 'selected' : ''}`;
                item.draggable = true;
                item.innerHTML = `
                    <div class="page-preview">📄</div>
                    <div>Page ${page.originalIndex + 1}</div>
                `;
                item.onclick = () => {
                    page.selected = !page.selected;
                    renderPages();
                };
                item.ondragstart = (e) => e.dataTransfer.setData('text', index);
                item.ondragover = (e) => e.preventDefault();
                item.ondrop = (e) => {
                    e.preventDefault();
                    const fromIdx = parseInt(e.dataTransfer.getData('text'));
                    const toIdx = index;
                    const movedPage = pages.splice(fromIdx, 1)[0];
                    pages.splice(toIdx, 0, movedPage);
                    renderPages();
                };
                elements.pagesGrid.appendChild(item);
            });
        }

        async function savePDF() {
            const activePages = pages.filter(p => !p.deleted);
            const newPdf = await PDFLib.PDFDocument.create();
            for (const p of activePages) {
                const [copied] = await newPdf.copyPages(uploadedPDF, [p.originalIndex]);
                newPdf.addPage(copied);
            }
            const bytes = await newPdf.save();
            organizedPDFBlob = new Blob([bytes], { type: 'application/pdf' });
            elements.organizeSection.style.display = 'none';
            elements.resultInfo.textContent = `New PDF has ${activePages.length} pages • ${(organizedPDFBlob.size / 1024).toFixed(1)} KB`;
            elements.downloadSection.style.display = 'block';
        }

        elements.uploadZone.onclick = () => elements.fileInput.click();
        elements.fileInput.onchange = (e) => handleFileSelect(e.target.files[0]);
        elements.applyChangesBtn.onclick = savePDF;
        elements.downloadBtn.onclick = () => {
            const url = URL.createObjectURL(organizedPDFBlob);
            const a = document.createElement('a'); a.href = url; a.download = 'organized.pdf'; a.click();
        };
        elements.selectAllBtn.onclick = () => { pages.forEach(p => p.selected = true); renderPages(); };
        elements.selectNoneBtn.onclick = () => { pages.forEach(p => p.selected = false); renderPages(); };
        elements.duplicateSelectedBtn.onclick = () => {
            const newPages = [];
            pages.forEach(p => {
                newPages.push(p);
                if (p.selected && !p.deleted) {
                    newPages.push({ originalIndex: p.originalIndex, selected: false, deleted: false });
                }
                p.selected = false; // Deselect to clearly show completion
            });
            pages = newPages;
            renderPages();
        };
        elements.deleteSelectedBtn.onclick = () => { pages.filter(p => p.selected).forEach(p => p.deleted = true); renderPages(); };
        elements.reverseOrderBtn.onclick = () => { pages.reverse(); renderPages(); };