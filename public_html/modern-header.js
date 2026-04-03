// Modern Header with Tools Dropdown - Premium Corporate Style

const toolsData = {
    ai: [
        { title: "AI PDF Summarizer", icon: "📝", url: "tools/pdf-summarizer.html", badge: "NEW" },
        { title: "Chat with PDF", icon: "💬", url: "tools/chat-with-pdf.html", badge: "NEW" },
        { title: "PDF to Notes", icon: "📌", url: "tools/pdf-to-study-notes.html", badge: "NEW" },
        { title: "PDF to Presentation", icon: "📽️", url: "tools/pdf-to-presentation.html", badge: "NEW" },
        { title: "PDF to Podcast", icon: "🎧", url: "tools/pdf-to-podcast.html", badge: "NEW" }
    ],
    student: [
        { title: "PDF to Handwritten", icon: "✍️", url: "tools/pdf-to-handwritten.html" },
        { title: "PDF Quiz Generator", icon: "❓", url: "tools/pdf-quiz-generator.html" },
        { title: "Extract Questions", icon: "🎯", url: "tools/extract-questions.html" },
        { title: "PDF to Flashcards", icon: "🗂️", url: "tools/pdf-to-flashcards.html" },
        { title: "Auto-Highlight PDF", icon: "🖍️", url: "tools/auto-highlight-pdf.html" }
    ],
    job: [
        { title: "Resume PDF Optimizer", icon: "📄", url: "tools/resume-pdf-optimizer.html" },
        { title: "PDF Resume Analyzer", icon: "📊", url: "tools/pdf-resume-analyzer.html" },
        { title: "Portfolio PDF Creator", icon: "💼", url: "tools/portfolio-pdf-creator.html" }
    ],
    organize: [
        { title: "Merge PDF", icon: "📂", url: "tools/merge-pdf.html" },
        { title: "Split PDF", icon: "✂️", url: "tools/split-pdf.html" },
        { title: "Reorder PDF Pages", icon: "📑", url: "tools/organize-pdf.html" },
        { title: "Rotate PDF", icon: "🔄", url: "tools/rotate-pdf.html" }
    ],
    optimize: [
        { title: "Compress PDF", icon: "🗜️", url: "tools/compress-pdf.html", badge: "POPULAR" },
        { title: "Add Watermark", icon: "💧", url: "tools/add-watermark.html" },
        { title: "Image OCR", icon: "👁️", url: "tools/image-ocr.html" }
    ],
    convertFrom: [
        { title: "PDF to Word", icon: "📄", url: "tools/pdf-to-word.html" },
        { title: "PDF to JPG", icon: "📷", url: "tools/pdf-to-jpg.html" },
        { title: "PDF to PowerPoint", icon: "📊", url: "coming-soon.html", badge: "SOON" },
        { title: "PDF to Excel", icon: "📈", url: "coming-soon.html", badge: "SOON" }
    ],
    convertTo: [
        { title: "Word to PDF", icon: "📝", url: "tools/word-to-pdf.html" },
        { title: "JPG to PDF", icon: "🖼️", url: "tools/jpeg-to-pdf.html" },
        { title: "PowerPoint to PDF", icon: "📉", url: "coming-soon.html", badge: "SOON" },
        { title: "Excel to PDF", icon: "📊", url: "coming-soon.html", badge: "SOON" }
    ],
    edit: [
        { title: "Edit PDF", icon: "✏️", url: "tools/edit-pdf.html", badge: "BETA" }
    ],
    security: [
        { title: "Unlock PDF", icon: "🔓", url: "tools/unlock-pdf.html" },
        { title: "Protect PDF", icon: "🔒", url: "tools/protect-pdf.html" }
    ],
    utility: [
        { title: "Image Compressor", icon: "📸", url: "tools/image-compressor.html" },
        { title: "Image Converter", icon: "♻️", url: "tools/image-converter.html" },
        { title: "QR Code Generator", icon: "📱", url: "tools/qr-code-generator.html" },
        { title: "Password Generator", icon: "🔑", url: "tools/password-generator.html" },
        { title: "Word Counter", icon: "🧮", url: "tools/word-counter.html" },
        { title: "Text to Speech", icon: "🗣️", url: "tools/text-to-speech.html" },
        { title: "JSON Formatter", icon: "{} ", url: "tools/json-formatter.html" },
        { title: "Case Converter", icon: "Aa", url: "tools/case-converter.html" },
        { title: "Lorem Ipsum", icon: "📜", url: "tools/lorem-ipsum-generator.html" },
        { title: "Base64 Encoder", icon: "🔗", url: "tools/base64-encoderdecoder.html" },
        { title: "Age Calculator", icon: "🎂", url: "tools/age-calculator.html" },
        { title: "BMI Calculator", icon: "⚖️", url: "tools/bmi-calculator.html" },
        { title: "Speech to Text", icon: "🎤", url: "tools/speech-to-text.html" },
        { title: "Color Picker", icon: "🎨", url: "tools/color-picker.html" },
        { title: "Unit Converter", icon: "📏", url: "tools/unit-converter.html" }
    ]
};

