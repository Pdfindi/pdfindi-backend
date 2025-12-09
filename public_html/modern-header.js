// Modern Header with Tools Dropdown - iLovePDF Style

const toolsData = {
    pdf: [
        { title: "Merge PDF", icon: "🔗", url: "tools/merge-pdf.html" },
        { title: "Split PDF", icon: "✂️", url: "tools/split-pdf.html" },
        { title: "Compress PDF", icon: "🗜️", url: "tools/compress-pdf.html", badge: "API" },
        { title: "PDF to Word", icon: "📄", url: "tools/pdf-to-word.html", badge: "API" },
        { title: "Word to PDF", icon: "📝", url: "tools/word-to-pdf.html", badge: "API" },
        { title: "PDF to JPG", icon: "📷", url: "tools/pdf-to-jpg.html", badge: "API" },
        { title: "JPEG to PDF", icon: "🖼️", url: "tools/jpeg-to-pdf.html" },
        { title: "Rotate PDF", icon: "🔄", url: "tools/rotate-pdf.html" },
        { title: "Reorder PDF Pages", icon: "🗂️", url: "tools/organize-pdf.html" },
        { title: "Add Watermark", icon: "💧", url: "tools/add-watermark.html" },
        { title: "Protect PDF", icon: "🔒", url: "tools/protect-pdf.html" },
        { title: "Unlock PDF", icon: "🔓", url: "tools/unlock-pdf.html" },
        { title: "Edit PDF", icon: "✏️", url: "tools/edit-pdf.html" }
    ],
    utility: [
        { title: "Image Compressor", icon: "💨", url: "tools/image-compressor.html" },
        { title: "Image Converter", icon: "🔄", url: "tools/image-converter.html" },
        { title: "Image OCR", icon: "🔍", url: "tools/image-ocr.html", badge: "API" },
        { title: "QR Code Generator", icon: "📱", url: "tools/qr-code-generator.html" },
        { title: "Password Generator", icon: "🔑", url: "tools/password-generator.html" },
        { title: "Word Counter", icon: "🧮", url: "tools/word-counter.html" },
        { title: "Text to Speech", icon: "🗣️", url: "tools/text-to-speech.html" },
        { title: "Speech to Text", icon: "🎤", url: "tools/speech-to-text.html" },
        { title: "JSON Formatter", icon: "{ }", url: "tools/json-formatter.html" },
        { title: "Case Converter", icon: "Aa", url: "tools/case-converter.html" },
        { title: "Lorem Ipsum Generator", icon: "¶", url: "tools/lorem-ipsum-generator.html" },
        { title: "Base64 Encoder/Decoder", icon: "🔐", url: "tools/base64-encoderdecoder.html" },
        { title: "Age Calculator", icon: "🎂", url: "tools/age-calculator.html" },
        { title: "BMI Calculator", icon: "💪", url: "tools/bmi-calculator.html" },
        { title: "Color Picker", icon: "🎨", url: "tools/color-picker.html" },
        { title: "Unit Converter", icon: "📏", url: "tools/unit-converter.html" },

    ]
};

class ModernHeader {
    constructor() {
        this.dropdownOpen = false;
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
        document.body.classList.add('has-modern-header');
    }

    render() {
        // Detect if we're in a tool page (subfolder) or homepage
        const isToolPage = window.location.pathname.includes('/tools/');
        const basePath = isToolPage ? '../' : '';
        
        const headerHTML = `
            <header class="modern-header">
                <a href="${basePath}index.html" class="header-logo">
                    <div class="logo-main">
                        <img src="${basePath}logo.png" alt="PDFindi Logo" class="logo-image" style="height:40px;width:auto;">
                        <div class="logo-text">
                            <span class="brand-name">PDFINDI</span>
                            <span style="font-size:10px;color:#6B7280;margin-top:2px;display:block;">Indian • Secure • Fast</span>
                        </div>
                    </div>
                    <div class="made-in-india-badge">
                        🇮🇳 Made in India
                    </div>
                </a>

                <nav class="header-nav">
                    <div class="header-dropdown" id="toolsDropdown">
                        <button class="header-dropdown-trigger" id="toolsDropdownBtn">
                            All Tools
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        <div class="header-dropdown-menu" id="toolsDropdownMenu">
                            ${this.renderDropdownContent()}
                        </div>
                    </div>
                    <a href="${basePath}about.html" class="header-nav-link">About</a>
                    <a href="${basePath}faq.html" class="header-nav-link">FAQ</a>
                    <a href="${basePath}contact.html" class="header-nav-link">Contact</a>
                </nav>

                <button class="header-mobile-menu" id="mobileMenuBtn" aria-label="Menu">
                    ☰
                </button>
            </header>
            <div class="header-overlay" id="headerOverlay"></div>
        `;

        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }

    renderDropdownContent() {
        // Detect if we're in a tool page (subfolder) or homepage
        const isToolPage = window.location.pathname.includes('/tools/');
        const basePath = isToolPage ? '../' : '';
        
        let html = '<div class="header-dropdown-categories">';
        
        // PDF Tools Column
        html += '<div class="header-dropdown-category">';
        html += '<div class="header-dropdown-category-title">📄 PDF Tools</div>';
        html += '<div class="header-dropdown-links">';
        toolsData.pdf.forEach(tool => {
            html += `
                <a href="${basePath}${tool.url}" class="header-dropdown-link">
                    <span class="header-dropdown-link-icon">${tool.icon}</span>
                    <span>${tool.title}</span>
                    ${tool.badge ? `<span class="header-dropdown-link-badge">${tool.badge}</span>` : ''}
                </a>
            `;
        });
        html += '</div></div>';
        
        // Utility Tools Column
        html += '<div class="header-dropdown-category">';
        html += '<div class="header-dropdown-category-title">🔧 Utility Tools</div>';
        html += '<div class="header-dropdown-links">';
        toolsData.utility.forEach(tool => {
            html += `
                <a href="${basePath}${tool.url}" class="header-dropdown-link">
                    <span class="header-dropdown-link-icon">${tool.icon}</span>
                    <span>${tool.title}</span>
                    ${tool.badge ? `<span class="header-dropdown-link-badge">${tool.badge}</span>` : ''}
                </a>
            `;
        });
        html += '</div></div>';
        
        html += '</div>';
        return html;
    }

    attachEventListeners() {
        const dropdownBtn = document.getElementById('toolsDropdownBtn');
        const dropdown = document.getElementById('toolsDropdown');
        const overlay = document.getElementById('headerOverlay');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');

        // Toggle dropdown on button click
        dropdownBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Mobile menu - reuse dropdown
        mobileMenuBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Close dropdown on overlay click
        overlay?.addEventListener('click', () => {
            this.closeDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown?.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Close dropdown on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDropdown();
            }
        });

        // Prevent dropdown from closing when clicking inside
        document.getElementById('toolsDropdownMenu')?.addEventListener('click', (e) => {
            e.stopPropagation();
        });
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

// Initialize header when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ModernHeader();
    });
} else {
    new ModernHeader();
}
