// Tool Navigator - Quick Access Navigation System
const toolsData = {
    pdf: [
        { title: "Merge PDF", icon: "🔗", url: "merge-pdf.html" },
        { title: "Split PDF", icon: "✂️", url: "split-pdf.html" },
        { title: "JPEG to PDF", icon: "🖼️", url: "jpeg-to-pdf.html" },
        { title: "Reorder PDF Pages", icon: "🗂️", url: "organize-pdf.html" },
        { title: "Rotate PDF", icon: "🔄", url: "rotate-pdf.html" },
        { title: "Add Watermark", icon: "💧", url: "add-watermark.html" },
        { title: "Protect PDF", icon: "🔒", url: "protect-pdf.html" },
        { title: "Unlock PDF", icon: "🔓", url: "unlock-pdf.html" },
        { title: "Compress PDF", icon: "🗜️", url: "compress-pdf.html", badge: "API" },
        { title: "PDF to Word", icon: "📄", url: "pdf-to-word.html", badge: "API" },
        { title: "Word to PDF", icon: "📝", url: "word-to-pdf.html", badge: "API" },
        { title: "PDF to JPG", icon: "📷", url: "pdf-to-jpg.html", badge: "API" },
        { title: "Edit PDF", icon: "✏️", url: "edit-pdf.html" }
    ],
    utility: [
        { title: "Image Compressor", icon: "💨", url: "image-compressor.html" },
        { title: "Image Converter", icon: "🔄", url: "image-converter.html" },
        { title: "QR Code Generator", icon: "📱", url: "qr-code-generator.html" },
        { title: "Password Generator", icon: "🔑", url: "password-generator.html" },
        { title: "Word Counter", icon: "🧮", url: "word-counter.html" },
        { title: "Text to Speech", icon: "🗣️", url: "text-to-speech.html" },
        { title: "Speech to Text", icon: "🎤", url: "speech-to-text.html" },
        { title: "JSON Formatter", icon: "{ }", url: "json-formatter.html" },
        { title: "Case Converter", icon: "Aa", url: "case-converter.html" },
        { title: "Lorem Ipsum Generator", icon: "¶", url: "lorem-ipsum-generator.html" },
        { title: "Base64 Encoder/Decoder", icon: "🔐", url: "base64-encoderdecoder.html" },
        { title: "Age Calculator", icon: "🎂", url: "age-calculator.html" },
        { title: "BMI Calculator", icon: "💪", url: "bmi-calculator.html" },
        { title: "Color Picker", icon: "🎨", url: "color-picker.html" },
        { title: "Unit Converter", icon: "📏", url: "unit-converter.html" },
        { title: "Image OCR", icon: "🔍", url: "image-ocr.html", badge: "API" },

    ]
};

class ToolNavigator {
    constructor() {
        this.isOpen = false;
        this.currentTool = this.getCurrentToolName();
        this.init();
    }