class ModernHeader {
    constructor() {
        this.dropdownOpen = false;
        // Detect base path once
        this.isToolPage = window.location.pathname.includes('/tools/');
        this.basePath = this.isToolPage ? '../' : '';
        this.init();
    }

    init() {
        this.renderHeader();
        this.renderFooter();
        this.renderFeedbackWidget();
        this.attachEventListeners();
        this.handleInitialNavigation();
        document.body.classList.add('has-modern-header');
    }

    renderHeader() {
        // Prevent duplicate headers
        const existingHeader = document.querySelector('header.modern-header');
        if (existingHeader) existingHeader.remove();
        
        const headerHTML = `
            <div class="header-overlay" id="headerOverlay"></div>
            <header class="modern-header">
                <div style="display: flex; align-items: center; gap: 2rem;">
                    <a href="${this.basePath}index.html" class="header-logo">
                        <img src="${this.basePath}Logo1.png" alt="PDFIndi Logo" class="logo-image" loading="lazy">
                        <div class="made-in-india-badge">Made in India</div>
                    </a>

                    <nav class="header-nav">
                        <div class="header-dropdown" id="toolsDropdown">
                            <button class="header-dropdown-trigger" id="toolsDropdownBtn">
                                ALL TOOLS
                                <svg viewBox="0 0 24 24" fill="currentColor" style="width: 14px; height: 14px;">
                                    <path d="M7 10l5 5 5-5z"/>
                                </svg>
                            </button>
                            <div class="header-dropdown-menu" id="toolsDropdownMenu">
                                ${this.renderDropdownContent()}
                            </div>
                        </div>
                        <a href="${this.basePath}index.html?filter=job#tools-section" class="header-nav-link" data-page="job">RESUME & JOB</a>
                        <a href="${this.basePath}index.html?filter=student#tools-section" class="header-nav-link" data-page="student">STUDENT TOOLS</a>
                        <a href="${this.basePath}index.html?filter=ai#tools-section" class="header-nav-link" data-page="ai">AI TOOLS</a>
                        <a href="${this.basePath}tools/organize-pdf.html" class="header-nav-link" data-page="organize">ORGANIZE PDF</a>
                    </nav>
                </div>

                <div class="header-actions">
                    <a href="${this.basePath}about.html" class="header-btn header-btn-login">ABOUT</a>
                    <a href="${this.basePath}contact.html" class="header-btn header-btn-primary">CONTACT</a>
                    <button class="header-mobile-menu" id="mobileMenuBtn">☰</button>
                </div>
            </header>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
        this.setActiveLink();
    }

    renderFooter() {
        // Remove any existing hardcoded footer
        const existingFooter = document.querySelector('footer.footer');
        if (existingFooter) existingFooter.remove();

        const footerHTML = `
            <footer class="footer" style="background: #ffffff; color: #1e293b; padding: 5rem 2rem 2rem; margin-top: 0; border-top: 1px solid #e2e8f0; font-family: 'Inter', sans-serif;">
                <div style="max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 4rem; margin-bottom: 4rem;">
                    <!-- Brand Section -->
                    <div style="grid-column: span 2;">
                        <a href="${this.basePath}index.html" style="text-decoration: none; display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
                            <img src="${this.basePath}Logo1.png" alt="PDFIndi Logo" style="height: 48px; width: auto;" loading="lazy">
                        </a>
                        <p style="font-size: 1rem; line-height: 1.8; color: #64748b; margin-bottom: 2rem; max-width: 500px;">
                            PDFIndi is India's leading 100% free PDF toolkit. We provide professional-grade AI tools to merge, compress, edit, and convert PDFs securely. No registration, no watermarks—just powerful PDF solutions.
                        </p>
                        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                            <span style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.5rem;">
                                <span style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%;"></span>
                                Proudly Made in India 
                            </span>
                            <span style="background: #fff7ed; border: 1px solid #ffedd5; padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; color: #ea580c; text-transform: uppercase;">
                                🛡️ 100% Secure & Private
                            </span>
                        </div>
                    </div>
                    
                    <!-- Popular Tools -->
                    <div>
                        <h3 style="color: #0f172a !important; margin-bottom: 1.5rem; font-size: 1.1rem; font-weight: 800; letter-spacing: -0.02em;">PDF SOLUTIONS</h3>
                        <ul style="list-style: none; padding: 0; margin: 0; line-height: 2.5;">
                            <li><a href="${this.basePath}tools/merge-pdf.html" style="color: #475569; text-decoration: none; font-size: 0.95rem; transition: color 0.2s;" onmouseover="this.style.color='#f97316'" onmouseout="this.style.color='#475569'">Merge PDF Online</a></li>
                            <li><a href="${this.basePath}tools/compress-pdf.html" style="color: #475569; text-decoration: none; font-size: 0.95rem; transition: color 0.2s;" onmouseover="this.style.color='#f97316'" onmouseout="this.style.color='#475569'">Compress PDF Free</a></li>
                            <li><a href="${this.basePath}tools/pdf-to-word.html" style="color: #475569; text-decoration: none; font-size: 0.95rem; transition: color 0.2s;" onmouseover="this.style.color='#f97316'" onmouseout="this.style.color='#475569'">PDF to Word Converter</a></li>
                            <li><a href="${this.basePath}tools/pdf-summarizer.html" style="color: #475569; text-decoration: none; font-size: 0.95rem; transition: color 0.2s;" onmouseover="this.style.color='#f97316'" onmouseout="this.style.color='#475569'">AI PDF Summarizer</a></li>
                            <li><a href="${this.basePath}tools/resume-pdf-optimizer.html" style="color: #475569; text-decoration: none; font-size: 0.95rem; transition: color 0.2s;" onmouseover="this.style.color='#f97316'" onmouseout="this.style.color='#475569'">ATS Resume Optimizer</a></li>
                        </ul>
                    </div>
                    
                    <!-- Quick Links -->
                    <div>
                        <h3 style="color: #0f172a !important; margin-bottom: 1.5rem; font-size: 1.1rem; font-weight: 800; letter-spacing: -0.02em;">QUICK LINKS</h3>
                        <ul style="list-style: none; padding: 0; margin: 0; line-height: 2.5;">
                            <li><a href="${this.basePath}about.html" style="color: #475569; text-decoration: none; font-size: 0.95rem; transition: color 0.2s;" onmouseover="this.style.color='#f97316'" onmouseout="this.style.color='#475569'">About Us</a></li>
                            <li><a href="${this.basePath}contact.html" style="color: #475569; text-decoration: none; font-size: 0.95rem; transition: color 0.2s;" onmouseover="this.style.color='#f97316'" onmouseout="this.style.color='#475569'">Contact Support</a></li>
                            <li><a href="${this.basePath}faq.html" style="color: #475569; text-decoration: none; font-size: 0.95rem; transition: color 0.2s;" onmouseover="this.style.color='#f97316'" onmouseout="this.style.color='#475569'">Help Center / FAQ</a></li>
                            <li><a href="${this.basePath}privacy.html" style="color: #475569; text-decoration: none; font-size: 0.95rem; transition: color 0.2s;" onmouseover="this.style.color='#f97316'" onmouseout="this.style.color='#475569'">Privacy Policy</a></li>
                            <li><a href="${this.basePath}terms.html" style="color: #475569; text-decoration: none; font-size: 0.95rem; transition: color 0.2s;" onmouseover="this.style.color='#f97316'" onmouseout="this.style.color='#475569'">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                
                <!-- Bottom Bar -->
                <div style="max-width: 1400px; margin: 0 auto; border-top: 1px solid #f1f5f9; padding-top: 2.5rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1.5rem;">
                    <div>
                        <p style="font-size: 0.9rem; color: #94a3b8; margin: 0; font-weight: 500;">
                            © 2026 <span style="color: #475569;">PDFIndi.com</span> – The Best Free PDF Software. <span style="margin-left: 10px; color: #cbd5e1;">|</span> <span style="margin-left: 10px;">Managed with ❤️ for the world.</span>
                        </p>
                    </div>
                    <div style="display: flex; gap: 1.5rem; align-items: center; padding-right: 180px;">
                        <span style="font-size: 0.95rem; font-weight: 600; color: #64748b;">Follow Us :</span>
                        <a href="https://www.facebook.com/profile.php?id=61583984113205" target="_blank" aria-label="Facebook" style="color: #94a3b8; transition: color 0.2s;" onmouseover="this.style.color='#1877f2'" onmouseout="this.style.color='#94a3b8'">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                        </a>
                        <a href="https://instagram.com/pdfindi" target="_blank" aria-label="Instagram" style="color: #94a3b8; transition: color 0.2s;" onmouseover="this.style.color='#e1306c'" onmouseout="this.style.color='#94a3b8'">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.667.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </a>
                        <a href="https://www.linkedin.com/company/110615147/" target="_blank" aria-label="LinkedIn" style="color: #94a3b8; transition: color 0.2s;" onmouseover="this.style.color='#0a66c2'" onmouseout="this.style.color='#94a3b8'">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
                        </a>
                        <a href="https://twitter.com/pdfindi" target="_blank" aria-label="X" style="color: #94a3b8; transition: color 0.2s;" onmouseover="this.style.color='#000000'" onmouseout="this.style.color='#94a3b8'">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                    </div>
                </div>
            </footer>
        `;
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    renderFeedbackWidget() {
        const feedbackHTML = `
            <button class="feedback-fab" id="feedbackFab" title="Give Feedback">
                <span>💬</span>
                <span class="feedback-label">Share Feedback</span>
            </button>

            <div class="feedback-modal" id="feedbackModal">
                <div class="feedback-header">
                    <h3>Share your Feedback</h3>
                    <button class="feedback-close" id="feedbackClose">&times;</button>
                </div>
                <form class="feedback-form" id="feedbackForm">
                    <div class="rating-container">
                        <span class="star-rating" data-rating="1">★</span>
                        <span class="star-rating" data-rating="2">★</span>
                        <span class="star-rating" data-rating="3">★</span>
                        <span class="star-rating" data-rating="4">★</span>
                        <span class="star-rating" data-rating="5">★</span>
                    </div>
                    <div class="feedback-category">
                        <div class="category-pill active" data-cat="Improvement">Suggestion</div>
                        <div class="category-pill" data-cat="Question">Question</div>
                        <div class="category-pill" data-cat="Bug">Bug Report</div>
                        <div class="category-pill" data-cat="Review">Review</div>
                    </div>
                    <div class="feedback-inputs">
                        <input type="text" class="feedback-input" id="feedbackName" placeholder="Full Name" required>
                        <input type="email" class="feedback-input" id="feedbackEmail" placeholder="Email Address" required>
                    </div>
                    <textarea class="feedback-textarea" id="feedbackText" rows="4" placeholder="How can we improve this tool?" required></textarea>
                    <button type="submit" class="feedback-submit" id="feedbackSubmitBtn">Send Review</button>
                </form>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', feedbackHTML);
    }

