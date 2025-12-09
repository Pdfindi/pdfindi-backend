// --- CLEAN PDFINDI ARCHITECTURE ---
// Simple configuration for clean, separate tool pages

const config = {
    // Backend API URL for the 3 tools that need it
    backendUrl: 'https://pdfindi-backend.onrender.com', // Your live Render backend
    
    // Simple tool list for rendering the homepage
    tools: [
        // 🔵 CLIENT-SIDE PDF TOOLS (Browser-based processing - No server needed)
        // These tools work entirely in the browser using libraries like PDF-lib
        { title: "Merge PDF", category: "PDF Tools", description: "Combine multiple PDF files into one.", icon: "🔗" },
        { title: "Split PDF", category: "PDF Tools", description: "Extract a range of pages from a PDF.", icon: "✂️" },
        { title: "JPEG to PDF", category: "PDF Tools", description: "Combine JPG/PNG images into a PDF.", icon: "🖼️" },
        { title: "Reorder PDF Pages", category: "PDF Tools", description: "Rearrange, delete, or duplicate PDF pages.", icon: "🗂️" },
        { title: "Rotate PDF", category: "PDF Tools", description: "Rotate all pages in 90° increments.", icon: "🔄" },
        { title: "Add Watermark", category: "PDF Tools", description: "Stamp text or an image on a PDF.", icon: "💧" },
        { title: "Protect PDF", category: "PDF Tools", description: "Add a password to secure a PDF.", icon: "🔒" },
        { title: "Unlock PDF", category: "PDF Tools", description: "Remove a password from a PDF.", icon: "🔓" },

        // 🟡 BACKEND PDF TOOLS (Render Server + Cloudmersive API)
        // These require server-side processing for complex operations
        { title: "Compress PDF", category: "PDF Tools", description: "Reduce the file size of your PDF.", icon: "🗜️", backend: true },
        { title: "PDF to Word", category: "PDF Tools", description: "Convert PDF to editable Word docs.", icon: "📄", backend: true },
        { title: "Word to PDF", category: "PDF Tools", description: "Convert Word docs to PDF.", icon: "📝", backend: true },
        { title: "PDF to JPG", category: "PDF Tools", description: "Convert each PDF page to a JPG.", icon: "📷", backend: true },
        
        // 🔵 CLIENT-SIDE UTILITY TOOLS (Browser-based processing)
        // Pure JavaScript functionality - no server required
        { title: "Image Compressor", category: "Utility Tools", description: "Compress JPG/PNG images.", icon: "💨" },
        { title: "Image Converter", category: "Utility Tools", description: "Convert images to JPG, PNG, WEBP.", icon: "🔄" },
        { title: "QR Code Generator", category: "Utility Tools", description: "Generate & download a QR code.", icon: "📱" },
        { title: "Password Generator", category: "Utility Tools", description: "Create strong, secure passwords.", icon: "🔑" },
        { title: "Word Counter", category: "Utility Tools", description: "Count words, chars, sentences.", icon: "🧮" },
        { title: "Text to Speech", category: "Utility Tools", description: "Convert text to natural speech.", icon: "🗣️" },
        { title: "JSON Formatter", category: "Utility Tools", description: "Format, validate, & copy JSON.", icon: "{}︎" },
        { title: "Case Converter", category: "Utility Tools", description: "Convert text to various cases.", icon: "Aa" },
        { title: "Lorem Ipsum Generator", category: "Utility Tools", description: "Generate placeholder text.", icon: "¶" },
        { title: "Base64 Encoder/Decoder", category: "Utility Tools", description: "Encode/decode Base64 text.", icon: "🔐" },
        { title: "Age Calculator", category: "Utility Tools", description: "Calculate your age from birth date.", icon: "🎂" },
        { title: "BMI Calculator", category: "Utility Tools", description: "Calculate your Body Mass Index.", icon: "💪" },
        { title: "Speech to Text", category: "Utility Tools", description: "Dictate text using your mic.", icon: "🎤" },
        { title: "Color Picker", category: "Utility Tools", description: "Pick colors from screen or image.", icon: "🎨" },
        { title: "Unit Converter", category: "Utility Tools", description: "Convert length, weight, etc.", icon: "📏" },
        
        // 🟡 BACKEND UTILITY TOOLS (Render Server + Cloudmersive API)
        // These require server-side processing for complex operations
        { title: "Image OCR", category: "Utility Tools", description: "Extract text from images using OCR.", icon: "🔍", backend: true },
        
        // Future tools (not implemented yet)
        { title: "PDF to PowerPoint", category: "PDF Tools", description: "Convert PDFs to PowerPoint.", icon: "📊", disabled: true },
        { title: "PowerPoint to PDF", category: "PDF Tools", description: "Convert PowerPoint to PDF.", icon: "📈", disabled: true },
        { title: "PDF to Excel", category: "PDF Tools", description: "Extract data from PDFs to Excel.", icon: "📉", disabled: true },
        { title: "Excel to PDF", category: "PDF Tools", description: "Convert Excel sheets to PDF.", icon: "🧾", disabled: true },
        { title: "Edit PDF", category: "PDF Tools", description: "Add text or images to a PDF.", icon: "✏️", disabled: false },
    ]
};

