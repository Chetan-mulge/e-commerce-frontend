// 1. Get Elements
const cartItemsContainer = document.getElementById('cart-items');
const subtotalEl = document.getElementById('subtotal-price');
const totalEl = document.getElementById('total-price');
const cartBadge = document.getElementById('cart-count');

// 2. Load Cart on Page Load
function loadCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    updateCartBadge(cart);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is currently empty.</p>
                <a href="index.html" class="btn-primary" style="margin-top:20px; display:inline-block;">Start Shopping</a>
            </div>
        `;
        updateTotals(0);
        return;
    }

    renderCartItems(cart);
    calculateTotal(cart);
}

// 3. Render Items
function renderCartItems(cart) {
    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;

        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item');
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="item-details">
                <h3>${item.title}</h3>
                <p>Size: ${item.size || 'M'}</p>
                <p class="item-price">₹${item.price.toLocaleString('en-IN')}</p>
            </div>
            <div class="item-actions">
                <div class="quantity-selector small">
                    <button onclick="changeQty('${item.uniqueId}', -1)">−</button>
                    <input type="text" value="${item.quantity}" readonly>
                    <button onclick="changeQty('${item.uniqueId}', 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeItem('${item.uniqueId}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });
}

// 4. Change Quantity
window.changeQty = function(uniqueId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.uniqueId === uniqueId);

    if (item) {
        item.quantity += change;
        if (item.quantity < 1) item.quantity = 1;
        
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart(); // Re-render
    }
};

// 5. Remove Item
window.removeItem = function(uniqueId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(i => i.uniqueId !== uniqueId); // Remove specific item
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); // Re-render
};

// 6. Calculate Totals
function calculateTotal(cart) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateTotals(total);
}

function updateTotals(amount) {
    const formatted = `₹${amount.toLocaleString('en-IN')}`;
    if(subtotalEl) subtotalEl.innerText = formatted;
    if(totalEl) totalEl.innerText = formatted;
}

function updateCartBadge(cart) {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    if(cartBadge) cartBadge.innerText = count;
}

// Run logic
document.addEventListener('DOMContentLoaded', loadCart);