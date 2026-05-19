// Global variables
let pdfDoc = null;
let currentPage = 1;
let scale = 1.5;
let pdfCanvas = null;
let pdfContext = null;
let textElements = [];
let imageElements = [];
let drawingElements = [];
let undoStack = [];
let redoStack = [];
let currentTool = null;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let ocrTextBlocks = [];
let editableTextBoxes = [];
let isOcrMode = false;
let originalFile = null;

// DOM elements
const uploadZone = document.getElementById('uploadZone');
const pdfInput = document.getElementById('pdfInput');
const editorContainer = document.getElementById('editorContainer');
const canvasContainer = document.getElementById('canvasContainer');
const textEditor = document.getElementById('textEditor');
const textEditorTextarea = textEditor.querySelector('textarea');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingText = document.getElementById('loadingText');
const loadingSubtext = document.getElementById('loadingSubtext');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const zoomLevel = document.getElementById('zoomLevel');

// Toolbar buttons
const textTool = document.getElementById('textTool');
const imageTool = document.getElementById('imageTool');
const drawTool = document.getElementById('drawTool');
const highlightTool = document.getElementById('highlightTool');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const zoomIn = document.getElementById('zoomIn');
const zoomOut = document.getElementById('zoomOut');
const fitToPage = document.getElementById('fitToPage');
const ocrTool = document.getElementById('ocrTool');
const ocrTextContainer = document.getElementById('ocrTextContainer');

// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

// Event listeners
if (uploadZone) {
    uploadZone.addEventListener('click', () => pdfInput.click());
    uploadZone.addEventListener('dragover', handleDragOver);
    uploadZone.addEventListener('drop', handleDrop);
}
if (pdfInput) pdfInput.addEventListener('change', handleFileSelect);

// Toolbar event listeners
if (textTool) textTool.addEventListener('click', () => selectTool('text'));
if (imageTool) imageTool.addEventListener('click', () => selectTool('image'));
if (drawTool) drawTool.addEventListener('click', () => selectTool('draw'));
if (highlightTool) highlightTool.addEventListener('click', () => selectTool('highlight'));
if (ocrTool) ocrTool.addEventListener('click', () => extractTextWithOCR());

if (undoBtn) undoBtn.addEventListener('click', undo);
if (redoBtn) redoBtn.addEventListener('click', redo);

if (zoomIn) zoomIn.addEventListener('click', () => changeZoom(0.25));
if (zoomOut) zoomOut.addEventListener('click', () => changeZoom(-0.25));
if (fitToPage) fitToPage.addEventListener('click', fitToPageView);

// Text editor event listeners
if (textEditor) {
    textEditor.querySelector('.save').addEventListener('click', saveText);
    textEditor.querySelector('.cancel').addEventListener('click', cancelTextEdit);
}

// Action buttons
if (downloadBtn) downloadBtn.addEventListener('click', downloadEditedPDF);
if (resetBtn) resetBtn.addEventListener('click', resetEditor);

// Functions
function handleDragOver(e) {
    e.preventDefault();
    uploadZone.classList.add('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
        handleFile(file);
    }
}

function handleFile(file) {
    showLoading('Loading PDF...');
    originalFile = file;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        loadPDF(new Uint8Array(e.target.result));
    };
    reader.readAsArrayBuffer(file);
}

async function loadPDF(data) {
    try {
        loadingText.textContent = 'Parsing PDF...';
        
        const loadingTask = pdfjsLib.getDocument({data: data});
        pdfDoc = await loadingTask.promise;
        
        loadingText.textContent = 'Rendering pages...';
        
        // Hide upload section and show editor
        document.querySelector('.upload-section').style.display = 'none';
        editorContainer.style.display = 'block';
        downloadBtn.style.display = 'inline-flex';
        resetBtn.style.display = 'inline-flex';
        
        // Render first page
        await renderPage(1);
        
        hideLoading();
        
    } catch (error) {
        console.error('Error loading PDF:', error);
        hideLoading();
        alert('Error loading PDF. Please try again.');
    }
}

