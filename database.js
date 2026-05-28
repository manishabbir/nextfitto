const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'data', 'nextfit.db');

let db = null;
let SQL = null;

// ─── Initialize SQL.js ─────────────────────────
async function initialize() {
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    SQL = await initSqlJs();

    if (fs.existsSync(DB_PATH)) {
        const buffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(buffer);
    } else {
        db = new SQL.Database();
    }

    createTables();
    seedData();
    saveDatabase();
}

function saveDatabase() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_PATH, buffer);
    }
}

// ─── Tables ─────────────────────────────────────
function createTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY,
            store_name TEXT DEFAULT 'Nextfit',
            tagline TEXT DEFAULT 'Premium Kids Clothing',
            description TEXT DEFAULT 'Premium quality kids clothing crafted in Pakistan.',
            email TEXT DEFAULT 'hello@nextfit.pk',
            phone TEXT DEFAULT '+92 300 1234567',
            whatsapp TEXT DEFAULT '923001234567',
            address TEXT DEFAULT 'Lahore, Pakistan',
            currency TEXT DEFAULT 'Rs.',
            logo TEXT,
            primary_color TEXT DEFAULT '#FF6B6B',
            secondary_color TEXT DEFAULT '#4ECDC4',
            shipping_info TEXT DEFAULT 'Free shipping on orders over Rs. 2,500',
            return_policy TEXT DEFAULT '7-day easy exchange policy',
            about_text TEXT DEFAULT 'At Nextfit, we believe every child deserves to look and feel their best.',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            original_price REAL,
            category TEXT,
            badge TEXT,
            image TEXT,
            stock INTEGER DEFAULT 0,
            featured INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            customer_address TEXT,
            city TEXT,
            items TEXT,
            total REAL,
            status TEXT DEFAULT 'pending',
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL DEFAULT 'Admin',
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

