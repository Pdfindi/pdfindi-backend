const textInput = document.getElementById('text-input');
        const outputArea = document.getElementById('output-area');
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

        function convertCase(type) {
            const text = textInput.value;
            if (!text.trim()) {
                outputArea.textContent = 'Please enter some text to convert.';
                return;
            }

            let result = '';
            
            switch (type) {
                case 'upper':
                    result = text.toUpperCase();
                    break;
                case 'lower':
                    result = text.toLowerCase();
                    break;
                case 'title':
                    result = text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
                    break;
                case 'sentence':
                    result = text.toLowerCase().replace(/(^\w|\.\s+\w)/g, l => l.toUpperCase());
                    break;
                case 'camel':
                    result = text.toLowerCase()
                        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
                            return index === 0 ? word.toLowerCase() : word.toUpperCase();
                        })
                        .replace(/\s+/g, '');
                    break;
                case 'pascal':
                    result = text.toLowerCase()
                        .replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase())
                        .replace(/\s+/g, '');
                    break;
                case 'snake':
                    result = text.toLowerCase().replace(/\s+/g, '_').replace(/[^\w_]/g, '');
                    break;
                case 'kebab':
                    result = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                    break;
                case 'toggle':
                    result = text.split('').map(char => {
                        return char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase();
                    }).join('');
                    break;
                default:
                    result = text;
            }
            
            outputArea.textContent = result;
        }

        copyBtn.addEventListener('click', () => {
            copyToClipboard(outputArea.textContent, copyBtn);
        });

        clearBtn.addEventListener('click', () => {
            textInput.value = '';
            outputArea.textContent = 'Your converted text will appear here...';
        });
        
        // Back to Tools button functionality
        document.getElementById('back-to-tools-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#utility-tools-section';
        });
