// --- CLEAN PDFINDI ARCHITECTURE ---
// Simple configuration for clean, separate tool pages

const config = {
    // Backend API URL for the 3 tools that need it
    backendUrl: 'https://pdfindi-backend.onrender.com', // Your live Render backend
    
    // Simple tool list for rendering the homepage
    tools: [
        // 🔵 PREMIUM PDF TOOLS
        { id: "merge-pdf", title: "Merge PDF", category: "PDF Tools", description: "Combine multiple PDF files into one.", icon: "📂", link: "tools/merge-pdf.html", popular: true },
        { id: "split-pdf", title: "Split PDF", category: "PDF Tools", description: "Extract a range of pages from a PDF.", icon: "✂️", link: "tools/split-pdf.html" },
        { id: "jpeg-to-pdf", title: "JPEG to PDF", category: "PDF Tools", description: "Combine JPG/PNG images into a PDF.", icon: "🖼️", link: "tools/jpeg-to-pdf.html" },
        { id: "organize-pdf", title: "Reorder PDF Pages", category: "PDF Tools", description: "Rearrange, delete, or duplicate PDF pages.", icon: "📑", link: "tools/organize-pdf.html" },
        { id: "rotate-pdf", title: "Rotate PDF", category: "PDF Tools", description: "Rotate all pages in 90° increments.", icon: "🔄", link: "tools/rotate-pdf.html" },
        { id: "watermark-pdf", title: "Add Watermark", category: "PDF Tools", description: "Stamp text or an image on a PDF.", icon: "💧", link: "tools/add-watermark.html" },
        { id: "protect-pdf", title: "Protect PDF", category: "PDF Tools", description: "Add a password to secure a PDF.", icon: "🔒", link: "tools/protect-pdf.html" },
        { id: "unlock-pdf", title: "Unlock PDF", category: "PDF Tools", description: "Remove a password from a PDF.", icon: "🔓", link: "tools/unlock-pdf.html" },
        { id: "compress-pdf", title: "Compress PDF", category: "PDF Tools", description: "Reduce the file size of your PDF.", icon: "🗜️", link: "tools/compress-pdf.html", popular: true },
        { id: "pdf-to-word", title: "PDF to Word", category: "PDF Tools", description: "Convert PDF to editable Word docs.", icon: "📄", link: "tools/pdf-to-word.html" },
        { id: "word-to-pdf", title: "Word to PDF", category: "PDF Tools", description: "Convert Word docs to PDF.", icon: "📝", link: "tools/word-to-pdf.html" },
        { id: "pdf-to-jpg", title: "PDF to JPG", category: "PDF Tools", description: "Convert each PDF page to a JPG.", icon: "📷", link: "tools/pdf-to-jpg.html" },
        { id: "edit-pdf", title: "Edit PDF", category: "PDF Tools", description: "Add text or images to a PDF.", icon: "✏️", link: "tools/edit-pdf.html", beta: true },
        { id: "pdf-to-ppt", title: "PDF to PowerPoint", category: "PDF Tools", description: "Convert PDFs to PowerPoint.", icon: "📊", disabled: true },
        { id: "ppt-to-pdf", title: "PowerPoint to PDF", category: "PDF Tools", description: "Convert PowerPoint to PDF.", icon: "📉", disabled: true },
        { id: "pdf-to-excel", title: "PDF to Excel", category: "PDF Tools", description: "Extract data from PDFs to Excel.", icon: "📈", disabled: true },
        { id: "excel-to-pdf", title: "Excel to PDF", category: "PDF Tools", description: "Convert Excel sheets to PDF.", icon: "📋", disabled: true },

        // 🤖 AI-BASED PDF TOOLS
        { id: "ai-pdf-summarizer", title: "AI PDF Summarizer", category: "AI-based PDF Tools", description: "Get instant AI summaries of long PDFs.", icon: "📝", link: "tools/pdf-summarizer.html", popular: true },
        { id: "chat-with-pdf", title: "Chat with PDF", category: "AI-based PDF Tools", description: "Upload a PDF and ask questions to AI.", icon: "💬", link: "tools/chat-with-pdf.html", popular: true },
        { id: "pdf-to-notes", title: "PDF to Notes", category: "AI-based PDF Tools", description: "Extract key points automatically.", icon: "📌", link: "tools/pdf-to-study-notes.html" },
        { id: "pdf-to-presentation", title: "PDF to Presentation", category: "AI-based PDF Tools", description: "Auto-generate slides from PDF.", icon: "📽️", link: "tools/pdf-to-presentation.html" },
        { id: "pdf-to-podcast", title: "PDF to Podcast", category: "AI-based PDF Tools", description: "Turn documents into engaging audio.", icon: "🎧", link: "tools/pdf-to-podcast.html" },

        // 🎓 STUDENT-FOCUSED TOOLS
        { id: "pdf-to-handwritten", title: "PDF to Handwritten", category: "Student Tools", description: "Convert PDF text into realistic handwritten notes.", icon: "✍️", link: "tools/pdf-to-handwritten.html" },
        { id: "pdf-quiz-generator", title: "PDF Quiz Generator", category: "Student Tools", description: "Generate instant quizzes & MCQs from your PDF.", icon: "❓", link: "tools/pdf-quiz-generator.html" },
        { id: "extract-questions", title: "Extract Questions", category: "Student Tools", description: "Pull all questions from a PDF for quick revision.", icon: "📝", link: "tools/extract-questions.html" },
        { id: "pdf-to-flashcards", title: "PDF to Flashcards", category: "Student Tools", description: "Convert your notes into interactive flashcards.", icon: "🗂️", link: "tools/pdf-to-flashcards.html" },
        { id: "auto-highlight-pdf", title: "Auto-Highlight PDF", category: "Student Tools", description: "AI highlights important lines for quick exam prep.", icon: "🖍️", link: "tools/auto-highlight-pdf.html" },

        // 💼 RESUME & JOB TOOLS
        { id: "resume-pdf-optimizer", title: "Resume PDF Optimizer", category: "Resume & Job", description: "Make your resume PDF fully ATS-friendly.", icon: "📄", link: "tools/resume-pdf-optimizer.html" },
        { id: "pdf-resume-analyzer", title: "PDF Resume Analyzer", category: "Resume & Job", description: "Get a resume score & AI suggestions instantly.", icon: "📊", link: "tools/pdf-resume-analyzer.html" },
        { id: "portfolio-pdf-creator", title: "Portfolio PDF Creator", category: "Resume & Job", description: "Build stunning PDF portfolios from your work.", icon: "💼", link: "tools/portfolio-pdf-creator.html" },

        // 🛠️ UTILITY TOOLS
        { id: "image-compressor", title: "Image Compressor", category: "Utility Tools", description: "Compress JPG/PNG images.", icon: "📸", link: "tools/image-compressor.html" },
        { id: "image-converter", title: "Image Converter", category: "Utility Tools", description: "Convert images to JPG, PNG, WEBP.", icon: "♻️", link: "tools/image-converter.html" },
        { id: "qr-code-generator", title: "QR Code Generator", category: "Utility Tools", description: "Generate & download a QR code.", icon: "📱", link: "tools/qr-code-generator.html" },
        { id: "password-generator", title: "Password Generator", category: "Utility Tools", description: "Create strong, secure passwords.", icon: "🔑", link: "tools/password-generator.html" },
        { id: "word-counter", title: "Word Counter", category: "Utility Tools", description: "Count words, chars, sentences.", icon: "🧮", link: "tools/word-counter.html" },
        { id: "text-to-speech", title: "Text to Speech", category: "Utility Tools", description: "Convert text to natural speech.", icon: "🗣️", link: "tools/text-to-speech.html" },
        { id: "json-formatter", title: "JSON Formatter", category: "Utility Tools", description: "Format, validate, & copy JSON.", icon: "{} ", link: "tools/json-formatter.html" },
        { id: "case-converter", title: "Case Converter", category: "Utility Tools", description: "Convert text to various cases.", icon: "Aa", link: "tools/case-converter.html" },
        { id: "lorem-ipsum-generator", title: "Lorem Ipsum Generator", category: "Utility Tools", description: "Generate placeholder text.", icon: "📜", link: "tools/lorem-ipsum-generator.html" },
        { id: "base64-encoderdecoder", title: "Base64 Encoder/Decoder", category: "Utility Tools", description: "Encode/decode Base64 text.", icon: "🔗", link: "tools/base64-encoderdecoder.html" },
        { id: "age-calculator", title: "Age Calculator", category: "Utility Tools", description: "Calculate your age from birth date.", icon: "🎂", link: "tools/age-calculator.html" },
        { id: "bmi-calculator", title: "BMI Calculator", category: "Utility Tools", description: "Calculate your Body Mass Index.", icon: "⚖️", link: "tools/bmi-calculator.html" },
        { id: "speech-to-text", title: "Speech to Text", category: "Utility Tools", description: "Dictate text using your mic.", icon: "🎤", link: "tools/speech-to-text.html" },
        { id: "color-picker", title: "Color Picker", category: "Utility Tools", description: "Pick colors from screen or image.", icon: "🎨", link: "tools/color-picker.html" },
        { id: "unit-converter", title: "Unit Converter", category: "Utility Tools", description: "Convert length, weight, etc.", icon: "📏", link: "tools/unit-converter.html" },
        { id: "image-ocr", title: "Image OCR", category: "Utility Tools", description: "Extract text from images using OCR.", icon: "👁️", link: "tools/image-ocr.html" }
    ]
};

