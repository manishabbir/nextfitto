const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// ─── Supabase Config ─────────────────────────
const SUPABASE_URL = 'https://tkphhkrrfzvjbdbmtvyd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcGhoa3JyZnp2amJkYm10dnlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5OTQ2MjgsImV4cCI6MjA5NTU3MDYyOH0.0lpveNgD46D6CjAyM2fCTPzUED76ddc7I4R6zMIXyIw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Default settings ─────────────────────────
const DEFAULT_SETTINGS = {
    store_name: 'Nextfit',
    tagline: 'Premium Kids Clothing',
    description: 'Premium quality kids clothing crafted in Pakistan.',
    email: 'hello@nextfit.pk',
    phone: '+92 300 1234567',
    whatsapp: '923001234567',
    address: 'Lahore, Pakistan',
    currency: 'Rs.',
    primary_color: '#FF6B6B',
    secondary_color: '#4ECDC4',
    shipping_info: 'Free shipping on orders over Rs. 2,500',
    return_policy: '7-day easy exchange policy',
    about_text: 'At Nextfit, we believe every child deserves to look and feel their best.'
};

// ═══════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════
async function initialize() {
    console.log('⏳ Connecting to Supabase...');

    // Ensure default settings exist
    const { data: existing } = await supabase.from('settings').select('id').eq('id', 1).maybeSingle();
    if (!existing) {
        await supabase.from('settings').insert([{ id: 1, ...DEFAULT_SETTINGS }]);
        console.log('✅ Default settings created');
    } else {
        // Update any null fields with defaults
        const { data: current } = await supabase.from('settings').select('*').eq('id', 1).single();
        const updates = {};
        let needsUpdate = false;
        for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
            if (current[key] === null || current[key] === undefined) {
                updates[key] = value;
                needsUpdate = true;
            }
        }
        if (needsUpdate) {
            await supabase.from('settings').update(updates).eq('id', 1);
            console.log('✅ Default settings updated (null fields filled)');
        }
    }

    // Check if admin exists, create default if not
    const { data: admins } = await supabase.from('admins').select('id').limit(1);
    if (!admins || admins.length === 0) {
        const hashedPassword = bcrypt.hashSync('admin123', 10);
        await supabase.from('admins').insert([
            { name: 'Admin', username: 'admin', password: hashedPassword }
        ]);
        console.log('✅ Default admin created: admin / admin123');
    }

    console.log('✅ Connected to Supabase successfully!');
}

// ═══════════════════════════════════════════════
//  SETTINGS
// ═══════════════════════════════════════════════
async function getStoreSettings() {
    try {
        const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
        if (!data) return { ...DEFAULT_SETTINGS };
        // Fill any null values with defaults
        const merged = { ...DEFAULT_SETTINGS };
        for (const [key, value] of Object.entries(data)) {
            if (value !== null && value !== undefined) {
                merged[key] = value;
            }
        }
        return merged;
    } catch (e) {
        // If table doesn't exist or no rows, return defaults
        return { ...DEFAULT_SETTINGS };
    }
}

async function updateStoreSettings(settings) {
    const { error } = await supabase.from('settings').update(settings).eq('id', 1);
    if (error) throw error;
    return true;
}

// ═══════════════════════════════════════════════
//  CATEGORIES
// ═══════════════════════════════════════════════
async function getCategories() {
    const { data } = await supabase.from('categories').select('*').order('name');
    return data || [];
}

async function addCategory(name) {
    const { error } = await supabase.from('categories').insert({ name });
    if (error) throw error;
    return true;
}

async function deleteCategory(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    return true;
}

async function getCategoryCount() {
    const { count } = await supabase.from('categories').select('*', { count: 'exact', head: true });
    return count || 0;
}

// ═══════════════════════════════════════════════
//  PRODUCTS
// ═══════════════════════════════════════════════
async function getProducts({ category, search, limit } = {}) {
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });
    if (category) query = query.eq('category', category);
    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    if (limit) query = query.limit(limit);
    const { data } = await query;
    return (data || []).map(p => ({ ...p, originalPrice: p.original_price }));
}

async function getProduct(id) {
    const { data } = await supabase.from('products').select('*').eq('id', id).single();
    if (data) data.originalPrice = data.original_price;
    return data;
}

async function addProduct(product) {
    const { error } = await supabase.from('products').insert({
        name: product.name, description: product.description, price: product.price,
        original_price: product.originalPrice || null, category: product.category || null,
        badge: product.badge || null, image: product.image || null, stock: product.stock || 0
    });
    if (error) throw error;
    return true;
}

async function updateProduct(id, product) {
    const { error } = await supabase.from('products').update({
        name: product.name, description: product.description, price: product.price,
        original_price: product.originalPrice || null, category: product.category || null,
        badge: product.badge || null, image: product.image || null,
        stock: product.stock || 0, updated_at: new Date()
    }).eq('id', id);
    if (error) throw error;
    return true;
}

async function deleteProduct(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return true;
}

async function getProductCount() {
    const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
    return count || 0;
}

// ═══════════════════════════════════════════════
//  ORDERS
// ═══════════════════════════════════════════════
async function createOrder(order) {
    const { data, error } = await supabase.from('orders').insert({
        customer_name: order.customerName, customer_phone: order.customerPhone,
        customer_address: order.customerAddress || '', city: order.city || '',
        items: order.items || [], total: order.total || 0, notes: order.notes || ''
    }).select();
    if (error) throw error;
    return data?.[0]?.id;
}

async function getOrders({ limit } = {}) {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (limit) query = query.limit(limit);
    const { data } = await query;
    return data || [];
}

async function updateOrderStatus(id, status) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) throw error;
    return true;
}

async function getOrderCount() {
    const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
    return count || 0;
}

async function getTotalRevenue() {
    const { data } = await supabase.from('orders').select('total').neq('status', 'cancelled');
    return (data || []).reduce((sum, o) => sum + (o.total || 0), 0);
}

// ═══════════════════════════════════════════════
//  ADMINS
// ═══════════════════════════════════════════════
async function getAdminByUsername(username) {
    const { data } = await supabase.from('admins').select('*').eq('username', username).single();
    return data;
}

async function getAdmin(id) {
    const { data } = await supabase.from('admins').select('*').eq('id', id).single();
    return data;
}

async function updateAdminPassword(id, hashedPassword) {
    const { error } = await supabase.from('admins').update({ password: hashedPassword }).eq('id', id);
    if (error) throw error;
    return true;
}

module.exports = {
    initialize, getStoreSettings, updateStoreSettings,
    getCategories, addCategory, deleteCategory, getCategoryCount,
    getProducts, getProduct, addProduct, updateProduct, deleteProduct, getProductCount,
    createOrder, getOrders, updateOrderStatus, getOrderCount, getTotalRevenue,
    getAdminByUsername, getAdmin, updateAdminPassword
};