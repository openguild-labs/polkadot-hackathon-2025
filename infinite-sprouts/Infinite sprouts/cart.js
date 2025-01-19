function toggleCart() {
    const cartSection = document.getElementById('cart-section');
    const overlay = document.getElementById('overlay');
    
    // Toggle the cart's visibility
    const isActive = cartSection.classList.toggle('active');
    overlay.classList.toggle('active', isActive); // Sync overlay visibility

    // If the cart is open, add a click listener to the overlay
    if (isActive) {
        overlay.addEventListener('click', closeCart);
    } else {
        overlay.removeEventListener('click', closeCart);
    }
}

function closeCart() {
    const cartSection = document.getElementById('cart-section');
    const overlay = document.getElementById('overlay');
    
    // Hide the cart and overlay
    cartSection.classList.remove('active');
    overlay.classList.remove('active');
}


function toggleCart() {
    const cartSection = document.getElementById('cart-section');
    if (cartSection) {
        cartSection.classList.toggle('active'); // Add/remove "active" class
    }
    renderCartItems(); // Refresh the cart items display
}



function toggleCart() {
    const cartSection = document.getElementById('cart-section');
    const overlay = document.getElementById('overlay');

    cartSection.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeCart() {
    const cartSection = document.getElementById('cart-section');
    const overlay = document.getElementById('overlay');

    cartSection.classList.remove('active');
    overlay.classList.remove('active');
}