async function renderPage(pageNum) {
    const page = await pdfDoc.getPage(pageNum);
    
    // Calculate canvas size
    const viewport = page.getViewport({scale: scale});
    
    // Create canvas
    pdfCanvas = document.createElement('canvas');
    pdfContext = pdfCanvas.getContext('2d');
    
    pdfCanvas.height = viewport.height;
    pdfCanvas.width = viewport.width;
    pdfCanvas.className = 'pdf-canvas';
    
    // Clear canvas container
    canvasContainer.innerHTML = '';
    canvasContainer.appendChild(pdfCanvas);
    
    // Render PDF page
    const renderContext = {
        canvasContext: pdfContext,
        viewport: viewport
    };
    
    await page.render(renderContext).promise;
    
    // Add event listeners for interaction
    pdfCanvas.addEventListener('click', handleCanvasClick);
    pdfCanvas.addEventListener('mousedown', handleMouseDown);
    pdfCanvas.addEventListener('mousemove', handleMouseMove);
    pdfCanvas.addEventListener('mouseup', handleMouseUp);
}

function selectTool(tool) {
    // Remove active class from all tools
    [textTool, imageTool, drawTool, highlightTool].forEach(btn => {
        if (btn) btn.classList.remove('active');
    });
    
    // Add active class to selected tool
    if (tool === 'text' && textTool) textTool.classList.add('active');
    else if (tool === 'image' && imageTool) imageTool.classList.add('active');
    else if (tool === 'draw' && drawTool) drawTool.classList.add('active');
    else if (tool === 'highlight' && highlightTool) highlightTool.classList.add('active');
    
    currentTool = tool;
    pdfCanvas.style.cursor = tool === 'text' ? 'text' : 'crosshair';
}

function handleCanvasClick(e) {
    const rect = pdfCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (currentTool === 'text') {
        showTextEditor(x, y);
    } else if (currentTool === 'image') {
        addImageAtPosition(x, y);
    }
}

function showTextEditor(x, y) {
    textEditor.style.left = x + 'px';
    textEditor.style.top = y + 'px';
    textEditor.style.display = 'block';
    textEditorTextarea.focus();
}

function saveText() {
    const text = textEditorTextarea.value;
    if (text.trim()) {
        const rect = textEditor.getBoundingClientRect();
        const canvasRect = pdfCanvas.getBoundingClientRect();
        
        const x = rect.left - canvasRect.left;
        const y = rect.top - canvasRect.top;
        
        // Draw text on canvas
        pdfContext.font = '16px Inter';
        pdfContext.fillStyle = '#000000';
        pdfContext.fillText(text, x, y + 20);
        
        // Store text element for undo functionality
        textElements.push({
            text: text,
            x: x,
            y: y + 20,
            font: '16px Inter',
            color: '#000000'
        });
        
        undoStack.push({type: 'text', data: textElements[textElements.length - 1]});
    }
    
    textEditor.style.display = 'none';
    textEditorTextarea.value = '';
}

function cancelTextEdit() {
    textEditor.style.display = 'none';
    textEditorTextarea.value = '';
}

function addImageAtPosition(x, y) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    // Scale image to reasonable size
                    const maxWidth = 200;
                    const maxHeight = 200;
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                    
                    // Draw image on canvas
                    pdfContext.drawImage(img, x, y, width, height);
                    
                    // Store image element
                    imageElements.push({
                        img: img,
                        x: x,
                        y: y,
                        width: width,
                        height: height
                    });
                    
                    undoStack.push({type: 'image', data: imageElements[imageElements.length - 1]});
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function handleMouseDown(e) {
    if (currentTool === 'draw' || currentTool === 'highlight') {
        isDrawing = true;
        const rect = pdfCanvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
        
        pdfContext.beginPath();
        pdfContext.moveTo(lastX, lastY);
        
        if (currentTool === 'highlight') {
            pdfContext.globalCompositeOperation = 'multiply';
            pdfContext.strokeStyle = 'rgba(255, 255, 0, 0.5)';
            pdfContext.lineWidth = 20;
        } else {
            pdfContext.strokeStyle = '#000000';
            pdfContext.lineWidth = 2;
        }
    }
}

function handleMouseMove(e) {
    if (isDrawing) {
        const rect = pdfCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        pdfContext.lineTo(x, y);
        pdfContext.stroke();
        
        lastX = x;
        lastY = y;
    }
}

