pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const fileInput = document.getElementById('file-input');
        const uploadOverlay = document.getElementById('upload-overlay');
        const chatMessages = document.getElementById('chat-messages');
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');

        let documentText = "";
        let sentences = [];

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            uploadOverlay.style.display = 'none';

            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const text = content.items.map(item => item.str).join(" ");
                    documentText += text + " ";
                }

                sentences = documentText.match(/[^.!?]+[.!?]+/g) || [];
                addMessage("bot", `Indexed ${sentences.length} sentences. I'm ready for your questions!`);
            } catch (err) {
                alert("Error indexing PDF.");
                uploadOverlay.style.display = 'flex';
            }
        };

        sendBtn.onclick = handleSend;
        chatInput.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };

        function handleSend() {
            const query = chatInput.value.trim();
            if (!query) return;

            addMessage("user", query);
            chatInput.value = "";

            setTimeout(() => {
                const answer = findAnswer(query);
                addMessage("bot", answer);
            }, 600);
        }

        function findAnswer(query) {
            const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
            let bestScore = 0;
            let bestSentence = "I couldn't find a specific section matching your question. Could you try rephrasing or asking about a different topic?";

            if (words.length === 0) return "Please ask a more specific question.";

            sentences.forEach(s => {
                const lowerS = s.toLowerCase();
                let score = 0;
                words.forEach(w => { if (lowerS.includes(w)) score++; });

                if (score > bestScore) {
                    bestScore = score;
                    bestSentence = s.trim();
                }
            });

            return bestSentence;
        }

        function addMessage(type, text) {
            const div = document.createElement('div');
            div.className = `message ${type}`;
            div.innerText = text;
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function downloadChat() {
            const transcript = chatMessages.innerText;
            const blob = new Blob([transcript], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "pdfindi_chat_transcript.txt";
            a.click();
        }