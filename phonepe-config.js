class PhonePePayment {
    constructor() {
        this.config = {
            redirectUrl: window.location.origin + '/payment-success.html',
            callbackUrl: window.location.origin + '/payment-callback.html'
        };
    }

    generateTransactionId() {
        return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);
    }

    async initiatePayment(orderData) {
        try {
            const transactionId = this.generateTransactionId();
            
            localStorage.setItem('pendingOrder_' + transactionId, JSON.stringify({
                ...orderData,
                transactionId: transactionId,
                timestamp: Date.now()
            }));

            this.simulatePaymentFlow(transactionId, orderData);

        } catch (error) {
            console.error('Payment initiation error:', error);
            this.showPaymentError('Failed to initiate payment. Please try again.');
        }
    }

    simulatePaymentFlow(transactionId, orderData) {
        const processingDiv = document.createElement('div');
        processingDiv.className = 'payment-processing pixel-border';
        processingDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
                <h3 style="color: var(--accent); margin-bottom: 1rem;">Processing Payment...</h3>
                <p>Redirecting to payment gateway...</p>
            </div>
        `;
        processingDiv.style.position = 'fixed';
        processingDiv.style.top = '50%';
        processingDiv.style.left = '50%';
        processingDiv.style.transform = 'translate(-50%, -50%)';
        processingDiv.style.zIndex = '3000';
        processingDiv.style.background = 'var(--dark)';
        processingDiv.style.minWidth = '400px';
        
        document.body.appendChild(processingDiv);

        setTimeout(() => {
            document.body.removeChild(processingDiv);
            this.showPaymentOptions(transactionId, orderData);
        }, 3000);
    }

    showPaymentOptions(transactionId, orderData) {
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'payment-options pixel-border';
        optionsDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3 style="color: var(--accent); margin-bottom: 1rem;">Payment Gateway</h3>
                <p style="margin-bottom: 2rem;">Choose payment outcome:</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="pixel-btn" onclick="phonePePayment.simulateSuccess('${transactionId}')" style="background: #4caf50;">
                        <i class="fas fa-check"></i> Success
                    </button>
                    <button class="pixel-btn" onclick="phonePePayment.simulateFailure('${transactionId}')" style="background: #f44336;">
                        <i class="fas fa-times"></i> Failed
                    </button>
                    <button class="pixel-btn" onclick="phonePePayment.cancelPayment('${transactionId}')">
                        <i class="fas fa-arrow-left"></i> Cancel
                    </button>
                </div>
            </div>
        `;
        optionsDiv.style.position = 'fixed';
        optionsDiv.style.top = '50%';
        optionsDiv.style.left = '50%';
        optionsDiv.style.transform = 'translate(-50%, -50%)';
        optionsDiv.style.zIndex = '3000';
        optionsDiv.style.background = 'var(--dark)';
        optionsDiv.style.minWidth = '400px';
        
        document.body.appendChild(optionsDiv);
        this.currentOptionsDiv = optionsDiv;
    }

    simulateSuccess(transactionId) {
        if (this.currentOptionsDiv) {
            document.body.removeChild(this.currentOptionsDiv);
        }
        window.location.href = `payment-success.html?txnId=${transactionId}&status=success`;
    }

    simulateFailure(transactionId) {
        if (this.currentOptionsDiv) {
            document.body.removeChild(this.currentOptionsDiv);
        }
        window.location.href = `payment-success.html?txnId=${transactionId}&status=failed`;
    }

    cancelPayment(transactionId) {
        if (this.currentOptionsDiv) {
            document.body.removeChild(this.currentOptionsDiv);
        }
        localStorage.removeItem('pendingOrder_' + transactionId);
        this.showPaymentError('Payment cancelled by user.');
    }

    showPaymentError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'payment-error pixel-border';
        errorDiv.innerHTML = `
            <h3>Payment Error</h3>
            <p>${message}</p>
            <button class="pixel-btn" onclick="this.parentElement.remove()">OK</button>
        `;
        document.body.appendChild(errorDiv);
    }

    async processCheckout(cartItems, customerInfo) {
        if (!cartItems || cartItems.length === 0) {
            this.showPaymentError('Your cart is empty');
            return;
        }

        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const orderData = {
            items: cartItems,
            amount: totalAmount,
            customerInfo: customerInfo,
            orderDate: new Date().toISOString()
        };

        await this.initiatePayment(orderData);
    }
}

const phonePePayment = new PhonePePayment();
