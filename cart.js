// This file handles adding, removing, and showing items in the shopping cart across all pages.

// 1. Wait for the webpage elements to load fully
document.addEventListener("DOMContentLoaded", () => {
    injectCartUI();
    updateCartCount();
});

// 2. Inject the professional sliding cart panel into whatever page the user is viewing
function injectCartUI() {
    const cartHTML = `
        <div id="cart-floating-btn" onclick="toggleCartPanel(true)">
            🛒 <span id="cart-counter">0</span>
        </div>

        <div id="cart-sidebar">
            <div class="cart-header">
                <h2>Your Shopping Cart</h2>
                <button class="close-cart-btn" onclick="toggleCartPanel(false)">×</button>
            </div>
            <div id="cart-items-list">
                </div>
            <div class="cart-footer">
                <div class="cart-total-row">
                    <strong>Total:</strong>
                    <span id="cart-total-price">0.00da</span>
                </div>
                <button class="checkout-btn" onclick="alert('Checkout integration coming up next step!')">Proceed to Secure Checkout</button>
            </div>
        </div>
        <div id="cart-overlay" onclick="toggleCartPanel(false)"></div>
    `;

    // Inject these elements directly to the bottom of the body tag safely
    document.body.insertAdjacentHTML('beforeend', cartHTML);
    renderCartItems();
}

// 3. Open or close the side drawer panel smoothly
function toggleCartPanel(open) {
    const sidebar = document.getElementById("cart-sidebar");
    const overlay = document.getElementById("cart-overlay");
    if (open) {
        sidebar.classList.add("active");
        overlay.classList.add("active");
        renderCartItems(); // refresh elements
    } else {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    }
}

// 4. Global Action Function to Add Items into Local Storage Memory
window.addToCart = function(id, name, price, image) {
    let cart = JSON.parse(localStorage.getItem("furniture_cart")) || [];
    
    // Check if the exact product already exists in the cart list
    const existingProductIndex = cart.findIndex(item => item.id === id);
    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ id, name, price: parseFloat(price), image, quantity: 1 });
    }
    
    localStorage.setItem("furniture_cart", JSON.stringify(cart));
    updateCartCount();
    toggleCartPanel(true); // Open the drawer immediately so they see it work!
};

// 5. Delete item function
window.removeFromCart = function(id) {
    let cart = JSON.parse(localStorage.getItem("furniture_cart")) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("furniture_cart", JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
};

// 6. Update the small numbered pill badge count globally
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("furniture_cart")) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counterPill = document.getElementById("cart-counter");
    if (counterPill) counterPill.innerText = totalCount;
}

// 7. Render local data array systematically into clean HTML entries inside the drawer
function renderCartItems() {
    const listContainer = document.getElementById("cart-items-list");
    const totalPriceElement = document.getElementById("cart-total-price");
    let cart = JSON.parse(localStorage.getItem("furniture_cart")) || [];
    
    if (!listContainer) return;
    
    if (cart.length === 0) {
        listContainer.innerHTML = `<div class="empty-message">Your cart feels lonely. Add luxury pieces!</div>`;
        totalPriceElement.innerText = "0.00 da";
        return;
    }
    
    let listHTML = "";
    let finalTotal = 0;
    
    cart.forEach(item => {
        const lineTotal = item.price * item.quantity;
        finalTotal += lineTotal;
        listHTML += `
            <div class="cart-item-row">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.price.toFixed(2)}da × ${item.quantity}</p>
                </div>
                <button class="remove-item-cross" onclick="removeFromCart('${item.id}')">×</button>
            </div>
        `;
    });
    
    listContainer.innerHTML = listHTML;
    totalPriceElement.innerText = `${finalTotal.toFixed(2)}da`;
}
