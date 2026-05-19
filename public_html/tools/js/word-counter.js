// Word Counter functionality
        const textInput = document.getElementById('text-input');
        const wordCount = document.getElementById('word-count');
        const charCount = document.getElementById('char-count');
        const charNoSpaces = document.getElementById('char-no-spaces');
        const sentenceCount = document.getElementById('sentence-count');
        const paragraphCount = document.getElementById('paragraph-count');
        const readingTime = document.getElementById('reading-time');
        
        // Previous values for change indicators
        let previousStats = {
            words: 0,
            chars: 0,
            charsNoSpaces: 0,
            sentences: 0,
            paragraphs: 0,
            readingTime: 0
        };
        
        // Sample text for demonstration
        const sampleText = `The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the English alphabet at least once.

Writing is a skill that improves with practice. Whether you're crafting an essay, composing an email, or creating content for your website, understanding your text's structure and complexity is crucial.

This word counter tool provides comprehensive analysis including word count, character count, sentence structure, and reading time estimation. It's perfect for students, writers, content creators, and anyone who wants to improve their writing.

Remember: Good writing is clear, concise, and engaging. Use this tool to analyze your text and identify areas for improvement.`;
        
        function updateStats() {
            const text = textInput.value;
            
            // Calculate current stats
            const currentStats = {
                words: text.trim() ? text.trim().split(/\s+/).length : 0,
                chars: text.length,
                charsNoSpaces: text.replace(/\s/g, '').length,
                sentences: text.match(/[^.!?]+[.!?\n]+/g) || [],
                paragraphs: text.split(/\n\s*\n/).filter(p => p.trim().length > 0),
                readingTime: 0
            };
            
            currentStats.sentences = currentStats.sentences.length;
            currentStats.paragraphs = currentStats.paragraphs.length || (text.trim() ? 1 : 0);
            currentStats.readingTime = Math.ceil(currentStats.words / 200); // Average 200 words per minute
            
            // Update display
            wordCount.textContent = currentStats.words;
            charCount.textContent = currentStats.chars;
            charNoSpaces.textContent = currentStats.charsNoSpaces;
            sentenceCount.textContent = currentStats.sentences;
            paragraphCount.textContent = currentStats.paragraphs;
            readingTime.textContent = currentStats.readingTime;
            
            // Update change indicators
            updateChangeIndicator('word-change', currentStats.words, previousStats.words);
            updateChangeIndicator('char-change', currentStats.chars, previousStats.chars);
            updateChangeIndicator('char-no-spaces-change', currentStats.charsNoSpaces, previousStats.charsNoSpaces);
            updateChangeIndicator('sentence-change', currentStats.sentences, previousStats.sentences);
            updateChangeIndicator('paragraph-change', currentStats.paragraphs, previousStats.paragraphs);
            updateChangeIndicator('reading-time-change', currentStats.readingTime, previousStats.readingTime);
            
            // Update analysis
            updateAnalysis(currentStats);
            
            // Update word frequency
            updateWordFrequency(text);
            
            // Store current stats as previous
            previousStats = { ...currentStats };
        }
        
        function updateChangeIndicator(elementId, current, previous) {
            const element = document.getElementById(elementId);
            if (current > previous) {
                element.textContent = `+${current - previous}`;
                element.style.color = '#28a745';
            } else if (current < previous) {
                element.textContent = `${current - previous}`;
                element.style.color = '#dc3545';
            } else {
                element.textContent = '';
            }
        }
        
        function updateAnalysis(stats) {
            // Text Complexity
            let complexity = 'Simple';
            if (stats.words > 1000) complexity = 'Complex';
            else if (stats.words > 500) complexity = 'Moderate';
            document.getElementById('complexity-text').textContent = `${complexity} text (${stats.words} words)`;
            
            // Writing Style
            let style = 'Balanced';
            if (stats.sentences > 0 && stats.words / stats.sentences > 25) style = 'Long sentences';
            else if (stats.sentences > 0 && stats.words / stats.sentences < 10) style = 'Short sentences';
            document.getElementById('style-text').textContent = `${style} (avg: ${stats.sentences > 0 ? Math.round(stats.words / stats.sentences) : 0} words/sentence)`;
            
            // Recommendations
            let recommendations = 'Good text structure';
            if (stats.paragraphs === 1 && stats.words > 200) recommendations = 'Consider breaking into paragraphs';
            if (stats.sentences > 0 && stats.words / stats.sentences > 30) recommendations = 'Try shorter sentences for clarity';
            document.getElementById('recommendations-text').textContent = recommendations;
            
            // Key Insights
            let insights = 'Text is well-balanced';
            if (stats.words < 50) insights = 'Very short text - consider adding more content';
            else if (stats.words > 2000) insights = 'Long text - consider breaking into sections';
            document.getElementById('insights-text').textContent = insights;
        }
        
        function updateWordFrequency(text) {
            if (!text.trim()) {
                document.getElementById('word-frequency-section').style.display = 'none';
                return;
            }
            
            // Count word frequency
            const words = text.toLowerCase().match(/\b\w+\b/g) || [];
            const frequency = {};
            
            words.forEach(word => {
                if (word.length > 2) { // Only count words longer than 2 characters
                    frequency[word] = (frequency[word] || 0) + 1;
                }
            });
            
            // Sort by frequency and get top 10
            const sortedWords = Object.entries(frequency)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10);
            
            if (sortedWords.length > 0) {
                const frequencyList = document.getElementById('frequency-list');
                frequencyList.innerHTML = sortedWords.map(([word, count]) => `
                    <div class="frequency-item">
                        <span class="frequency-word">${word}</span>
                        <span class="frequency-count">${count}</span>

                `).join('');
                document.getElementById('word-frequency-section').style.display = 'block';
            } else {
                document.getElementById('word-frequency-section').style.display = 'none';
            }
        }
        
        function clearText() {
            textInput.value = '';
            updateStats();
        }
        
        function loadSampleText() {
            textInput.value = sampleText;
            updateStats();
        }
        
        function copyText() {
            if (textInput.value) {
                navigator.clipboard.writeText(textInput.value).then(() => {
                    alert('Text copied to clipboard!');
                }).catch(() => {
                    alert('Failed to copy text. Please select and copy manually.');
                });
            }
        }
        
        function exportStats() {
            const text = textInput.value;
            if (!text.trim()) {
                alert('Please enter some text first.');
                return;
            }
            
            const stats = {
                text: text,
                wordCount: wordCount.textContent,
                charCount: charCount.textContent,
                charNoSpaces: charNoSpaces.textContent,
                sentenceCount: sentenceCount.textContent,
                paragraphCount: paragraphCount.textContent,
                readingTime: readingTime.textContent,
                timestamp: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(stats, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `word-count-analysis-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        
        // Event listeners
        textInput.addEventListener('input', updateStats);
        
        // Initialize
        updateStats();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    loadSampleText();
                } else if (e.key === 'Delete') {
                    e.preventDefault();
                    clearText();
                }
            }
        });
        
        // Back to Tools button functionality
        document.getElementById('back-to-tools-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#utility-tools-section';
        });
