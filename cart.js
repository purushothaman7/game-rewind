class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('gameCart')) || [];
        this.updateCartDisplay();
    }

    addItem(gameId) {
        const game = games.find(g => g.id === gameId);
        if (!game || !game.inStock) return false;

        const existingItem = this.items.find(item => item.id === gameId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: game.id,
                title: game.title,
                price: game.price,
                image: game.image,
                platform: game.platform,
                condition: game.condition,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showCartNotification(`${game.title} added to cart!`);
        return true;
    }

    removeItem(gameId) {
        this.items = this.items.filter(item => item.id !== gameId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(gameId, quantity) {
        const item = this.items.find(item => item.id === gameId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(gameId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('gameCart', JSON.stringify(this.items));
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        const cartIcon = document.getElementById('cartIcon');
        
        if (cartCount) {
            const count = this.getItemCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'block' : 'none';
        }

        this.updateCartModal();
    }

    updateCartModal() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItems) return;

        if (this.items.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            if (cartTotal) cartTotal.textContent = '₹0';
            return;
        }

        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p class="cart-item-platform">${getPlatformName(item.platform)}</p>
                    <p class="cart-item-condition">Condition: ${item.condition}</p>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="remove-btn" onclick="cart.removeItem(${item.id})">Remove</button>
                    </div>
                </div>
                <div class="cart-item-price">₹${item.price * item.quantity}</div>
            </div>
        `).join('');

        if (cartTotal) {
            cartTotal.textContent = `₹${this.getTotal()}`;
        }
    }

    showCartNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
}

const cart = new ShoppingCart();
