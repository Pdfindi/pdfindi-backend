let uploadedPDF = null;
        let totalPages = 0;
        let selectedOption = null;
        let splitFiles = [];

        const elements = {
            uploadZone: document.getElementById('upload-zone'),
            fileInput: document.getElementById('file-input'),
            errorMessage: document.getElementById('error-message'),
            successMessage: document.getElementById('success-message'),
            pdfInfo: document.getElementById('pdf-info'),
            fileName: document.getElementById('file-name'),
            fileSize: document.getElementById('file-size'),
            totalPagesSpan: document.getElementById('total-pages'),
            currentStatus: document.getElementById('current-status'),
            splitOptions: document.getElementById('split-options'),
            optionCards: document.querySelectorAll('.option-card'),
            customSplitSection: document.getElementById('custom-split-section'),
            pageOptions: document.querySelectorAll('.page-option'),
            customPages: document.getElementById('custom-pages'),
            pagesInput: document.getElementById('pages-input'),
            splitPdfBtn: document.getElementById('split-pdf-btn'),
            processing: document.getElementById('processing'),
            processingText: document.getElementById('processing-text'),
            resultsSection: document.getElementById('results-section'),
            downloadList: document.getElementById('download-list'),
            resultInfo: document.getElementById('result-info'),
            splitNewBtn: document.getElementById('split-new-btn')
        };

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        function showError(message) {
            elements.errorMessage.textContent = message;
            elements.errorMessage.style.display = 'block';
            elements.successMessage.style.display = 'none';
            setTimeout(() => {
                elements.errorMessage.style.display = 'none';
            }, 5000);
        }

        function showSuccess(message) {
            elements.successMessage.textContent = message;
            elements.successMessage.style.display = 'block';
            elements.errorMessage.style.display = 'none';
            setTimeout(() => {
                elements.successMessage.style.display = 'none';
            }, 5000);
        }

        function handleFileSelect(file) {
            // Check if file is PDF - accept either MIME type or .pdf extension
            const isPDF = file.type === 'application/pdf' || 
                         file.type === '' && file.name.toLowerCase().endsWith('.pdf') ||
                         file.name.toLowerCase().endsWith('.pdf');
            
            if (!isPDF) {
                showError('Please select a valid PDF file.');
                return;
            }

            if (file.size > 25 * 1024 * 1024) {
                showError('File size too large. Please select a PDF under 25MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    elements.processing.style.display = 'block';
                    elements.processingText.textContent = 'Loading PDF...';

                    // Try to load the PDF with better error handling
                    const arrayBuffer = e.target.result;
                    console.log('File loaded, size:', arrayBuffer.byteLength);
                    
                    uploadedPDF = await PDFLib.PDFDocument.load(arrayBuffer, { 
                        ignoreEncryption: true,
                        updateMetadata: false 
                    });
                    totalPages = uploadedPDF.getPageCount();
                    
                    elements.fileName.textContent = file.name;
                    elements.fileSize.textContent = formatFileSize(file.size);
                    elements.totalPagesSpan.textContent = totalPages;
                    
                    elements.uploadZone.style.display = 'none';
                    elements.pdfInfo.style.display = 'block';
                    elements.splitOptions.style.display = 'grid';
                    
                    elements.processing.style.display = 'none';
                    showSuccess(`PDF loaded successfully with ${totalPages} pages!`);
                    
                } catch (error) {
                    console.error('Error loading PDF:', error);
                    console.error('Error details:', error.message);
                    showError(`Failed to load PDF: ${error.message}. Please ensure it's a valid PDF file.`);
                    elements.processing.style.display = 'none';
                }
            };
            
            reader.onerror = () => {
                showError('Failed to read file. Please try again.');
                elements.processing.style.display = 'none';
            };
            
            reader.readAsArrayBuffer(file);
        }

        function selectOption(option) {
            selectedOption = option;
            
            // Update UI
            elements.optionCards.forEach(card => {
                card.classList.remove('selected');
                if (card.dataset.option === option) {
                    card.classList.add('selected');
                }
            });

            // Show/hide custom split section based on option
            const splitBtnContainer = document.getElementById('split-btn-container');
            
            if (option === 'single') {
                // Split All Pages - Always splits ALL pages, no configuration needed
                elements.customSplitSection.style.display = 'none';
                splitBtnContainer.style.display = 'block';
            } else if (option === 'range') {
                // Extract Pages - Show page selection options (no custom range needed - just custom input)
                elements.customSplitSection.style.display = 'block';
                splitBtnContainer.style.display = 'block';
                elements.customPages.style.display = 'block';
                elements.pagesInput.focus();
                elements.customSplitSection.querySelector('h4').textContent = 'âš™ï¸ Enter Pages to Extract';
                
                // Hide page option buttons for Extract Pages - only show custom input
                elements.pageOptions.forEach(option => {
                    option.style.display = 'none';
                });
            } else if (option === 'groups') {
                // Group Split - Show page selection for which pages to group
                elements.customSplitSection.style.display = 'block';
                splitBtnContainer.style.display = 'block';
                selectPages('all');
                elements.customSplitSection.querySelector('h4').textContent = 'âš™ï¸ Select Pages to Group (2 pages per file)';
                
                // Show all page option buttons except custom range for Group Split
                elements.pageOptions.forEach(option => {
                    if (option.dataset.pages === 'custom') {
                        option.style.display = 'none';
                    } else {
                        option.style.display = 'flex';
                    }
                });
            }
        }

        function selectPages(pagesType) {
            elements.pageOptions.forEach(option => {
                option.classList.remove('selected');
                if (option.dataset.pages === pagesType) {
                    option.classList.add('selected');
                }
            });

            if (pagesType === 'custom') {
                elements.customPages.style.display = 'block';
                    } else {
                elements.customPages.style.display = 'none';
            }
        }

        async function splitPDF() {
            if (!uploadedPDF) {
                showError('Please select a PDF file first.');
                return;
            }
            
            if (!selectedOption) {
                showError('Please select a split option first (Split All Pages, Extract Pages, or Group Split).');
                return;
            }

            const btnText = elements.splitPdfBtn.textContent;
            const progressBar = document.getElementById('progress-bar');
            const progressText = document.getElementById('progress-text');
            
            elements.splitPdfBtn.disabled = true;
            elements.splitPdfBtn.textContent = 'Processing...';
            elements.customSplitSection.style.display = 'none';
            elements.processing.style.display = 'block';

            try {
                splitFiles = [];
                const { PDFDocument } = PDFLib;

                // Get selected pages
                const selectedPages = getSelectedPages();
                
                console.log('Selected Option:', selectedOption);
                console.log('Selected Pages:', selectedPages);
                
                if (selectedPages.length === 0) {
                    throw new Error('No pages selected for splitting.');
                }

                if (selectedOption === 'single') {
                    // Split All Pages - Create separate PDF for each page
                    elements.processingText.textContent = `Splitting ${selectedPages.length} pages into separate files...`;
                    
                    for (let i = 0; i < selectedPages.length; i++) {
                        const pageNum = selectedPages[i];
                        const progress = Math.round(((i + 1) / selectedPages.length) * 100);
                        
                        elements.processingText.textContent = `Creating file ${i + 1} of ${selectedPages.length}: page_${pageNum}.pdf`;
                        progressBar.style.width = progress + '%';
                        progressText.textContent = progress + '%';
                        
                        const newPdf = await PDFDocument.create();
                        const [copiedPage] = await newPdf.copyPages(uploadedPDF, [pageNum - 1]);
                        newPdf.addPage(copiedPage);
                        
                        const pdfBytes = await newPdf.save();
                        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                        
                        splitFiles.push({
                            name: `page_${pageNum}.pdf`,
                            blob: blob,
                            size: blob.size
                        });
                    }
                } else if (selectedOption === 'range') {
                    // Extract Pages - Create separate PDFs based on ranges
                    const ranges = parseCustomRanges(elements.pagesInput.value);
                    elements.processingText.textContent = `Extracting ${ranges.length} range(s) into separate files...`;
                    
                    for (let i = 0; i < ranges.length; i++) {
                        const range = ranges[i];
                        const progress = Math.round(((i + 1) / ranges.length) * 100);
                        
                        elements.processingText.textContent = `Creating file ${i + 1} of ${ranges.length}...`;
                        progressBar.style.width = progress + '%';
                        progressText.textContent = progress + '%';
                        
                        const newPdf = await PDFDocument.create();
                        const pageIndices = range.pages.map(p => p - 1);
                        const copiedPages = await newPdf.copyPages(uploadedPDF, pageIndices);
                        copiedPages.forEach(page => newPdf.addPage(page));
                        
                        const pdfBytes = await newPdf.save();
                        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                        
                        splitFiles.push({
                            name: range.name,
                            blob: blob,
                            size: blob.size
                        });
                    }
                } else if (selectedOption === 'groups') {
                    // Group Split - Split into groups of 2 pages per file
                    const groupSize = 2;
                    const numGroups = Math.ceil(selectedPages.length / groupSize);
                    elements.processingText.textContent = `Creating ${numGroups} group(s) of ${groupSize} pages each...`;
                    
                    for (let i = 0; i < selectedPages.length; i += groupSize) {
                        const groupPages = selectedPages.slice(i, i + groupSize);
                        const groupNum = Math.floor(i / groupSize) + 1;
                        const progress = Math.round((groupNum / numGroups) * 100);
                        
                        elements.processingText.textContent = `Creating group ${groupNum} of ${numGroups}...`;
                        progressBar.style.width = progress + '%';
                        progressText.textContent = progress + '%';
                        
                        const newPdf = await PDFDocument.create();
                        const pageIndices = groupPages.map(p => p - 1);
                        const copiedPages = await newPdf.copyPages(uploadedPDF, pageIndices);
                        copiedPages.forEach(page => newPdf.addPage(page));
                        
                        const pdfBytes = await newPdf.save();
                        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                        
                        splitFiles.push({
                            name: `pages_${groupPages[0]}-${groupPages[groupPages.length - 1]}.pdf`,
                            blob: blob,
                            size: blob.size
                        });
                    }
                }
                
                elements.processing.style.display = 'none';
                displayResults();
                
            } catch (error) {
                console.error('Split error:', error);
                showError('Failed to split PDF: ' + error.message);
                elements.processing.style.display = 'none';
                elements.customSplitSection.style.display = 'block';
            } finally {
                elements.splitPdfBtn.disabled = false;
                elements.splitPdfBtn.textContent = btnText;
            }
        }

        function getSelectedPages() {
            // For Split All Pages, return all pages
            if (selectedOption === 'single') {
                return Array.from({length: totalPages}, (_, i) => i + 1);
            }
            
            // For Extract Pages, always use custom input
            if (selectedOption === 'range') {
                return parseCustomPages(elements.pagesInput.value);
            }
            
            // For Group Split, check selected page option
            const selectedPageOption = document.querySelector('.page-option.selected');
            if (!selectedPageOption) return [];
            
            const pagesType = selectedPageOption.dataset.pages;
            
            switch (pagesType) {
                case 'all':
                    return Array.from({length: totalPages}, (_, i) => i + 1);
                case 'odd':
                    return Array.from({length: Math.ceil(totalPages / 2)}, (_, i) => (i * 2) + 1);
                case 'even':
                    return Array.from({length: Math.floor(totalPages / 2)}, (_, i) => (i + 1) * 2);
                case 'first':
                    return [1];
                case 'last':
                    return [totalPages];
                default:
                    return [];
            }
        }

        function parseCustomPages(input) {
            const pages = [];
            const ranges = input.split(',');
            
            ranges.forEach(range => {
                range = range.trim();
                if (range.includes('-')) {
                    const [start, end] = range.split('-').map(n => parseInt(n.trim()));
                    for (let i = start; i <= end; i++) {
                        if (i >= 1 && i <= totalPages) pages.push(i);
                    }
                } else {
                    const page = parseInt(range);
                    if (page >= 1 && page <= totalPages) pages.push(page);
                }
            });
            
            return [...new Set(pages)].sort((a, b) => a - b);
        }

        function parseCustomRanges(input) {
            const rangeObjects = [];
            const ranges = input.split(',');
            
            ranges.forEach(range => {
                range = range.trim();
                if (!range) return;
                
                if (range.includes('-')) {
                    const [start, end] = range.split('-').map(n => parseInt(n.trim()));
                    if (start >= 1 && end <= totalPages && start <= end) {
                        const pages = [];
                        for (let i = start; i <= end; i++) {
                            pages.push(i);
                        }
                        rangeObjects.push({
                            name: start === end ? `page_${start}.pdf` : `pages_${start}-${end}.pdf`,
                            pages: pages
                        });
                    }
                } else {
                    const page = parseInt(range);
                    if (page >= 1 && page <= totalPages) {
                        rangeObjects.push({
                            name: `page_${page}.pdf`,
                            pages: [page]
                        });
                    }
                }
            });
            
            return rangeObjects;
        }

        function displayResults() {
            elements.downloadList.innerHTML = '';
            
            splitFiles.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'download-item';
                item.innerHTML = `
                    <div class="download-info">
                        <div class="download-icon">📄</div>
                        <div class="download-details">
                            <h4>${file.name}</h4>
                            <p>${formatFileSize(file.size)}</p>
                        </div>

                    <button class="download-btn" onclick="downloadFile(${index})">Download</button>
                `;
            elements.downloadList.appendChild(item);
            });
            
            elements.resultInfo.textContent = `Successfully created ${splitFiles.length} PDF file(s)`;
            elements.resultsSection.style.display = 'block';
        }

        function downloadFile(index) {
            const file = splitFiles[index];
            const url = URL.createObjectURL(file.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function resetTool() {
            uploadedPDF = null;
            totalPages = 0;
            selectedOption = null;
            splitFiles = [];
            
            elements.pdfInfo.style.display = 'none';
            elements.splitOptions.style.display = 'none';
            elements.customSplitSection.style.display = 'none';
            elements.resultsSection.style.display = 'none';
            elements.processing.style.display = 'none';
            
            elements.fileInput.value = '';
            elements.pagesInput.value = '';
            
            // Reset selections
            elements.optionCards.forEach(card => card.classList.remove('selected'));
            elements.pageOptions.forEach(option => {
                option.classList.remove('selected');
                option.style.display = 'flex'; // Reset visibility
                if (option.dataset.pages === 'all') {
                    option.classList.add('selected');
                }
            });
            elements.customPages.style.display = 'none';
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

        // Option selection
        elements.optionCards.forEach(card => {
            card.addEventListener('click', () => {
                selectOption(card.dataset.option);
            });
        });

        // Page selection
        elements.pageOptions.forEach(option => {
            option.addEventListener('click', () => {
                selectPages(option.dataset.pages);
            });
        });

        elements.splitPdfBtn.addEventListener('click', splitPDF);
        elements.splitNewBtn.addEventListener('click', resetTool);
        
        // Back to Tools button functionality
        document.getElementById('back-to-tools-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#pdf-tools-section';
        });

        // Make downloadFile function global
        window.downloadFile = downloadFile;
