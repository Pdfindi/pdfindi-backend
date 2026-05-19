pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const fileInput = document.getElementById('file-input');
        const loading = document.getElementById('loading');
        const resultArea = document.getElementById('result-area');
        const scriptContent = document.getElementById('script-content');
        const dropZone = document.getElementById('drop-zone');

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            dropZone.style.display = 'none';
            loading.style.display = 'block';

            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                
                let text = "";
                for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    text += content.items.map(item => item.str).join(" ") + " ";
                }

                generatePodcastScript(text);
            } catch (err) {
                alert("Error creating script.");
                location.reload();
            }
        };

        function generatePodcastScript(text) {
            loading.style.display = 'none';
            resultArea.style.display = 'block';
            scriptContent.style.display = 'block';

            const facts = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 60).slice(0, 10);
            const script = [];
            
            script.push({ speaker: "Alex", text: "Welcome back to the PDFIndi Insight series. Today we're diving into a very interesting document." });
            script.push({ speaker: "Jordan", text: "Definitely. There is a lot to unpack here. Let's start with the big picture." });

            facts.forEach((f, i) => {
                const speaker = i % 2 === 0 ? "Alex" : "Jordan";
                const transition = i % 3 === 0 ? "That's a great point. Also, " : "I found this part fascinating: ";
                script.push({ speaker: speaker, text: transition + f });
            });

            script.push({ speaker: "Alex", text: "That just about wraps up our dive into this document. Thanks for listening!" });

            let html = "";
            script.forEach(s => {
                html += `<div class="script-line"><span class="speaker">${s.speaker}</span><p class="dialogue">${s.text}</p></div>`;
            });
            scriptContent.innerHTML = html;

            const fullTextForPDF = script.map(s => `${s.speaker}: ${s.text}`).join('\n\n');

            // Trigger Automatic Download
            setTimeout(() => { downloadScript(fullTextForPDF); }, 2000);
            document.getElementById('download-btn').onclick = () => downloadScript(fullTextForPDF);
        }

        function downloadScript(text) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFontSize(22);
            doc.setTextColor(250, 114, 32);
            doc.text("AI Podcast Script", 20, 20);
            
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text("Drafted by PDFIndi AI", 20, 30);
            
            doc.setFontSize(11);
            doc.setTextColor(50);
            const lines = doc.splitTextToSize(text, 170);
            doc.text(lines, 20, 45);
            
            doc.save("pdfindi-podcast-script.pdf");
        }