    getCurrentToolName() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        return filename || '';
    }

    init() {
        this.injectHTML();
        this.attachEventListeners();
        this.highlightCurrentTool();
    }

    injectHTML() {
        const html = `
            <!-- Tool Navigator Overlay -->
            <div class="tool-nav-overlay" id="toolNavOverlay"></div>
            
            <!-- Tool Navigator Trigger Button -->
            <button class="tool-navigator-trigger" id="toolNavTrigger" aria-label="Open Tools Menu" title="Browse All Tools">
                🔧
                <span class="tool-navigator-tooltip" id="toolNavTooltip">Browse Other<br>Tools</span>
            </button>
            
            <!-- Tool Navigator Panel -->
            <div class="tool-navigator-panel" id="toolNavPanel">
                <div class="tool-nav-header">
                    <div class="tool-nav-title">
                        🇮🇳 All Tools
                    </div>
                    <button class="tool-nav-close" id="toolNavClose" aria-label="Close">✕</button>
                </div>
                
                <div class="tool-nav-search">
                    <input type="text" id="toolNavSearch" placeholder="🔍 Search tools..." />
                </div>
                
                <div class="tool-nav-content" id="toolNavContent">
                    ${this.renderToolCategories()}
                </div>
                
                <div class="tool-nav-quick">
                    <div class="tool-nav-quick-title">Quick Access</div>
                    <div class="tool-nav-quick-btns">
                        <a href="../index.html" class="tool-nav-quick-btn">🏠 Home</a>
                        <a href="../about.html" class="tool-nav-quick-btn">ℹ️ About</a>
                        <a href="../contact.html" class="tool-nav-quick-btn">📧 Contact</a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
    }

    renderToolCategories() {
        let html = '';
        
        // PDF Tools
        html += `
            <div class="tool-nav-category">
                <div class="tool-nav-category-title">📄 PDF Tools (${toolsData.pdf.length})</div>
                <div class="tool-nav-list">
                    ${toolsData.pdf.map(tool => this.renderToolItem(tool)).join('')}
                </div>
            </div>
        `;
        
        // Utility Tools
        html += `
            <div class="tool-nav-category">
                <div class="tool-nav-category-title">🔧 Utility Tools (${toolsData.utility.length})</div>
                <div class="tool-nav-list">
                    ${toolsData.utility.map(tool => this.renderToolItem(tool)).join('')}
                </div>
            </div>
        `;
        
        return html;
    }

    renderToolItem(tool) {
        const isActive = this.currentTool === tool.url ? 'active' : '';
        const badge = tool.badge ? `<span class="tool-nav-badge">${tool.badge}</span>` : '';
        
        return `
            <a href="${tool.url}" class="tool-nav-item ${isActive}" data-tool="${tool.title}">
                <span class="tool-nav-icon">${tool.icon}</span>
                <span class="tool-nav-text">${tool.title}</span>
                ${badge}
            </a>
        `;
    }

    attachEventListeners() {
        const trigger = document.getElementById('toolNavTrigger');
        const panel = document.getElementById('toolNavPanel');
        const overlay = document.getElementById('toolNavOverlay');
        const closeBtn = document.getElementById('toolNavClose');
        const searchInput = document.getElementById('toolNavSearch');

        trigger.addEventListener('click', () => this.toggle());
        closeBtn.addEventListener('click', () => this.close());
        overlay.addEventListener('click', () => this.close());
        
        // Search functionality
        searchInput.addEventListener('input', (e) => this.filterTools(e.target.value));
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Track tool clicks for analytics
        const toolItems = document.querySelectorAll('.tool-nav-item');
        toolItems.forEach(item => {
            item.addEventListener('click', () => {
                const toolName = item.dataset.tool;
                console.log(`Navigating to: ${toolName}`);
            });
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
            // Hide tooltip when user clicks to open
            const tooltip = document.getElementById('toolNavTooltip');
            if (tooltip) {
                tooltip.classList.add('hidden');
            }
        }
    }

    open() {
        const panel = document.getElementById('toolNavPanel');
        const overlay = document.getElementById('toolNavOverlay');
        
        panel.classList.add('open');
        overlay.classList.add('show');
        this.isOpen = true;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    close() {
        const panel = document.getElementById('toolNavPanel');
        const overlay = document.getElementById('toolNavOverlay');
        
        panel.classList.remove('open');
        overlay.classList.remove('show');
        this.isOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    filterTools(searchTerm) {
        const items = document.querySelectorAll('.tool-nav-item');
        const categories = document.querySelectorAll('.tool-nav-category');
        const term = searchTerm.toLowerCase().trim();
        
        if (!term) {
            // Show all
            items.forEach(item => item.style.display = 'flex');
            categories.forEach(cat => cat.style.display = 'block');
            return;
        }
        
        // Filter items
        items.forEach(item => {
            const toolName = item.dataset.tool.toLowerCase();
            if (toolName.includes(term)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Hide empty categories
        categories.forEach(category => {
            const visibleItems = category.querySelectorAll('.tool-nav-item[style*="display: flex"]');
            if (visibleItems.length === 0) {
                category.style.display = 'none';
            } else {
                category.style.display = 'block';
            }
        });
    }

    highlightCurrentTool() {
        const items = document.querySelectorAll('.tool-nav-item');
        items.forEach(item => {
            const href = item.getAttribute('href');
            if (href === this.currentTool) {
                item.classList.add('active');
            }
        });
    }
}

// Initialize Tool Navigator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a tool page (not the main index)
    if (window.location.pathname.includes('/tools/')) {
        const navigator = new ToolNavigator();
        console.log('🔧 Tool Navigator initialized');
    }
});
