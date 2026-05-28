-- FIRST: Delete old tables if they exist
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id BIGINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO settings (id, store_name, tagline, whatsapp)
VALUES (1, 'Nextfit', 'Premium Kids Clothing', '923001234567')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on settings" ON settings FOR ALL USING (true) WITH CHECK (true);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO categories (name) VALUES
    ('Tops'), ('Bottoms'), ('Dresses'), ('Outerwear'), ('Traditional'), ('Sleepwear'), ('Accessories')
ON CONFLICT (name) DO NOTHING;

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on categories" ON categories FOR ALL USING (true) WITH CHECK (true);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    original_price REAL,
    category TEXT,
    badge TEXT,
    image TEXT,
    stock INTEGER DEFAULT 0,
    featured INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO products (name, description, price, original_price, category, badge, image, stock) VALUES
    ('Kids Casual T-Shirt', 'Soft cotton t-shirt with fun prints.', 899, 1299, 'Tops', 'Sale', NULL, 50),
    ('Boys Denim Jacket', 'Stylish denim jacket with comfortable fit.', 1899, 2499, 'Outerwear', 'Popular', NULL, 30),
    ('Girls Party Dress', 'Beautiful floral party dress with tulle lining.', 1599, 2199, 'Dresses', 'New', NULL, 25),
    ('Kids Track Pants', 'Comfortable elastic-waist track pants.', 749, 999, 'Bottoms', 'Sale', NULL, 60),
    ('Boys Kurta Shalwar', 'Premium cotton kurta shalwar set for Eid.', 2199, 2999, 'Traditional', 'Best Seller', NULL, 20),
    ('Girls Summer Top', 'Lightweight sleeveless top with bow detailing.', 649, 849, 'Tops', 'New', NULL, 45),
    ('Kids Hoodie Set', 'Cozy hoodie with matching joggers set.', 2499, 3499, 'Outerwear', 'Sale', NULL, 15),
    ('Kids Pajama Set', 'Super soft 2-piece pajama set.', 999, 1499, 'Sleepwear', 'Popular', NULL, 35);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on products" ON products FOR ALL USING (true) WITH CHECK (true);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT,
    city TEXT,
    items JSONB DEFAULT '[]',
    total REAL,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on orders" ON orders FOR ALL USING (true) WITH CHECK (true);

-- Admins
CREATE TABLE IF NOT EXISTS admins (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Admin',
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on admins" ON admins FOR ALL USING (true) WITH CHECK (true);