pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const fileInput = document.getElementById('file-input');
        const loading = document.getElementById('loading');
        const resultArea = document.getElementById('result-area');
        const slidePreview = document.getElementById('slide-preview');
        const dropZone = document.getElementById('drop-zone');

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            dropZone.style.display = 'none';
            loading.style.display = 'block';

            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                
                let pages = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    pages.push(content.items.map(item => item.str).join(" "));
                }

                generateSlides(pages);
            } catch (err) {
                alert("Error generating slides.");
                location.reload();
            }
        };

        function generateSlides(pages) {
            loading.style.display = 'none';
            resultArea.style.display = 'block';
            slidePreview.style.display = 'flex';

            const slides = [];
            pages.forEach(p => {
                const sentences = p.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 40);
                if (sentences.length > 0) {
                    slides.push({
                        title: sentences[0].slice(0, 60) + "...",
                        content: sentences.slice(1, 3).join("\n\n")
                    });
                }
            });

            // Fallback for very sparse documents
            if (slides.length === 0) {
                slides.push({ title: "Document Overview", content: "Main text content extracted professionally." });
            }

            // Preview logic
            slides.slice(0, 6).forEach(s => {
                const div = document.createElement('div');
                div.className = "slide-thumb";
                div.innerText = s.title;
                slidePreview.appendChild(div);
            });

            // Trigger Automatic Download
            setTimeout(() => { downloadPresentation(slides); }, 2000);
            document.getElementById('download-btn').onclick = () => downloadPresentation(slides);
        }

        function downloadPresentation(slides) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            
            slides.forEach((s, i) => {
                if (i > 0) doc.addPage();
                
                // Background
                doc.setFillColor(250, 251, 252);
                doc.rect(0, 0, 297, 210, 'F');

                // Header Bar
                doc.setFillColor(250, 114, 32);
                doc.rect(0, 0, 297, 20, 'F');
                doc.setTextColor(255);
                doc.setFontSize(12);
                doc.text("PDFIndi - AI Presentation Generator", 15, 13);
                
                // Slide Content
                doc.setTextColor(30);
                doc.setFontSize(24);
                const titleSplit = doc.splitTextToSize(s.title, 260);
                doc.text(titleSplit, 20, 50);

                doc.setFontSize(14);
                doc.setTextColor(80);
                const contentSplit = doc.splitTextToSize(s.content, 260);
                doc.text(contentSplit, 20, 90);

                // Footer
                doc.setFontSize(10);
                doc.setTextColor(150);
                doc.text(`Slide ${i + 1} of ${slides.length}`, 270, 200, { align: 'right' });
            });

            doc.save("pdfindi-presentation.pdf");
        }