    setActiveLink() {
        const path = window.location.pathname;
        const links = document.querySelectorAll('.header-nav-link');
        links.forEach(link => {
            const page = link.getAttribute('data-page');
            if (path.includes('merge-pdf.html') && page === 'merge') link.classList.add('active');
            else if (path.includes('split-pdf.html') && page === 'split') link.classList.add('active');
            else if (path.includes('compress-pdf.html') && page === 'compress') link.classList.add('active');
            else if (path.includes('pdf-to-word.html') && page === 'convert') link.classList.add('active');
            else if (path.includes('index.html') && path === '/') link.classList.add('active');
        });
    }

    renderDropdownContent() {
        const categories = [
            { id: 'job', title: '💼 Resume & Job Tools' },
            { id: 'student', title: '🎓 Student-Focused Tools' },
            { id: 'ai', title: '🤖 AI-based PDF Tools' },
            { id: 'organize', title: 'Organize PDF' },
            { id: 'optimize', title: 'Optimize PDF' },
            { id: 'convertFrom', title: 'Convert from PDF' },
            { id: 'convertTo', title: 'Convert to PDF' },
            { id: 'edit', title: 'Edit PDF' },
            { id: 'security', title: 'Security' },
            { id: 'utility', title: 'Utility Tools' }
        ];

        let html = '';
        categories.forEach(cat => {
            html += `
                <div class="header-dropdown-category">
                    <div class="header-dropdown-category-title">${cat.title}</div>
                    <div class="header-dropdown-links">
                        ${toolsData[cat.id].map(tool => `
                            <a href="${this.basePath}${tool.url}" class="header-dropdown-link">
                                <span class="header-dropdown-link-icon">${tool.icon}</span>
                                <span>${tool.title}</span>
                                ${tool.badge ? `<span class="header-dropdown-link-badge">${tool.badge}</span>` : ''}
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        
        return html;
    }

    attachEventListeners() {
        const dropdownBtn = document.getElementById('toolsDropdownBtn');
        const overlay = document.getElementById('headerOverlay');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');

        dropdownBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleDropdown();
        });

        document.addEventListener('click', (e) => {
            if (this.dropdownOpen && !e.target.closest('.header-dropdown')) {
                this.closeDropdown();
            }
        });

        mobileMenuBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        overlay?.addEventListener('click', () => {
            this.closeDropdown();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDropdown();
            }
        });

