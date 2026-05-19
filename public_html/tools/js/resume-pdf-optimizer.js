pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const loading = document.getElementById('loading');
        const results = document.getElementById('results');
        const checkList = document.getElementById('check-list');
        const statusBadge = document.getElementById('status-badge');

        dropZone.onclick = () => fileInput.click();
        fileInput.onchange = (e) => processFile(e.target.files[0]);

        async function processFile(file) {
            if (!file) return;
            dropZone.style.display = 'none';
            loading.style.display = 'block';

            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                
                let textContent = "";
                let hasComplexLayout = false;
                let textBlocksByPage = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const items = content.items;
                    
                    // Simple complexity check: check for blocks with very similar Y but different X
                    let yCoords = {};
                    items.forEach(item => {
                        const y = Math.round(item.transform[5]);
                        if (!yCoords[y]) yCoords[y] = 0;
                        yCoords[y]++;
                        textContent += item.str + " ";
                    });

                    // If many lines have multiple blocks, it's likely a multi-column layout
                    const multiBlockLines = Object.values(yCoords).filter(count => count > 3).length;
                    if (multiBlockLines > 5) hasComplexLayout = true;
                }

                runAtsCheck(textContent, hasComplexLayout, file.size);
            } catch (err) {
                alert("Error processing PDF.");
                location.reload();
            }
        }

        function runAtsCheck(text, isComplex, fileSize) {
            loading.style.display = 'none';
            results.style.display = 'block';
            checkList.style.display = 'block';

            const checks = [
                {
                    title: "Text Searchability",
                    status: text.trim().length > 100 ? 'pass' : 'fail',
                    passMsg: "Your PDF is text-based and searchable.",
                    failMsg: "Your PDF seems to be an image. ATS cannot read this."
                },
                {
                    title: "Layout Simplicity",
                    status: isComplex ? 'warn' : 'pass',
                    passMsg: "Single-column layout or simple structure detected.",
                    failMsg: "Complex multi-column layout detected. Some older ATS might struggle."
                },
                {
                    title: "File Size Optimization",
                    status: fileSize < 500000 ? 'pass' : 'warn',
                    passMsg: "Optimal file size for quick uploading.",
                    failMsg: "File is a bit large. Consider compressing for faster parsing."
                },
                {
                    title: "Standard Section Headings",
                    status: /Experience|Education|Skills/i.test(text) ? 'pass' : 'warn',
                    passMsg: "Standard ATS-friendly headings found.",
                    failMsg: "Standard headings not detected. Use words like 'Experience' or 'Education'."
                }
            ];

            let passes = checks.filter(c => c.status === 'pass').length;
            if (passes === 4) {
                statusBadge.textContent = "ATS READY";
                statusBadge.className = "status-badge status-ats-ready";
            } else if (passes >= 2) {
                statusBadge.textContent = "OPTIMIZATION RECOMMENDED";
                statusBadge.className = "status-badge status-ats-warning";
            } else {
                statusBadge.textContent = "ATS COMPATIBILITY LOW";
                statusBadge.className = "status-badge status-ats-danger";
            }

            checkList.innerHTML = checks.map(c => `
                <div class="check-item">
                    <div class="check-icon">${c.status === 'pass' ? '✅' : (c.status === 'warn' ? '⚠️' : '❌')}</div>
                    <div class="check-content">
                        <h4>${c.title}</h4>
                        <p>${c.status === 'pass' ? c.passMsg : (c.status === 'warn' ? c.failMsg : c.failMsg)}</p>
                    </div>
                </div>
            `).join('');

            // Automatic Download Trigger
            setTimeout(() => {
                const transcript = checks.map(c => `${c.title}: ${c.status.toUpperCase()}`).join('\n');
                const blob = new Blob([transcript], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = "resume_optimization_report.txt";
                a.click();
            }, 1500);
        }