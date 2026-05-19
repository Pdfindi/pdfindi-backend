// QR Code Generator functionality
        const qrText = document.getElementById('qr-text');
        const qrOutput = document.getElementById('qr-output');
        const generateBtn = document.getElementById('generate-btn');
        const downloadBtn = document.getElementById('download-btn');
        const clearBtn = document.getElementById('clear-btn');
        const sizeSlider = document.getElementById('qr-size');
        const sizeValue = document.getElementById('size-value');
        const sizeDisplay = document.getElementById('size-display');
        const errorCorrection = document.getElementById('qr-error-correction');
        const foregroundColor = document.getElementById('qr-foreground');
        const backgroundColor = document.getElementById('qr-background');
        const downloadFeedback = document.getElementById('download-feedback');
        
        let currentQRCode = null;
        
        // Update size display
        function updateSizeDisplay() {
            const size = sizeSlider.value;
            sizeValue.textContent = size;
            sizeDisplay.textContent = `${size}px`;
        }
        
        // Check if input is valid
        function validateInput() {
            const text = qrText.value.trim();
            generateBtn.disabled = text.length === 0;
        }
        
        // Generate QR Code
        function generateQR() {
            const text = qrText.value.trim();
            if (!text) return;
            
            try {
                // Clear previous output
                qrOutput.innerHTML = '';
                qrOutput.classList.remove('empty');
                
                // Create QR Code
                const qr = qrcode(0, errorCorrection.value);
                qr.addData(text);
                qr.make();
                
                // Get QR code data
                const modules = qr.getModuleCount();
                const cellSize = parseInt(sizeSlider.value) / modules;
                
                // Create canvas
                const canvas = document.createElement('canvas');
                canvas.width = parseInt(sizeSlider.value);
                canvas.height = parseInt(sizeSlider.value);
                const ctx = canvas.getContext('2d');
                
                // Set background
                ctx.fillStyle = backgroundColor.value;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw QR code
                ctx.fillStyle = foregroundColor.value;
                for (let row = 0; row < modules; row++) {
                    for (let col = 0; col < modules; col++) {
                        if (qr.isDark(row, col)) {
                            ctx.fillRect(
                                col * cellSize, 
                                row * cellSize, 
                                cellSize, 
                                cellSize
                            );
                        }
                    }
                }
                
                // Add canvas to output
                canvas.classList.add('qr-canvas');
                qrOutput.appendChild(canvas);
                
                // Add QR code info
                const info = document.createElement('div');
                info.className = 'qr-info';
                info.innerHTML = `
                    <strong>QR Code Generated Successfully!</strong><br>
                    Size: ${sizeSlider.value}í—${sizeSlider.value}px | 
                    Error Correction: ${errorCorrection.value} | 
                    Data Length: ${text.length} characters
                `;
                qrOutput.appendChild(info);
                
                // Enable download button
                downloadBtn.disabled = false;
                currentQRCode = canvas;
                
            } catch (error) {
                console.error('QR Code generation error:', error);
                qrOutput.innerHTML = `<div style="color: #dc3545; padding: 2rem;">Error generating QR code. Please check your input.</div>`;
                downloadBtn.disabled = true;
            }
        }
        
        // Download QR Code
        function downloadQR() {
            if (currentQRCode) {
                currentQRCode.toBlob(blob => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `qrcode_${Date.now()}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    // Show feedback
                    downloadFeedback.classList.add('show');
                    setTimeout(() => {
                        downloadFeedback.classList.remove('show');
                    }, 2000);
                });
            }
        }
        
        // Clear everything
        function clearAll() {
            qrText.value = '';
            qrOutput.innerHTML = '';
            qrOutput.classList.add('empty');
            generateBtn.disabled = true;
            downloadBtn.disabled = true;
            currentQRCode = null;
        }
        
        // Event listeners
        sizeSlider.addEventListener('input', updateSizeDisplay);
        qrText.addEventListener('input', validateInput);
        generateBtn.addEventListener('click', generateQR);
        downloadBtn.addEventListener('click', downloadQR);
        clearBtn.addEventListener('click', clearAll);
        
        // Auto-generate on input change (with debounce)
        let generateTimeout;
        qrText.addEventListener('input', () => {
            clearTimeout(generateTimeout);
            generateTimeout = setTimeout(() => {
                if (qrText.value.trim()) {
                    generateQR();
                }
            }, 500);
        });
        
        // Initialize
        updateSizeDisplay();
        validateInput();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (!generateBtn.disabled) generateQR();
                } else if (e.key === 's' && !downloadBtn.disabled) {
                    e.preventDefault();
                    downloadQR();
                }
            }
        });
        
        // Back to Tools button functionality
        document.getElementById('back-to-tools-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#utility-tools-section';
        });
