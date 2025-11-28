require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// --- 1. CORS CONFIGURATION (PENTING) ---
// Karena Frontend dan Backend nanti beda domain (beda link vercel),
// kita harus izinkan akses dari mana saja ('*') atau spesifik domain frontend.
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// --- 2. SUPABASE CONNECTION ---
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// --- 3. ROUTES ---

// Route Cek Server (Health Check)
// Akses ini di browser nanti untuk memastikan server hidup
app.get('/', (req, res) => {
    res.json({ status: 'Success', message: 'DreamDesk Backend is Running!' });
});

// Get All Products
app.get('/api/products', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: true }); // Urutkan biar rapi

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Product by ID
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 4. SERVER LISTENER ---
// Logika: Kalau di laptop (development), jalankan app.listen.
// Kalau di Vercel (production), export app biar Vercel yang handle serverless-nya.
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running locally on http://localhost:${port}`);
    });
}

// WAJIB: Export app untuk Vercel Serverless Function
module.exports = app;