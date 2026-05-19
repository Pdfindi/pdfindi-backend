const birthdateInput = document.getElementById('birthdate');
        const calculateBtn = document.getElementById('calculate-btn');
        const ageResult = document.getElementById('age-result');
        const nextBirthday = document.getElementById('next-birthday');
        const ageMain = document.getElementById('age-main');
        const yearsSpan = document.getElementById('years');
        const monthsSpan = document.getElementById('months');
        const daysSpan = document.getElementById('days');
        const hoursSpan = document.getElementById('hours');
        const minutesSpan = document.getElementById('minutes');
        const secondsSpan = document.getElementById('seconds');
        const nextBirthdayText = document.getElementById('next-birthday-text');

        // Set max date to today
        const today = new Date().toISOString().split('T')[0];
        birthdateInput.max = today;

        function calculateAge() {
            const birthdate = new Date(birthdateInput.value);
            const now = new Date();
            
            if (!birthdateInput.value) {
                alert('Please select your birth date.');
                return;
            }
            
            if (birthdate > now) {
                alert('Birth date cannot be in the future.');
                return;
            }
            
            // Calculate exact age
            let years = now.getFullYear() - birthdate.getFullYear();
            let months = now.getMonth() - birthdate.getMonth();
            let days = now.getDate() - birthdate.getDate();
            
            if (days < 0) {
                months--;
                days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            }
            
            if (months < 0) {
                years--;
                months += 12;
            }
            
            // Calculate total values
            const totalMonths = years * 12 + months;
            const totalDays = Math.floor((now - birthdate) / (1000 * 60 * 60 * 24));
            const totalHours = totalDays * 24;
            const totalMinutes = totalHours * 60;
            const totalSeconds = totalMinutes * 60;
            
            // Calculate next birthday
            const nextBirthdayYear = now.getFullYear();
            let nextBirthdayDate = new Date(nextBirthdayYear, birthdate.getMonth(), birthdate.getDate());
            
            if (nextBirthdayDate < now) {
                nextBirthdayDate = new Date(nextBirthdayYear + 1, birthdate.getMonth(), birthdate.getDate());
            }
            
            const daysToNextBirthday = Math.ceil((nextBirthdayDate - now) / (1000 * 60 * 60 * 24));
            
            // Update UI
            ageMain.textContent = `You are ${years} years old!`;
            yearsSpan.textContent = years;
            monthsSpan.textContent = totalMonths.toLocaleString();
            daysSpan.textContent = totalDays.toLocaleString();
            hoursSpan.textContent = totalHours.toLocaleString();
            minutesSpan.textContent = totalMinutes.toLocaleString();
            secondsSpan.textContent = totalSeconds.toLocaleString();
            
            nextBirthdayText.textContent = `${daysToNextBirthday} days from now (${nextBirthdayDate.toLocaleDateString()})`;
            
            ageResult.classList.remove('hidden');
            nextBirthday.classList.remove('hidden');
        }

        calculateBtn.addEventListener('click', calculateAge);
        
        // Allow Enter key to calculate
        birthdateInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculateAge();
            }
        });
        
        // Back to Tools button functionality
        document.getElementById('back-to-tools-btn').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#utility-tools-section';
        });
