// 1. Get Elements
const productContainer = document.getElementById('product-detail');
const cartBadge = document.getElementById('cart-count');

// 2. Extract Product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

let currentProduct = {}; // Store product data globally for this page
let currentQuantity = 1;
let currentPrice = 0;

// 3. Fetch Product Details
async function fetchProductDetails() {
    if (!productId) {
        productContainer.innerHTML = '<p>Product not found.</p>';
        return;
    }

    try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        currentProduct = await response.json();
        renderProduct(currentProduct);
    } catch (error) {
        console.error("Error:", error);
        productContainer.innerHTML = '<p>Failed to load product details.</p>';
    }
}

// 4. Render Product HTML (With Interactive Features)
function renderProduct(product) {
    // Calculate Base Price
    currentPrice = Math.floor(product.price * 85); 

    productContainer.innerHTML = `
        <div class="detail-image" id="zoom-container">
            <img src="${product.image}" alt="${product.title}" id="zoom-img">
        </div>
        <div class="detail-info">
            <h1 class="detail-title">${product.title}</h1>
            <p class="detail-category">${product.category}</p>
            <p class="detail-price">Unit Price: ₹${currentPrice.toLocaleString('en-IN')}</p>
            <p class="detail-desc">${product.description}</p>
            
            <div class="product-options">
                <div class="option-group">
                    <label>Select Size</label>
                    <select id="size-select" class="custom-select">
                        <option value="S">Small (S)</option>
                        <option value="M" selected>Medium (M)</option>
                        <option value="L">Large (L)</option>
                        <option value="XL">Extra Large (XL)</option>
                    </select>
                </div>

                <div class="option-group">
                    <label>Quantity</label>
                    <div class="quantity-selector">
                        <button class="qty-btn" onclick="updateQuantity(-1)">−</button>
                        <input type="text" id="qty-display" class="qty-input" value="1" readonly>
                        <button class="qty-btn" onclick="updateQuantity(1)">+</button>
                    </div>
                    <div class="total-price-display">
                        Total: ₹<span id="total-price">${currentPrice.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>

            <button class="add-to-cart-btn-large" onclick="addToCartWithOptions()">
                Add to Cart
            </button>
            <a href="index.html" class="back-btn">← Back to Shop</a>
        </div>
    `;

    // Initialize Zoom Script after HTML is injected
    initZoom();
}

// 5. Quantity Logic (Subtask Requirement: Real-time Price Update)
window.updateQuantity = function(change) {
    let newQty = currentQuantity + change;
    if (newQty < 1) newQty = 1; // Prevent zero or negative
    if (newQty > 10) newQty = 10; // Max limit

    currentQuantity = newQty;
    
    // Update Input
    document.getElementById('qty-display').value = currentQuantity;
    
    // Update Total Price
    const total = currentPrice * currentQuantity;
    document.getElementById('total-price').innerText = total.toLocaleString('en-IN');
};

// 6. Advanced Zoom Logic (Mouse Tracking)
function initZoom() {
    const container = document.getElementById('zoom-container');
    const img = document.getElementById('zoom-img');

    if (container && img) {
        container.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = container.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;

            // Move the image origin based on mouse position
            const xPercent = (x / width) * 100;
            const yPercent = (y / height) * 100;

            img.style.transformOrigin = `${xPercent}% ${yPercent}%`;
            img.style.transform = "scale(2)"; // Zoom Level
        });

        container.addEventListener('mouseleave', () => {
            img.style.transform = "scale(1)"; // Reset
            img.style.transformOrigin = "center center";
        });
    }
}

// 7. Add to Cart (With Size & Quantity)
window.addToCartWithOptions = function() {
    const size = document.getElementById('size-select').value;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Create a unique ID for this specific variation (Product ID + Size)
    // This allows you to have "Shirt (M)" and "Shirt (L)" as separate items in cart
    const uniqueId = `${currentProduct.id}-${size}`;

    const existingItem = cart.find(item => item.uniqueId === uniqueId);

    if (existingItem) {
        existingItem.quantity += currentQuantity;
    } else {
        cart.push({ 
            id: currentProduct.id,
            uniqueId: uniqueId, // New unique tracker
            title: currentProduct.title, 
            price: currentPrice, // Store INR price
            image: currentProduct.image, 
            quantity: currentQuantity,
            size: size 
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`Added ${currentQuantity} x ${size} to cart!`);
};

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if(cartBadge) cartBadge.textContent = totalItems;
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProductDetails();
    updateCartCount();
});