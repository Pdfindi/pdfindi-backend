let selectedImages = [];
        let pdfBlob = null;

        const elements = {
            uploadZone: document.getElementById('upload-zone'),
            fileInput: document.getElementById('file-input'),
            errorMessage: document.getElementById('error-message'),
            successMessage: document.getElementById('success-message'),
            imagesPreview: document.getElementById('images-preview'),
            pdfSettings: document.getElementById('pdf-settings'),
            pageSizeSelect: document.getElementById('page-size'),
            orientationSelect: document.getElementById('orientation'),
            marginSelect: document.getElementById('margin'),
            qualitySelect: document.getElementById('quality'),
            layoutOptions: document.querySelectorAll('.layout-option'),
            sortableList: document.getElementById('sortable-list'),
            sortItems: document.getElementById('sort-items'),
            createPdfBtn: document.getElementById('create-pdf-btn'),
            processing: document.getElementById('processing'),
            processingText: document.getElementById('processing-text'),
            downloadSection: document.getElementById('download-section'),
            pdfInfo: document.getElementById('pdf-info'),
            downloadBtn: document.getElementById('download-btn'),
            createNewBtn: document.getElementById('create-new-btn')
        };

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

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        function handleFileSelect(files) {
            Array.from(files).forEach(file => {
                if (!file.type.startsWith('image/')) {
                    showError(`${file.name} is not a valid image file.`);
                    return;
                }

                if (file.size > 10 * 1024 * 1024) { // 10MB limit per image
                    showError(`${file.name} is too large. Please use images under 10MB.`);
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = {
                        id: Date.now() + Math.random(),
                        file: file,
                        dataUrl: e.target.result,
                        name: file.name,
                        size: file.size
                    };
                    selectedImages.push(imageData);
                    updateImagesPreview();
                };
                reader.readAsDataURL(file);
            });
        }

        function updateImagesPreview() {
            if (selectedImages.length === 0) {
                elements.imagesPreview.style.display = 'none';
                elements.pdfSettings.style.display = 'none';
                return;
            }

            elements.imagesPreview.style.display = 'grid';
            elements.pdfSettings.style.display = 'block';

            elements.imagesPreview.innerHTML = '';
            selectedImages.forEach(image => {
                const item = document.createElement('div');
                item.className = 'image-item';
                item.innerHTML = `
                    <img src="${image.dataUrl}" alt="${image.name}" class="image-thumbnail" loading="lazy">
                    <div class="image-info">
                        <strong>${image.name}</strong>
                        <div>${formatFileSize(image.size)}</div>
                    </div>
                    <button class="remove-image" onclick="removeImage('${image.id}')">×</button>
                `;
                elements.imagesPreview.appendChild(item);
            });

            updateSortableList();
        }

        function updateSortableList() {
            if (selectedImages.length > 1) {
                elements.sortableList.style.display = 'block';
                elements.sortItems.innerHTML = '';

                selectedImages.forEach((image, index) => {
                    const item = document.createElement('div');
                    item.className = 'image-sort-item';
                    item.draggable = true;
                    item.dataset.imageId = image.id;
                    item.innerHTML = `
                        <span class="drag-handle" style="cursor: move; margin-right: 10px; color: #999;">⋮⋮</span>
                        <img src="${image.dataUrl}" alt="${image.name}" class="sort-thumbnail" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; margin-right: 10px;" loading="lazy">
                        <span style="flex: 1; font-size: 0.85rem;">${image.name}</span>
                        <span style="font-weight: bold; color: #fa7220;">#${index + 1}</span>
                    `;
                    item.style.display = 'flex';
                    item.style.alignItems = 'center';
                    item.style.padding = '0.75rem';
                    item.style.background = '#f9fafb';
                    item.style.border = '1px solid #e5e7eb';
                    item.style.borderRadius = '8px';
                    item.style.marginBottom = '0.5rem';
                    elements.sortItems.appendChild(item);
                });

                addSortableEvents();
            } else {
                elements.sortableList.style.display = 'none';
            }
        }

        function addSortableEvents() {
            const items = elements.sortItems.querySelectorAll('.image-sort-item');
            items.forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', item.dataset.imageId);
                    item.style.opacity = '0.5';
                });

                item.addEventListener('dragend', () => {
                    item.style.opacity = '1';
                });

                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                });

                item.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const draggedId = e.dataTransfer.getData('text/plain');
                    const droppedId = item.dataset.imageId;

                    if (draggedId !== droppedId) {
                        reorderImages(draggedId, droppedId);
                    }
                });
            });
        }

        function reorderImages(draggedId, droppedId) {
            const draggedIndex = selectedImages.findIndex(img => img.id == draggedId);
            const droppedIndex = selectedImages.findIndex(img => img.id == droppedId);

            const draggedImage = selectedImages.splice(draggedIndex, 1)[0];
            selectedImages.splice(droppedIndex, 0, draggedImage);

            updateSortableList();
            updateImagesPreview();
        }

        function removeImage(id) {
            selectedImages = selectedImages.filter(img => img.id != id);
            updateImagesPreview();
        }

        async function createPDF() {
            if (selectedImages.length === 0) {
                showError('Please select at least one image.');
                return;
            }

            const progressBar = document.getElementById('progress-bar');
            const progressText = document.getElementById('progress-text');
            
            elements.processing.style.display = 'block';
            elements.processingText.textContent = 'Creating PDF...';

            try {
                const pdfDoc = await PDFLib.PDFDocument.create();
                const pageSize = elements.pageSizeSelect.value;
                const orientation = elements.orientationSelect.value;
                const margin = parseInt(elements.marginSelect.value);
                const quality = parseFloat(elements.qualitySelect.value);
                
                const selectedLayoutOption = document.querySelector('.layout-option.selected');
                const layout = selectedLayoutOption ? selectedLayoutOption.dataset.layout : 'single';

                const pageSizes = {
                    a4: { width: 595, height: 842 },
                    letter: { width: 612, height: 792 },
                    a3: { width: 842, height: 1191 },
                    a5: { width: 420, height: 595 }
                };

                for (let i = 0; i < selectedImages.length; i++) {
                    const progress = Math.round(((i + 1) / selectedImages.length) * 100);
                    
                    elements.processingText.textContent = `Processing image ${i + 1} of ${selectedImages.length}...`;
                    progressBar.style.width = progress + '%';
                    progressText.textContent = progress + '%';

                    const image = selectedImages[i];
                    let pdfImage;

                    if (image.file.type === 'image/jpeg' || image.file.type === 'image/jpg') {
                        pdfImage = await pdfDoc.embedJpg(await image.file.arrayBuffer());
                    } else {
                        pdfImage = await pdfDoc.embedPng(await convertToPng(image.dataUrl));
                    }

                    const { width: imgWidth, height: imgHeight } = pdfImage;
                    let pageWidth, pageHeight;

                    if (pageSize === 'custom') {
                        pageWidth = imgWidth + (margin * 2);
                        pageHeight = imgHeight + (margin * 2);
                    } else {
                        const size = pageSizes[pageSize];
                        if (orientation === 'auto') {
                            if (imgWidth > imgHeight) {
                                pageWidth = Math.max(size.width, size.height);
                                pageHeight = Math.min(size.width, size.height);
                            } else {
                                pageWidth = Math.min(size.width, size.height);
                                pageHeight = Math.max(size.width, size.height);
                            }
                        } else if (orientation === 'landscape') {
                            pageWidth = Math.max(size.width, size.height);
                            pageHeight = Math.min(size.width, size.height);
                        } else {
                            pageWidth = Math.min(size.width, size.height);
                            pageHeight = Math.max(size.width, size.height);
                        }
                    }

                    const page = pdfDoc.addPage([pageWidth, pageHeight]);
                    const maxWidth = pageWidth - (margin * 2);
                    const maxHeight = pageHeight - (margin * 2);

                    let scaledWidth = imgWidth;
                    let scaledHeight = imgHeight;

                    if (scaledWidth > maxWidth) {
                        const scale = maxWidth / scaledWidth;
                        scaledWidth = maxWidth;
                        scaledHeight = scaledHeight * scale;
                    }

                    if (scaledHeight > maxHeight) {
                        const scale = maxHeight / scaledHeight;
                        scaledHeight = maxHeight;
                        scaledWidth = scaledWidth * scale;
                    }

                    const x = (pageWidth - scaledWidth) / 2;
                    const y = (pageHeight - scaledHeight) / 2;

                    page.drawImage(pdfImage, {
                        x: x,
                        y: y,
                        width: scaledWidth,
                        height: scaledHeight
                    });
                }

                elements.processingText.textContent = 'Finalizing PDF...';
                const pdfBytes = await pdfDoc.save();
                pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

                elements.processing.style.display = 'none';
                elements.pdfInfo.textContent = `PDF created with ${selectedImages.length} image(s) • ${formatFileSize(pdfBlob.size)}`;
                elements.downloadSection.style.display = 'block';

            } catch (error) {
                console.error('Error creating PDF:', error);
                showError('Failed to create PDF. Please try again.');
                elements.processing.style.display = 'none';
            }
        }

        async function convertToPng(dataUrl) {
            return new Promise((resolve) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        blob.arrayBuffer().then(resolve);
                    }, 'image/png');
                };
                img.src = dataUrl;
            });
        }

        function downloadPDF() {
            if (!pdfBlob) return;
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `images-to-pdf-${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function resetTool() {
            selectedImages = [];
            pdfBlob = null;
            elements.imagesPreview.style.display = 'none';
            elements.pdfSettings.style.display = 'none';
            elements.downloadSection.style.display = 'none';
            elements.processing.style.display = 'none';
            elements.fileInput.value = '';
            renderPages(); // actually it's updateImagesPreview but renderPages was called in some places
        }

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
            if (files.length > 0) handleFileSelect(files);
        });
        elements.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) handleFileSelect(e.target.files);
        });
        elements.layoutOptions.forEach(option => {
            option.addEventListener('click', () => {
                elements.layoutOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
        elements.createPdfBtn.addEventListener('click', createPDF);
        elements.downloadBtn.addEventListener('click', downloadPDF);
        elements.createNewBtn.addEventListener('click', () => window.location.reload());

        window.removeImage = removeImage;