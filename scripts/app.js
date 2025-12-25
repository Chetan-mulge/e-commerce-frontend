// 1. Select Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const productGrid = document.getElementById('product-grid');
const cartBadge = document.getElementById('cart-count');

// 2. Mobile Menu Logic
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });
}

// 3. Fallback Data
const localProducts = [
    { id: 1, title: "Vintage Leather Jacket", price: 120, image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg" },
    { id: 2, title: "Casual Gold Bracelet", price: 695, image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg" },
    { id: 3, title: "Solid Gold Petite Micropave", price: 168, image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg" },
    { id: 4, title: "Retro Camera Lens", price: 59, image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg" }
];

// 4. Main Fetch Function
async function fetchProducts() {
    if (!productGrid) return;

    try {
        const response = await fetch('https://fakestoreapi.com/products?limit=8');
        if (!response.ok) throw new Error('Network response was not ok');
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.warn("API Failed. Loading Fallback Data.", error);
        renderProducts(localProducts);
    }
}

// 5. Render Function
function renderProducts(products) {
    productGrid.innerHTML = ''; 

    products.forEach(product => {
        // Safe Price Calculation
        const priceInr = Math.floor((product.price || 100) * 85);
        
        // Escape quotes for the onclick function to prevent errors
        const safeTitle = product.title.replace(/'/g, "\\'"); 
        const safeImage = product.image;

        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <div class="card-image">
                <a href="product.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                </a>
            </div>
            <div class="card-info">
                <a href="product.html?id=${product.id}" style="text-decoration:none;">
                    <h3 class="card-title">${product.title}</h3>
                </a>
                <p class="card-price">₹${priceInr.toLocaleString('en-IN')}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}, '${safeTitle}', ${priceInr}, '${safeImage}')">
                    Add to Cart
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
    
    // Update badge on load
    updateCartCount();
}

// 6. REAL Add to Cart Function (Home Page Version)
function addToCart(id, title, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Default to 'Medium' size for homepage adds
    const size = "M"; 
    const uniqueId = `${id}-${size}`;

    const existingItem = cart.find(item => item.uniqueId === uniqueId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            uniqueId: uniqueId,
            title: title,
            price: price,
            image: image,
            quantity: 1,
            size: size
        });
    }

    // Save to Local Storage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update Badge
    updateCartCount();
    
    // Feedback
    alert(`${title} added to cart!`);
}

// 7. Update Cart Count Badge
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if(cartBadge) cartBadge.textContent = totalItems;
}

// Run on load
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartCount(); // This forces the number to update immediately
});