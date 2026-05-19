const categories = {
            length: {
                m: { name: 'Meters', factor: 1 },
                km: { name: 'Kilometers', factor: 1000 },
                cm: { name: 'Centimeters', factor: 0.01 },
                mm: { name: 'Millimeters', factor: 0.001 },
                in: { name: 'Inches', factor: 0.0254 },
                ft: { name: 'Feet', factor: 0.3048 },
                yd: { name: 'Yards', factor: 0.9144 },
                mi: { name: 'Miles', factor: 1609.34 }
            },
            weight: {
                kg: { name: 'Kilograms', factor: 1 },
                g: { name: 'Grams', factor: 0.001 },
                mg: { name: 'Milligrams', factor: 0.000001 },
                lb: { name: 'Pounds', factor: 0.453592 },
                oz: { name: 'Ounces', factor: 0.0283495 },
                t: { name: 'Tonnes', factor: 1000 }
            },
            temperature: {
                c: { name: 'Celsius', factor: 1 },
                f: { name: 'Fahrenheit', factor: 1 },
                k: { name: 'Kelvin', factor: 1 }
            },
            area: {
                sqm: { name: 'Square Meters', factor: 1 },
                sqkm: { name: 'Square Kilometers', factor: 1000000 },
                sqcm: { name: 'Square Centimeters', factor: 0.0001 },
                sqft: { name: 'Square Feet', factor: 0.092903 },
                sqin: { name: 'Square Inches', factor: 0.00064516 },
                acre: { name: 'Acres', factor: 4046.86 }
            },
            volume: {
                l: { name: 'Liters', factor: 1 },
                ml: { name: 'Milliliters', factor: 0.001 },
                gal: { name: 'Gallons (US)', factor: 3.78541 },
                qt: { name: 'Quarts (US)', factor: 0.946353 },
                pt: { name: 'Pints (US)', factor: 0.473176 },
                cup: { name: 'Cups (US)', factor: 0.236588 }
            },
            speed: {
                mps: { name: 'Meters/Second', factor: 1 },
                kmh: { name: 'Kilometers/Hour', factor: 0.277778 },
                mph: { name: 'Miles/Hour', factor: 0.44704 },
                fps: { name: 'Feet/Second', factor: 0.3048 },
                knot: { name: 'Knots', factor: 0.514444 }
            }
        };

        const fromValue = document.getElementById('from-value');
        const toValue = document.getElementById('to-value');
        const fromUnit = document.getElementById('from-unit');
        const toUnit = document.getElementById('to-unit');
        const resultDisplay = document.getElementById('result-display');
        const resultText = document.getElementById('result-text');
        const swapBtn = document.getElementById('swap-btn');
        const categoryTabs = document.querySelectorAll('.category-tab');

        let currentCategory = 'length';

        function populateUnits() {
            const units = categories[currentCategory];
            fromUnit.innerHTML = '';
            toUnit.innerHTML = '';
            
            Object.keys(units).forEach(key => {
                const option1 = document.createElement('option');
                option1.value = key;
                option1.textContent = units[key].name;
                fromUnit.appendChild(option1);
                
                const option2 = document.createElement('option');
                option2.value = key;
                option2.textContent = units[key].name;
                toUnit.appendChild(option2);
            });
            
            // Set default units
            const unitKeys = Object.keys(units);
            if (unitKeys.length > 1) {
                toUnit.value = unitKeys[1];
            }
        }

        function convertTemperature(value, from, to) {
            // Convert to Celsius first
            let celsius = value;
            if (from === 'f') celsius = (value - 32) * 5/9;
            if (from === 'k') celsius = value - 273.15;
            
            // Convert from Celsius to target
            if (to === 'f') return celsius * 9/5 + 32;
            if (to === 'k') return celsius + 273.15;
            return celsius;
        }

        function convert() {
            const inputValue = parseFloat(fromValue.value);
            if (isNaN(inputValue)) {
                toValue.value = '';
                resultDisplay.style.display = 'none';
                return;
            }

            const fromUnitKey = fromUnit.value;
            const toUnitKey = toUnit.value;
            
            let result;
            
            if (currentCategory === 'temperature') {
                result = convertTemperature(inputValue, fromUnitKey, toUnitKey);
            } else {
                const units = categories[currentCategory];
                const fromFactor = units[fromUnitKey].factor;
                const toFactor = units[toUnitKey].factor;
                result = inputValue * fromFactor / toFactor;
            }
            
            toValue.value = result.toFixed(6).replace(/\.?0+$/, '');
            
            // Update result display
            const fromUnitName = categories[currentCategory][fromUnitKey].name;
            const toUnitName = categories[currentCategory][toUnitKey].name;
            resultText.textContent = `${inputValue} ${fromUnitName} = ${toValue.value} ${toUnitName}`;
            resultDisplay.style.display = 'block';
        }

        function switchCategory(category) {
            currentCategory = category;
            categoryTabs.forEach(tab => {
                tab.classList.toggle('active', tab.dataset.category === category);
            });
            populateUnits();
            convert();
        }

        function swapUnits() {
            const tempValue = fromUnit.value;
            fromUnit.value = toUnit.value;
            toUnit.value = tempValue;
            
            const tempInputValue = fromValue.value;
            fromValue.value = toValue.value;
            toValue.value = tempInputValue;
            
            convert();
        }

        // Event listeners
        fromValue.addEventListener('input', convert);
        fromUnit.addEventListener('change', convert);
        toUnit.addEventListener('change', convert);
        swapBtn.addEventListener('click', swapUnits);

        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                switchCategory(tab.dataset.category);
            });
        });

        // Initialize
        populateUnits();
        fromValue.value = '1';
        convert();
        
        // Back to Tools button functionality
        document.getElementById('back-to-tools-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#utility-tools-section';
        });
