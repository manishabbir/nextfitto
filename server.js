const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const db = require('./database-supabase');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Directories ──────────────────────────────
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ─── Multer ────────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `product-${Date.now()}${ext}`);
    }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ─── Middleware ────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'nextfit-secret-key-change-in-production',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(flash());

// ─── View Engine ──────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Auth Middleware ───────────────────────────
function isAuthenticated(req, res, next) {
    if (req.session && req.session.adminId) return next();
    res.redirect('/admin/login');
}

// ─── Wrapper to catch async errors ────────────
function asyncHandler(fn) {
    return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

// ─── Make store settings available everywhere ──
app.use(asyncHandler(async (req, res, next) => {
    try {
        res.locals.store = await db.getStoreSettings();
        res.locals.categories = await db.getCategories();
    } catch (e) {
        res.locals.store = { store_name: 'Nextfit', tagline: 'Premium Kids Clothing', currency: 'Rs.', whatsapp: '923001234567', phone: '+92 300 1234567', email: 'hello@nextfit.pk', address: 'Lahore, Pakistan', shipping_info: 'Free shipping on orders over Rs. 2,500', return_policy: '7-day easy exchange policy', primary_color: '#FF6B6B', secondary_color: '#4ECDC4' };
        res.locals.categories = [];
    }
    res.locals.currentPath = req.path;
    next();
}));

// ═══════════════════════════════════════════════
//  PUBLIC ROUTES
// ═══════════════════════════════════════════════

app.get('/', asyncHandler(async (req, res) => {
    const featuredProducts = await db.getProducts({ limit: 8 });
    res.render('store/index', { title: 'Home', products: featuredProducts });
}));

app.get('/products', asyncHandler(async (req, res) => {
    const { category, search } = req.query;
    const [products, categories] = await Promise.all([
        db.getProducts({ category, search }),
        db.getCategories()
    ]);
    res.render('store/products', {
        title: 'Shop', products, categories,
        selectedCategory: category || '', searchQuery: search || ''
    });
}));

app.get('/products/:id', asyncHandler(async (req, res) => {
    const product = await db.getProduct(req.params.id);
    if (!product) { req.flash('error', 'Product not found'); return res.redirect('/products'); }
    const related = await db.getProducts({ category: product.category, limit: 4 });
    res.render('store/product-detail', { title: product.name, product, related: related || [] });
}));

app.get('/about', (req, res) => {
    res.render('store/about', { title: 'About Us' });
});

app.get('/contact', (req, res) => {
    res.render('store/contact', { title: 'Contact Us' });
});

// ═══════════════════════════════════════════════
//  ADMIN ROUTES
// ═══════════════════════════════════════════════

app.get('/admin/login', (req, res) => {
    if (req.session.adminId) return res.redirect('/admin/dashboard');
    res.render('admin/login', { title: 'Admin Login' });
});

app.post('/admin/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const admin = await db.getAdminByUsername(username);
    if (!admin || !bcrypt.compareSync(password, admin.password)) {
        req.flash('error', 'Invalid username or password');
        return res.redirect('/admin/login');
    }
    req.session.adminId = admin.id;
    req.session.adminName = admin.name;
    res.redirect('/admin/dashboard');
}));

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

app.get('/admin/dashboard', isAuthenticated, asyncHandler(async (req, res) => {
    const [productCount, orderCount, categoryCount, revenue] = await Promise.all([
        db.getProductCount(), db.getOrderCount(), db.getCategoryCount(), db.getTotalRevenue()
    ]);
    const recentOrders = await db.getOrders({ limit: 5 });
    res.render('admin/dashboard', {
        title: 'Dashboard',
        stats: { products: productCount, orders: orderCount, categories: categoryCount, revenue },
        recentOrders
    });
}));

app.get('/admin/products', isAuthenticated, asyncHandler(async (req, res) => {
    const products = await db.getProducts({});
    res.render('admin/products', { title: 'Manage Products', products });
}));

app.get('/admin/products/add', isAuthenticated, asyncHandler(async (req, res) => {
    const categories = await db.getCategories();
    res.render('admin/product-form', { title: 'Add Product', product: null, categories });
}));

app.post('/admin/products/add', isAuthenticated, upload.single('image'), asyncHandler(async (req, res) => {
    const { name, description, price, originalPrice, category, badge, stock } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : null;
    await db.addProduct({
        name, description, price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        category, badge, stock: parseInt(stock || 0), image
    });
    req.flash('message', 'Product added successfully!');
    res.redirect('/admin/products');
}));

app.get('/admin/products/edit/:id', isAuthenticated, asyncHandler(async (req, res) => {
    const product = await db.getProduct(req.params.id);
    if (!product) { req.flash('error', 'Product not found'); return res.redirect('/admin/products'); }
    const categories = await db.getCategories();
    res.render('admin/product-form', { title: 'Edit Product', product, categories });
}));

