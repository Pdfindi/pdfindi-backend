const weightInput = document.getElementById('weight');
        const heightInput = document.getElementById('height');
        const calculateBtn = document.getElementById('calculate-btn');
        const bmiResult = document.getElementById('bmi-result');
        const bmiAdvice = document.getElementById('bmi-advice');
        const bmiValue = document.getElementById('bmi-value');
        const bmiCategory = document.getElementById('bmi-category');
        const adviceText = document.getElementById('advice-text');

        function getBMICategory(bmi) {
            if (bmi < 18.5) return 'Underweight';
            if (bmi < 25) return 'Normal Weight';
            if (bmi < 30) return 'Overweight';
            return 'Obesity';
        }

        function getBMIAdvice(category) {
            const advice = {
                'Underweight': 'You may want to gain weight through a balanced diet and exercise. Consider consulting with a healthcare provider.',
                'Normal Weight': 'Great! You\'re in the healthy weight range. Maintain your current lifestyle with regular exercise and balanced nutrition.',
                'Overweight': 'Consider losing weight through a combination of healthy diet and regular physical activity. Small changes can make a big difference.',
                'Obesity': 'It\'s recommended to lose weight for better health. Consider consulting with a healthcare provider for a personalized weight loss plan.'
            };
            return advice[category] || 'Please consult with a healthcare provider for personalized advice.';
        }

        function calculateBMI() {
            const weight = parseFloat(weightInput.value);
            const height = parseFloat(heightInput.value) / 100; // Convert cm to meters
            
            if (!weight || !height) {
                alert('Please enter valid weight and height values.');
                return;
            }
            
            if (weight <= 0 || height <= 0) {
                alert('Weight and height must be positive numbers.');
                return;
            }
            
            const bmi = weight / (height * height);
            const category = getBMICategory(bmi);
            const advice = getBMIAdvice(category);
            
            // Update UI
            bmiValue.textContent = bmi.toFixed(1);
            bmiCategory.textContent = category;
            adviceText.textContent = advice;
            
            // Highlight current range
            const ranges = document.querySelectorAll('.bmi-range');
            ranges.forEach(range => range.classList.remove('current-range'));
            
            let rangeIndex = 0;
            if (bmi >= 18.5 && bmi < 25) rangeIndex = 1;
            else if (bmi >= 25 && bmi < 30) rangeIndex = 2;
            else if (bmi >= 30) rangeIndex = 3;
            
            ranges[rangeIndex].classList.add('current-range');
            
            // Update colors based on category
            const resultElement = document.getElementById('bmi-result');
            if (category === 'Normal Weight') {
                resultElement.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            } else if (category === 'Overweight') {
                resultElement.style.background = 'linear-gradient(135deg, #ffc107, #fd7e14)';
            } else if (category === 'Obesity') {
                resultElement.style.background = 'linear-gradient(135deg, #dc3545, #138808)';
            } else {
                resultElement.style.background = 'linear-gradient(135deg, #17a2b8, #20c997)';
            }
            
            bmiResult.classList.remove('hidden');
            bmiAdvice.classList.remove('hidden');
        }

        calculateBtn.addEventListener('click', calculateBMI);
        
        // Allow Enter key to calculate
        [weightInput, heightInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    calculateBMI();
                }
            });
        });

        // Auto-calculate on input change (with debounce)
        let timeout;
        [weightInput, heightInput].forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    if (weightInput.value && heightInput.value) {
                        calculateBMI();
                    }
                }, 500);
            });
        });
        
        // Back to Tools button functionality
        document.getElementById('back-to-tools-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#utility-tools-section';
        });
