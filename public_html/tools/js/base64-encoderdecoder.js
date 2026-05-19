const textInput = document.getElementById('text-input');
        const resultArea = document.getElementById('result-area');
        const encodeBtn = document.getElementById('encode-btn');
        const decodeBtn = document.getElementById('decode-btn');
        const copyBtn = document.getElementById('copy-btn');
        const clearBtn = document.getElementById('clear-btn');

        function copyToClipboard(text, button) {
            navigator.clipboard.writeText(text).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            }).catch(() => {
                button.textContent = 'Failed';
                setTimeout(() => {
                    button.textContent = 'Copy Result';
                }, 2000);
            });
        }

        function resetResult() {
            resultArea.style.color = '';
            resultArea.style.backgroundColor = '';
        }

        function showError(message) {
            resultArea.textContent = message;
            resultArea.style.color = '#dc3545';
            resultArea.style.backgroundColor = '#f8d7da';
        }

        function showSuccess(message) {
            resultArea.textContent = message;
            resultArea.style.color = '#155724';
            resultArea.style.backgroundColor = '#d4edda';
        }

        encodeBtn.addEventListener('click', () => {
            const text = textInput.value;
            if (!text) {
                showError('Please enter some text to encode.');
                return;
            }
            
            try {
                resetResult();
                const encoded = btoa(unescape(encodeURIComponent(text)));
                showSuccess(encoded);
            } catch (error) {
                showError('Error encoding text: ' + error.message);
            }
        });

        decodeBtn.addEventListener('click', () => {
            const text = textInput.value;
            if (!text) {
                showError('Please enter Base64 text to decode.');
                return;
            }
            
            try {
                resetResult();
                const decoded = decodeURIComponent(escape(atob(text)));
                showSuccess(decoded);
            } catch (error) {
                showError('Invalid Base64 text. Please check your input.');
            }
        });

        copyBtn.addEventListener('click', () => {
            copyToClipboard(resultArea.textContent, copyBtn);
        });

        clearBtn.addEventListener('click', () => {
            textInput.value = '';
            resultArea.textContent = 'Your encoded/decoded text will appear here...';
            resetResult();
        });

        // Auto-detect and suggest operation
        textInput.addEventListener('input', () => {
            const text = textInput.value.trim();
            if (!text) return;
            
            // Simple Base64 detection (Base64 typically contains only A-Z, a-z, 0-9, +, /, = and has length divisible by 4)
            const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
            const isLikelyBase64 = base64Regex.test(text) && text.length % 4 === 0 && text.length > 4;
            
            if (isLikelyBase64) {
                encodeBtn.textContent = 'Encode to Base64';
                decodeBtn.textContent = 'Decode from Base64 â† Suggested';
                decodeBtn.style.background = '#28a745';
            } else {
                encodeBtn.textContent = 'Encode to Base64 â† Suggested';
                decodeBtn.textContent = 'Decode from Base64';
                encodeBtn.style.background = '#fa7220';
                decodeBtn.style.background = '#6c757d';
            }
        });
        
        // Back to Tools button functionality
        document.getElementById('back-to-tools-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#utility-tools-section';
        });