app.post('/admin/products/edit/:id', isAuthenticated, upload.single('image'), asyncHandler(async (req, res) => {
    const { name, description, price, originalPrice, category, badge, stock } = req.body;
    let image = req.body.existingImage || null;
    if (req.file) image = '/uploads/' + req.file.filename;
    await db.updateProduct(req.params.id, {
        name, description, price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        category, badge, stock: parseInt(stock || 0), image
    });
    req.flash('message', 'Product updated successfully!');
    res.redirect('/admin/products');
}));

app.post('/admin/products/delete/:id', isAuthenticated, asyncHandler(async (req, res) => {
    await db.deleteProduct(req.params.id);
    req.flash('message', 'Product deleted successfully!');
    res.redirect('/admin/products');
}));

app.get('/admin/categories', isAuthenticated, asyncHandler(async (req, res) => {
    const categories = await db.getCategories();
    res.render('admin/categories', { title: 'Manage Categories', categories });
}));

app.post('/admin/categories/add', isAuthenticated, asyncHandler(async (req, res) => {
    await db.addCategory(req.body.name);
    req.flash('message', 'Category added successfully!');
    res.redirect('/admin/categories');
}));

app.post('/admin/categories/delete/:id', isAuthenticated, asyncHandler(async (req, res) => {
    await db.deleteCategory(req.params.id);
    req.flash('message', 'Category deleted successfully!');
    res.redirect('/admin/categories');
}));

app.get('/admin/orders', isAuthenticated, asyncHandler(async (req, res) => {
    const orders = await db.getOrders({});
    res.render('admin/orders', { title: 'Manage Orders', orders });
}));

app.post('/admin/orders/update-status/:id', isAuthenticated, asyncHandler(async (req, res) => {
    await db.updateOrderStatus(req.params.id, req.body.status);
    req.flash('message', 'Order status updated!');
    res.redirect('/admin/orders');
}));

app.get('/admin/settings', isAuthenticated, asyncHandler(async (req, res) => {
    const settings = await db.getStoreSettings();
    res.render('admin/settings', { title: 'Store Settings', settings });
}));

app.post('/admin/settings', isAuthenticated, upload.single('logo'), asyncHandler(async (req, res) => {
    const data = req.body;
    if (req.file) data.logo = '/uploads/' + req.file.filename;
    if (req.body.existingLogo && !data.logo) data.logo = req.body.existingLogo;
    await db.updateStoreSettings(data);
    req.flash('message', 'Settings updated successfully!');
    res.redirect('/admin/settings');
}));

app.post('/admin/change-password', isAuthenticated, asyncHandler(async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const admin = await db.getAdmin(req.session.adminId);
    if (!bcrypt.compareSync(currentPassword, admin.password)) {
        req.flash('error', 'Current password is incorrect');
        return res.redirect('/admin/settings');
    }
    if (newPassword !== confirmPassword) {
        req.flash('error', 'New passwords do not match');
        return res.redirect('/admin/settings');
    }
    await db.updateAdminPassword(req.session.adminId, bcrypt.hashSync(newPassword, 10));
    req.flash('message', 'Password changed successfully!');
    res.redirect('/admin/settings');
}));

// ═══════════════════════════════════════════════
//  API: Place Order
// ═══════════════════════════════════════════════
app.post('/api/orders', asyncHandler(async (req, res) => {
    const order = JSON.parse(req.body.orderData);
    const orderId = await db.createOrder(order);
    res.json({ success: true, orderId });
}));

// ═══════════════════════════════════════════════
//  ERROR HANDLER (catches all async errors)
// ═══════════════════════════════════════════════
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err.message);
    // Don't expose stack traces in production
    if (req.path.startsWith('/admin')) {
        req.flash('error', 'An error occurred. Please check your Supabase connection.');
        res.redirect('/admin/login');
    } else {
        res.status(500).render('store/index', {
            title: 'Home',
            products: [],
            error: 'Something went wrong. Please try again.',
            message: null
        });
    }
});

// ═══════════════════════════════════════════════
//  INIT & START
// ═══════════════════════════════════════════════
//  INIT & START
// ═══════════════════════════════════════════════
async function start() {
    try {
        await db.initialize();
        console.log('✅ Database connected (Supabase)');
    } catch (e) {
        console.error('⚠️ Database init warning:', e.message);
        console.log('⚠️ Running with offline defaults...');
    }

    app.listen(PORT, () => {
        console.log(`
╔══════════════════════════════════════════╗
║        NEXTFIT - ENTERPRISE SYSTEM       ║
║══════════════════════════════════════════║
║  Store:    http://localhost:${PORT}       ║
║  Admin:    http://localhost:${PORT}/admin/login║
║  Default:  admin / admin123              ║
║  Database: Supabase PostgreSQL           ║
╚══════════════════════════════════════════╝
        `);
    });
}

start();