pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const loading = document.getElementById('loading');
        const results = document.getElementById('results');
        const questionsList = document.getElementById('questions-list');
        const countLabel = document.getElementById('count-label');
        const copyBtn = document.getElementById('copy-btn');

        dropZone.onclick = () => fileInput.click();
        fileInput.onchange = (e) => processFile(e.target.files[0]);

        async function processFile(file) {
            if (!file) return;
            dropZone.style.display = 'none';
            loading.style.display = 'block';

            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                let fullText = "";

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    fullText += content.items.map(item => item.str).join(" ") + " ";
                }

                extractQuestions(fullText);
            } catch (err) {
                alert("Error reading PDF.");
                location.reload();
            }
        }

        function extractQuestions(text) {
            loading.style.display = 'none';
            results.style.display = 'block';

            // Advanced Regex for Questions
            // 1. Lines starting with Q1, Que 1, 1. (followed by space and text)
            // 2. Sentences ending with ?
            // 3. Sentences starting with "What", "How", "Why", "Define", "Explain"
            
            const lines = text.split(/(?<=[.!?])\s+(?=[A-Z0-9])/);
            let questions = [];

            const questionCheck = /^(Q\d+[:.]?|Que \d+[:.]?|\d+[:.)])|(\?)$|^(What|How|Why|Define|Explain|Describe|List|Name|Calculate|State|Discuss)/i;

            lines.forEach(line => {
                const trimmed = line.trim();
                if (questionCheck.test(trimmed) && trimmed.length > 20) {
                    questions.push(trimmed);
                }
            });

            // Fallback
            if (questions.length === 0) {
                questions.push("No explicit questions detected. Try a standard exam paper format.");
            }

            countLabel.innerText = `Found ${questions.length} Questions`;
            questionsList.innerHTML = questions.map((q, idx) => `
                <div class="question-item">
                    <span class="q-num">${idx+1}</span>
                    <span>${q}</span>

            `).join('');

            copyBtn.onclick = () => {
                const allText = questions.join("\n\n");
                navigator.clipboard.writeText(allText).then(() => {
                    copyBtn.innerText = "Copied! ✅";
                    setTimeout(() => copyBtn.innerText = "Copy All Questions", 2000);
                });
            };

            // Automatic Download Trigger
            const allTxt = questions.join("\n\n");
            const blob = new Blob([allTxt], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "extracted_questions.txt";
            a.click();
        }