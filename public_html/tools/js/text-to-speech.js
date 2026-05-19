const synth = window.speechSynthesis;
        let voices = [];
        let currentUtterance = null;

        const elements = {
            textInput: document.getElementById('text-input'),
            voiceSelect: document.getElementById('voice-select'),
            rateControl: document.getElementById('rate-control'),
            pitchControl: document.getElementById('pitch-control'),
            volumeControl: document.getElementById('volume-control'),
            rateDisplay: document.getElementById('rate-display'),
            pitchDisplay: document.getElementById('pitch-display'),
            volumeDisplay: document.getElementById('volume-display'),
            speakBtn: document.getElementById('speak-btn'),
            pauseBtn: document.getElementById('pause-btn'),
            resumeBtn: document.getElementById('resume-btn'),
            stopBtn: document.getElementById('stop-btn'),
            speakingIndicator: document.getElementById('speaking-indicator'),
            progressText: document.getElementById('progress-text'),
            voiceInfo: document.getElementById('voice-info'),
            testVoiceBtn: document.getElementById('test-voice-btn'),
            unsupportedMessage: document.getElementById('unsupported-message'),
            ttsInterface: document.getElementById('tts-interface')
        };

        function checkSupport() {
            if (!synth) {
                elements.unsupportedMessage.style.display = 'block';
                elements.ttsInterface.style.display = 'none';
                return false;
            }
            return true;
        }

        function loadVoices() {
            voices = synth.getVoices();
            elements.voiceSelect.innerHTML = '';
            
            if (voices.length === 0) {
                elements.voiceSelect.innerHTML = '<option>No voices available</option>';
                return;
            }

            // Group voices by language
            const grouped = {};
            voices.forEach((voice, index) => {
                const lang = voice.lang.split('-')[0];
                if (!grouped[lang]) grouped[lang] = [];
                grouped[lang].push({ voice, index });
            });

            Object.keys(grouped).sort().forEach(lang => {
                const optgroup = document.createElement('optgroup');
                optgroup.label = lang.toUpperCase();
                
                grouped[lang].forEach(({ voice, index }) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = `${voice.name} (${voice.lang})`;
                    if (voice.default) option.selected = true;
                    optgroup.appendChild(option);
                });
                
                elements.voiceSelect.appendChild(optgroup);
            });

            updateVoiceInfo();
        }

        function updateVoiceInfo() {
            const selectedIndex = elements.voiceSelect.value;
            if (selectedIndex && voices[selectedIndex]) {
                const voice = voices[selectedIndex];
                elements.voiceInfo.innerHTML = `
                    <strong>${voice.name}</strong><br>
                    Language: ${voice.lang}<br>
                    ${voice.localService ? 'Local' : 'Remote'} • ${voice.default ? 'Default' : 'Alternative'}
                `;
            }
        }

        function updateDisplays() {
            elements.rateDisplay.textContent = `${elements.rateControl.value}x`;
            elements.pitchDisplay.textContent = elements.pitchControl.value;
            elements.volumeDisplay.textContent = `${Math.round(elements.volumeControl.value * 100)}%`;
        }

        function speak() {
            const text = elements.textInput.value.trim();
            if (!text) {
                alert('Please enter some text to speak.');
                return;
            }

            if (synth.speaking) {
                synth.cancel();
            }

            currentUtterance = new SpeechSynthesisUtterance(text);
            
            // Set voice
            const selectedIndex = elements.voiceSelect.value;
            if (selectedIndex && voices[selectedIndex]) {
                currentUtterance.voice = voices[selectedIndex];
            }

            // Set properties
            currentUtterance.rate = parseFloat(elements.rateControl.value);
            currentUtterance.pitch = parseFloat(elements.pitchControl.value);
            currentUtterance.volume = parseFloat(elements.volumeControl.value);

            // Event handlers
            currentUtterance.onstart = () => {
                updateButtonStates('speaking');
                elements.speakingIndicator.classList.add('active');
                elements.progressText.textContent = 'Starting...';
            };

            currentUtterance.onend = () => {
                updateButtonStates('idle');
                elements.speakingIndicator.classList.remove('active');
            };

            currentUtterance.onerror = (event) => {
                console.error('Speech error:', event);
                updateButtonStates('idle');
                elements.speakingIndicator.classList.remove('active');
                alert('Speech synthesis error occurred.');
            };

            currentUtterance.onpause = () => {
                updateButtonStates('paused');
            };

            currentUtterance.onresume = () => {
                updateButtonStates('speaking');
            };

            synth.speak(currentUtterance);
        }

        function pause() {
            if (synth.speaking && !synth.paused) {
                synth.pause();
            }
        }

        function resume() {
            if (synth.paused) {
                synth.resume();
            }
        }

        function stop() {
            if (synth.speaking) {
                synth.cancel();
            }
        }

        function testVoice() {
            const tempText = elements.textInput.value;
            elements.textInput.value = 'Hello! This is a test of the selected voice. How does it sound?';
            speak();
            setTimeout(() => {
                elements.textInput.value = tempText;
            }, 1000);
        }

        function updateButtonStates(state) {
            elements.speakBtn.disabled = state === 'speaking';
            elements.pauseBtn.disabled = state !== 'speaking';
            elements.resumeBtn.disabled = state !== 'paused';
            elements.stopBtn.disabled = state === 'idle';
        }

        // Event listeners
        elements.speakBtn.addEventListener('click', speak);
        elements.pauseBtn.addEventListener('click', pause);
        elements.resumeBtn.addEventListener('click', resume);
        elements.stopBtn.addEventListener('click', stop);
        elements.testVoiceBtn.addEventListener('click', testVoice);
        elements.voiceSelect.addEventListener('change', updateVoiceInfo);

        [elements.rateControl, elements.pitchControl, elements.volumeControl].forEach(control => {
            control.addEventListener('input', updateDisplays);
        });

        // Initialize
        if (checkSupport()) {
            // Load voices when they become available
            if (voices.length === 0) {
                synth.addEventListener('voiceschanged', loadVoices);
            }
            loadVoices();
            updateDisplays();
            updateButtonStates('idle');
        }
        
        // Back to Tools button functionality
        document.getElementById('back-to-tools-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#utility-tools-section';
        });
