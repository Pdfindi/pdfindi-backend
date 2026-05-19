let recognition = null;
        let isRecording = false;
        let finalTranscript = '';
        let interimTranscript = '';
        let startTime = null;
        let timeInterval = null;
        let confidenceScores = [];

        const elements = {
            unsupportedMessage: document.getElementById('unsupported-message'),
            permissionMessage: document.getElementById('permission-message'),
            speechInterface: document.getElementById('speech-interface'),
            micButton: document.getElementById('mic-button'),
            micStatus: document.getElementById('mic-status'),
            transcriptArea: document.getElementById('transcript-area'),
            languageSelect: document.getElementById('language-select'),
            continuousMode: document.getElementById('continuous-mode'),
            interimResults: document.getElementById('interim-results'),
            clearBtn: document.getElementById('clear-btn'),
            copyBtn: document.getElementById('copy-btn'),
            downloadBtn: document.getElementById('download-btn'),
            wordCount: document.getElementById('word-count'),
            charCount: document.getElementById('char-count'),
            recordingTime: document.getElementById('recording-time'),
            confidenceScore: document.getElementById('confidence-score')
        };

        function checkSupport() {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                elements.unsupportedMessage.style.display = 'block';
                elements.speechInterface.style.display = 'none';
                console.error('Speech Recognition not supported. Browser:', navigator.userAgent);
                return false;
            }
            
            // Check if running on localhost or HTTPS
            const isSecureContext = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
            if (!isSecureContext) {
                console.warn('Speech Recognition works best on HTTPS or localhost. Current protocol:', location.protocol);
            }
            
            return true;
        }

        // Test if Google's speech API is reachable
        async function testGoogleConnection() {
            try {
                console.log('Testing connection to Google servers...');
                const response = await fetch('https://www.google.com/favicon-pi.svg', { 
                    mode: 'no-cors',
                    cache: 'no-cache'
                });
                console.log('✅Google connection test passed');
                return true;
            } catch (error) {
                console.error('â�Œ Cannot reach Google servers:', error);
                return false;
            }
        }

        function initSpeechRecognition() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();

            recognition.continuous = elements.continuousMode.checked;
            recognition.interimResults = elements.interimResults.checked;
            recognition.lang = elements.languageSelect.value;
            
            // Add longer timeout for network issues
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                console.log('✅Speech recognition started successfully');
                isRecording = true;
                startTime = Date.now();
                updateUI('listening');
                startTimer();
            };

            recognition.onresult = (event) => {
                interimTranscript = '';
                confidenceScores = [];

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        finalTranscript += result[0].transcript + ' ';
                        confidenceScores.push(result[0].confidence);
                    } else {
                        interimTranscript += result[0].transcript;
                    }
                }

                updateTranscript();
                updateStats();
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                let errorMessage = '';
                let shouldRetry = false;
                
                switch(event.error) {
                    case 'not-allowed':
                    case 'permission-denied':
                        elements.permissionMessage.style.display = 'block';
                        errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings.';
                        break;
                    case 'no-speech':
                        errorMessage = 'No speech detected. Please try speaking again.';
                        shouldRetry = true;
                        break;
                    case 'audio-capture':
                        errorMessage = 'No microphone found. Please connect a microphone and refresh the page.';
                        break;
                    case 'network':
                        errorMessage = 'âš ï¸ Network error. The speech recognition service requires internet. Click microphone to retry.';
                        console.error('Network error - possible causes:', {
                            'Internet Connection': navigator.onLine ? 'Connected' : 'Disconnected',
                            'Protocol': location.protocol,
                            'Hostname': location.hostname,
                            'Possible Fix': 'Try: 1) Check internet, 2) Use Chrome/Edge, 3) Reload page, 4) Check firewall settings'
                        });
                        // Don't auto-retry network errors as it might be persistent
                        break;
                    case 'aborted':
                        errorMessage = 'Speech recognition stopped.';
                        break;
                    case 'service-not-allowed':
                        errorMessage = 'Speech recognition service blocked. Ensure you\'re on HTTPS or localhost.';
                        break;
                    default:
                        errorMessage = `Speech recognition error: ${event.error}`;
                }
                
                console.error('Error details:', errorMessage);
                elements.micStatus.textContent = errorMessage;
                updateUI('error');
                
                // Auto-retry for no-speech errors
                if (shouldRetry && isRecording) {
                    console.log('Auto-retrying after no-speech error...');
                    setTimeout(() => {
                        try {
                            recognition.start();
                        } catch (e) {
                            console.error('Retry failed:', e);
                        }
                    }, 1000);
                }
            };

            recognition.onend = () => {
                isRecording = false;
                updateUI('ready');
                stopTimer();
                
                // Reinitialize recognition object to prevent stuck states
                console.log('Recognition ended. Reinitializing...');
                recognition = null;
            };
        }

        function updateUI(status) {
            const button = elements.micButton;
            const statusEl = elements.micStatus;

            button.classList.remove('listening');
            statusEl.className = 'mic-status';

            switch (status) {
                case 'listening':
                    button.classList.add('listening');
                    button.textContent = 'â¹ï¸';
                    statusEl.textContent = 'Listening... Click to stop';
                    statusEl.classList.add('status-listening');
                    break;
                case 'processing':
                    button.textContent = 'â³';
                    statusEl.textContent = 'Processing...';
                    statusEl.classList.add('status-processing');
                    break;
                case 'error':
                    button.textContent = 'â�Œ';
                    statusEl.textContent = 'Error occurred. Click to retry';
                    statusEl.classList.add('status-error');
                    break;
                default: // ready
                    button.textContent = '🎯¤';
                    statusEl.textContent = 'Click microphone to start';
                    statusEl.classList.add('status-ready');
            }
        }

        function updateTranscript() {
            const fullText = finalTranscript + (elements.interimResults.checked ? interimTranscript : '');
            
            if (elements.interimResults.checked && interimTranscript) {
                elements.transcriptArea.innerHTML = 
                    `<span class="final-text">${finalTranscript}</span><span class="interim-text">${interimTranscript}</span>`;
            } else {
                elements.transcriptArea.textContent = fullText || 'Your speech will appear here...';
            }

            if (fullText.trim()) {
                elements.transcriptArea.classList.add('has-content');
            }
        }

        function updateStats() {
            const text = (finalTranscript + interimTranscript).trim();
            const words = text ? text.split(/\s+/).length : 0;
            const chars = text.length;

            elements.wordCount.textContent = words;
            elements.charCount.textContent = chars;

            // Calculate average confidence
            if (confidenceScores.length > 0) {
                const avgConfidence = confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length;
                elements.confidenceScore.textContent = Math.round(avgConfidence * 100) + '%';
            }
        }

        function startTimer() {
            timeInterval = setInterval(() => {
                if (startTime) {
                    const elapsed = Math.floor((Date.now() - startTime) / 1000);
                    const minutes = Math.floor(elapsed / 60);
                    const seconds = elapsed % 60;
                    elements.recordingTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                }
            }, 1000);
        }

        function stopTimer() {
            if (timeInterval) {
                clearInterval(timeInterval);
                timeInterval = null;
            }
        }

        async function toggleRecording() {
            if (!recognition) {
                initSpeechRecognition();
            }

            if (isRecording) {
                recognition.stop();
            } else {
                // Check internet connectivity first
                if (!navigator.onLine) {
                    elements.micStatus.textContent = 'â�Œ No internet connection. Please check your network.';
                    updateUI('error');
                    console.error('No internet connection detected');
                    return;
                }
                
                // Test Google connection before starting
                elements.micStatus.textContent = 'ðŸ” Testing connection to speech service...';
                const canReachGoogle = await testGoogleConnection();
                
                if (!canReachGoogle) {
                    elements.micStatus.textContent = 'â�Œ Cannot reach Google\'s speech service. Check firewall/VPN settings.';
                    updateUI('error');
                    console.error('Google speech API is not reachable from your network');
                    
                    // Show detailed troubleshooting
                    alert('🚫 Speech Recognition Service Unavailable\n\n' +
                          'The speech recognition feature requires connection to Google\'s servers, but the connection is blocked.\n\n' +
                          'Common causes:\n' +
                          '• Firewall blocking Google services\n' +
                          '• VPN interfering with connections\n' +
                          '• Corporate/school network restrictions\n' +
                          '• Antivirus blocking network requests\n\n' +
                          'Solutions:\n' +
                          '1. Temporarily disable VPN if active\n' +
                          '2. Check firewall settings (allow google.com)\n' +
                          '3. Try from a different network (mobile hotspot)\n' +
                          '4. Contact your network administrator\n' +
                          '5. Try in production (HTTPS) environment');
                    return;
                }
                
                // Update settings
                recognition.continuous = elements.continuousMode.checked;
                recognition.interimResults = elements.interimResults.checked;
                recognition.lang = elements.languageSelect.value;
                
                try {
                    console.log('Attempting to start speech recognition...');
                    console.log('Settings:', {
                        continuous: recognition.continuous,
                        interimResults: recognition.interimResults,
                        lang: recognition.lang
                    });
                    
                    // Set a timeout to detect immediate network failures
                    const startTimeout = setTimeout(() => {
                        console.warn('âš ï¸ Speech recognition taking too long to start - possible network issue');
                        elements.micStatus.textContent = 'â³ Connecting to speech service...';
                    }, 2000);
                    
                    recognition.onstart = (function(originalOnStart) {
                        return function() {
                            clearTimeout(startTimeout);
                            originalOnStart.call(this);
                        };
                    })(recognition.onstart);
                    
                    recognition.start();
                } catch (error) {
                    console.error('Failed to start recognition:', error);
                    elements.micStatus.textContent = `â�Œ Error: ${error.message}`;
                    updateUI('error');
                }
            }
        }

        function clearTranscript() {
            finalTranscript = '';
            interimTranscript = '';
            confidenceScores = [];
            elements.transcriptArea.textContent = 'Your speech will appear here...';
            elements.transcriptArea.classList.remove('has-content');
            updateStats();
            elements.recordingTime.textContent = '0:00';
            elements.confidenceScore.textContent = '-';
        }

        function copyTranscript() {
            const text = finalTranscript.trim();
            if (!text) {
                alert('No text to copy!');
                return;
            }

            navigator.clipboard.writeText(text).then(() => {
                const originalText = elements.copyBtn.textContent;
                elements.copyBtn.textContent = '✅Copied!';
                setTimeout(() => {
                    elements.copyBtn.textContent = originalText;
                }, 2000);
            }).catch(() => {
                alert('Failed to copy text to clipboard.');
            });
        }

        function downloadTranscript() {
            const text = finalTranscript.trim();
            if (!text) {
                alert('No text to download!');
                return;
            }

            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'speech-transcript.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // Event listeners
        elements.micButton.addEventListener('click', toggleRecording);
        elements.clearBtn.addEventListener('click', clearTranscript);
        elements.copyBtn.addEventListener('click', copyTranscript);
        elements.downloadBtn.addEventListener('click', downloadTranscript);

        elements.languageSelect.addEventListener('change', () => {
            if (recognition) {
                recognition.lang = elements.languageSelect.value;
            }
        });

        elements.continuousMode.addEventListener('change', () => {
            if (recognition) {
                recognition.continuous = elements.continuousMode.checked;
            }
        });

        elements.interimResults.addEventListener('change', () => {
            if (recognition) {
                recognition.interimResults = elements.interimResults.checked;
            }
        });

        // Initialize
        console.log('Speech to Text Tool Initializing...');
        console.log('Browser:', navigator.userAgent);
        console.log('Protocol:', location.protocol);
        console.log('Hostname:', location.hostname);
        console.log('Secure Context:', window.isSecureContext);
        console.log('SpeechRecognition available:', 'SpeechRecognition' in window);
        console.log('webkitSpeechRecognition available:', 'webkitSpeechRecognition' in window);
        
        if (checkSupport()) {
            console.log('✅Speech Recognition supported!');
            updateUI('ready');
            updateStats();
        } else {
            console.error('â�Œ Speech Recognition not supported');
        }
        
        // Back to Tools button functionality
        document.getElementById('back-to-tools-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#utility-tools-section';
        });
