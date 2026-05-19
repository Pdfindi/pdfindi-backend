pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-input');
        const loading = document.getElementById('loading');
        const scoreSection = document.getElementById('score-section');
        const resultsGrid = document.getElementById('results-grid');
        const finalScore = document.getElementById('final-score');
        const scoreFeedback = document.getElementById('score-feedback');

        dropZone.onclick = () => fileInput.click();

        dropZone.ondragover = (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        };

        dropZone.ondragleave = () => dropZone.classList.remove('drag-over');

        dropZone.ondrop = (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type === 'application/pdf') {
                processFile(file);
            }
        };

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) processFile(file);
        };

        async function processFile(file) {
            dropZone.style.display = 'none';
            loading.style.display = 'block';

            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                let fullText = "";

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const strings = content.items.map(item => item.str);
                    fullText += strings.join(" ") + "\n";
                }

                analyzeResume(fullText);
            } catch (error) {
                console.error(error);
                alert("Error reading PDF. Please ensure it is a valid text-based PDF.");
                resetAnalyzer();
            }
        }

        function analyzeResume(text) {
            loading.style.display = 'none';
            scoreSection.style.display = 'block';
            resultsGrid.style.display = 'grid';

            const analysis = {
                score: 0,
                results: [],
                sections: {
                    contact: /email|phone|address|linkedin|@/i.test(text),
                    summary: /summary|profile|objective|about me/i.test(text),
                    experience: /experience|employment|work history|professional background/i.test(text),
                    education: /education|academic|university|degree|college/i.test(text),
                    skills: /skills|technologies|expertise|competencies/i.test(text)
                }
            };

            // Scoring Logic
            let points = 20; // Starting point for having a file
            
            if (analysis.sections.contact) { analysis.score += 20; points += 20; }
            if (analysis.sections.experience) { analysis.score += 20; points += 20; }
            if (analysis.sections.education) { analysis.score += 20; points += 20; }
            if (analysis.sections.skills) { analysis.score += 20; points += 20; }

            // Bonus for length
            if (text.length > 500) { analysis.score += 10; points += 10; }
            if (analysis.score > 100) analysis.score = 100;

            finalScore.textContent = Math.min(analysis.score, 100);
            
            if (analysis.score >= 85) scoreFeedback.textContent = "Excellent Professional Resume!";
            else if (analysis.score >= 60) scoreFeedback.textContent = "Good Start, but needs improvement.";
            else scoreFeedback.textContent = "Your Resume needs significant work.";

            // UI Population
            resultsGrid.innerHTML = "";

            const items = [
                { 
                    title: "Contact Information", 
                    passed: analysis.sections.contact, 
                    desc: analysis.sections.contact ? "We found your contact details easily." : "Warning: No email or phone number detected." 
                },
                { 
                    title: "Work Experience", 
                    passed: analysis.sections.experience, 
                    desc: analysis.sections.experience ? "Professional history is clearly defined." : "Missing: Explicit 'Experience' section heading." 
                },
                { 
                    title: "Education History", 
                    passed: analysis.sections.education, 
                    desc: analysis.sections.education ? "Academic background is present." : "Missing: No 'Education' section found." 
                },
                { 
                    title: "Skills Section", 
                    passed: analysis.sections.skills, 
                    desc: analysis.sections.skills ? "Key skills are listed." : "Recommendation: Add a dedicated skills section for ATS." 
                },
                { 
                    title: "Content Density", 
                    passed: text.length > 800, 
                    desc: text.length > 800 ? "Resume has a good amount of detailed content." : "Warning: Your resume seems a bit short. Add more details." 
                }
            ];
            items.forEach(item => {
                const div = document.createElement('div');
                div.className = `result-item ${item.passed ? 'passing' : 'failing'}`;
                div.innerHTML = `
                    <h4>${item.passed ? '✅' : '🔴'} ${item.title}</h4>
                    <p>${item.desc}</p>
                `;
                resultsGrid.appendChild(div);
            });

            // Automatic Download Trigger
            setTimeout(() => {
                const transcript = `Resume Score: ${analysis.score}\nFeedback: ${scoreFeedback.textContent}\n\n` + 
                    items.map(i => `${i.title}: ${i.passed ? 'PASS' : 'FAIL'} - ${i.desc}`).join('\n');
                const blob = new Blob([transcript], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = "resume_analysis_report.txt";
                a.click();
            }, 1500);
        }

        function resetAnalyzer() {
            dropZone.style.display = 'block';
            scoreSection.style.display = 'none';
            loading.style.display = 'none';
            fileInput.value = "";
        }