        // Handle native SPA scroll-to-section on homepage
        document.querySelectorAll(".header-nav-link").forEach(link => {
            link.addEventListener('click', (e) => {
                const url = new URL(link.href, window.location.origin);
                const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
                
                if (isHome) {
                    const filter = url.searchParams.get('filter');
                    if (filter) {
                        e.preventDefault();
                        window.history.pushState({}, '', link.href);
                        
                        this.applyFilterAndScroll(filter);
                    }
                }
            });
        });

        // Feedback Widget Listeners
        const fab = document.getElementById('feedbackFab');
        const modal = document.getElementById('feedbackModal');
        const closeBtn = document.getElementById('feedbackClose');
        const stars = document.querySelectorAll('.star-rating');
        const pills = document.querySelectorAll('.category-pill');
        const form = document.getElementById('feedbackForm');

        fab?.addEventListener('click', () => {
            modal?.classList.toggle('active');
        });

        closeBtn?.addEventListener('click', () => {
            modal?.classList.remove('active');
        });

        let selectedRating = 0;
        stars.forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.dataset.rating);
                stars.forEach((s, i) => {
                    s.classList.toggle('active', i < selectedRating);
                });
            });
        });

        let selectedCategory = 'Improvement';
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                selectedCategory = pill.dataset.cat;
            });
        });

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('feedbackSubmitBtn');
            const name = document.getElementById('feedbackName').value;
            const email = document.getElementById('feedbackEmail').value;
            const text = document.getElementById('feedbackText').value;
            const toolName = document.title.split('-')[0].trim();
            const pageUrl = window.location.href;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                const response = await fetch('https://pdfindi-backend.onrender.com/api/contact-form', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: `Type: ${selectedCategory}\nTool: ${toolName}\nRating: ${selectedRating}/5\nURL: ${pageUrl}\n\nMessage: ${text}`
                    })
                });

                if (response.ok) {
                    submitBtn.textContent = 'Thank You! ❤️';
                    setTimeout(() => {
                        modal?.classList.remove('active');
                        form.reset();
                        stars.forEach(s => s.classList.remove('active'));
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Send Review';
                    }, 2000);
                } else {
                    throw new Error('Failed');
                }
            } catch (err) {
                submitBtn.textContent = 'Error! Try again.';
                submitBtn.disabled = false;
            }
        });
    }

    handleInitialNavigation() {
        const urlParams = new URLSearchParams(window.location.search);
        const filter = urlParams.get('filter');
        const hash = window.location.hash;

        if (filter || hash === '#tools-section') {
            // Wait for script.js to render tools
            setTimeout(() => {
                if (filter) this.applyFilterAndScroll(filter, 'instant');
                else if (hash === '#tools-section') this.scrollToSection('tools-section', 'instant');
            }, 500);
        }
    }

    applyFilterAndScroll(filter, behavior = 'smooth') {
        const targetBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
        if (targetBtn) {
            targetBtn.click();
            // Small delay to let cards re-render
            setTimeout(() => {
                this.scrollToSection('tools-section', behavior);
            }, 100);
        }
        
        if (window.innerWidth <= 768) this.closeDropdown();
    }

    scrollToSection(sectionId, behavior = 'smooth') {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 100; // Increased offset for better visibility
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: behavior === 'instant' ? 'auto' : 'smooth'
            });
        }
    }

    toggleDropdown() {
        const dropdown = document.getElementById('toolsDropdown');
        const overlay = document.getElementById('headerOverlay');
        
        this.dropdownOpen = !this.dropdownOpen;
        
        if (this.dropdownOpen) {
            dropdown?.classList.add('open');
            overlay?.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            dropdown?.classList.remove('open');
            overlay?.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    closeDropdown() {
        const dropdown = document.getElementById('toolsDropdown');
        const overlay = document.getElementById('headerOverlay');
        
        this.dropdownOpen = false;
        dropdown?.classList.remove('open');
        overlay?.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize header when DOM is ready — only once
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.modernHeader = new ModernHeader();
    });
} else {
    window.modernHeader = new ModernHeader();
}

