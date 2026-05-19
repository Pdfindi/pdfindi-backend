let currentColor = { r: 255, g: 0, b: 0 };

        const elements = {
            colorPicker: document.getElementById('color-picker'),
            hexInput: document.getElementById('hex-input'),
            rgbInput: document.getElementById('rgb-input'),
            hslInput: document.getElementById('hsl-input'),
            currentColorDisplay: document.getElementById('current-color-display'),
            randomColorBtn: document.getElementById('random-color-btn'),
            colorName: document.getElementById('color-name'),
            brightness: document.getElementById('brightness'),
            luminance: document.getElementById('luminance'),
            complementaryColors: document.getElementById('complementary-colors'),
            analogousColors: document.getElementById('analogous-colors'),
            hexValue: document.getElementById('hex-value'),
            rgbValue: document.getElementById('rgb-value'),
            rgbaValue: document.getElementById('rgba-value'),
            hslValue: document.getElementById('hsl-value'),
            hslaValue: document.getElementById('hsla-value'),
            filterValue: document.getElementById('filter-value'),
            materialPalette: document.getElementById('material-palette'),
            websafePalette: document.getElementById('websafe-palette'),
            gradientStart: document.getElementById('gradient-start'),
            gradientEnd: document.getElementById('gradient-end'),
            gradientDirection: document.getElementById('gradient-direction'),
            gradientDisplay: document.getElementById('gradient-display'),
            gradientCSS: document.getElementById('gradient-css'),
            copyFeedback: document.getElementById('copy-feedback')
        };

        // Color conversion functions
        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

        function rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        function rgbToHsl(r, g, b) {
            r /= 255; g /= 255; b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
        }

        function hslToRgb(h, s, l) {
            h /= 360; s /= 100; l /= 100;
            const c = (1 - Math.abs(2 * l - 1)) * s;
            const x = c * (1 - Math.abs((h * 6) % 2 - 1));
            const m = l - c / 2;
            let r, g, b;

            if (0 <= h && h < 1/6) { r = c; g = x; b = 0; }
            else if (1/6 <= h && h < 2/6) { r = x; g = c; b = 0; }
            else if (2/6 <= h && h < 3/6) { r = 0; g = c; b = x; }
            else if (3/6 <= h && h < 4/6) { r = 0; g = x; b = c; }
            else if (4/6 <= h && h < 5/6) { r = x; g = 0; b = c; }
            else { r = c; g = 0; b = x; }

            return {
                r: Math.round((r + m) * 255),
                g: Math.round((g + m) * 255),
                b: Math.round((b + m) * 255)
            };
        }

        function updateColor(color) {
            currentColor = color;
            const hex = rgbToHex(color.r, color.g, color.b);
            const hsl = rgbToHsl(color.r, color.g, color.b);

            // Update visual display
            elements.currentColorDisplay.style.background = hex;
            elements.colorPicker.value = hex;

            // Update format values
            elements.hexValue.textContent = hex.toUpperCase();
            elements.rgbValue.textContent = `rgb(${color.r}, ${color.g}, ${color.b})`;
            elements.rgbaValue.textContent = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
            elements.hslValue.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
            elements.hslaValue.textContent = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`;

            // Update input fields
            elements.hexInput.value = hex;
            elements.rgbInput.value = `${color.r}, ${color.g}, ${color.b}`;
            elements.hslInput.value = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;

            // Update color information
            updateColorInfo(color, hsl);
            generateColorHarmonies(hsl);
        }

        function updateColorInfo(rgb, hsl) {
            // Calculate luminance
            const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
            elements.luminance.textContent = luminance.toFixed(2);

            // Determine brightness
            if (luminance > 0.7) elements.brightness.textContent = "Bright";
            else if (luminance > 0.3) elements.brightness.textContent = "Medium";
            else elements.brightness.textContent = "Dark";

            // Simple color name approximation
            const colorNames = [
                { name: "Red", h: 0, range: 15 },
                { name: "Orange", h: 30, range: 15 },
                { name: "Yellow", h: 60, range: 15 },
                { name: "Green", h: 120, range: 30 },
                { name: "Cyan", h: 180, range: 15 },
                { name: "Blue", h: 240, range: 30 },
                { name: "Purple", h: 300, range: 30 }
            ];

            if (hsl.s < 10) {
                elements.colorName.textContent = "Gray";
            } else {
                const match = colorNames.find(c => 
                    Math.abs(c.h - hsl.h) <= c.range || 
                    Math.abs(c.h - hsl.h + 360) <= c.range || 
                    Math.abs(c.h - hsl.h - 360) <= c.range
                );
                elements.colorName.textContent = match ? match.name : "Unknown";
            }
        }

        function generateColorHarmonies(hsl) {
            // Complementary color
            const complementary = { ...hsl, h: (hsl.h + 180) % 360 };
            const compRgb = hslToRgb(complementary.h, complementary.s, complementary.l);
            elements.complementaryColors.innerHTML = 
                `<div class="palette-color" style="background: ${rgbToHex(compRgb.r, compRgb.g, compRgb.b)}" 
                 onclick="updateColor({r: ${compRgb.r}, g: ${compRgb.g}, b: ${compRgb.b}})"></div>`;

            // Analogous colors
            elements.analogousColors.innerHTML = '';
            [-30, -15, 15, 30].forEach(offset => {
                const analogous = { ...hsl, h: (hsl.h + offset + 360) % 360 };
                const anaRgb = hslToRgb(analogous.h, analogous.s, analogous.l);
                const div = document.createElement('div');
                div.className = 'palette-color';
                div.style.background = rgbToHex(anaRgb.r, anaRgb.g, anaRgb.b);
                div.onclick = () => updateColor(anaRgb);
                elements.analogousColors.appendChild(div);
            });
        }

        function generateRandomColor() {
            const color = {
                r: Math.floor(Math.random() * 256),
                g: Math.floor(Math.random() * 256),
                b: Math.floor(Math.random() * 256)
            };
            updateColor(color);
        }

        function updateGradient() {
            const start = elements.gradientStart.value;
            const end = elements.gradientEnd.value;
            const direction = elements.gradientDirection.value;

            let gradient;
            if (direction === 'radial') {
                gradient = `radial-gradient(${start}, ${end})`;
            } else {
                gradient = `linear-gradient(${direction}, ${start}, ${end})`;
            }

            elements.gradientDisplay.style.background = gradient;
            elements.gradientCSS.textContent = gradient;
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                elements.copyFeedback.classList.add('show');
                setTimeout(() => elements.copyFeedback.classList.remove('show'), 2000);
            });
        }

        function initializePalettes() {
            // Material Design colors
            const materialColors = [
                '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
                '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
                '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
                '#FF5722', '#795548', '#9E9E9E', '#607D8B'
            ];

            elements.materialPalette.innerHTML = '';
            materialColors.forEach(color => {
                const div = document.createElement('div');
                div.className = 'palette-color';
                div.style.background = color;
                div.onclick = () => {
                    const rgb = hexToRgb(color);
                    updateColor(rgb);
                };
                elements.materialPalette.appendChild(div);
            });

            // Web safe colors (simplified)
            const websafeColors = [];
            for (let r = 0; r <= 255; r += 51) {
                for (let g = 0; g <= 255; g += 102) {
                    for (let b = 0; b <= 255; b += 102) {
                        websafeColors.push(rgbToHex(r, g, b));
                    }
                }
            }

            elements.websafePalette.innerHTML = '';
            websafeColors.slice(0, 36).forEach(color => {
                const div = document.createElement('div');
                div.className = 'palette-color';
                div.style.background = color;
                div.onclick = () => {
                    const rgb = hexToRgb(color);
                    updateColor(rgb);
                };
                elements.websafePalette.appendChild(div);
            });
        }

        // Event listeners
        elements.colorPicker.addEventListener('input', (e) => {
            const rgb = hexToRgb(e.target.value);
            if (rgb) updateColor(rgb);
        });

        elements.hexInput.addEventListener('input', (e) => {
            const rgb = hexToRgb(e.target.value);
            if (rgb) updateColor(rgb);
        });

        elements.rgbInput.addEventListener('input', (e) => {
            const match = e.target.value.match(/(\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
                const color = {
                    r: parseInt(match[1]),
                    g: parseInt(match[2]),
                    b: parseInt(match[3])
                };
                updateColor(color);
            }
        });

        elements.hslInput.addEventListener('input', (e) => {
            const match = e.target.value.match(/(\d+),\s*(\d+)%?,\s*(\d+)%?/);
            if (match) {
                const rgb = hslToRgb(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
                updateColor(rgb);
            }
        });

        elements.randomColorBtn.addEventListener('click', generateRandomColor);

        [elements.gradientStart, elements.gradientEnd, elements.gradientDirection].forEach(el => {
            el.addEventListener('input', updateGradient);
        });

        // Initialize
        initializePalettes();
        updateColor(currentColor);
        updateGradient();
        
        // Back to Tools button functionality
        document.getElementById('back-to-tools-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#utility-tools-section';
        });