// --- SEARCH FUNCTIONALITY ---
function filterTools() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    
    const searchTerm = input.value.toLowerCase();
    const toolCards = document.querySelectorAll('.tool-card');
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    
    toolCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const category = card.closest('.tools-section')?.id || '';
        
        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesFilter = activeFilter === 'all' || 
                             (activeFilter === 'pdf' && category === 'pdf-tools-section') ||
                             (activeFilter === 'utility' && category === 'utility-tools-section');
        
        if (matchesSearch && matchesFilter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide section headers
    updateSectionVisibility();
}

function updateSectionVisibility() {
    const sections = document.querySelectorAll('.tools-section');
    sections.forEach(section => {
        const visibleCards = section.querySelectorAll('.tool-card[style*="display: block"], .tool-card:not([style*="display: none"])');
        if (visibleCards.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
}

// --- SIMPLE HOMEPAGE RENDERING ---
function createToolCards() {
    const pdfGrid = document.getElementById('pdf-tools-grid');
    const utilityGrid = document.getElementById('utility-tools-grid');
    
    if (!pdfGrid || !utilityGrid) return;

    // Separate tools by category
    const pdfTools = config.tools.filter(tool => tool.category === 'PDF Tools');
    const utilityTools = config.tools.filter(tool => tool.category === 'Utility Tools');

    // Render PDF tools
    pdfGrid.innerHTML = pdfTools.map(tool => {
        const disabledClass = tool.disabled ? 'disabled' : '';
        return `
            <div class="tool-card ${disabledClass}" data-title="${tool.title}">
                <div class="card-icon">${tool.icon}</div>
                <h3>${tool.title}</h3>
                <p>${tool.description}</p>
                ${tool.disabled ? '<span class="coming-soon">Coming Soon</span>' : ''}
            </div>
        `;
    }).join('');

    // Render Utility tools
    utilityGrid.innerHTML = utilityTools.map(tool => {
        const disabledClass = tool.disabled ? 'disabled' : '';
        return `
            <div class="tool-card ${disabledClass}" data-title="${tool.title}">
                <div class="card-icon">${tool.icon}</div>
                <h3>${tool.title}</h3>
                <p>${tool.description}</p>
                ${tool.disabled ? '<span class="coming-soon">Coming Soon</span>' : ''}
            </div>
        `;
    }).join('');

    // Add click handlers for tool cards
    document.querySelectorAll('.tool-card:not(.disabled)').forEach(card => {
        card.addEventListener('click', () => {
            const toolTitle = card.dataset.title;
            const slug = toolTitle.toLowerCase().replace(/\s+/g, '-');
            
            // Check if tool page exists
            const toolPage = `tools/${slug}.html`;
            
            // For now, let's check if the file exists or redirect to a working tool
            if (toolTitle === "Merge PDF" || toolTitle === "Split PDF" || toolTitle === "JPEG to PDF") {
                window.location.href = toolPage;
            } else if (toolTitle === "Compress PDF") {
                window.location.href = 'tools/compress-pdf.html';
            } else if (toolTitle === "PDF to Word") {
                window.location.href = 'tools/pdf-to-word.html';
            } else if (toolTitle === "Word to PDF") {
                window.location.href = 'tools/word-to-pdf.html';
            } else if (toolTitle === "PDF to JPG") {
                window.location.href = 'tools/pdf-to-jpg.html';
            } else if (toolTitle === "Image Compressor") {
                window.location.href = 'tools/image-compressor.html';
            } else if (toolTitle === "Image Converter") {
                window.location.href = 'tools/image-converter.html';
            } else if (toolTitle === "QR Code Generator") {
                window.location.href = 'tools/qr-code-generator.html';
            } else if (toolTitle === "Password Generator") {
                window.location.href = 'tools/password-generator.html';
            } else if (toolTitle === "Word Counter") {
                window.location.href = 'tools/word-counter.html';
            } else if (toolTitle === "Text to Speech") {
                window.location.href = 'tools/text-to-speech.html';
            } else if (toolTitle === "Image OCR") {
                window.location.href = 'tools/image-ocr.html';
            } else if (toolTitle === "JSON Formatter") {
                window.location.href = 'tools/json-formatter.html';
            } else if (toolTitle === "Case Converter") {
                window.location.href = 'tools/case-converter.html';
            } else if (toolTitle === "Lorem Ipsum Generator") {
                window.location.href = 'tools/lorem-ipsum-generator.html';
            } else if (toolTitle === "Base64 Encoder/Decoder") {
                window.location.href = 'tools/base64-encoderdecoder.html';
            } else if (toolTitle === "Age Calculator") {
                window.location.href = 'tools/age-calculator.html';
            } else if (toolTitle === "BMI Calculator") {
                window.location.href = 'tools/bmi-calculator.html';
            } else if (toolTitle === "Speech to Text") {
                window.location.href = 'tools/speech-to-text.html';
            } else if (toolTitle === "Color Picker") {
                window.location.href = 'tools/color-picker.html';
            } else if (toolTitle === "Unit Converter") {
                window.location.href = 'tools/unit-converter.html';
            } else if (toolTitle === "Add Watermark") {
                window.location.href = 'tools/add-watermark.html';
            } else if (toolTitle === "Protect PDF") {
                window.location.href = 'tools/protect-pdf.html';
            } else if (toolTitle === "Unlock PDF") {
                window.location.href = 'tools/unlock-pdf.html';
            } else if (toolTitle === "Reorder PDF Pages") {
                window.location.href = 'tools/organize-pdf.html';
            } else if (toolTitle === "Rotate PDF") {
                window.location.href = 'tools/rotate-pdf.html';
            } else if (toolTitle === "Edit PDF") {
                window.location.href = 'tools/edit-pdf.html';
            } else {
                // Fallback for any missing tools
                console.log(`Tool page not found for: ${toolTitle}`);
                showNotification(`Tool "${toolTitle}" is coming soon!`, 'info');
            }
        });
    });
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
        a.download = result.filename || file.name.replace(/\.(docx?|doc)$/i, '.pdf');
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
    if (document.getElementById('pdf-tools-grid')) {
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
            
            if (filter === 'all') {
                if (pdfSection) pdfSection.style.display = 'block';
                if (utilitySection) utilitySection.style.display = 'block';
            } else if (filter === 'pdf') {
                if (pdfSection) pdfSection.style.display = 'block';
                if (utilitySection) utilitySection.style.display = 'none';
            } else if (filter === 'utility') {
                if (pdfSection) pdfSection.style.display = 'none';
                if (utilitySection) utilitySection.style.display = 'block';
            }
            
            // Clear search and reapply filters
            const searchInput = document.getElementById('searchInput');
            if (searchInput && searchInput.value) {
                filterTools();
            }
            
            // Smooth scroll to tools
            const firstVisibleSection = filter === 'pdf' ? pdfSection : 
                                       filter === 'utility' ? utilitySection : pdfSection;
            if (firstVisibleSection) {
                setTimeout(() => {
                    firstVisibleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
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

        // Check if the response contains Cloudmersive URLs (new format)
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
