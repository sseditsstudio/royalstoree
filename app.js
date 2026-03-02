// ═══════════════════════════════════════════════════════════════
// ROYAL STORE — Elite Frontend Application
// ═══════════════════════════════════════════════════════════════
(function () {
    'use strict';
    const API = window.location.origin;
    const ADMIN_EMAIL = 'siddharths1003@gmail.com';

    // ── STATE ──
    let currentUser = JSON.parse(localStorage.getItem('royal_user')) || null;
    let cart = JSON.parse(localStorage.getItem('royal_cart')) || [];
    let orders = JSON.parse(localStorage.getItem('royal_orders')) || [];
    let searchHistory = JSON.parse(localStorage.getItem('royal_searches')) || [];
    let products = JSON.parse(localStorage.getItem('royal_products')) || getDefaultProducts();
    let banners = JSON.parse(localStorage.getItem('royal_banners')) || getDefaultBanners();
    let captchaText = '';
    let pendingAuth = {};
    let offerSlideIdx = 0;

    function getDefaultProducts() {
        return [
            { id: 1, name: "Organic Alphonso Mangoes", price: 750, category: "fruits", img: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600" },
            { id: 2, name: "Fresh Blueberries Pack", price: 499, category: "fruits", img: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600" },
            { id: 3, name: "Amul Gold Milk 1L", price: 68, category: "dairy", img: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600" },
            { id: 4, name: "Artisan Cheese Platter", price: 1250, category: "dairy", img: "https://images.unsplash.com/photo-1631206753348-db4496b27004?w=600" },
            { id: 5, name: "Basmati Rice Premium 5KG", price: 680, category: "grains", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600" },
            { id: 6, name: "Organic Quinoa 500g", price: 450, category: "grains", img: "https://images.unsplash.com/photo-1612257416648-ee7a6c5b49eb?w=600" },
            { id: 7, name: "Belgian Dark Chocolate", price: 380, category: "snacks", img: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600" },
            { id: 8, name: "Himalayan Pink Salt", price: 320, category: "snacks", img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600" },
            { id: 9, name: "Darjeeling First Flush Tea", price: 550, category: "beverages", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600" },
            { id: 10, name: "Cold Pressed Olive Oil", price: 890, category: "beverages", img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600" },
            { id: 11, name: "Fresh Atlantic Salmon", price: 1800, category: "meat", img: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=600" },
            { id: 12, name: "Premium Chicken Breast", price: 420, category: "meat", img: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600" },
        ];
    }

    function getDefaultBanners() {
        return [
            { text: "🎉 Grand Opening Sale — Flat 20% off on all Fruits & Vegetables!", color: "#fff", bg1: "#3A7BD5", bg2: "#00D2FF", align: "center", valign: "center", size: "1.6rem", img: "" },
            { text: "🚚 Free Delivery within 15 KM — Order now and enjoy!", color: "#fff", bg1: "#00796B", bg2: "#26A69A", align: "center", valign: "center", size: "1.4rem", img: "" },
            { text: "Enjoy shopping with Royal Store", color: "#E6F1FF", bg1: "#020C1B", bg2: "#0A192F", align: "center", valign: "center", size: "1.6rem", img: "" }
        ];
    }

    function saveState() {
        localStorage.setItem('royal_products', JSON.stringify(products));
        localStorage.setItem('royal_banners', JSON.stringify(banners));
        localStorage.setItem('royal_cart', JSON.stringify(cart));
        localStorage.setItem('royal_orders', JSON.stringify(orders));
        localStorage.setItem('royal_searches', JSON.stringify(searchHistory));
    }

    // ── DOM READY ──
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        setupPreloader();
        setupParticles();
        setupNav();
        setupAuth();
        setupShop();
        setupCart();
        setupCheckout();
        setupAI();
        setupAdminPanel();
        setupUserDropdown();
        renderOfferCarousel();
        animateStats();
        checkAuthStatus();
    }

    // ── PRELOADER ──
    function setupPreloader() {
        const p = document.getElementById('preloader');
        setTimeout(() => { p.classList.add('fade-out'); setTimeout(() => p.classList.add('hidden'), 800); }, 2000);
    }

    // ── PARTICLES ──
    function setupParticles() {
        const c = document.getElementById('particles');
        if (!c) return;
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = (80 + Math.random() * 20) + '%';
            p.style.animationDuration = (8 + Math.random() * 12) + 's';
            p.style.animationDelay = Math.random() * 10 + 's';
            p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
            c.appendChild(p);
        }
    }

    // ── NAVIGATION ──
    function setupNav() {
        window.addEventListener('scroll', () => {
            document.getElementById('main-nav').classList.toggle('scrolled', window.scrollY > 40);
        });
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(l => {
            l.addEventListener('click', e => { e.preventDefault(); navigateTo(l.dataset.page); closeMobileDrawer(); });
        });
        document.getElementById('nav-logo-link').addEventListener('click', e => { e.preventDefault(); navigateTo('hero'); });
        document.getElementById('hero-shop-btn').addEventListener('click', () => navigateTo('shop'));
        document.getElementById('hero-offers-btn').addEventListener('click', () => {
            document.getElementById('offer-carousel').scrollIntoView({ behavior: 'smooth' });
        });
        // Mobile
        document.getElementById('mobile-menu-toggle').addEventListener('click', () => {
            document.getElementById('mobile-drawer').classList.remove('hidden');
        });
        document.getElementById('close-mobile-drawer').addEventListener('click', closeMobileDrawer);
        document.getElementById('mobile-drawer-overlay').addEventListener('click', closeMobileDrawer);
    }

    function closeMobileDrawer() { document.getElementById('mobile-drawer').classList.add('hidden'); }

    function navigateTo(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
        const el = document.getElementById('page-' + page);
        if (el) { el.classList.remove('hidden'); el.style.animation = 'none'; el.offsetHeight; el.style.animation = 'fadeIn 0.5s ease'; }
        document.querySelectorAll('.nav-link,.mobile-nav-link').forEach(l => {
            l.classList.toggle('active', l.dataset.page === page);
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (page === 'shop') renderProducts();
        if (page === 'orders') renderOrders();
        if (page === 'admin') { renderAdminProducts(); renderAdminBanners(); renderAdminOrders(); }
    }

    // ── AUTH ──
    function checkAuthStatus() {
        if (!currentUser) {
            document.getElementById('auth-modal').classList.remove('hidden');
            generateCaptcha();
        } else {
            document.getElementById('auth-modal').classList.add('hidden');
            updateUserUI();
            if (currentUser.email === ADMIN_EMAIL) {
                document.querySelectorAll('.admin-link').forEach(l => l.classList.remove('hidden'));
            }
            showRecommendations();
        }
    }

    function updateUserUI() {
        const btn = document.getElementById('user-btn');
        btn.innerHTML = `<i class="fas fa-user-check" style="color:var(--success)"></i>`;
        document.getElementById('user-dd-name').textContent = currentUser.name || 'User';
        document.getElementById('user-dd-email').textContent = currentUser.email || '';
    }

    function setupAuth() {
        // Tabs
        document.querySelectorAll('.auth-tab').forEach(t => {
            t.addEventListener('click', () => {
                document.querySelectorAll('.auth-tab').forEach(b => b.classList.remove('active'));
                t.classList.add('active');
                const which = t.dataset.auth;
                document.getElementById('form-signin').classList.toggle('hidden', which !== 'signin');
                document.getElementById('form-signup').classList.toggle('hidden', which !== 'signup');
                document.getElementById('form-otp').classList.add('hidden');
            });
        });
        // Sign In
        document.getElementById('form-signin').addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('signin-email').value.trim();
            if (!email.includes('@')) return toast('Please enter a valid email address.', 'error');
            pendingAuth = { email, name: '' };
            requestOTP(email);
        });
        // Sign Up
        document.getElementById('form-signup').addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const phone = document.getElementById('signup-phone').value.trim();
            if (!email.includes('@')) return toast('Please enter a valid email address.', 'error');
            if (!name) return toast('Name is required.', 'error');
            pendingAuth = { name, email, phone };
            requestOTP(email);
        });
        // OTP auto-focus
        document.querySelectorAll('.otp-input').forEach((inp, i, arr) => {
            inp.addEventListener('input', () => { if (inp.value && i < arr.length - 1) arr[i + 1].focus(); });
            inp.addEventListener('keydown', e => { if (e.key === 'Backspace' && !inp.value && i > 0) arr[i - 1].focus(); });
        });
        // Verify
        document.getElementById('verify-otp-btn').addEventListener('click', verifyOTP);
        document.getElementById('captcha-refresh').addEventListener('click', generateCaptcha);
        document.getElementById('resend-otp-btn').addEventListener('click', () => { if (pendingAuth.email) requestOTP(pendingAuth.email); });
    }

    async function requestOTP(email) {
        try {
            const res = await fetch(API + '/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (res.ok) {
                toast('Verification code sent to ' + email, 'success');
            } else {
                toast('Server error: Could not send email. Using test code 123456.', 'warning');
                pendingAuth._devOTP = '123456';
            }
        } catch (err) {
            console.error('Fetch error:', err);
            toast('Network error: Backend server unreachable. Using local verification.', 'info');
            pendingAuth._devOTP = '123456';
        }
        showOTPForm(email);
    }

    function showOTPForm(email) {
        document.getElementById('form-signin').classList.add('hidden');
        document.getElementById('form-signup').classList.add('hidden');
        document.getElementById('form-otp').classList.remove('hidden');
        document.getElementById('otp-email-display').textContent = email;
        document.querySelectorAll('.otp-input').forEach(i => { i.value = ''; });
        document.querySelector('.otp-input').focus();
        generateCaptcha();
    }

    async function verifyOTP() {
        const otp = Array.from(document.querySelectorAll('.otp-input')).map(i => i.value).join('');
        const captchaVal = document.getElementById('captcha-input').value.trim();
        if (captchaVal.toUpperCase() !== captchaText) { toast('CAPTCHA verification failed.', 'error'); generateCaptcha(); return; }
        if (otp.length !== 6) { toast('Please enter the full 6-digit code.', 'error'); return; }
        // Try server verify
        try {
            const res = await fetch(API + '/verify-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: pendingAuth.email, otp }) });
            const data = await res.json();
            if (data.status !== 'success') { toast('Invalid verification code.', 'error'); return; }
        } catch {
            if (pendingAuth._devOTP && otp !== pendingAuth._devOTP) { toast('Invalid code. Dev code: 123456', 'error'); return; }
        }
        currentUser = { name: pendingAuth.name || 'Valued Customer', email: pendingAuth.email, phone: pendingAuth.phone || '' };
        localStorage.setItem('royal_user', JSON.stringify(currentUser));
        document.getElementById('auth-modal').classList.add('hidden');
        toast(`Welcome, ${currentUser.name}!`, 'success');
        checkAuthStatus();
    }

    // CAPTCHA
    function generateCaptcha() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        captchaText = '';
        for (let i = 0; i < 6; i++) captchaText += chars[Math.floor(Math.random() * chars.length)];
        const canvas = document.getElementById('captcha-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 200, 60);
        ctx.fillStyle = 'rgba(10,25,47,0.8)';
        ctx.fillRect(0, 0, 200, 60);
        // Noise lines
        for (let i = 0; i < 6; i++) {
            ctx.strokeStyle = `rgba(${Math.random() * 100 + 50},${Math.random() * 100 + 100},${Math.random() * 200 + 55},0.4)`;
            ctx.beginPath(); ctx.moveTo(Math.random() * 200, Math.random() * 60); ctx.lineTo(Math.random() * 200, Math.random() * 60); ctx.stroke();
        }
        // Text
        ctx.font = 'bold 28px "Courier New", monospace';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < captchaText.length; i++) {
            ctx.save();
            const x = 20 + i * 28;
            const y = 30 + (Math.random() * 10 - 5);
            ctx.translate(x, y);
            ctx.rotate((Math.random() - 0.5) * 0.4);
            const hue = 200 + Math.random() * 60;
            ctx.fillStyle = `hsl(${hue}, 80%, 70%)`;
            ctx.fillText(captchaText[i], 0, 0);
            ctx.restore();
        }
        document.getElementById('captcha-input').value = '';
    }

    // ── SHOP ──
    function setupShop() {
        document.getElementById('main-search').addEventListener('input', debounce(onSearch, 300));
        document.getElementById('clear-search-btn')?.addEventListener('click', () => {
            document.getElementById('main-search').value = '';
            document.getElementById('no-results').classList.add('hidden');
            renderProducts();
        });
        document.getElementById('shop-filters').addEventListener('click', e => {
            const chip = e.target.closest('.filter-chip');
            if (!chip) return;
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            renderProducts(chip.dataset.filter);
        });
    }

    function onSearch(e) {
        const q = e.target.value.toLowerCase().trim();
        if (q.length < 2) { document.getElementById('no-results').classList.add('hidden'); renderProducts(); return; }
        navigateTo('shop');
        const results = products.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q));
        if (results.length > 0) {
            renderProducts('all', results);
            document.getElementById('no-results').classList.add('hidden');
        } else {
            document.getElementById('product-grid').innerHTML = '';
            document.getElementById('no-results').classList.remove('hidden');
        }
        if (!searchHistory.includes(q)) { searchHistory.unshift(q); if (searchHistory.length > 10) searchHistory.pop(); saveState(); }
    }

    function renderProducts(filter = 'all', list = null) {
        const grid = document.getElementById('product-grid');
        const empty = document.getElementById('no-results');
        let items = list || products;
        if (filter !== 'all') items = items.filter(p => p.category === filter);

        if (items.length === 0) {
            grid.innerHTML = '';
            empty.classList.remove('hidden');
            return;
        }

        empty.classList.add('hidden');
        grid.innerHTML = items.map(p => `
            <div class="product-card" data-id="${p.id}">
                <div class="product-card-img-wrap">
                    <img src="${p.img}" alt="${p.name}" class="product-card-img" loading="lazy" onerror="this.src='https://placehold.co/600x400/0A192F/3A7BD5?text=${encodeURIComponent(p.name)}'">
                    <span class="product-card-category">${p.category}</span>
                </div>
                <div class="product-card-body">
                    <div class="product-card-name">${p.name}</div>
                    <div class="product-card-price">₹${p.price.toLocaleString('en-IN')} <span>/unit</span></div>
                    <button class="add-cart-btn btn" onclick="window._addToCart(${p.id})">
                        <i class="fas fa-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    function showRecommendations() {
        if (searchHistory.length === 0) return;
        const section = document.getElementById('recommendations-section');
        const grid = document.getElementById('reco-grid');
        const queries = searchHistory.slice(0, 3);
        let recs = [];
        queries.forEach(q => {
            products.forEach(p => {
                if ((p.name.toLowerCase().includes(q) || p.category.includes(q)) && !recs.find(r => r.id === p.id)) recs.push(p);
            });
        });
        if (recs.length === 0) return;
        section.classList.remove('hidden');
        grid.innerHTML = recs.slice(0, 6).map(p => `
            <div class="reco-card" onclick="window._addToCart(${p.id})">
                <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/300x200/0A192F/3A7BD5?text=${encodeURIComponent(p.name)}'">
                <div class="reco-name">${p.name}</div>
                <div class="reco-price">₹${p.price.toLocaleString('en-IN')}</div>
            </div>
        `).join('');
    }

    // ── CART ──
    window._addToCart = function (id) {
        const p = products.find(x => x.id === id);
        if (!p) return;
        const existing = cart.find(x => x.id === id);
        if (existing) existing.qty++;
        else cart.push({ ...p, qty: 1 });
        saveState();
        updateCartUI();
        toast(`${p.name} added to cart`, 'success');
    };

    function setupCart() {
        document.getElementById('cart-toggle').addEventListener('click', openCart);
        document.getElementById('cart-close').addEventListener('click', closeCart);
        document.getElementById('cart-overlay').addEventListener('click', closeCart);
        document.getElementById('checkout-btn').addEventListener('click', openCheckout);
        updateCartUI();
    }

    function openCart() {
        document.getElementById('cart-sidebar').classList.add('open');
        document.getElementById('cart-overlay').classList.remove('hidden');
    }

    function closeCart() {
        document.getElementById('cart-sidebar').classList.remove('open');
        document.getElementById('cart-overlay').classList.add('hidden');
    }

    function updateCartUI() {
        const badge = document.getElementById('cart-badge');
        const container = document.getElementById('cart-items');
        const subtotal = document.getElementById('cart-subtotal');
        const checkoutBtn = document.getElementById('checkout-btn');
        const total = cart.reduce((s, i) => s + i.qty, 0);
        badge.textContent = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
        checkoutBtn.disabled = cart.length === 0;
        if (cart.length === 0) {
            container.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Your cart is empty</p></div>';
            subtotal.textContent = '₹0';
            return;
        }
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://placehold.co/100/0A192F/3A7BD5?text=img'">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="window._cartQty(${item.id},-1)"><i class="fas fa-minus"></i></button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="qty-btn" onclick="window._cartQty(${item.id},1)"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="window._cartRemove(${item.id})"><i class="fas fa-trash-alt"></i></button>
            </div>
        `).join('');
        const sum = cart.reduce((s, i) => s + i.price * i.qty, 0);
        subtotal.textContent = '₹' + sum.toLocaleString('en-IN');
    }

    window._cartQty = function (id, delta) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
        saveState(); updateCartUI();
    };
    window._cartRemove = function (id) {
        cart = cart.filter(i => i.id !== id);
        saveState(); updateCartUI();
    };

    // ── CHECKOUT ──
    function setupCheckout() {
        document.querySelectorAll('input[name="delivery-method"]').forEach(r => {
            r.addEventListener('change', () => {
                document.getElementById('address-section').classList.toggle('hidden', r.value === 'shop');
                updateCheckoutTotals();
            });
        });
        document.getElementById('delivery-distance').addEventListener('input', updateCheckoutTotals);
        document.getElementById('close-checkout').addEventListener('click', () => {
            document.getElementById('checkout-modal').classList.add('hidden');
        });
        document.getElementById('place-order-btn').addEventListener('click', placeOrder);
        document.getElementById('success-close-btn').addEventListener('click', () => {
            document.getElementById('success-modal').classList.add('hidden');
            navigateTo('shop');
        });
        document.getElementById('free-delivery-ok').addEventListener('click', () => {
            document.getElementById('free-delivery-popup').classList.add('hidden');
        });
    }

    function openCheckout() {
        if (cart.length === 0) return toast('Cart is empty!', 'error');
        closeCart();
        const modal = document.getElementById('checkout-modal');
        modal.classList.remove('hidden');
        // Render items
        document.getElementById('checkout-items').innerHTML = cart.map(i =>
            `<div class="checkout-item"><span>${i.name} × ${i.qty}</span><span>₹${(i.price * i.qty).toLocaleString('en-IN')}</span></div>`
        ).join('');
        updateCheckoutTotals();
    }

    function updateCheckoutTotals() {
        const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
        const method = document.querySelector('input[name="delivery-method"]:checked').value;
        let delivery = 0;
        const notice = document.getElementById('delivery-notice');
        notice.textContent = '';
        notice.className = 'delivery-notice';
        if (method === 'home') {
            const dist = parseFloat(document.getElementById('delivery-distance').value) || 0;
            if (dist > 0 && dist <= 15) {
                delivery = 0;
                notice.textContent = '🎉 Enjoy your FREE delivery!';
                notice.classList.add('free');
                document.getElementById('free-delivery-popup').classList.remove('hidden');
            } else if (dist > 15) {
                delivery = Math.ceil((dist - 15) * 100);
                notice.textContent = `₹100/KM beyond 15 KM — Delivery charge: ₹${delivery.toLocaleString('en-IN')}`;
                notice.classList.add('paid');
            }
        }
        document.getElementById('chk-subtotal').textContent = '₹' + sub.toLocaleString('en-IN');
        document.getElementById('chk-delivery').textContent = '₹' + delivery.toLocaleString('en-IN');
        document.getElementById('chk-total').textContent = '₹' + (sub + delivery).toLocaleString('en-IN');
    }

    async function placeOrder() {
        const method = document.querySelector('input[name="delivery-method"]:checked').value;
        if (method === 'home') {
            const addr = document.getElementById('delivery-address').value.trim();
            const dist = parseFloat(document.getElementById('delivery-distance').value);
            if (!addr) return toast('Please enter delivery address.', 'error');
            if (!dist || dist <= 0) return toast('Please enter valid distance.', 'error');
        }
        // Generate unique code: 4 digits + 2 letters
        const digits = String(Math.floor(1000 + Math.random() * 9000));
        const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const code = digits + letters;
        const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
        const dist = parseFloat(document.getElementById('delivery-distance').value) || 0;
        let deliveryCharge = 0;
        if (method === 'home' && dist > 15) deliveryCharge = Math.ceil((dist - 15) * 100);
        const orderData = {
            code, email: currentUser.email, customerName: currentUser.name,
            method, address: method === 'home' ? document.getElementById('delivery-address').value : 'Collect from Shop',
            pincode: document.getElementById('delivery-pincode').value || '',
            distance: dist, items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
            subtotal: sub, deliveryCharge, total: sub + deliveryCharge,
            date: new Date().toISOString()
        };
        try {
            await fetch(API + '/place-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
        } catch { /* Backend offline — order still saved locally */ }
        orders.unshift(orderData);
        localStorage.setItem('royal_orders', JSON.stringify(orders));
        cart = [];
        saveState();
        updateCartUI();
        document.getElementById('checkout-modal').classList.add('hidden');
        document.getElementById('success-code').textContent = code;
        document.getElementById('success-modal').classList.remove('hidden');
        toast('Order placed successfully!', 'success');
    }

    // ── ORDERS ──
    function renderOrders() {
        const list = document.getElementById('orders-list');
        const userOrders = orders.filter(o => o.email === currentUser?.email);
        if (currentUser?.email === ADMIN_EMAIL) userOrders.push(...orders.filter(o => o.email !== ADMIN_EMAIL));
        if (userOrders.length === 0) {
            list.innerHTML = '<div class="empty-orders"><i class="fas fa-box-open"></i><h3>No Orders Yet</h3><p>Your order history will appear here.</p></div>';
            return;
        }
        list.innerHTML = userOrders.map(o => `
            <div class="order-item">
                <div class="order-item-header">
                    <span class="order-code">#${o.code}</span>
                    <span class="order-status">Confirmed</span>
                </div>
                <div class="order-products">${o.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</div>
                <div class="order-total">Total: ₹${o.total?.toLocaleString('en-IN') || '0'}</div>
                <div style="font-size:0.78rem;color:var(--text-500);margin-top:6px">${o.method === 'home' ? '🚚 Home Delivery' : '🏪 Shop Pickup'} • ${new Date(o.date).toLocaleDateString('en-IN')}</div>
            </div>
        `).join('');
    }

    // ── OFFER CAROUSEL ──
    function renderOfferCarousel() {
        const track = document.getElementById('offer-carousel-track');
        const dots = document.getElementById('offer-carousel-dots');
        if (!track) return;

        let displayBanners = banners.length > 0 ? banners : [{ text: "Enjoy shopping with Royal Store", color: "#E6F1FF", bg1: "#020C1B", bg2: "#0A192F", align: "center", valign: "center", size: "1.8rem", img: "" }];

        track.innerHTML = displayBanners.map(b => `
            <div class="offer-slide" style="background:linear-gradient(135deg,${b.bg1},${b.bg2}); text-align:${b.align}; justify-content:${b.valign || 'center'}; ${b.img ? 'background-image:url(' + b.img + '); background-size:cover; background-blend-mode:overlay;' : ''}">
                <h3 style="color:${b.color}; font-size:${b.size || '1.6rem'}">${b.text}</h3>
            </div>
        `).join('');

        dots.innerHTML = displayBanners.map((_, i) => `<button class="offer-dot${i === 0 ? ' active' : ''}" data-slide="${i}"></button>`).join('');

        dots.addEventListener('click', e => {
            const dot = e.target.closest('.offer-dot');
            if (dot) {
                offerSlideIdx = parseInt(dot.dataset.slide);
                slideCarousel();
            }
        });

        if (displayBanners.length > 1) {
            if (window._bannerInterval) clearInterval(window._bannerInterval);
            window._bannerInterval = setInterval(() => {
                offerSlideIdx = (offerSlideIdx + 1) % displayBanners.length;
                slideCarousel();
            }, 6000);
        }
    }

    function slideCarousel() {
        const track = document.getElementById('offer-carousel-track');
        track.style.transform = `translateX(-${offerSlideIdx * 100}%)`;
        document.querySelectorAll('.offer-dot').forEach((d, i) => d.classList.toggle('active', i === offerSlideIdx));
    }

    // ── STATS ANIMATION ──
    function animateStats() {
        document.querySelectorAll('.stat-number').forEach(el => {
            const target = parseInt(el.dataset.count);
            let current = 0;
            const step = Math.ceil(target / 60);
            const interval = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(interval); }
                el.textContent = current.toLocaleString('en-IN');
            }, 30);
        });
    }

    // ── ADMIN ──
    function setupAdminPanel() {
        document.querySelectorAll('.admin-tab').forEach(t => {
            t.addEventListener('click', () => {
                document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
                t.classList.add('active');
                document.querySelectorAll('.admin-panel').forEach(p => p.classList.add('hidden'));
                document.getElementById(t.dataset.adminTab).classList.remove('hidden');
            });
        });

        // Product Image Upload
        document.getElementById('admin-p-file').addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => { document.getElementById('admin-p-image').value = ev.target.result; toast('Image ready to upload', 'success'); };
            reader.readAsDataURL(file);
        });

        // Banner Image Upload
        document.getElementById('admin-banner-file').addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => { document.getElementById('admin-banner-img').value = ev.target.result; toast('Banner image ready', 'success'); };
            reader.readAsDataURL(file);
        });

        document.getElementById('admin-add-product-btn').addEventListener('click', adminAddProduct);
        document.getElementById('admin-add-banner-btn').addEventListener('click', adminAddBanner);
    }

    function adminAddProduct() {
        const name = document.getElementById('admin-p-name').value.trim();
        const price = parseInt(document.getElementById('admin-p-price').value);
        const category = document.getElementById('admin-p-category').value;
        const img = document.getElementById('admin-p-image').value.trim() || `https://source.unsplash.com/600x400/?${encodeURIComponent(name)},grocery`;

        if (!name || isNaN(price)) return toast('Name & valid price required.', 'error');

        const existingIdx = products.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
        if (existingIdx > -1) {
            products[existingIdx] = { ...products[existingIdx], price, category, img };
            toast('Product updated!', 'success');
        } else {
            products.push({ id: Date.now(), name, price, category, img });
            toast('Product added!', 'success');
        }

        saveState(); renderAdminProducts(); renderProducts();
        document.getElementById('admin-p-name').value = '';
        document.getElementById('admin-p-price').value = '';
        document.getElementById('admin-p-image').value = '';
        document.getElementById('admin-p-file').value = '';
    }

    function renderAdminProducts() {
        const list = document.getElementById('admin-product-list');
        list.innerHTML = products.map(p => `
            <div class="admin-list-item">
                <div class="admin-item-info">
                    <img src="${p.img}" alt="${p.name}" onerror="this.src='https://placehold.co/50/0A192F/3A7BD5?text=P'">
                    <div>
                        <div class="admin-item-name">${p.name}</div>
                        <div class="admin-item-price">₹${p.price.toLocaleString('en-IN')} • ${p.category}</div>
                    </div>
                </div>
                <div class="admin-item-actions">
                    <button class="btn btn-glass btn-sm btn-danger" onclick="window._adminDeleteProduct(${p.id})"><i class="fas fa-trash"></i> Remove</button>
                </div>
            </div>
        `).join('');
    }

    window._adminDeleteProduct = function (id) {
        if (!confirm('Remove this product?')) return;
        products = products.filter(p => p.id !== id);
        saveState(); renderAdminProducts(); renderProducts(); toast('Product removed.', 'info');
    };

    function adminAddBanner() {
        const text = document.getElementById('admin-banner-text').value.trim();
        if (!text) return toast('Banner text required.', 'error');

        banners.push({
            text,
            color: document.getElementById('admin-banner-color').value,
            bg1: document.getElementById('admin-banner-bg1').value,
            bg2: document.getElementById('admin-banner-bg2').value,
            align: document.getElementById('admin-banner-align').value,
            valign: document.getElementById('admin-banner-valign').value,
            size: document.getElementById('admin-banner-size').value,
            img: document.getElementById('admin-banner-img').value.trim(),
        });

        saveState(); renderAdminBanners(); renderOfferCarousel(); toast('Banner added!', 'success');
        document.getElementById('admin-banner-text').value = '';
        document.getElementById('admin-banner-img').value = '';
        document.getElementById('admin-banner-file').value = '';
    }

    function renderAdminBanners() {
        const list = document.getElementById('admin-banner-list');
        list.innerHTML = banners.map((b, i) => `
            <div class="admin-list-item" style="background:linear-gradient(90deg,${b.bg1}33,transparent)">
                <div class="admin-item-name" style="color:${b.color}">${b.text}</div>
                <button class="btn-danger" onclick="window._adminDeleteBanner(${i})"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');
    }
    window._adminDeleteBanner = function (i) {
        banners.splice(i, 1); saveState(); renderAdminBanners(); renderOfferCarousel(); toast('Banner removed.', 'info');
    };

    function renderAdminOrders() {
        const list = document.getElementById('admin-orders-list');
        if (orders.length === 0) { list.innerHTML = '<div class="empty-orders"><i class="fas fa-clipboard-list"></i><h3>No orders yet</h3></div>'; return; }
        list.innerHTML = orders.map(o => `
            <div class="order-item">
                <div class="order-item-header"><span class="order-code">#${o.code}</span><span class="order-status">Confirmed</span></div>
                <div style="font-size:0.85rem;color:var(--text-400)">Customer: ${o.customerName} (${o.email})</div>
                <div class="order-products">${o.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</div>
                <div class="order-total">Total: ₹${o.total?.toLocaleString('en-IN')}</div>
                <div style="font-size:0.78rem;color:var(--text-500);margin-top:4px">${o.method === 'home' ? '🚚 ' + o.address : '🏪 Shop Pickup'} • ${new Date(o.date).toLocaleDateString('en-IN')}</div>
            </div>
        `).join('');
    }

    // ── USER DROPDOWN ──
    function setupUserDropdown() {
        const btn = document.getElementById('user-btn');
        const dd = document.getElementById('user-dropdown');
        btn.addEventListener('click', () => dd.classList.toggle('hidden'));
        document.addEventListener('click', e => { if (!btn.contains(e.target) && !dd.contains(e.target)) dd.classList.add('hidden'); });
        document.getElementById('dd-signout').addEventListener('click', signOut);
        document.getElementById('mobile-logout-btn').addEventListener('click', signOut);
        document.getElementById('dd-orders').addEventListener('click', () => { dd.classList.add('hidden'); navigateTo('orders'); });
    }

    function signOut() {
        localStorage.removeItem('royal_user');
        currentUser = null;
        document.getElementById('user-dropdown').classList.add('hidden');
        closeMobileDrawer();
        checkAuthStatus();
    }

    // ── AI ASSISTANT ──
    function setupAI() {
        document.getElementById('ai-fab').addEventListener('click', () => {
            document.getElementById('ai-chat-panel').classList.toggle('hidden');
        });
        document.getElementById('ai-close').addEventListener('click', () => {
            document.getElementById('ai-chat-panel').classList.add('hidden');
        });
        document.getElementById('ai-send').addEventListener('click', sendAIMsg);
        document.getElementById('ai-input').addEventListener('keypress', e => { if (e.key === 'Enter') sendAIMsg(); });
        document.querySelectorAll('.ai-quick-btn').forEach(b => {
            b.addEventListener('click', () => {
                document.getElementById('ai-input').value = b.dataset.msg;
                sendAIMsg();
            });
        });
    }

    function sendAIMsg() {
        const input = document.getElementById('ai-input');
        const msg = input.value.trim();
        if (!msg) return;
        appendAIMsg('user', msg);
        input.value = '';
        // Typing indicator
        const typing = document.createElement('div');
        typing.className = 'ai-msg-bubble bot';
        typing.id = 'ai-typing-ind';
        typing.innerHTML = '<div class="ai-msg-avatar"><i class="fas fa-robot"></i></div><div class="ai-msg-content"><div class="ai-typing"><span></span><span></span><span></span></div></div>';
        document.getElementById('ai-messages').appendChild(typing);
        typing.scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            typing.remove();
            const reply = getAIResponse(msg);
            appendAIMsg('bot', reply);
        }, 1200);
    }

    function appendAIMsg(sender, text) {
        const container = document.getElementById('ai-messages');
        const bubble = document.createElement('div');
        bubble.className = `ai-msg-bubble ${sender}`;
        const isBot = sender === 'bot';
        bubble.innerHTML = `
            <div class="ai-msg-avatar"><i class="fas fa-${isBot ? 'robot' : 'user'}"></i></div>
            <div class="ai-msg-content"><p>${text}</p></div>
        `;
        container.appendChild(bubble);
        bubble.scrollIntoView({ behavior: 'smooth' });
    }

    function getAIResponse(msg) {
        const m = msg.toLowerCase();
        if (m.includes('recommend') || m.includes('suggestion')) {
            const recos = searchHistory.length > 0 ? products.filter(p => p.name.toLowerCase().includes(searchHistory[0])).slice(0, 3) : products.slice(0, 3);
            return `Based on your preferences, I recommend: <strong>${recos.map(p => p.name).join(', ')}</strong>. Would you like me to add any to your cart?`;
        }
        if (m.includes('delivery') || m.includes('shipping')) return '🚚 We offer <strong>free delivery</strong> within a 15 KM radius of our store. Beyond 15 KM, a charge of <strong>₹100 per KM</strong> applies. Fast and reliable!';
        if (m.includes('price') || m.includes('cost')) return '💰 Our prices are set by our administrators and updated regularly for the best value. You can browse all products in the <strong>Shop</strong> section!';
        if (m.includes('offer') || m.includes('discount') || m.includes('sale')) return `🏷️ Current offers: ${banners.map(b => b.text).join(' | ')}`;
        if (m.includes('contact') || m.includes('help') || m.includes('support')) return '📧 You can reach us at <strong>siddharths1003@gmail.com</strong>. We\'re happy to help!';
        if (m.includes('hours') || m.includes('time') || m.includes('open')) return '🕐 We are open <strong>7 days a week, 8 AM to 10 PM</strong>. Online orders are accepted 24/7!';
        if (m.includes('cart')) return `🛒 You have <strong>${cart.length} item(s)</strong> in your cart with a total of <strong>₹${cart.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString('en-IN')}</strong>.`;
        if (m.includes('hello') || m.includes('hi') || m.includes('hey')) return `Hello, ${currentUser?.name || 'there'}! 👋 How can I help you today? I can find products, check delivery info, or tell you about our latest offers.`;
        return `I'd be happy to help! You can ask me about our <strong>products, delivery, prices, offers,</strong> or <strong>recommendations</strong>. What would you like to know?`;
    }

    // ── UTILS ──
    function toast(msg, type = 'info') {
        const t = document.createElement('div');
        t.className = `toast ${type}`;
        t.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${msg}`;
        document.getElementById('toast-container').appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }

    function debounce(fn, ms) { let t; return function (...a) { clearTimeout(t); t = setTimeout(() => fn.apply(this, a), ms); }; }
})();
