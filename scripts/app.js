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
function renderProducts(products) {
    productGrid.innerHTML = ''; // Clear "Loading..." text

    products.forEach(product => {
        // Safe Price Calculation
        const priceInr = Math.floor((product.price || 100) * 85);

        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <div class="card-image">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
            </div>
            <div class="card-info">
                <h3 class="card-title">${product.title}</h3>
                <p class="card-price">₹${priceInr.toLocaleString('en-IN')}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// 6. Add to Cart Function
function addToCart(id) {
    alert("Item added to cart!");
}

// 7. Run on Load
document.addEventListener('DOMContentLoaded', fetchProducts);