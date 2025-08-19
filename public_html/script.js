// --- CLEAN PDFINDI ARCHITECTURE ---
// Simple configuration for clean, separate tool pages

const config = {
    // Backend API URL for the 3 tools that need it
    backendUrl: 'https://pdfindi-backend.onrender.com', // Your live Render backend
    
    // Simple tool list for rendering the homepage
    tools: [
        // Client-side PDF Tools (working in browser)
        { title: "Merge PDF", category: "PDF Tools", description: "Combine multiple PDF files into one.", icon: "🔗" },
        { title: "Split PDF", category: "PDF Tools", description: "Extract a range of pages from a PDF.", icon: "✂️" },
        { title: "JPEG to PDF", category: "PDF Tools", description: "Combine JPG/PNG images into a PDF.", icon: "🖼️" },
        { title: "Organize PDF", category: "PDF Tools", description: "Reorder or delete pages from a PDF.", icon: "🗂️" },
        { title: "Rotate PDF", category: "PDF Tools", description: "Rotate all pages in 90° increments.", icon: "🔄" },
        { title: "Add Watermark", category: "PDF Tools", description: "Stamp text or an image on a PDF.", icon: "💧" },
        { title: "Protect PDF", category: "PDF Tools", description: "Add a password to secure a PDF.", icon: "🔒" },
        { title: "Unlock PDF", category: "PDF Tools", description: "Remove a password from a PDF.", icon: "🔓" },

        // Backend PDF Tools (using Cloudmersive API)
        { title: "Compress PDF", category: "PDF Tools", description: "Reduce the file size of your PDF.", icon: "🗜️", backend: true },
        { title: "PDF to Word", category: "PDF Tools", description: "Convert PDF to editable Word docs.", icon: "📄", backend: true },
        { title: "Word to PDF", category: "PDF Tools", description: "Convert Word docs to PDF.", icon: "📝", backend: true },
        { title: "Image to PDF", category: "PDF Tools", description: "Convert images to PDF documents.", icon: "🖼️", backend: true },
        { title: "PDF to JPG", category: "PDF Tools", description: "Convert each PDF page to a JPG.", icon: "📷", backend: true },
        
        // Future tools (not implemented yet)
        { title: "PDF to PowerPoint", category: "PDF Tools", description: "Convert PDFs to PowerPoint.", icon: "📊", disabled: true },
        { title: "PowerPoint to PDF", category: "PDF Tools", description: "Convert PowerPoint to PDF.", icon: "📈", disabled: true },
        { title: "PDF to Excel", category: "PDF Tools", description: "Extract data from PDFs to Excel.", icon: "📉", disabled: true },
        { title: "Excel to PDF", category: "PDF Tools", description: "Convert Excel sheets to PDF.", icon: "🧾", disabled: true },
        { title: "Edit PDF", category: "PDF Tools", description: "Add text or images to a PDF.", icon: "✏️", disabled: true },

        // Client-side Utility Tools (working in browser)
        { title: "Image Compressor", category: "Utility Tools", description: "Compress JPG/PNG images.", icon: "💨" },
        { title: "Image Converter", category: "Utility Tools", description: "Convert images to JPG, PNG, WEBP.", icon: "🔄" },
        { title: "QR Code Generator", category: "Utility Tools", description: "Generate & download a QR code.", icon: "📱" },
        { title: "Password Generator", category: "Utility Tools", description: "Create strong, secure passwords.", icon: "🔑" },
        { title: "Word Counter", category: "Utility Tools", description: "Count words, chars, sentences.", icon: "🧮" },
        { title: "Text to Speech", category: "Utility Tools", description: "Convert text to natural speech.", icon: "🗣️" },
        
        // Backend Utility Tools (using Cloudmersive API)
        { title: "Image OCR", category: "Utility Tools", description: "Extract text from images using OCR.", icon: "🔍", backend: true },
        { title: "File Converter Hub", category: "Utility Tools", description: "Convert between multiple file formats.", icon: "🔄", backend: true },
        { title: "JSON Formatter", category: "Utility Tools", description: "Format, validate, & copy JSON.", icon: "{}︎" },
        { title: "Case Converter", category: "Utility Tools", description: "Convert text to various cases.", icon: "Aa" },
        { title: "Lorem Ipsum Generator", category: "Utility Tools", description: "Generate placeholder text.", icon: "¶" },
        { title: "Base64 Encoder/Decoder", category: "Utility Tools", description: "Encode/decode Base64 text.", icon: "🔐" },
        { title: "Age Calculator", category: "Utility Tools", description: "Calculate your age from birth date.", icon: "🎂" },
        { title: "BMI Calculator", category: "Utility Tools", description: "Calculate your Body Mass Index.", icon: "💪" },
        { title: "Speech to Text", category: "Utility Tools", description: "Dictate text using your mic.", icon: "🎤" },
        { title: "Color Picker", category: "Utility Tools", description: "Pick colors from screen or image.", icon: "🎨" },
        { title: "Unit Converter", category: "Utility Tools", description: "Convert length, weight, etc.", icon: "📏" },
    ]
};

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
            
            // Simple redirect to individual tool page
            window.location.href = `tools/${slug}.html`;
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

// Real Image to PDF Conversion using Cloudmersive API
async function convertImageToPDF(file) {
    const formData = new FormData();
    formData.append('file', file); // Backend expects 'file' field name
    
    try {
        console.log('Making request to:', `${config.backendUrl}/api/image-to-pdf`);
        const response = await fetch(`${config.backendUrl}/api/image-to-pdf`, {
            method: 'POST',
            body: formData
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
            let errorMessage = `Image to PDF API error: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
                console.log('Error data:', errorData);
            } catch (e) {
                console.log('Failed to parse error JSON:', e);
                // If parsing JSON fails, use the status-based message
            }
            throw new Error(errorMessage);
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
        a.download = result.filename || file.name.replace(/\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i, '.pdf');
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        return { success: true, message: result.message || 'Image successfully converted to PDF!' };
        
    } catch (error) {
        console.error('Image to PDF conversion error:', error);
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
                e.preventDefault();
                // Handle navigation here if needed
            });
        });
    }
    
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            // Handle mobile menu toggle
        });
    }
    
    if (exploreToolsBtn) {
        exploreToolsBtn.addEventListener('click', () => {
            document.getElementById('pdf-tools-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
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
