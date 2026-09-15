let currentInput = '0';
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
    modalElement.style.display = 'flex';
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
                    currentInput = 'Paid!';
                    updateDisplay();
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
