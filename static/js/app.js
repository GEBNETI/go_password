document.addEventListener('DOMContentLoaded', function() {
    const passwordDisplay = document.getElementById('passwordDisplay');
    const copyBtn = document.getElementById('copyBtn');
    const regenerateBtn = document.getElementById('regenerateBtn');
    const mainCopyBtn = document.getElementById('mainCopyBtn');
    const lengthSlider = document.getElementById('lengthSlider');
    const lengthValue = document.getElementById('lengthValue');
    const progressFill = document.getElementById('progressFill');
    
    const uppercase = document.getElementById('uppercase');
    const lowercase = document.getElementById('lowercase');
    const numbers = document.getElementById('numbers');
    const symbols = document.getElementById('symbols');
    
    const easyToSay = document.getElementById('easyToSay');
    const easyToRead = document.getElementById('easyToRead');
    const allCharacters = document.getElementById('allCharacters');

    function getPasswordConfig() {
        return {
            length: parseInt(lengthSlider.value),
            useUppercase: uppercase.checked,
            useLowercase: lowercase.checked,
            useNumbers: numbers.checked,
            useSymbols: symbols.checked,
            easyToSay: easyToSay.checked,
            easyToRead: easyToRead.checked,
            allCharacters: allCharacters.checked
        };
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 12) strength += 25;
        else if (password.length >= 8) strength += 15;
        else strength += 5;
        
        if (/[a-z]/.test(password)) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^A-Za-z0-9]/.test(password)) strength += 15;
        
        return Math.min(strength, 100);
    }

    function updateProgressBar(password) {
        const strength = calculatePasswordStrength(password);
        progressFill.style.width = strength + '%';
        
        if (strength < 40) {
            progressFill.style.backgroundColor = '#f44336';
        } else if (strength < 70) {
            progressFill.style.backgroundColor = '#ff9800';
        } else {
            progressFill.style.backgroundColor = '#4caf50';
        }
    }

    async function generatePassword() {
        const config = getPasswordConfig();
        
        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config)
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate password');
            }
            
            const data = await response.json();
            passwordDisplay.textContent = data.password;
            updateProgressBar(data.password);
        } catch (error) {
            console.error('Error generating password:', error);
            passwordDisplay.textContent = 'Error generating password';
        }
    }

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(passwordDisplay.textContent);
            
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✓';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
            
            mainCopyBtn.textContent = 'Copiado!';
            setTimeout(() => {
                mainCopyBtn.textContent = 'Copiar contraseña';
            }, 2000);
        } catch (error) {
            console.error('Failed to copy password:', error);
        }
    }

    lengthSlider.addEventListener('input', function() {
        lengthValue.value = this.value;
        generatePassword();
    });

    lengthValue.addEventListener('input', function() {
        const value = Math.min(Math.max(parseInt(this.value) || 4, 4), 50);
        this.value = value;
        lengthSlider.value = value;
        generatePassword();
    });

    [uppercase, lowercase, numbers, symbols].forEach(checkbox => {
        checkbox.addEventListener('change', generatePassword);
    });

    [easyToSay, easyToRead, allCharacters].forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.id === 'easyToSay') {
                symbols.checked = false;
                symbols.disabled = true;
                numbers.checked = false;
                numbers.disabled = true;
            } else if (this.id === 'easyToRead') {
                symbols.disabled = false;
                numbers.disabled = false;
            } else if (this.id === 'allCharacters') {
                uppercase.checked = true;
                lowercase.checked = true;
                numbers.checked = true;
                symbols.checked = true;
                symbols.disabled = false;
                numbers.disabled = false;
            }
            generatePassword();
        });
    });

    copyBtn.addEventListener('click', copyToClipboard);
    mainCopyBtn.addEventListener('click', copyToClipboard);
    regenerateBtn.addEventListener('click', generatePassword);

    generatePassword();
});