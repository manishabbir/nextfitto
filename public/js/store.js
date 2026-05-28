document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
        navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navMenu.classList.remove('active')));
    }

    // Auto-hide flash messages
    document.querySelectorAll('.flash').forEach(el => {
        setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 500); }, 4000);
    });

    // ======================
    // SHOPPING CART SYSTEM
    // ======================
    let cart = JSON.parse(localStorage.getItem('nextfit_cart')) || [];

    function saveCart() {
        localStorage.setItem('nextfit_cart', JSON.stringify(cart));
        updateCartUI();
    }

    function getCartTotal() {
        return cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.qty), 0);
    }

    function getTotalItems() {
        return cart.reduce((sum, item) => sum + item.qty, 0);
    }

    function updateCartUI() {
        const badge = document.getElementById('cart-count');
        if (badge) badge.textContent = getTotalItems();
    }

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.dataset.id;
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            const image = this.dataset.image || '';
            
            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ id, name, price, image, qty: 1 });
            }
            saveCart();
            showToast(`${name} added to cart!`, 'success');
        });
    });

    // Cart toggle
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCart = document.getElementById('close-cart');

    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', () => {
            renderCartItems();
            cartSidebar.classList.add('active');
            if (cartOverlay) cartOverlay.classList.add('active');
        });
    }
    if (closeCart) closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        if (cartOverlay) cartOverlay.classList.remove('active');
    });
    if (cartOverlay) cartOverlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });

    function renderCartItems() {
        const container = document.getElementById('cart-items');
        const totalEl = document.getElementById('cart-total');
        const countEl = document.getElementById('cart-count-sidebar');
        
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Your cart is empty</p></div>';
            if (totalEl) totalEl.textContent = 'Rs. 0';
            if (countEl) countEl.textContent = '(0)';
            return;
        }

        container.innerHTML = cart.map((item, idx) => `
            <div class="cart-item" data-index="${idx}">
                <img src="${item.image || 'https://placehold.co/80x80/eee/999?text=N'}" alt="${item.name}" class="cart-item-img" />
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">Rs. ${(parseFloat(item.price) * item.qty).toLocaleString()}</p>
                    <div class="cart-item-qty">
                        <button class="qty-minus" data-id="${item.id}">−</button>
                        <span>${item.qty}</span>
                        <button class="qty-plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
            </div>
        `).join('');
        
        if (totalEl) totalEl.textContent = 'Rs. ' + getCartTotal().toLocaleString();
        if (countEl) countEl.textContent = '(' + getTotalItems() + ')';

        // Qty buttons
        container.querySelectorAll('.qty-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = cart.find(i => i.id === btn.dataset.id);
                if (item) { item.qty++; saveCart(); renderCartItems(); }
            });
        });
        container.querySelectorAll('.qty-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = cart.find(i => i.id === btn.dataset.id);
                if (item) {
                    item.qty--;
                    if (item.qty <= 0) cart = cart.filter(i => i.id !== item.id);
                    saveCart();
                    renderCartItems();
                }
            });
        });
        container.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                cart = cart.filter(i => i.id !== btn.dataset.id);
                saveCart();
                renderCartItems();
            });
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeModal = document.getElementById('close-modal');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Your cart is empty!', 'error');
                return;
            }
            if (checkoutModal) {
                renderCheckoutSummary();
                checkoutModal.classList.add('active');
                if (cartOverlay) cartOverlay.classList.add('active');
            }
        });
    }
    if (closeModal) closeModal.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
        if (cartOverlay) cartOverlay.classList.remove('active');
    });

    function renderCheckoutSummary() {
        const summary = document.getElementById('checkout-summary');
        if (!summary) return;
        summary.innerHTML = cart.map((item, idx) => `
            <div class="checkout-item">
                <span>${idx + 1}. ${item.name} × ${item.qty}</span>
                <span>Rs. ${(parseFloat(item.price) * item.qty).toLocaleString()}</span>
            </div>
        `).join('');
        document.getElementById('checkout-total-display').textContent = 'Rs. ' + getCartTotal().toLocaleString();
    }

    // Submit order via WhatsApp
    const submitOrder = document.getElementById('submit-order');
    if (submitOrder) {
        submitOrder.addEventListener('click', () => {
            const customerName = document.getElementById('cust-name').value.trim();
            const customerPhone = document.getElementById('cust-phone').value.trim();
            const customerCity = document.getElementById('cust-city').value.trim();
            const customerAddress = document.getElementById('cust-address').value.trim();
            
            if (!customerName || !customerPhone) {
                showToast('Please fill in your name and phone number', 'error');
                return;
            }

            let whatsapp = submitOrder.dataset.whatsapp;
            if (!whatsapp || whatsapp === 'null' || whatsapp === 'undefined') whatsapp = '923001234567';
            
            // Build simple message - no special characters
            let message = 'NEW ORDER - Nextfit\n\n';
            message += 'Customer: ' + customerName + '\n';
            message += 'Phone: ' + customerPhone + '\n';
            if (customerCity) message += 'City: ' + customerCity + '\n';
            if (customerAddress) message += 'Address: ' + customerAddress + '\n\n';
            message += 'ORDER DETAILS:\n';
            message += '----------------\n';
            
            cart.forEach((item, idx) => {
                const subtotal = parseFloat(item.price) * item.qty;
                message += (idx + 1) + '. ' + item.name + ' x ' + item.qty + ' = Rs. ' + subtotal.toLocaleString() + '\n';
            });
            
            message += '----------------\n';
            message += 'TOTAL: Rs. ' + getCartTotal().toLocaleString();

            const url = 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(message);
            console.log('Opening WhatsApp URL:', url);
            window.open(url, '_blank');

            // Clear cart
            cart = [];
            saveCart();
            renderCartItems();
            checkoutModal.classList.remove('active');
            if (cartOverlay) cartOverlay.classList.remove('active');
            showToast('Order sent! We will contact you soon.', 'success');
        });
    }

    // Toast
    let toastTimeout;
    function showToast(msg, type = '') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        clearTimeout(toastTimeout);
        toast.textContent = msg;
        toast.className = 'toast ' + type;
        void toast.offsetWidth;
        toast.classList.add('show');
        toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
    }

    updateCartUI();
});