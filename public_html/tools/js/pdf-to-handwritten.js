pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        const { jsPDF } = window.jspdf;

        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const textEditor = document.getElementById('text-editor');
        const preview = document.getElementById('handwritten-preview');
        const generateBtn = document.getElementById('generate-pdf');

        let activeFont = 'Dancing Script';

        dropZone.onclick = () => fileInput.click();
        fileInput.onchange = (e) => processFile(e.target.files[0]);

        textEditor.oninput = () => {
            preview.innerText = textEditor.value || "Start typing or upload a PDF to see the handwriting preview here...";
        };

        function setStyle(font, btn) {
            activeFont = font;
            preview.style.fontFamily = `'${font}', cursive`;
            document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }

        async function processFile(file) {
            if (!file) return;
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            let fullText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                fullText += content.items.map(item => item.str).join(" ") + "\n";
            }
            textEditor.value = fullText;
            preview.innerText = fullText;
            document.getElementById('file-status').innerText = `Loaded: ${file.name}`;
        }

        generateBtn.onclick = () => {
            const doc = new jsPDF();
            const text = textEditor.value;
            
            // Set font - jsPDF requires fonts to be registered for specific styles
            // For simplicity, we'll use a very similar standard look if custom fonts aren't embedded
            // But we can try to use the canvas scaling or just a clean cursive font
            
            doc.setFont("courier", "normal"); // Fallback
            doc.setFontSize(14);
            
            const splitText = doc.splitTextToSize(text, 170);
            let y = 20;
            
            splitText.forEach(line => {
                if (y > 280) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(line, 20, y);
                y += 10;
            });

            doc.save("handwritten_document.pdf");
            
            // Automatic Download Trigger
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = doc.output('bloburl');
                link.download = "handwritten_document.pdf";
                link.click();
            }, 1000);
        };