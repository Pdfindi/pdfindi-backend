// Password Generator functionality
        const passwordOutput = document.getElementById('password-output');
        const generateBtn = document.getElementById('generate-btn');
        const copyBtn = document.getElementById('copy-btn');
        const refreshBtn = document.getElementById('refresh-btn');
        const lengthSlider = document.getElementById('password-length');
        const lengthValue = document.getElementById('length-value');
        const lengthDisplay = document.getElementById('length-display');
        const strengthIndicator = document.getElementById('strength-indicator');
        const copyFeedback = document.getElementById('copy-feedback');
        
        // Character sets
        const charSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
            similar: 'l1IO0'
        };
        
        // Update length display
        function updateLengthDisplay() {
            const length = lengthSlider.value;
            lengthValue.textContent = length;
            lengthDisplay.textContent = `${length} character${length > 1 ? 's' : ''}`;
        }
        
        // Calculate password strength
        function calculateStrength(password) {
            let score = 0;
            
            if (password.length >= 8) score += 1;
            if (password.length >= 12) score += 1;
            if (password.length >= 16) score += 1;
            
            if (/[A-Z]/.test(password)) score += 1;
            if (/[a-z]/.test(password)) score += 1;
            if (/[0-9]/.test(password)) score += 1;
            if (/[^A-Za-z0-9]/.test(password)) score += 1;
            
            if (score <= 2) return { level: 'weak', class: 'strength-weak', text: 'Weak Password' };
            if (score <= 4) return { level: 'medium', class: 'strength-medium', text: 'Medium Password' };
            if (score <= 6) return { level: 'strong', class: 'strength-strong', text: 'Strong Password' };
            return { level: 'very-strong', class: 'strength-very-strong', text: 'Very Strong Password' };
        }
        
        // Generate password
        function generatePassword() {
            const length = parseInt(lengthSlider.value);
            const includeUppercase = document.getElementById('include-uppercase').checked;
            const includeLowercase = document.getElementById('include-lowercase').checked;
            const includeNumbers = document.getElementById('include-numbers').checked;
            const includeSymbols = document.getElementById('include-symbols').checked;
            const excludeSimilar = document.getElementById('exclude-similar').checked;
            
            // Build character set
            let chars = '';
            if (includeUppercase) chars += charSets.uppercase;
            if (includeLowercase) chars += charSets.lowercase;
            if (includeNumbers) chars += charSets.numbers;
            if (includeSymbols) chars += charSets.symbols;
            
            if (chars === '') {
                alert('Please select at least one character type!');
                return;
            }
            
            // Remove similar characters if requested
            if (excludeSimilar) {
                chars = chars.split('').filter(char => !charSets.similar.includes(char)).join('');
            }
            
            // Generate password
            let password = '';
            for (let i = 0; i < length; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            
            // Ensure at least one character from each selected type
            if (includeUppercase && !/[A-Z]/.test(password)) {
                password = password.slice(0, -1) + charSets.uppercase.charAt(Math.floor(Math.random() * charSets.uppercase.length));
            }
            if (includeLowercase && !/[a-z]/.test(password)) {
                password = password.slice(0, -1) + charSets.lowercase.charAt(Math.floor(Math.random() * charSets.lowercase.length));
            }
            if (includeNumbers && !/[0-9]/.test(password)) {
                password = password.slice(0, -1) + charSets.numbers.charAt(Math.floor(Math.random() * charSets.numbers.length));
            }
            if (includeSymbols && !/[^A-Za-z0-9]/.test(password)) {
                password = password.slice(0, -1) + charSets.symbols.charAt(Math.floor(Math.random() * charSets.symbols.length));
            }
            
            passwordOutput.value = password;
            copyBtn.disabled = false;
            
            // Show strength indicator
            const strength = calculateStrength(password);
            strengthIndicator.className = `strength-indicator ${strength.class}`;
            strengthIndicator.textContent = strength.text;
            strengthIndicator.style.display = 'block';
        }
        
        // Copy to clipboard
        function copyToClipboard() {
            if (passwordOutput.value) {
                navigator.clipboard.writeText(passwordOutput.value).then(() => {
                    copyFeedback.classList.add('show');
                    setTimeout(() => {
                        copyFeedback.classList.remove('show');
                    }, 2000);
                }).catch(() => {
                    alert('Failed to copy password. Please select and copy manually.');
                });
            }
        }
        
        // Event listeners
        lengthSlider.addEventListener('input', updateLengthDisplay);
        generateBtn.addEventListener('click', generatePassword);
        copyBtn.addEventListener('click', copyToClipboard);
        refreshBtn.addEventListener('click', generatePassword);
        
        // Initialize
        updateLengthDisplay();
        generatePassword(); // Generate initial password
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    generatePassword();
                } else if (e.key === 'c' && !copyBtn.disabled) {
                    e.preventDefault();
                    copyToClipboard();
                }
            }
        });
        
        // Back to Tools button functionality
        document.getElementById('back-to-tools-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#utility-tools-section';
        });
