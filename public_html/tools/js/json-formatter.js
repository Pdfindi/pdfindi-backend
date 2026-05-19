const jsonInput = document.getElementById('json-input');
        const jsonOutput = document.getElementById('json-output');
        const formatBtn = document.getElementById('format-btn');
        const minifyBtn = document.getElementById('minify-btn');
        const validateBtn = document.getElementById('validate-btn');
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

        function resetOutput() {
            jsonOutput.className = '';
            jsonOutput.style.color = '';
        }

        formatBtn.addEventListener('click', () => {
            try {
                resetOutput();
                const parsed = JSON.parse(jsonInput.value);
                jsonOutput.textContent = JSON.stringify(parsed, null, 2);
                jsonOutput.className = 'success';
            } catch (error) {
                jsonOutput.textContent = `Error: ${error.message}`;
                jsonOutput.className = 'error';
            }
        });

        minifyBtn.addEventListener('click', () => {
            try {
                resetOutput();
                const parsed = JSON.parse(jsonInput.value);
                jsonOutput.textContent = JSON.stringify(parsed);
                jsonOutput.className = 'success';
            } catch (error) {
                jsonOutput.textContent = `Error: ${error.message}`;
                jsonOutput.className = 'error';
            }
        });

        validateBtn.addEventListener('click', () => {
            try {
                resetOutput();
                JSON.parse(jsonInput.value);
                jsonOutput.textContent = '✅Valid JSON!';
                jsonOutput.className = 'success';
            } catch (error) {
                jsonOutput.textContent = `â�Œ Invalid JSON: ${error.message}`;
                jsonOutput.className = 'error';
            }
        });

        copyBtn.addEventListener('click', () => {
            copyToClipboard(jsonOutput.textContent, copyBtn);
        });

        clearBtn.addEventListener('click', () => {
            jsonInput.value = '';
            jsonOutput.textContent = 'Your formatted JSON will appear here...';
            resetOutput();
        });

        // Auto-format on input (with debounce)
        let timeout;
        jsonInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (jsonInput.value.trim()) {
                    formatBtn.click();
                }
            }, 500);
        });
        
        // Back to Tools button functionality
        document.getElementById('back-to-tools-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#utility-tools-section';
        });