function handleMouseUp(e) {
    if (isDrawing) {
        isDrawing = false;
        pdfContext.closePath();
        pdfContext.globalCompositeOperation = 'source-over';
        
        // Store drawing element
        drawingElements.push({
            type: currentTool,
            points: [] // In a real implementation, you'd store the drawing path
        });
        
        undoStack.push({type: 'drawing', data: drawingElements[drawingElements.length - 1]});
    }
}

function undo() {
    if (undoStack.length > 0) {
        const action = undoStack.pop();
        redoStack.push(action);
        
        // Re-render the page to remove the last action
        renderPage(currentPage);
        
        // Re-apply all remaining elements
        redrawElements();
    }
}

function redo() {
    if (redoStack.length > 0) {
        const action = redoStack.pop();
        undoStack.push(action);
        
        // Re-apply the redone action
        redrawElements();
    }
}

function redrawElements() {
    // Re-draw all text elements
    textElements.forEach(element => {
        pdfContext.font = element.font;
        pdfContext.fillStyle = element.color;
        pdfContext.fillText(element.text, element.x, element.y);
    });
    
    // Re-draw all image elements
    imageElements.forEach(element => {
        pdfContext.drawImage(element.img, element.x, element.y, element.width, element.height);
    });
    
    // Re-draw all drawing elements
    drawingElements.forEach(element => {
        // In a real implementation, you'd replay the drawing paths
    });
}

function changeZoom(delta) {
    scale += delta;
    scale = Math.max(0.5, Math.min(3, scale));
    if (zoomLevel) zoomLevel.textContent = Math.round(scale * 100) + '%';
    renderPage(currentPage);
}

function fitToPageView() {
    const containerWidth = canvasContainer.clientWidth - 40;
    const canvasWidth = pdfCanvas.width / scale;
    const newScale = containerWidth / canvasWidth;
    
    scale = Math.max(0.5, Math.min(3, newScale));
    if (zoomLevel) zoomLevel.textContent = Math.round(scale * 100) + '%';
    renderPage(currentPage);
}

async function downloadEditedPDF() {
    showLoading('Generating edited PDF...');
    
    try {
        const imageData = pdfCanvas.toDataURL('image/png');
        
        if (isOcrMode || textElements.length > 0 || imageElements.length > 0) {
            await reconstructPDFWithEdits(imageData);
        } else {
            const link = document.createElement('a');
            link.download = 'edited_page_' + currentPage + '.png';
            link.href = imageData;
            link.click();
        }
        
        hideLoading();
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        hideLoading();
        alert('Error generating PDF. Please try again.');
    }
}

function resetEditor() {
    if (confirm('Are you sure you want to start over? All changes will be lost.')) {
        textElements = [];
        imageElements = [];
        drawingElements = [];
        undoStack = [];
        redoStack = [];
        isOcrMode = false;
        ocrTextBlocks = [];
        ocrTextContainer.innerHTML = '';
        renderPage(currentPage);
    }
}