// --- SEARCH FUNCTIONALITY ---
function filterTools() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    
    const searchTerm = input.value.toLowerCase();
    const toolCards = document.querySelectorAll('.bento-card'); // Updated to .bento-card
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    
    toolCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const category = card.dataset.category || ''; // Use dataset.category
        
        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        
        // Match filter based on category string
        const matchesFilter = activeFilter === 'all' || 
                             (activeFilter === 'pdf' && category === 'PDF Tools') ||
                             (activeFilter === 'ai' && category === 'AI-based PDF Tools') ||
                             (activeFilter === 'student' && category === 'Student Tools') ||
                             (activeFilter === 'job' && category === 'Resume & Job') ||
                             (activeFilter === 'utility' && category === 'Utility Tools');
        
        if (matchesSearch && matchesFilter) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function updateSectionVisibility() {
    const sections = document.querySelectorAll('.tools-section');
    sections.forEach(section => {
        const visibleCards = section.querySelectorAll('.tool-card:not([style*="display: none"])');
        if (visibleCards.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
    // Note: This function might need adjustment if the entire homepage is a bento grid
    // and traditional sections are no longer used.
}

// --- SIMPLE HOMEPAGE RENDERING ---
function createToolCards() {
    // Helper function to populate a grid
    const populateGrid = (gridElement, toolsArray) => {
        gridElement.innerHTML = toolsArray.map(tool => {
            const disabledClass = tool.disabled ? 'disabled' : '';
            const popularBadge = tool.popular ? '<span style="position:absolute;top:10px;right:-35px;background:#fa7220;color:white;padding:3px 40px;font-size:0.6rem;font-weight:900;transform:rotate(45deg);box-shadow:0 2px 4px rgba(0,0,0,0.1);">POPULAR</span>' : '';
            return `
                <div class="tool-card ${disabledClass}" data-title="${tool.title}" data-id="${tool.id}">
                    ${popularBadge}
                    <div class="card-icon">${tool.icon}</div>
                    <h3>${tool.title}${tool.beta ? ' <span class="beta-badge-small">BETA</span>' : ''}</h3>
                    <p>${tool.description}</p>
                    ${tool.disabled ? '<span class="coming-soon">Coming Soon</span>' : ''}
                </div>
            `;
        }).join('');
    };

    // Handle Bento Grid specifically if it exists
    const bentoGrid = document.getElementById('main-tools-bento');
    if (bentoGrid) {
        bentoGrid.innerHTML = ''; // Clear hardcoded tools to render ALL symmetrically
        
        config.tools.forEach(tool => {
            const card = document.createElement('div');
            card.className = `bento-card ${tool.disabled ? 'disabled' : ''}`;
            card.dataset.id = tool.id;
            card.dataset.category = tool.category;
            
            card.onclick = () => {
                if (tool.disabled) {
                    showNotification(`${tool.title} is coming soon!`, 'info');
                    return;
                }
                if (tool.link) {
                    window.location.href = tool.link;
                }
            };

            const popularBadge = tool.popular ? '<span class="popular-badge">POPULAR</span>' : '';
            const betaBadge = tool.beta ? '<span class="beta-badge-small">BETA</span>' : '';

            card.innerHTML = `
                ${popularBadge}
                <div class="icon-placeholder">${tool.icon}</div>
                <div>
                    <h3>${tool.title} ${betaBadge}</h3>
                    <p>${tool.description}</p>
                </div>
                ${tool.disabled ? '<span class="coming-soon-tag">Coming Soon</span>' : ''}
            `;
            bentoGrid.appendChild(card);
        });
    }

    // Standard grids for other pages or fallbacks (if they still exist)
    const pdfGrid = document.getElementById('pdf-tools-grid');
    const utilityGrid = document.getElementById('utility-tools-grid');

    // Only render legacy grids if they exist on the page
    if (pdfGrid) {
        const pdfTools = config.tools.filter(tool => tool.category === 'PDF Tools');
        pdfGrid.innerHTML = pdfTools.map(tool => {
            const disabledClass = tool.disabled ? 'disabled' : '';
            const popularBadge = tool.popular ? '<span style="position:absolute;top:10px;right:-35px;background:#fa7220;color:white;padding:3px 40px;font-size:0.6rem;font-weight:900;transform:rotate(45deg);box-shadow:0 2px 4px rgba(0,0,0,0.1);">POPULAR</span>' : '';
            return `
                <div class="tool-card ${disabledClass}" data-title="${tool.title}">
                    ${popularBadge}
                    <div class="card-icon">${tool.icon}</div>
                    <h3>${tool.title}${tool.beta ? ' <span class="beta-badge-small">BETA</span>' : ''}</h3>
                    <p>${tool.description}</p>
                    ${tool.disabled ? '<span class="coming-soon">Coming Soon</span>' : ''}
                </div>
            `;
        }).join('');
    }

    if (utilityGrid) {
        const utilityTools = config.tools.filter(tool => tool.category === 'Utility Tools');
        utilityGrid.innerHTML = utilityTools.map(tool => {
            const disabledClass = tool.disabled ? 'disabled' : '';
            const popularBadge = tool.popular ? '<span style="position:absolute;top:10px;right:-35px;background:#fa7220;color:white;padding:3px 40px;font-size:0.6rem;font-weight:900;transform:rotate(45deg);box-shadow:0 2px 4px rgba(0,0,0,0.1);">POPULAR</span>' : '';
            return `
                <div class="tool-card ${disabledClass}" data-title="${tool.title}">
                    ${popularBadge}
                    <div class="card-icon">${tool.icon}</div>
                    <h3>${tool.title}</h3>
                    <p>${tool.description}</p>
                    ${tool.disabled ? '<span class="coming-soon">Coming Soon</span>' : ''}
                </div>
            `;
        }).join('');
    }

    // Handlers are now part of the dynamic creation in createToolCards
}

// --- UTILITY FUNCTIONS FOR TOOL PAGES ---
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

// --- LOADING STATES ---
function showLoading(element, text = 'Processing...') {
    element.disabled = true;
    element.textContent = text;
}

function hideLoading(element, originalText) {
    element.disabled = false;
    element.textContent = originalText;
}

// --- BACKEND API FUNCTIONS (for use in individual tool pages) ---

// Real PDF to Word Conversion using Cloudmersive API
async function convertPDFToWord(file) {
    const formData = new FormData();
    formData.append('file', file); // Backend expects 'file' field name
    
    try {
        const response = await fetch(`${config.backendUrl}/api/pdf-to-word`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Conversion failed');
        }
        
        // Get the JSON response with base64 data
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Conversion failed');
        }
        
        // Convert base64 to blob and download
        const byteCharacters = atob(result.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { 
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename || file.name.replace('.pdf', '.docx');
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        return { success: true, message: result.message || 'PDF successfully converted to Word!' };
        
    } catch (error) {
        console.error('PDF to Word conversion error:', error);
        throw error;
    }
}

// Real Word to PDF Conversion using Cloudmersive API
async function convertWordToPDF(file) {
    const formData = new FormData();
    formData.append('file', file); // Backend expects 'file' field name
    
    try {
        const response = await fetch(`${config.backendUrl}/api/word-to-pdf`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Conversion failed');
        }
        
        // Get the JSON response with base64 data
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Conversion failed');
        }
        
        // Convert base64 to blob and download
        const byteCharacters = atob(result.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Robust filename logic: Ensure .pdf extension
        let downloadName = result.filename || file.name.replace(/\.(docx?|doc|rtf|odt)$/i, '.pdf');
        if (!downloadName.toLowerCase().endsWith('.pdf')) {
            downloadName += '.pdf';
        }
        
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        return { success: true, message: result.message || 'Word document successfully converted to PDF!' };
        
    } catch (error) {
        console.error('Word to PDF conversion error:', error);
        throw error;
    }
}

// Real PDF Compression using Cloudmersive API
async function compressPDF(file) {
    const formData = new FormData();
    formData.append('file', file); // Backend expects 'file' field name
    
    try {
        const response = await fetch(`${config.backendUrl}/api/compress-pdf`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            let errorMessage = `Compression API error: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                // If parsing JSON fails, use the status-based message
            }
            throw new Error(errorMessage);
        }
        
        // Get the JSON response with base64 data
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Compression failed');
        }
        
        // Convert base64 to blob and download
        const byteCharacters = atob(result.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename || file.name.replace('.pdf', '_compressed.pdf');
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        return { 
            success: true, 
            message: result.message || `PDF compressed successfully! (${result.compressionRatio} reduction)`
        };
        
    } catch (error) {
        console.error('PDF compression error:', error);
        throw error;
    }
}

// Real PDF to JPG Conversion using Cloudmersive API
async function convertPDFToJPG(file) {
    const formData = new FormData();
    formData.append('file', file); // Backend expects 'file' field name
    
    try {
        const response = await fetch(`${config.backendUrl}/api/pdf-to-jpg`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Conversion failed');
        }
        
        // Get the JSON response with base64 data
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Conversion failed');
        }
        
        // Convert base64 to blob and download
        const byteCharacters = atob(result.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename || file.name.replace(/\.pdf$/i, '.png');
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        return { success: true, message: result.message || 'PDF successfully converted to image!' };
        
    } catch (error) {
        console.error('PDF to JPG conversion error:', error);
        throw error;
    }
}

// OCR Text Extraction from Image using Cloudmersive API
async function extractTextFromImage(file) {
    const formData = new FormData();
    formData.append('file', file); // Backend expects 'file' field name
    
    try {
        const response = await fetch(`${config.backendUrl}/api/ocr-text`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'OCR extraction failed');
        }
        
        // Get the JSON response with extracted text
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'OCR extraction failed');
        }
        
        return { 
            success: true, 
            extractedText: result.extractedText,
            confidence: result.confidence,
            message: result.message || 'Text successfully extracted from image!'
        };
        
    } catch (error) {
        console.error('OCR text extraction error:', error);
        throw error;
    }
}

// --- SIMPLE INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function() {
    // Only run tool card creation on homepage (when grids exist)
    if (document.getElementById('pdf-tools-grid') || document.getElementById('main-tools-bento')) {
        createToolCards();
    }
    
    // Add navigation and other UI handlers for homepage
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburgerBtn = document.getElementById('hamburger-button');
    const exploreToolsBtn = document.getElementById('explore-tools-btn');
    
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const pageId = link.getAttribute('data-page');
                e.preventDefault();
                
                // Update active class for nav links
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                if (pageId === 'pdf-tools-section') {
                    // Scroll to PDF tools section with smooth animation
                    const targetSection = document.getElementById('pdf-tools-section');
                    if (targetSection) {
                        // Add highlight effect
                        targetSection.classList.add('section-highlight');
                        setTimeout(() => targetSection.classList.remove('section-highlight'), 2000);
                        
                        // Smooth scroll to section with offset for better positioning
                        const headerOffset = 80; // Account for header height
                        const elementPosition = targetSection.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Ensure home page is active
                        document.getElementById('home-page').classList.add('active');
                        document.querySelectorAll('.page').forEach(page => {
                            if (page.id !== 'home-page') page.classList.remove('active');
                        });
                    }
                } else if (pageId === 'utility-tools-section') {
                    // Scroll to Utility tools section with smooth animation
                    const targetSection = document.getElementById('utility-tools-section');
                    if (targetSection) {
                        // Add highlight effect
                        targetSection.classList.add('section-highlight');
                        setTimeout(() => targetSection.classList.remove('section-highlight'), 2000);
                        
                        // Smooth scroll to section with offset for better positioning
                        const headerOffset = 80; // Account for header height
                        const elementPosition = targetSection.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Ensure home page is active
                        document.getElementById('home-page').classList.add('active');
                        document.querySelectorAll('.page').forEach(page => {
                            if (page.id !== 'home-page') page.classList.remove('active');
                        });
                    }
                } else if (pageId === 'home-page') {
                    // Scroll to top of home page
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    document.getElementById('home-page').classList.add('active');
                    document.querySelectorAll('.page').forEach(page => {
                        if (page.id !== 'home-page') page.classList.remove('active');
                    });
                } else if (pageId === 'blog-page') {
                    // Show blog page and scroll to top
                    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
                    const blogPage = document.getElementById('blog-page');
                    blogPage.classList.add('active');
                    
                    // Add highlight effect to the blog page
                    blogPage.classList.add('section-highlight');
                    setTimeout(() => blogPage.classList.remove('section-highlight'), 2000);
                    
                    // Immediately reset scroll position and then smooth scroll to top
                    window.scrollTo(0, 0);
                    setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                } else if (pageId === 'contact-page') {
                    // Show contact page and scroll to top
                    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
                    const contactPage = document.getElementById('contact-page');
                    contactPage.classList.add('active');
                    
                    // Add highlight effect to the contact page
                    contactPage.classList.add('section-highlight');
                    setTimeout(() => contactPage.classList.remove('section-highlight'), 2000);
                    
                    // Immediately reset scroll position and then smooth scroll to top
                    window.scrollTo(0, 0);
                    setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                }
            });
        });
    }
    
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.toggle('open');
                hamburgerBtn.setAttribute('aria-expanded', 
                    sidebar.classList.contains('open') ? 'true' : 'false'
                );
            }
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('open')) {
                if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                    sidebar.classList.remove('open');
                    hamburgerBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }
    
    if (exploreToolsBtn) {
        exploreToolsBtn.addEventListener('click', () => {
            const targetSection = document.getElementById('pdf-tools-section');
            if (targetSection) {
                // Add highlight effect
                targetSection.classList.add('section-highlight');
                setTimeout(() => targetSection.classList.remove('section-highlight'), 2000);
                
                // Smooth scroll to section with offset for better positioning
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Add scroll spy functionality to highlight active section
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateActiveNavigation();
        }, 100);
    });
    
    // Function to update active navigation based on scroll position
    function updateActiveNavigation() {
        const scrollPosition = window.scrollY + 100; // Offset for better detection
        
        // Check if we're on a different page first
        const blogPage = document.getElementById('blog-page');
        const contactPage = document.getElementById('contact-page');
        
        if (blogPage && blogPage.classList.contains('active')) {
            // We're on the blog page, keep blog navigation active
            navLinks.forEach(link => {
                const pageId = link.getAttribute('data-page');
                if (pageId === 'blog-page') {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            return;
        }
        
        if (contactPage && contactPage.classList.contains('active')) {
            // We're on the contact page, keep contact navigation active
            navLinks.forEach(link => {
                const pageId = link.getAttribute('data-page');
                if (pageId === 'contact-page') {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            return;
        }
        
        // We're on the home page, check sections
        const homePage = document.getElementById('home-page');
        const pdfToolsSection = document.getElementById('pdf-tools-section');
        const utilityToolsSection = document.getElementById('utility-tools-section');
        
        // Find which section is currently in view
        let activeSection = 'home-page';
        
        if (pdfToolsSection && scrollPosition >= pdfToolsSection.offsetTop) {
            activeSection = 'pdf-tools-section';
        }
        if (utilityToolsSection && scrollPosition >= utilityToolsSection.offsetTop) {
            activeSection = 'utility-tools-section';
        }
        
        // Update navigation active state
        navLinks.forEach(link => {
            const pageId = link.getAttribute('data-page');
            if (pageId === activeSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Back to top button functionality
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Category filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Apply filter
            const filter = btn.dataset.filter;
            const pdfSection = document.getElementById('pdf-tools-section');
            const utilitySection = document.getElementById('utility-tools-section');
            
            // Note: Since we use filterTools() below, we don't strictly need to hide sections here
            // but we keep it for visual consistency if sections are still used.
            if (filter === 'all' || filter === 'ai' || filter === 'student' || filter === 'job') {
                if (pdfSection) pdfSection.style.display = 'block';
                if (utilitySection) utilitySection.style.display = 'block';
            } else if (filter === 'pdf') {
                if (pdfSection) pdfSection.style.display = 'block';
                if (utilitySection) utilitySection.style.display = 'none';
            } else if (filter === 'utility') {
                if (pdfSection) pdfSection.style.display = 'none';
                if (utilitySection) utilitySection.style.display = 'block';
            }
            
            // ALWAYS reapply filters (search + category)
            filterTools();
            
            // Smooth scroll to tools if not searching
            const searchInput = document.getElementById('searchInput');
            if (!searchInput || !searchInput.value) {
                const toolsSection = document.getElementById('tools-section');
                if (toolsSection) {
                    setTimeout(() => {
                        const offset = 100;
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = toolsSection.getBoundingClientRect().top;
                        const elementPosition = elementRect - bodyRect;
                        const offsetPosition = elementPosition - offset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            }
        });
    });
    
    console.log('PDFINDI - Clean architecture loaded');
});

// PDF to Image conversion function
async function convertPDFToImage(file, format = 'png') {
    console.log(` PDF to Image conversion started - Format: ${format}`);
    
    if (!file) {
        throw new Error('No file provided for conversion');
    }

    if (file.type !== 'application/pdf') {
        throw new Error('File must be a PDF document');
    }

    try {
        const formData = new FormData();
        formData.append('file', file);

        console.log(` Sending PDF to Image request: ${file.name} (${file.size} bytes) -> ${format.toUpperCase()}`);

        const response = await fetch(`https://pdfindi-backend.onrender.com/api/pdf-to-jpg`, {
            method: 'POST',
            body: formData
        });

        console.log(` PDF to Image response status: ${response.status}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const result = await response.json();
        console.log(' PDF to Image conversion successful:', result);

        // Check if backend returned pages array (new format)
        if (result.pages && Array.isArray(result.pages)) {
            console.log(`📄 Processing ${result.pages.length} page(s)`);
            
            // Download each page
            for (const page of result.pages) {
                const byteCharacters = atob(page.base64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'image/png' });
                
                // Create download link
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${result.filename}_page_${page.pageNumber}.png`;
                document.body.appendChild(a);
                a.click();
                
                // Cleanup
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }, 100);
                
                console.log(`✅ Downloaded page ${page.pageNumber}`);
                
                // Small delay between downloads
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            return {
                success: true,
                message: `Successfully downloaded ${result.pages.length} page(s)`,
                pages: result.pages.length
            };
        }

        // Check if the response contains Cloudmersive URLs (old format - fallback)
        if (result.base64) {
            try {
                // Decode the base64 to see if it contains URLs
                const decodedData = atob(result.base64);
                const parsedData = JSON.parse(decodedData);
                
                if (parsedData.PngResultPages && Array.isArray(parsedData.PngResultPages)) {
                    console.log(`📄 Found ${parsedData.PngResultPages.length} pages with URLs`);
                    console.log('🔗 URLs:', parsedData.PngResultPages.map(p => p.URL));
                    
                    // Download each page
                    for (let i = 0; i < parsedData.PngResultPages.length; i++) {
                        const page = parsedData.PngResultPages[i];
                        console.log(`📥 Downloading page ${page.PageNumber}:`, page.URL);
                        
                        try {
                            // Try to fetch the image through CORS
                            const proxyResponse = await fetch(page.URL, {
                                mode: 'cors',
                                credentials: 'omit'
                            });
                            
                            console.log(`📡 Response status for page ${page.PageNumber}:`, proxyResponse.status);
                            
                            if (proxyResponse.ok) {
                                const imageBlob = await proxyResponse.blob();
                                console.log(`📄 Blob size for page ${page.PageNumber}:`, imageBlob.size, 'bytes');
                                
                                // Create download link for this page
                                const url = window.URL.createObjectURL(imageBlob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${file.name.replace(/\.pdf$/i, '')}_page_${page.PageNumber}.png`;
                                a.style.display = 'none';
                                document.body.appendChild(a);
                                
                                console.log(`📥 Initiating download: ${a.download}`);
                                
                                // Force the download
                                a.click();
                                
                                // Clean up
                                setTimeout(() => {
                                    window.URL.revokeObjectURL(url);
                                    document.body.removeChild(a);
                                }, 1000);
                                
                                console.log(`✅ Download completed for page ${page.PageNumber}`);
                                
                                // Small delay between downloads
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            } else {
                                console.error(`❌ Failed to download page ${page.PageNumber}:`, proxyResponse.status, proxyResponse.statusText);
                                
                                // Try direct link as fallback
                                console.log(`🔗 Opening direct link for page ${page.PageNumber}`);
                                window.open(page.URL, '_blank');
                            }
                        } catch (pageError) {
                            console.error(`❌ Error downloading page ${page.PageNumber}:`, pageError);
                            
                            // Fallback: open the URL in a new tab
                            console.log(`🔗 Opening fallback link for page ${page.PageNumber}`);
                            window.open(page.URL, '_blank');
                        }
                    }
                    
                    return {
                        success: true,
                        message: `Successfully processed ${parsedData.PngResultPages.length} pages. Check your Downloads folder or allow pop-ups if needed.`,
                        pages: parsedData.PngResultPages.length
                    };
                }
            } catch (e) {
                console.log('📄 Not URL format, trying direct base64...');
            }
        }

        return result;

    } catch (error) {
        console.error(' PDF to Image conversion error:', error);
        throw error;
    }
}

// Make PDF to Image function globally available
window.convertPDFToImage = convertPDFToImage;

// --- HASH NAVIGATION HANDLING ---
// Handle hash navigation when coming from tool pages
function handleHashNavigation() {
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            // Small delay to ensure page is fully loaded
            setTimeout(() => {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start', 
                    inline: 'nearest' 
                });
                
                // Add highlight effect
                targetSection.classList.add('section-highlight');
                setTimeout(() => {
                    targetSection.classList.remove('section-highlight');
                }, 2000);
            }, 100);
        }
    }
}

// Listen for hash changes
window.addEventListener('hashchange', handleHashNavigation);

// Handle initial hash on page load
document.addEventListener('DOMContentLoaded', handleHashNavigation);

document.addEventListener('DOMContentLoaded', function() {
    // Render tool cards on the homepage
    createToolCards();
    
    // Enhanced search input focus effect
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.style.borderColor = '#fa7220';
            this.style.boxShadow = '0 4px 20px rgba(229, 62, 62, 0.15)';
        });
        searchInput.addEventListener('blur', function() {
            this.style.borderColor = '#e2e8f0';
            this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
        });
    }
    
        // Filter button interactions
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all buttons
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.style.background = 'white';
                b.style.color = '#333';
                b.style.borderColor = '#e0e0e0';
            });
            
            // Add active to clicked button
            this.classList.add('active');
            this.style.background = '#FF9933';
            this.style.color = 'white';
            this.style.borderColor = '#FF9933';
            
            // Trigger filter
            filterTools();
        });
    });

    // Check URL for filter parameter on load
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
        setTimeout(() => {
            const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
            if (targetBtn) {
                targetBtn.click();
            }
        }, 100);
    }
});

// ============================================
// HERO TYPING ANIMATION - USP Phrases
// ============================================
(function() {
    const phrases = ['Simplified.', '100% Free.', 'Made in India. ', 'Fast & Secure.', 'No Sign-up.'];
    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
        const el = document.getElementById('heroTyped');
        if (!el) return;

        const currentPhrase = phrases[currentIndex];

        if (!isDeleting) {
            el.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentPhrase.length) {
                // Pause at end, then start deleting
                setTimeout(() => { isDeleting = true; requestAnimationFrame(tick); }, 2200);
                return;
            }
        } else {
            el.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                currentIndex = (currentIndex + 1) % phrases.length;
            }
        }

        typingSpeed = isDeleting ? 45 : 80;
        setTimeout(typeEffect, typingSpeed);
    }

    function tick() { typeEffect(); }

    // Start after a short delay
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(typeEffect, 600);
    });
    // If DOM already loaded
    if (document.readyState !== 'loading') {
        setTimeout(typeEffect, 600);
    }
})();


