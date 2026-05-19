let uploadedPDF = null;
        let protectedPDFBlob = null;

        const elements = {
            uploadZone: document.getElementById('upload-zone'),
            fileInput: document.getElementById('file-input'),
            errorMessage: document.getElementById('error-message'),
            successMessage: document.getElementById('success-message'),
            pdfInfo: document.getElementById('pdf-info'),
            fileName: document.getElementById('file-name'),
            fileSize: document.getElementById('file-size'),
            totalPages: document.getElementById('total-pages'),
            currentStatus: document.getElementById('current-status'),
            protectionSettings: document.getElementById('protection-settings'),
            userPassword: document.getElementById('user-password'),
            userStrengthBar: document.getElementById('user-strength-bar'),
            userStrengthText: document.getElementById('user-strength-text'),
            allowPrinting: document.getElementById('allow-printing'),
            allowCopying: document.getElementById('allow-copying'),
            allowModifying: document.getElementById('allow-modifying'),
            allowAnnotations: document.getElementById('allow-annotations'),
            allowForms: document.getElementById('allow-forms'),
            allowAccessibility: document.getElementById('allow-accessibility'),
            allowAssembly: document.getElementById('allow-assembly'),
            allowHighQualityPrint: document.getElementById('allow-high-quality-print'),
            encryptionLevel: document.getElementById('encryption-level'),
            protectPdfBtn: document.getElementById('protect-pdf-btn'),
            processing: document.getElementById('processing'),
            processingText: document.getElementById('processing-text'),
            downloadSection: document.getElementById('download-section'),
            resultInfo: document.getElementById('result-info'),
            downloadBtn: document.getElementById('download-btn'),
            protectNewBtn: document.getElementById('protect-new-btn')
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

        function togglePassword(inputId) {
            const input = document.getElementById(inputId);
            const button = input.nextElementSibling;
            
            if (input.type === 'password') {
                input.type = 'text';
                button.textContent = '🙈';
            } else {
                input.type = 'password';
                button.textContent = 'ðŸ‘ï¸';
            }
        }

        function checkPasswordStrength(password) {
            let strength = 0;
            let feedback = [];

            if (password.length >= 8) strength += 25;
            else feedback.push('At least 8 characters');

            if (/[a-z]/.test(password)) strength += 25;
            else feedback.push('Lowercase letter');

            if (/[A-Z]/.test(password)) strength += 25;
            else feedback.push('Uppercase letter');

            if (/[0-9]/.test(password)) strength += 15;
            else feedback.push('Number');

            if (/[^A-Za-z0-9]/.test(password)) strength += 10;
            else feedback.push('Special character');

            return { strength, feedback };
        }

        function updatePasswordStrength(password, strengthBar, strengthText) {
            const { strength, feedback } = checkPasswordStrength(password);
            
            strengthBar.style.width = strength + '%';
            
            if (strength < 25) {
                strengthBar.style.background = '#fa7220';
                strengthText.textContent = 'Very Weak';
                strengthText.style.color = '#fa7220';
            } else if (strength < 50) {
                strengthBar.style.background = '#f97316';
                strengthText.textContent = 'Weak';
                strengthText.style.color = '#f97316';
            } else if (strength < 75) {
                strengthBar.style.background = '#eab308';
                strengthText.textContent = 'Good';
                strengthText.style.color = '#eab308';
            } else if (strength < 90) {
                strengthBar.style.background = '#22c55e';
                strengthText.textContent = 'Strong';
                strengthText.style.color = '#22c55e';
            } else {
                strengthBar.style.background = '#138808';
                strengthText.textContent = 'Very Strong';
                strengthText.style.color = '#138808';
            }
        }

        // Password strength monitoring
        elements.userPassword.addEventListener('input', (e) => {
            updatePasswordStrength(e.target.value, elements.userStrengthBar, elements.userStrengthText);
        });

        function handleFileSelect(file) {
            if (file.type !== 'application/pdf') {
                showError('Please select a valid PDF file.');
                return;
            }

            if (file.size > 25 * 1024 * 1024) { // 25MB limit
                showError('File size too large. Please select a PDF under 25MB.');
                return;
            }

            uploadedPDF = file;
            
            elements.fileName.textContent = file.name;
            elements.fileSize.textContent = formatFileSize(file.size);
            elements.totalPages.textContent = 'Analyzing...';
            
            // Simulate analysis
            setTimeout(() => {
                // This is a rough estimate - in a real implementation you'd parse the PDF
                const estimatedPages = Math.ceil(file.size / (50 * 1024)); // Rough estimate
                elements.totalPages.textContent = `~${estimatedPages} pages`;
                
                elements.uploadZone.style.display = 'none';
                elements.pdfInfo.style.display = 'block';
                elements.protectionSettings.style.display = 'block';
                
                showSuccess('PDF loaded successfully! Configure your protection settings below.');
            }, 1000);
        }

        async function protectPDF() {
            if (!uploadedPDF) {
                showError('Please select a PDF file first.');
                return;
            }

            const userPassword = elements.userPassword.value;

            if (!userPassword) {
                showError('Please enter a password to protect the PDF.');
                return;
            }

            if (userPassword.length < 6) {
                showError('Password must be at least 6 characters long.');
                return;
            }

            elements.processing.style.display = 'block';
            elements.processingText.textContent = 'Protecting PDF...';
            elements.protectionSettings.style.display = 'none';

            try {
                // Prepare form data for backend API
                const formData = new FormData();
                formData.append('file', uploadedPDF);
                formData.append('userPassword', userPassword);
                formData.append('encryptionKeyLength', elements.encryptionLevel.value);
                
                elements.processingText.textContent = 'Encrypting PDF with password...';
                
                // Call backend API on Render
                const response = await fetch('https://pdfindi-backend.onrender.com/api/protect-pdf', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('API Error:', errorData);
                    throw new Error(errorData.details || errorData.error || 'Failed to protect PDF');
                }

                elements.processingText.textContent = 'Finalizing protected PDF...';
                
                // Get protected PDF as blob
                const protectedPdfBytes = await response.arrayBuffer();
                protectedPDFBlob = new Blob([protectedPdfBytes], { type: 'application/pdf' });

                elements.processing.style.display = 'none';
                elements.resultInfo.textContent = `PDF protected with password encryption • ${formatFileSize(protectedPDFBlob.size)}`;
                elements.downloadSection.style.display = 'block';

                showSuccess('PDF protected successfully! Password required to open.');

            } catch (error) {
                console.error('Protection error:', error);
                console.error('Error details:', error.message);
                showError(`Failed to protect PDF: ${error.message}. Please try again.`);
                elements.processing.style.display = 'none';
                elements.protectionSettings.style.display = 'block';
            }
        }

        function downloadProtectedPDF() {
            if (!protectedPDFBlob) return;

            const url = URL.createObjectURL(protectedPDFBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = uploadedPDF.name.replace('.pdf', '_protected.pdf');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function resetTool() {
            uploadedPDF = null;
            protectedPDFBlob = null;
            
            elements.uploadZone.style.display = 'block';
            elements.pdfInfo.style.display = 'none';
            elements.protectionSettings.style.display = 'none';
            elements.downloadSection.style.display = 'none';
            elements.processing.style.display = 'none';
            
            elements.fileInput.value = '';
            elements.userPassword.value = '';
            elements.userStrengthBar.style.width = '0%';
            elements.userStrengthText.textContent = 'Password strength will appear here';
            
            elements.encryptionLevel.value = '256';
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

        elements.protectPdfBtn.addEventListener('click', protectPDF);
        elements.downloadBtn.addEventListener('click', downloadProtectedPDF);
        elements.protectNewBtn.addEventListener('click', resetTool);

        // Back to Tools button functionality
        document.getElementById('back-to-tools-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#pdf-tools-section';
        });

        // Initialize password strength indicators
        updatePasswordStrength('', elements.userStrengthBar, elements.userStrengthText);
        updatePasswordStrength('', elements.ownerStrengthBar, elements.ownerStrengthText);