function showLoading(text, subtext = '') {
    loadingText.textContent = text;
    loadingSubtext.textContent = subtext || 'Please wait...';
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// OCR Functions
async function extractTextWithOCR() {
    if (!pdfDoc || !originalFile) {
        alert('Please upload a PDF first');
        return;
    }
    
    showLoading('Extracting text...', 'Detecting editable text regions in your PDF');

    try {
        await processOCR(originalFile);
    } catch (error) {
        console.error('OCR error:', error);
        hideLoading();
        alert('Error extracting text. Please try again.');
    }
}

async function processOCR(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${config.backendUrl}/api/extract-pdf-text`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'OCR failed');
        }

        const result = await response.json();

        if (result.success) {
            // Adapt Cloudmersive response format: OcrPages -> Lines -> LineText/Words
            ocrTextBlocks = result.textData?.OcrPages?.flatMap(page => 
                page.Lines?.map(line => ({
                    Text: line.LineText,
                    X: line.Words?.[0]?.XLeft || 0,
                    Y: line.Words?.[0]?.YTop || 0,
                    Width: (line.Words?.[line.Words.length-1]?.XRight || 0) - (line.Words?.[0]?.XLeft || 0),
                    Height: (line.Words?.[0]?.YBottom || 0) - (line.Words?.[0]?.YTop || 0),
                    page: page.PageNumber,
                    Confidence: line.ConfidenceLevel || 0.9
                }))
            ) || [];

            isOcrMode = true;
            createEditableTextBoxes(ocrTextBlocks);
            hideLoading();
            
            if (ocrTextBlocks.length > 0) {
                alert(`Found ${ocrTextBlocks.length} text blocks! Click on any text to edit it.`);
            } else {
                alert('No editable text blocks found. Try adding new text instead.');
            }
        } else {
            throw new Error(result.error || 'OCR failed');
        }
    } catch (error) {
        console.error('OCR processing error:', error);
        hideLoading();
        alert('Error processing OCR. Please try again.');
    }
}

function createEditableTextBoxes(textBlocks) {
    ocrTextContainer.innerHTML = '';
    editableTextBoxes = [];

    textBlocks.forEach((block, index) => {
        const textBox = document.createElement('div');
        textBox.className = 'editable-text-box';
        textBox.dataset.index = index;

        const scaledX = (block.X || 0) * scale;
        const scaledY = (block.Y || 0) * scale;
        const scaledWidth = (block.Width || 100) * scale;
        const scaledHeight = (block.Height || 20) * scale;

        textBox.style.left = scaledX + 'px';
        textBox.style.top = scaledY + 'px';
        textBox.style.width = Math.max(scaledWidth, 100) + 'px';
        textBox.style.minHeight = Math.max(scaledHeight, 30) + 'px';

        textBox.innerHTML = `
            <div class="editable-text-controls">
                <button class="text-control-btn save-text" onclick="saveOcrText(${index})">✓</button>
                <button class="text-control-btn cancel-text" onclick="cancelOcrEdit(${index})">✕</button>
            </div>
            <textarea class="editable-text-input" onfocus="selectOcrTextBox(${index})">${block.Text || ''}</textarea>
        `;

        ocrTextContainer.appendChild(textBox);
        editableTextBoxes.push(textBox);
    });
}

function selectOcrTextBox(index) {
    editableTextBoxes.forEach(box => box.classList.remove('selected'));
    if (editableTextBoxes[index]) {
        editableTextBoxes[index].classList.add('selected');
    }
}

function saveOcrText(index) {
    const textBox = editableTextBoxes[index];
    if (textBox) {
        const textarea = textBox.querySelector('.editable-text-input');
        const newText = textarea.value;

        if (ocrTextBlocks[index]) {
            ocrTextBlocks[index].Text = newText;
            ocrTextBlocks[index].edited = true;
        }

        textBox.classList.remove('selected');
    }
}

function cancelOcrEdit(index) {
    const textBox = editableTextBoxes[index];
    if (textBox) {
        const textarea = textBox.querySelector('.editable-text-input');
        if (ocrTextBlocks[index]) {
            textarea.value = ocrTextBlocks[index].Text || '';
        }
        textBox.classList.remove('selected');
    }
}

async function reconstructPDFWithEdits(imageData) {
    try {
        if (!originalFile) throw new Error('Original file missing');

        const formData = new FormData();
        formData.append('file', originalFile);
        
        const allEdits = {};
        ocrTextBlocks.filter(block => block.edited).forEach((block, idx) => {
            allEdits[`ocr_${idx}`] = {
                page: block.page || currentPage,
                x: block.X,
                y: block.Y,
                text: block.Text,
                fontSize: 12
            };
        });

        textElements.forEach((el, idx) => {
            allEdits[`new_${idx}`] = {
                page: currentPage,
                x: el.x / scale,
                y: (el.y - 20) / scale,
                text: el.text,
                fontSize: 16 / scale
            };
        });

        formData.append('edits', JSON.stringify(allEdits));

        const response = await fetch(`${config.backendUrl}/api/rebuild-pdf`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('PDF reconstruction failed');

        const result = await response.json();

        if (result.success && result.editedPdf) {
            const byteCharacters = atob(result.editedPdf);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = result.filename || originalFile.name.replace('.pdf', '_edited.pdf');
            link.click();
            window.URL.revokeObjectURL(link.href);
        } else {
            throw new Error('Invalid response');
        }

    } catch (error) {
        console.error('PDF reconstruction error:', error);
        alert('Advanced PDF rebuild failed. Downloading capture instead.');
        const link = document.createElement('a');
        link.download = 'edited_page_' + currentPage + '.png';
        link.href = imageData;
        link.click();
    }
}