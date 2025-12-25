// 1. Select Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const productGrid = document.getElementById('product-grid');

// 2. Mobile Menu Logic
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });
}

// 3. Fallback Data (Used if API fails)
const localProducts = [
    { id: 1, title: "Vintage Leather Jacket", price: 120, image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg" },
    { id: 2, title: "Casual Gold Bracelet", price: 695, image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg" },
    { id: 3, title: "Solid Gold Petite Micropave", price: 168, image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg" },
    { id: 4, title: "Retro Camera Lens", price: 59, image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg" }
];

// 4. Main Fetch Function
async function fetchProducts() {
    // If grid doesn't exist, stop immediately
    if (!productGrid) return;

    try {
        console.log("Attempting to fetch from API...");
        const response = await fetch('https://fakestoreapi.com/products?limit=8');
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const products = await response.json();
        console.log("API Success!");
        renderProducts(products);

    } catch (error) {
        console.warn("API Failed or Blocked. Loading Fallback Data.", error);
        renderProducts(localProducts);
    }
}

// 5. Render Function
// 5. Render Function
function renderProducts(products) {
    productGrid.innerHTML = ''; 

    products.forEach(product => {
        const priceInr = Math.floor((product.price || 100) * 85);

        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        // CHANGE: Added <a href> around the image and title to link to product.html
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
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
    
    // Update badge on home page load too
    updateCartCount();
}

// Add this helper to app.js too so the badge works on home page
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badge = document.getElementById('cart-count'); // Make sure to add id="cart-count" to your index.html badge span if missing
    if(badge) badge.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// 6. Add to Cart Function
function addToCart(id) {
    alert("Item added to cart!");
}

// 7. Run on Load
document.addEventListener('DOMContentLoaded', fetchProducts);