let currentInput = '0';
let isPremium = localStorage.getItem('isPremium') === 'true';
const displayElement = document.getElementById('display');
const modalElement = document.getElementById('premiumModal');

function updateDisplay() {
    displayElement.innerText = currentInput;
}

function appendNumber(number) {
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function appendOperator(op) {
    if (op === '+/-') {
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.slice(1);
        } else if (currentInput !== '0') {
            currentInput = '-' + currentInput;
        }
    } else if (op === '%') {
        currentInput += '%';
    } else {
        currentInput += ` ${op} `;
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    updateDisplay();
}

function calculateResult() {
    if (!isPremium) {
        modalElement.style.display = 'flex';
    } else {
        try {
            // Replace % with /100 for basic percentage calculation
            let evalString = currentInput.replace(/%/g, '/100');
            let result = eval(evalString);
            
            if (result === undefined || Number.isNaN(result) || !isFinite(result)) {
                currentInput = 'Error';
            } else {
                currentInput = String(result);
            }
            updateDisplay();
        } catch (error) {
            currentInput = 'Error';
            updateDisplay();
        }
    }
}

function closeModal() {
    modalElement.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target === modalElement) {
        closeModal();
    }
}

async function payMidtrans() {
    const payButton = document.getElementById('pay-button');
    payButton.innerText = 'Connecting...';
    payButton.disabled = true;

    try {
        const response = await fetch('/api/charge', {
            method: 'POST'
        });
        
        const data = await response.json();

        if (data.token) {
            closeModal();
            window.snap.pay(data.token, {
                onSuccess: function(result){
                    alert("Payment success!");
                    isPremium = true;
                    localStorage.setItem('isPremium', 'true');
                    calculateResult();
                },
                onPending: function(result){
                    alert("Waiting for payment...");
                },
                onError: function(result){
                    alert("Payment failed!");
                },
                onClose: function(){
                    alert('Payment cancelled');
                }
            });
        } else {
            alert('Failed to get token: ' + JSON.stringify(data));
        }
    } catch (error) {
        alert('Network or server error: ' + error.message);
    } finally {
        payButton.innerText = 'Subscribe Now';
        payButton.disabled = false;
    }
}
