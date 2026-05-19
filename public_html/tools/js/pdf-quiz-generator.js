pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const loading = document.getElementById('loading');
        const quizContainer = document.getElementById('quiz-container');
        const questionsList = document.getElementById('questions-list');

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

                generateQuiz(fullText);
            } catch (err) {
                alert("Error processing PDF.");
                location.reload();
            }
        }

        function generateQuiz(text) {
            loading.style.display = 'none';
            quizContainer.style.display = 'block';

            // Heuristic Quiz Generation
            // 1. Split into sentences
            const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
            
            // 2. Find sentences that look like definitions (X is a Y, X refers to Y)
            const definitionPatterns = [
                /\b(is|are) defined as\b/i,
                /\brefers to\b/i,
                /\bis a type of\b/i,
                /\b(is|are) the process of\b/i,
                /\b(is|are) known as\b/i
            ];

            let questions = [];

            sentences.forEach(s => {
                if (definitionPatterns.some(p => p.test(s)) && s.split(" ").length > 8) {
                    // Try to extract the term and definition
                    let term = "";
                    let definition = "";

                    if (s.toLowerCase().includes(" is ")) {
                        const parts = s.split(/ is /i);
                        term = parts[0].trim();
                        definition = parts[1].trim();
                    }

                    if (term && definition && questions.length < 5) {
                        questions.push({
                            type: 'mcq',
                            question: `What is the definition of "${term}"?`,
                            answer: definition,
                            distractors: ["A byproduct of the inverse process.", "A non-essential component in this context.", "The opposite of the intended effect."]
                        });
                    }
                }
            });

            // Fallback if no definitions found
            if (questions.length === 0) {
                questions.push({
                    type: 'mcq',
                    question: "Based on the text, what is a primary focus of this document?",
                    answer: "Comprehensive analysis of the subject matter.",
                    distractors: ["Casual conversation.", "External marketing strategy.", "Historical archives only."]
                });
            }

            questionsList.innerHTML = questions.map((q, idx) => `
                <div class="question-card">
                    <div class="question-text">${idx+1}. ${q.question}</div>
                    <div class="options-list">
                        ${[q.answer, ...q.distractors].sort(() => Math.random() - 0.5).map(opt => `
                            <div class="option-item" onclick="checkAnswer(this, '${opt === q.answer}')">${opt}</div>
                        `).join('')}
                    </div>
                </div>
            `).join('');

            // Automatic Download Trigger
            setTimeout(() => {
                const transcript = questions.map((q, i) => `Q${i+1}: ${q.question}\nAnswer: ${q.answer}`).join('\n\n');
                triggerAutoDownload(transcript);
            }, 1500);
        }

        function checkAnswer(el, isCorrect) {
            if (isCorrect === 'true') {
                el.classList.add('correct');
                el.innerText += " ✓";
            } else {
                el.classList.add('wrong');
                el.innerText += " ✗";
            }
            // Disable other options in this card
            el.parentElement.querySelectorAll('.option-item').forEach(opt => opt.style.pointerEvents = 'none');
        }

        // Automatic Download Result Trigger
        function triggerAutoDownload(text) {
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "generated_quiz.txt";
            a.click();
        }