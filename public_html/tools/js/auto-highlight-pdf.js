pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const loading = document.getElementById('loading');
        const viewer = document.getElementById('viewer');
        const pagesContainer = document.getElementById('pdf-pages');

        const keywords = ["definition", "important", "key", "remember", "exam", "note", "summary", "essential", "focus"];

        dropZone.onclick = () => fileInput.click();
        fileInput.onchange = (e) => processFile(e.target.files[0]);

        async function processFile(file) {
            if (!file) return;
            dropZone.style.display = 'none';
            loading.style.display = 'block';

            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                
                pagesContainer.innerHTML = "";
                viewer.style.display = "block";

                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    await renderPageWithHighlights(pdf, pageNum);
                }
                
                loading.style.display = 'none';

                // Automatic Download (Trigger Print/Save)
                setTimeout(() => {
                    window.print();
                }, 2000);
            } catch (err) {
                alert("Error rendering PDF.");
                location.reload();
            }
        }

        async function renderPageWithHighlights(pdf, num) {
            const page = await pdf.getPage(num);
            const viewport = page.getViewport({ scale: 1.5 });
            
            const wrapper = document.createElement('div');
            wrapper.className = 'pdf-page-wrapper';
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            wrapper.appendChild(canvas);
            pagesContainer.appendChild(wrapper);

            await page.render({ canvasContext: ctx, viewport: viewport }).promise;

            // Extract text with positions for highlighting
            const textContent = await page.getTextContent();
            const overlay = document.createElement('canvas');
            overlay.className = 'highlight-overlay';
            overlay.width = viewport.width;
            overlay.height = viewport.height;
            const oCtx = overlay.getContext('2d');
            wrapper.appendChild(overlay);

            textContent.items.forEach(item => {
                const text = item.str.toLowerCase();
                const isImportant = keywords.some(k => text.includes(k)) || text.includes(":") || (text.length > 20 && text.match(/[A-Z]{2,}/));

                if (isImportant && text.trim().length > 3) {
                    const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
                    oCtx.fillStyle = "rgba(255, 255, 0, 0.35)";
                    // Approximate text block size
                    oCtx.fillRect(tx[4], tx[5] - item.height, item.width, item.height * 1.2);
                }
            });
        }