// ─── Seed Data ──────────────────────────────────
function seedData() {
    // Check if settings exist
    const settingsCount = db.exec("SELECT COUNT(*) as c FROM settings");
    if (!settingsCount.length || settingsCount[0].values[0][0] === 0) {
        db.run("INSERT INTO settings (store_name, tagline) VALUES (?, ?)", ['Nextfit', 'Premium Kids Clothing']);
    }

    // Check if admin exists
    const adminCount = db.exec("SELECT COUNT(*) as c FROM admins");
    if (!adminCount.length || adminCount[0].values[0][0] === 0) {
        const hashedPassword = bcrypt.hashSync('admin123', 10);
        db.run("INSERT INTO admins (name, username, password) VALUES (?, ?, ?)",
            ['Admin', 'admin', hashedPassword]);
    }

    // Seed categories
    const catCount = db.exec("SELECT COUNT(*) as c FROM categories");
    if (!catCount.length || catCount[0].values[0][0] === 0) {
        const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Traditional', 'Sleepwear', 'Accessories'];
        categories.forEach(c => {
            db.run("INSERT OR IGNORE INTO categories (name) VALUES (?)", [c]);
        });
    }

    // Seed products
    const prodCount = db.exec("SELECT COUNT(*) as c FROM products");
    if (!prodCount.length || prodCount[0].values[0][0] === 0) {
        const products = [
            ['Kids Casual T-Shirt', 'Soft cotton t-shirt with fun prints.', 899, 1299, 'Tops', 'Sale', null, 50],
            ['Boys Denim Jacket', 'Stylish denim jacket with comfortable fit.', 1899, 2499, 'Outerwear', 'Popular', null, 30],
            ['Girls Party Dress', 'Beautiful floral party dress with tulle lining.', 1599, 2199, 'Dresses', 'New', null, 25],
            ['Kids Track Pants', 'Comfortable elastic-waist track pants.', 749, 999, 'Bottoms', 'Sale', null, 60],
            ['Boys Kurta Shalwar', 'Premium cotton kurta shalwar set for Eid.', 2199, 2999, 'Traditional', 'Best Seller', null, 20],
            ['Girls Summer Top', 'Lightweight sleeveless top with bow detailing.', 649, 849, 'Tops', 'New', null, 45],
            ['Kids Hoodie Set', 'Cozy hoodie with matching joggers set.', 2499, 3499, 'Outerwear', 'Sale', null, 15],
            ['Kids Pajama Set', 'Super soft 2-piece pajama set.', 999, 1499, 'Sleepwear', 'Popular', null, 35],
            ['Boys Formal Shirt', 'Crisp formal shirt for special occasions.', 1299, 1799, 'Tops', null, null, 25],
            ['Girls Cotton Leggings', 'Stretchy comfortable leggings for daily wear.', 499, 699, 'Bottoms', null, null, 70]
        ];
        const stmt = db.prepare("INSERT INTO products (name, description, price, original_price, category, badge, image, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        products.forEach(p => stmt.run(p));
        stmt.free();
    }
}

// ─── Store Settings ────────────────────────────
function getStoreSettings() {
    const result = db.exec("SELECT * FROM settings WHERE id = 1");
    if (result.length && result[0].values.length) {
        const cols = result[0].columns;
        const vals = result[0].values[0];
        const settings = {};
        cols.forEach((c, i) => settings[c] = vals[i]);
        return settings;
    }
    return { store_name: 'Nextfit', tagline: 'Premium Kids Clothing', currency: 'Rs.' };
}

function updateStoreSettings(data) {
    const fields = ['store_name', 'tagline', 'description', 'email', 'phone', 'whatsapp',
        'address', 'currency', 'logo', 'primary_color', 'secondary_color',
        'shipping_info', 'return_policy', 'about_text'];
    const updates = fields.filter(f => data[f] !== undefined).map(f => `${f} = ?`).join(', ');
    const values = fields.filter(f => data[f] !== undefined).map(f => data[f]);
    if (updates) {
        db.run(`UPDATE settings SET ${updates} WHERE id = 1`, values);
        saveDatabase();
    }
}

// ─── Categories ─────────────────────────────────
function getCategories() {
    const result = db.exec("SELECT * FROM categories ORDER BY name");
    if (result.length) {
        const cols = result[0].columns;
        return result[0].values.map(row => {
            const obj = {};
            cols.forEach((c, i) => obj[c] = row[i]);
            return obj;
        });
    }
    return [];
}

function addCategory(name) {
    db.run("INSERT INTO categories (name) VALUES (?)", [name]);
    saveDatabase();
}

function deleteCategory(id) {
    db.run("DELETE FROM categories WHERE id = ?", [id]);
    saveDatabase();
}

function getCategoryCount() {
    const result = db.exec("SELECT COUNT(*) as c FROM categories");
    return result.length ? result[0].values[0][0] : 0;
}

// ─── Products ───────────────────────────────────
function getProducts({ category, search, limit } = {}) {
    let query = "SELECT * FROM products WHERE 1=1";
    const params = [];
    if (category) { query += " AND category = ?"; params.push(category); }
    if (search) { query += " AND (name LIKE ? OR description LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }
    query += " ORDER BY created_at DESC";
    if (limit) { query += " LIMIT ?"; params.push(limit); }

    const result = db.exec(query, params);
    if (result.length) {
        const cols = result[0].columns;
        return result[0].values.map(row => {
            const obj = {};
            cols.forEach((c, i) => obj[c === 'original_price' ? 'originalPrice' : c] = row[i]);
            return obj;
        });
    }
    return [];
}

function getProduct(id) {
    const result = db.exec("SELECT * FROM products WHERE id = ?", [id]);
    if (result.length && result[0].values.length) {
        const cols = result[0].columns;
        const row = result[0].values[0];
        const obj = {};
        cols.forEach((c, i) => obj[c === 'original_price' ? 'originalPrice' : c] = row[i]);
        return obj;
    }
    return null;
}

function addProduct(data) {
    db.run("INSERT INTO products (name, description, price, original_price, category, badge, image, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [data.name, data.description, data.price, data.originalPrice, data.category, data.badge, data.image, data.stock]);
    saveDatabase();
}

function updateProduct(id, data) {
    db.run("UPDATE products SET name=?, description=?, price=?, original_price=?, category=?, badge=?, image=?, stock=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
        [data.name, data.description, data.price, data.originalPrice, data.category, data.badge, data.image, data.stock, id]);
    saveDatabase();
}

function deleteProduct(id) {
    db.run("DELETE FROM products WHERE id = ?", [id]);
    saveDatabase();
}

function getProductCount() {
    const result = db.exec("SELECT COUNT(*) as c FROM products");
    return result.length ? result[0].values[0][0] : 0;
}

// ─── Orders ─────────────────────────────────────
function createOrder(order) {
    const items = JSON.stringify(order.items || []);
    db.run("INSERT INTO orders (customer_name, customer_phone, customer_address, city, items, total, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [order.customerName, order.customerPhone, order.customerAddress, order.city, items, order.total, order.notes]);
    saveDatabase();
    const result = db.exec("SELECT last_insert_rowid() as id");
    return result.length ? result[0].values[0][0] : null;
}

function getOrders({ limit } = {}) {
    let query = "SELECT * FROM orders ORDER BY created_at DESC";
    if (limit) query += " LIMIT " + parseInt(limit);
    const result = db.exec(query);
    if (result.length) {
        const cols = result[0].columns;
        return result[0].values.map(row => {
            const obj = {};
            cols.forEach((c, i) => {
                if (c === 'items') {
                    try { obj[c] = JSON.parse(row[i]); } catch (e) { obj[c] = []; }
                } else {
                    obj[c] = row[i];
                }
            });
            return obj;
        });
    }
    return [];
}

function updateOrderStatus(id, status) {
    db.run("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    saveDatabase();
}

function getOrderCount() {
    const result = db.exec("SELECT COUNT(*) as c FROM orders");
    return result.length ? result[0].values[0][0] : 0;
}

function getTotalRevenue() {
    const result = db.exec("SELECT COALESCE(SUM(total), 0) as revenue FROM orders WHERE status != 'cancelled'");
    return result.length ? result[0].values[0][0] : 0;
}

// ─── Admins ─────────────────────────────────────
function getAdminByUsername(username) {
    const result = db.exec("SELECT * FROM admins WHERE username = ?", [username]);
    if (result.length && result[0].values.length) {
        const cols = result[0].columns;
        const row = result[0].values[0];
        const obj = {};
        cols.forEach((c, i) => obj[c] = row[i]);
        return obj;
    }
    return null;
}

function getAdmin(id) {
    const result = db.exec("SELECT * FROM admins WHERE id = ?", [id]);
    if (result.length && result[0].values.length) {
        const cols = result[0].columns;
        const row = result[0].values[0];
        const obj = {};
        cols.forEach((c, i) => obj[c] = row[i]);
        return obj;
    }
    return null;
}

function updateAdminPassword(id, hashedPassword) {
    db.run("UPDATE admins SET password = ? WHERE id = ?", [hashedPassword, id]);
    saveDatabase();
}

module.exports = {
    initialize,
    getStoreSettings,
    updateStoreSettings,
    getCategories,
    addCategory,
    deleteCategory,
    getCategoryCount,
    getProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductCount,
    createOrder,
    getOrders,
    updateOrderStatus,
    getOrderCount,
    getTotalRevenue,
    getAdminByUsername,
    getAdmin,
    updateAdminPassword
};