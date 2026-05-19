const loremWords = [
            'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
            'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
            'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
            'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
            'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
            'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
            'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
            'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
            'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
            'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
            'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'explicabo', 'nemo',
            'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit', 'fugit'
        ];

        const elements = {
            typeButtons: document.querySelectorAll('.type-btn'),
            count: document.getElementById('count'),
            countLabel: document.getElementById('count-label'),
            startWithLorem: document.getElementById('start-with-lorem'),
            sentenceLength: document.getElementById('sentence-length'),
            format: document.getElementById('format'),
            generateBtn: document.getElementById('generate-btn'),
            copyBtn: document.getElementById('copy-btn'),
            clearBtn: document.getElementById('clear-btn'),
            output: document.getElementById('lorem-output'),
            wordCount: document.getElementById('word-count'),
            charCount: document.getElementById('char-count'),
            readingTime: document.getElementById('reading-time')
        };

        let currentType = 'paragraphs';

        function randomWord() {
            return loremWords[Math.floor(Math.random() * loremWords.length)];
        }

        function generateSentence(length = 'medium') {
            const lengths = {
                short: [4, 8],
                medium: [8, 15],
                long: [15, 25],
                mixed: [4, 25]
            };
            
            const [min, max] = lengths[length];
            const wordCount = Math.floor(Math.random() * (max - min + 1)) + min;
            const words = [];
            
            for (let i = 0; i < wordCount; i++) {
                words.push(randomWord());
            }
            
            return words.join(' ').charAt(0).toUpperCase() + words.join(' ').slice(1) + '.';
        }

        function generateParagraph(sentenceCount = null, sentenceLength = 'medium') {
            const count = sentenceCount || Math.floor(Math.random() * 4) + 3;
            const sentences = [];
            
            for (let i = 0; i < count; i++) {
                sentences.push(generateSentence(sentenceLength));
            }
            
            return sentences.join(' ');
        }

        function generateWords(count) {
            const words = [];
            for (let i = 0; i < count; i++) {
                words.push(randomWord());
            }
            return words.join(' ');
        }

        function generateSentences(count, length) {
            const sentences = [];
            for (let i = 0; i < count; i++) {
                sentences.push(generateSentence(length));
            }
            return sentences.join(' ');
        }

        function generateList(count) {
            const items = [];
            for (let i = 0; i < count; i++) {
                items.push('• ' + generateSentence('short').slice(0, -1));
            }
            return items.join('\n');
        }

        function generateLorem() {
            const count = parseInt(elements.count.value);
            const startWithLorem = elements.startWithLorem.value === 'true';
            const sentenceLength = elements.sentenceLength.value;
            const format = elements.format.value;
            
            let text = '';
            
            switch (currentType) {
                case 'paragraphs':
                    const paragraphs = [];
                    for (let i = 0; i < count; i++) {
                        let paragraph = generateParagraph(null, sentenceLength);
                        if (i === 0 && startWithLorem) {
                            paragraph = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + paragraph;
                        }
                        paragraphs.push(paragraph);
                    }
                    text = format === 'html' 
                        ? paragraphs.map(p => `<p>${p}</p>`).join('\n\n')
                        : paragraphs.join('\n\n');
                    break;
                    
                case 'words':
                    text = generateWords(count);
                    if (startWithLorem) {
                        text = 'Lorem ipsum dolor sit amet ' + text;
                    }
                    break;
                    
                case 'sentences':
                    text = generateSentences(count, sentenceLength);
                    if (startWithLorem) {
                        text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + text;
                    }
                    break;
                    
                case 'lists':
                    text = generateList(count);
                    if (format === 'html') {
                        const items = text.split('\n').map(item => `<li>${item.slice(2)}</li>`);
                        text = `<ul>\n${items.join('\n')}\n</ul>`;
                    }
                    break;
            }
            
            elements.output.textContent = text;
            updateStats(text);
        }

        function updateStats(text) {
            const plainText = text.replace(/<[^>]*>/g, '');
            const words = plainText.trim().split(/\s+/).length;
            const chars = plainText.length;
            const readingTime = Math.ceil(words / 200);
            
            elements.wordCount.textContent = words;
            elements.charCount.textContent = chars;
            elements.readingTime.textContent = `${readingTime} min`;
        }

        function copyToClipboard() {
            navigator.clipboard.writeText(elements.output.textContent).then(() => {
                const originalText = elements.copyBtn.textContent;
                elements.copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    elements.copyBtn.textContent = originalText;
                }, 2000);
            });
        }

        function clearOutput() {
            elements.output.textContent = 'Click "Generate Lorem Ipsum" to create placeholder text...';
            updateStats('');
        }

        // Event listeners
        elements.typeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                elements.typeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentType = btn.dataset.type;
                elements.countLabel.textContent = currentType;
                
                // Adjust max count based on type
                const maxCounts = { paragraphs: 50, words: 1000, sentences: 100, lists: 50 };
                elements.count.max = maxCounts[currentType];
                
                if (parseInt(elements.count.value) > maxCounts[currentType]) {
                    elements.count.value = maxCounts[currentType];
                }
            });
        });

        elements.generateBtn.addEventListener('click', generateLorem);
        elements.copyBtn.addEventListener('click', copyToClipboard);
        elements.clearBtn.addEventListener('click', clearOutput);

        // Auto-generate on changes
        [elements.count, elements.startWithLorem, elements.sentenceLength, elements.format].forEach(element => {
            element.addEventListener('change', () => {
                if (elements.output.textContent !== 'Click "Generate Lorem Ipsum" to create placeholder text...') {
                    generateLorem();
                }
            });
        });

        // Generate initial content
        generateLorem();
        
        // Back to Tools button functionality
        document.getElementById('back-to-tools-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#utility-tools-section';
        });
