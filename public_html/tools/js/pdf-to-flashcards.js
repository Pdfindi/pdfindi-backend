pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const loading = document.getElementById('loading');
        const stage = document.getElementById('stage');
        const nav = document.getElementById('nav');
        const cardFront = document.getElementById('card-front');
        const cardBack = document.getElementById('card-back');
        const indicator = document.getElementById('card-indicator');

        let cards = [];
        let currentIndex = 0;

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

                extractCards(fullText);
            } catch (err) {
                alert("Error processing PDF.");
                location.reload();
            }
        }

        function extractCards(text) {
            loading.style.display = 'none';
            stage.style.display = 'block';
            nav.style.display = 'flex';

            // Split into sentences
            const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
            
            sentences.forEach(s => {
                if (s.includes(" means ") || s.includes(" is defined as ") || s.includes(":")) {
                    let parts = s.split(/ means | is defined as |:/i);
                    if (parts.length >= 2 && parts[0].trim().split(" ").length < 5) {
                        cards.push({ 
                            front: parts[0].trim(), 
                            back: parts[1].trim()
                        });
                    }
                }
            });

            if (cards.length === 0) {
                cards.push({ front: "Sample Concept", back: "This is a placeholder since no definitions were found." });
            }

            renderCard();

            // Automatic Download Trigger (Flashcard list)
            setTimeout(() => {
                const transcript = cards.map((c, i) => `Card ${i+1}\nFront: ${c.front}\nBack: ${c.back}`).join('\n\n');
                const blob = new Blob([transcript], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = "pdfindi_flashcards.txt";
                a.click();
            }, 2000);
        }

        function renderCard() {
            document.getElementById('card').classList.remove('is-flipped');
            cardFront.innerText = cards[currentIndex].front;
            cardBack.innerText = cards[currentIndex].back;
            indicator.innerText = `${currentIndex + 1} of ${cards.length}`;
        }

        function nextCard() {
            currentIndex = (currentIndex + 1) % cards.length;
            renderCard();
        }

        function prevCard() {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            renderCard();
        }