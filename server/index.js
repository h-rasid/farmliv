const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); 
const multer = require('multer'); 
const path = require('path');
const fs = require('fs');
const compression = require('compression'); 
const nodemailer = require('nodemailer');
const sharp = require('sharp'); 
// ✅ FIXED: Explicitly locate .env relative to this file (CRITICAL for Hostinger startup from root)      
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// --- 1. MIDDLEWARE ---
app.use(compression()); 

// ⭐ SEO Redirect: Force specific IDs to their new descriptive URLs
app.use((req, res, next) => {
  const path = req.path.toLowerCase().replace(/\/$/, ""); // Remove trailing slash
  
  const seoRedirects = {
    "/product/2": "https://farmliv.com/heavy-duty-weed-control-mat-manufacturer",
    "/product/3": "https://farmliv.com/uv-stabilized-agriculture-shade-net-manufacturer",
    "/product/4": "https://farmliv.com/pp-leno-mesh-bag-manufacturer"
  };

  if (seoRedirects[path]) {
    console.log(`[SEO Redirect] Moving ${req.originalUrl} to slug...`);
    return res.redirect(301, seoRedirects[path]);
  }
  next();
});

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173', 
      'http://127.0.0.1:5173', 
      'https://farmliv-project.vercel.app',
      'https://farmliv-project.onrender.com',
      'https://farmliv.in',           
      'https://www.farmliv.in',
      'http://farmliv.in',
      'http://www.farmliv.in',       
      'https://farmliv.com',
      'https://www.farmliv.com',
      'http://farmliv.com',
      'http://www.farmliv.com',
      /\.vercel\.app$/,
      /farmliv\.in$/,
      /farmliv\.com$/
    ];
    if (!origin || allowedOrigins.some(item => (item instanceof RegExp ? item.test(origin) : item === origin))) {
      callback(null, true);
    } else {
      callback(null, true); // Debugging ke liye temporarily true
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Serve static files from 'dist' (Farmliv Production)
app.use(express.static(path.join(__dirname, '../client/dist'), {
  maxAge: '1d', // Default for index.html
  setHeaders: (res, filePath) => {
    // ⭐ Aggressive Caching for Assets (Vite Hashed Files)
    // Matches files in the assets folder or with Vite-style hashes
    if (filePath.includes(path.join('assets')) || filePath.match(/-[a-z0-9]{8}\./i)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  },
  index: 'index.html',
  etag: true
}));

app.use('/uploads', express.static(uploadDir, {
  maxAge: '30d', 
  etag: true
}));

// --- 2. DATABASE & EMAIL CONFIG ---
// Hostinger server2205 Optimized Configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',           
  user: process.env.DB_USER || 'u868538679_farmliv',      // ✅ FIXED: was 'u868538679_admin'
  password: process.env.DB_PASSWORD || 'Najmus@2508', 
  database: process.env.DB_NAME || 'u868538679_farmliv_data',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 5, // Best for Hostinger shared plans to avoid lockouts
  queueLimit: 0,
  connectTimeout: 10000, 
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

// Database Connection Test & Initialization
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Connected Successfully to server2205!');
        
        // Ensure critical tables exist
        await connection.query(`
          CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            gstNumber VARCHAR(255),
            whatsapp VARCHAR(255),
            smtpHost VARCHAR(255),
            smtpUser VARCHAR(255),
            smtpPass VARCHAR(255),
            facebook VARCHAR(255),
            instagram VARCHAR(255),
            isMaintenance TINYINT(1) DEFAULT 0,
            logo TEXT,
            favicon TEXT
          )
        `);

        // Seed default admin if empty
        const [adminExists] = await connection.query('SELECT COUNT(*) as count FROM admins');
        if (adminExists[0].count === 0) {
          console.log('👤 Seeding default administrative account...');
          await connection.query('INSERT INTO admins (name, email, password) VALUES (?, ?, ?)', ['Farmliv Admin', 'admin@farmliv.com', 'admin123']);
        }

        // Create activities table
        await connection.query(`
          CREATE TABLE IF NOT EXISTS activities (
            id INT AUTO_INCREMENT PRIMARY KEY,
            action VARCHAR(255),
            user VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Create sales table for converted transactions
        await connection.query(`
          CREATE TABLE IF NOT EXISTS sales (
            id INT AUTO_INCREMENT PRIMARY KEY,
            lead_id INT,
            salesman_id INT,
            final_price DECIMAL(15, 2),
            payment_method VARCHAR(50),
            transaction_id VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
        // Helper to add columns safely (Resilient Version)
        const addColumnIfMissing = async (table, column, definition) => {
          try {
            const [cols] = await connection.query(`SHOW COLUMNS FROM ${table} LIKE ?`, [column]);
            if (cols.length === 0) {
              console.log(`🛠️ Self-Healing: Adding ${column} to ${table}`);
              await connection.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
            }
          } catch (err) {
            console.warn(`⚠️ Column Sync Skip [${table}.${column}]: ${err.message}`);
          }
        };

        // --- FARMLIV SCHEMA SYNC ---
        
        // 0. Core Lead Management (Schema Recovery)
        await connection.query(`
          CREATE TABLE IF NOT EXISTS leads (
            id INT AUTO_INCREMENT PRIMARY KEY,
            customer_name VARCHAR(255),
            phone VARCHAR(20),
            email VARCHAR(255),
            company VARCHAR(255),
            location VARCHAR(255),
            product_id INT,
            quantity INT,
            notes TEXT,
            status VARCHAR(50) DEFAULT 'Pending',
            assigned_to INT DEFAULT NULL,
            is_seen TINYINT(1) DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS quick_enquiries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            customer_name VARCHAR(255),
            phone VARCHAR(20),
            email VARCHAR(255),
            company VARCHAR(255),
            location VARCHAR(255),
            notes TEXT,
            status VARCHAR(50) DEFAULT 'Pending',
            assigned_to INT DEFAULT NULL,
            is_seen TINYINT(1) DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // 1. Customers Table (Farmliv CRM)
        await connection.query(`
          CREATE TABLE IF NOT EXISTS customers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255),
            phone VARCHAR(20),
            company VARCHAR(255),
            address TEXT,
            location VARCHAR(255),
            type ENUM('Farmer', 'Dealer', 'Distributor') DEFAULT 'Farmer',
            status ENUM('active', 'inactive') DEFAULT 'active',
            assigned_salesman_id INT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // 2. Orders & Items
        await connection.query(`
          CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            customer_id INT,
            salesman_id INT,
            total_amount DECIMAL(15, 2),
            status ENUM('Pending', 'Approved', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
            payment_status ENUM('Pending', 'Partial', 'Received') DEFAULT 'Pending',
            tracking_info VARCHAR(255),
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS order_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT,
            product_id INT,
            quantity INT,
            price_at_sale DECIMAL(15, 2),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // 3. Field Visits & Tasks
        await connection.query(`
          CREATE TABLE IF NOT EXISTS field_visits (
            id INT AUTO_INCREMENT PRIMARY KEY,
            salesman_id INT,
            customer_id INT,
            check_in DATETIME,
            check_out DATETIME,
            report TEXT,
            images TEXT, -- JSON array
            location_gps VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            assigned_to INT,
            title VARCHAR(255),
            description TEXT,
            due_date DATETIME,
            status ENUM('Pending', 'Completed') DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) UNIQUE,
            description TEXT,
            image TEXT,
            parent_id INT DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            category VARCHAR(255),
            price DECIMAL(15, 2),
            stock INT DEFAULT 0,
            description TEXT,
            images TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS staff (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255),
            role ENUM('Admin', 'Manager', 'Salesman') DEFAULT 'Salesman',
            phone VARCHAR(20),
            status ENUM('active', 'inactive') DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // 4. Financials (Targets & Payments)
        await connection.query(`
          CREATE TABLE IF NOT EXISTS sales_targets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            salesman_id INT,
            target_amount DECIMAL(15, 2),
            month INT,
            year INT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS payments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT,
            invoice_id INT, -- Link to specific invoice
            customer_id INT,
            salesman_id INT,
            amount DECIMAL(15, 2),
            method ENUM('Cash', 'UPI', 'Bank Transfer'),
            transaction_id VARCHAR(255),
            status ENUM('Verified', 'Pending') DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // 5. Invoices Table
        await connection.query(`
          CREATE TABLE IF NOT EXISTS invoices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            invoice_number VARCHAR(50) UNIQUE,
            order_id INT,
            customer_id INT,
            subtotal DECIMAL(15, 2),
            tax_amount DECIMAL(15, 2), -- GST
            total_amount DECIMAL(15, 2),
            status ENUM('Draft', 'Sent', 'Paid', 'Partial', 'Overdue', 'Cancelled') DEFAULT 'Draft',
            due_date DATE,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // --- 🏷️ Seed Categories (Robust) ---
        const [existingCats] = await connection.query("SELECT name FROM categories");
        const existingNames = existingCats.map(c => c.name);
        
        const defaultCategories = [
          { name: 'Weed Control', image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817725/weedmat1_rln1ds.jpg', description: 'High quality weed mats and ground covers for effective weed suppression.' },
          { name: 'Mulch & Films', image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817061/Polyfilm_an9qiy.webp', description: 'Agricultural films and mulching solutions for moisture retention and soil health.' },
          { name: 'Greenhouse Materials', image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817061/Shadenet_ew7jv2.webp', description: 'Poly films and greenhouse coverings for controlled environment agriculture.' },
          { name: 'Water Management', image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817725/pondliner_vscz7q.jpg', description: 'Pond liners and water storage solutions for efficient irrigation.' },
          { name: 'Harvesting & Storage', image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817725/crates_f8q9ze.jpg', description: 'Plastic crates and harvesting tools for post-harvest management.' },
          { name: 'Packaging Solutions', image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817725/lenobags_pzm8z1.jpg', description: 'Leno bags and mesh packaging for agricultural produce.' },
          { name: 'Protective Covers', image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817725/tarpaulin_m2z8x1.jpg', description: 'Heavy-duty tarpaulins and protective covers for agricultural equipment.' },
          { name: 'Irrigation Systems', image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817725/drip_irrigation_yq9m1z.jpg', description: 'Efficient drip irrigation and sprinkler components.' }
        ];

        for (const cat of defaultCategories) {
          if (!existingNames.includes(cat.name)) {
            await connection.query(
              "INSERT INTO categories (name, image, description) VALUES (?, ?, ?)",
              [cat.name, cat.image, cat.description]
            );
            console.log(`✅ Seeded missing category: ${cat.name}`);
          }
        }


        // Self-Healing: Ensure older leads/enquiries match new Farmliv standards
        await addColumnIfMissing('leads', 'assigned_to', 'INT DEFAULT NULL');
        await addColumnIfMissing('leads', 'notes', 'TEXT DEFAULT NULL');
        await addColumnIfMissing('leads', 'product_id', 'INT DEFAULT NULL');
        await addColumnIfMissing('leads', 'updated_at', 'DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
        await addColumnIfMissing('quick_enquiries', 'assigned_to', 'INT DEFAULT NULL');
        await addColumnIfMissing('quick_enquiries', 'notes', 'TEXT DEFAULT NULL');
        
        // --- 2. Products Table Self-Healing ---
        await addColumnIfMissing('products', 'sub_category', 'VARCHAR(255) DEFAULT NULL');
        await addColumnIfMissing('products', 'moq', 'VARCHAR(255) DEFAULT NULL');
        await addColumnIfMissing('products', 'gsm', 'VARCHAR(255) DEFAULT NULL');
        await addColumnIfMissing('products', 'durability', 'VARCHAR(255) DEFAULT NULL');
        await addColumnIfMissing('products', 'hsn', 'VARCHAR(255) DEFAULT NULL');
        await addColumnIfMissing('products', 'status', 'VARCHAR(50) DEFAULT "Active"');
        await addColumnIfMissing('products', 'video', 'TEXT DEFAULT NULL');

        // --- 2.5 Categories Table Self-Healing ---
        await addColumnIfMissing('categories', 'description', 'TEXT DEFAULT NULL');
        await addColumnIfMissing('categories', 'image', 'TEXT DEFAULT NULL');
        await addColumnIfMissing('categories', 'parent_id', 'INT DEFAULT NULL');

        // --- 3. Terminology Cleanup (Migration) ---
        await connection.query("UPDATE products SET description = REPLACE(description, 'Node Assets', 'Products')");
        await connection.query("UPDATE products SET description = REPLACE(description, 'Node Asset', 'Product')");
        await connection.query("UPDATE products SET description = REPLACE(description, 'Node', '')");
        await connection.query("UPDATE products SET description = REPLACE(description, '-', ' ')");
        await connection.query("UPDATE products SET description = REPLACE(description, 'Assets', 'Products')");
        await connection.query("UPDATE products SET description = REPLACE(description, 'Asset', 'Product')");
        
        await connection.query("UPDATE activities SET action = REPLACE(action, 'Node Assets', 'Products')");
        await connection.query("UPDATE activities SET action = REPLACE(action, 'Node Asset', 'Product')");
        await connection.query("UPDATE activities SET action = REPLACE(action, 'Node', '')");
        await connection.query("UPDATE activities SET action = REPLACE(action, 'Assets', 'Products')");
        await connection.query("UPDATE activities SET action = REPLACE(action, 'Asset', 'Product')");
        
        // Add dummy logs if empty
        const [logRows] = await connection.query('SELECT COUNT(*) as count FROM activities');
        if (logRows[0].count === 0) {
          await connection.query(`
            INSERT INTO activities (action, user) VALUES 
            ('Farmliv Synchronized', 'System'),
            ('Staff Directory Initialized', 'Admin'),
            ('Security Protocols Active', 'System')
          `);
        }

        // Initialize default settings row if missing
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM settings');
        if (rows[0].count === 0) {
          await connection.query('INSERT INTO settings (gstNumber) VALUES ("")');
        }

        // Initialize Notification Seen Flags (using safe helper)
        await addColumnIfMissing('leads', 'is_seen', 'TINYINT(1) DEFAULT 0');
        await addColumnIfMissing('quick_enquiries', 'is_seen', 'TINYINT(1) DEFAULT 0');

        // Added brochure column for global settings
        await addColumnIfMissing('settings', 'brochure', 'TEXT DEFAULT NULL');

        connection.release();
    } catch (err) {
        console.error('❌ Database Initialization Error:', err.message);
    }
})();

const storage = multer.memoryStorage(); 
const upload = multer({ 
  storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit for PDFs
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'video', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 },
  { name: 'brochure', maxCount: 1 }
]);

const processImage = async (file) => {
  const filename = `optimized_${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
  const filepath = path.join(uploadDir, filename);
  
  await sharp(file.buffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 }) 
    .toFile(filepath);
    
  return `/uploads/${filename}`;
};

// Save PDF brochure directly (no image processing)
const savePdf = (file) => {
  const filename = `brochure_${Date.now()}.pdf`;
  const filepath = path.join(uploadDir, filename);
  fs.writeFileSync(filepath, file.buffer);
  return `/uploads/${filename}`;
};

// --- 2.5 MOCK DATA FALLBACK (For Local Offline Dev) ---
const MOCK_DATA = {
  settings: {
    gstNumber: "27AAEFC9999Z1Z1",
    whatsapp: "917002477367",
    smtpHost: "smtp.gmail.com",
    isMaintenance: 0
  },
  products: [
    { id: 1, name: "Premium Urea Fertilizer", category: "Fertilizers", price: 450, stock: 500, images: [] },
    { id: 2, name: "Hybrid Paddy Seeds", category: "Seeds", price: 1200, stock: 150, images: [] },
    { id: 3, name: "Organic Pesticide X", category: "Pesticides", price: 850, stock: 80, images: [] }
  ],
  categories: [
    { id: 1, name: "Seeds" },
    { id: 2, name: "Fertilizers" },
    { id: 3, name: "Pesticides" },
    { id: 4, name: "Equipment" }
  ],
  staff: [
    { id: 1, name: "Admin User", email: "admin@farmliv.com", role: "Admin", status: "active" },
    { id: 2, name: "Rahul Sharma", email: "rahul@farmliv.com", role: "Salesman", status: "active" }
  ],
  quick_enquiries: [
    { id: 1, customer_name: "Green Valley Farms", phone: "9876543210", location: "Assam", status: "Pending", notes: "Interested in bulk seeds." },
    { id: 2, customer_name: "Agro Corp", phone: "8887776665", location: "Barpeta", status: "Assigned", notes: "Requires fertilizer quote." }
  ],
  orders: [
    { id: 101, order_code: "ORD-772", customer_name: "Niloy Das", amount: 15400, status: "Approved", executive: "Rahul Sharma", created_at: new Date() },
    { id: 102, order_code: "ORD-991", customer_name: "Pranjal Ahmed", amount: 8200, status: "Pending", executive: "N/A", created_at: new Date() }
  ],
  customers: [
    { id: 1, name: "Niloy Das", phone: "9123456789", location: "Guwahati", type: "Retailer" },
    { id: 2, name: "Pranjal Ahmed", phone: "9876543210", location: "Jorhat", type: "Wholesaler" }
  ],
  payments: [
    { id: 1, order_id: 101, amount: 15400, method: "UPI", status: "Verified", created_at: new Date() },
    { id: 2, order_id: 102, amount: 5000, method: "Cash", status: "Pending", created_at: new Date() }
  ],
  leads: [
    { id: 1, customer_name: "Niloy Das", phone: "9123456789", location: "Guwahati", status: "Pending", created_at: new Date() },
    { id: 2, customer_name: "Pranjal Ahmed", phone: "9876543210", location: "Jorhat", status: "Pending", created_at: new Date() }
  ]
};

const safeQuery = async (query, params = [], mockKey = null) => {
  try {
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (err) {
    console.warn(`⚠️ DB Error, falling back to mock: ${err.message}`);
    if (mockKey && MOCK_DATA[mockKey]) {
      return MOCK_DATA[mockKey];
    }
    throw err;
  }
};

const logActivity = async (action, user = 'Admin') => {
  try {
    await pool.query('INSERT INTO activities (action, user) VALUES (?, ?)', [action, user]);
  } catch (err) {
    console.warn("Activity logging failed (expected if offline):", err.message);
  }
};

// --- 3. ROUTES (API) ---

app.get('/api/debug/schema', async (req, res) => {
  try {
    const [tables] = await pool.query("SHOW TABLES");
    const counts = {};
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      const [[{ count }]] = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      counts[tableName] = count;
    }
    return res.json(counts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
 
// --- SEO & DISCOVERY: Robots.txt & Dynamic Sitemap ---
app.get('/robots.txt', (req, res) => {
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin-portal
Disallow: /salesman
Disallow: /salesman-portal
Disallow: /api/debug

Sitemap: https://farmliv.com/sitemap.xml`;
  res.header('Content-Type', 'text/plain');
  res.status(200).send(robots);
});

app.get('/sitemap.xml', async (req, res) => {
  const DOMAIN = 'https://farmliv.com';
  try {
    // Get Categories & Products
    const [categories] = await pool.query('SELECT name FROM categories');
    const [products] = await pool.query('SELECT id, name FROM products');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${DOMAIN}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${DOMAIN}/products</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${DOMAIN}/certification</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${DOMAIN}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${DOMAIN}/request-quote</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${DOMAIN}/privacy-policy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${DOMAIN}/disclaimer</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;

    // Add Dynamic Categories
    categories.forEach(cat => {
      xml += `
  <url>
    <loc>${DOMAIN}/products/${encodeURIComponent(cat.name)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Add Dynamic Products
    products.forEach(prod => {
      // Special logic for SEO Slugs as requested by user
      let productUrl = `${DOMAIN}/product/${prod.id}`;
      if (String(prod.id) === '2') {
        productUrl = `${DOMAIN}/heavy-duty-weed-control-mat-manufacturer`;
      } else if (String(prod.id) === '3') {
        productUrl = `${DOMAIN}/uv-stabilized-agriculture-shade-net-manufacturer`;
      } else if (String(prod.id) === '4') {
        productUrl = `${DOMAIN}/pp-leno-mesh-bag-manufacturer`;
      }
        
      xml += `
  <url>
    <loc>${productUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    xml += '\n</urlset>';
    
    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('Error generating sitemap');
  }
});

app.get('/api/status', (req, res) => res.json({ 
  status: "Live", 
  sync: true, 
  provider: "Hostinger/farmliv.in",
  server: "server2205",
  time: new Date().toISOString()
}));

// Emergency DB Refresh Route
app.get('/api/admin/setup-db', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query(`CREATE TABLE IF NOT EXISTS activities (id INT AUTO_INCREMENT PRIMARY KEY, action VARCHAR(255), user VARCHAR(255), created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await connection.query(`INSERT INTO activities (action, user) VALUES ('Database Protocols Manually Refreshed', 'System')`);
    connection.release();
    res.json({ success: true, message: "Farmliv Database Synchronized" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT * FROM settings LIMIT 1', [], 'settings');
    const data = Array.isArray(rows) ? (rows[0] || MOCK_DATA.settings) : rows;
    // Attach full server origin to brochure URL for client consumption
    if (data && data.brochure && !data.brochure.startsWith('http')) {
      data.brochure = `${req.protocol}://${req.get('host')}${data.brochure}`;
    }
    return res.json(data);
  } catch (err) {
    return res.json(MOCK_DATA.settings); // Absolute fallback
  }
});

app.post('/api/settings', upload, async (req, res) => {
  try {
    const b = req.body;
    let logoUrl = b.logo;
    let faviconUrl = b.favicon;
    let brochureUrl = b.brochure; // keep existing URL if no new file
    
    // ⭐ DEFENSIVE: If brochure is a full URL, strip the protocol/host before saving
    if (brochureUrl && brochureUrl.startsWith('http')) {
      try {
        const urlObj = new URL(brochureUrl);
        brochureUrl = urlObj.pathname;
      } catch (e) {
        console.warn("Invalid brochure URL format, saving as-is:", brochureUrl);
      }
    }

    if (req.files['logo']) logoUrl = await processImage(req.files['logo'][0]);
    if (req.files['favicon']) faviconUrl = await processImage(req.files['favicon'][0]);
    if (req.files['brochure']) brochureUrl = savePdf(req.files['brochure'][0]);

    const [existing] = await pool.query('SELECT id FROM settings LIMIT 1');
    
    if (existing.length > 0) {
      await pool.query(
        `UPDATE settings SET gstNumber=?, whatsapp=?, smtpHost=?, smtpUser=?, smtpPass=?, facebook=?, instagram=?, isMaintenance=?, logo=?, favicon=?, brochure=? WHERE id=?`,
        [b.gstNumber, b.whatsapp, b.smtpHost, b.smtpUser, b.smtpPass, b.facebook, b.instagram, b.isMaintenance === 'true' ? 1 : 0, logoUrl, faviconUrl, brochureUrl, existing[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO settings (gstNumber, whatsapp, smtpHost, smtpUser, smtpPass, facebook, instagram, isMaintenance, logo, favicon, brochure) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [b.gstNumber, b.whatsapp, b.smtpHost, b.smtpUser, b.smtpPass, b.facebook, b.instagram, b.isMaintenance === 'true' ? 1 : 0, logoUrl, faviconUrl, brochureUrl]
      );
    }
    res.json({ success: true, message: "Settings saved", brochure: brochureUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save settings" });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Check Admin Table
    const [adminRows] = await pool.query('SELECT * FROM admins WHERE LOWER(email) = LOWER(?)', [email]);
    if (adminRows.length > 0) {
      const admin = adminRows[0];
      if (admin.password === password) {
        return res.status(200).json({ 
          success: true, 
          message: "Authorized Admin",
          user: { id: admin.id, email: admin.email, role: 'admin', name: admin.name || 'Farmliv Admin' },
          token: "session_" + Date.now() 
        });
      }
    }

    // 2. Check Staff Table (Salesman/Managers)
    const [staffRows] = await pool.query('SELECT * FROM staff WHERE LOWER(email) = LOWER(?)', [email]);
    if (staffRows.length > 0) {
      const staff = staffRows[0];
      if (staff.password === password) {
        if (staff.status === 'inactive') {
          return res.status(403).json({ success: false, message: "ACCOUNT DEACTIVATED" });
        }
        return res.status(200).json({
          success: true,
          message: "Authorized Staff",
          user: { id: staff.id, email: staff.email, role: staff.role.toLowerCase(), name: staff.name },
          token: "staff_session_" + Date.now()
        });
      } else {
        return res.status(401).json({ success: false, message: "AUTHENTICATION FAILED" });
      }
    }

    return res.status(404).json({ success: false, message: "IDENTITY NOT FOUND" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/staff', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT id, name, email, role, phone, status FROM staff ORDER BY id DESC', [], 'staff');
    return res.json(rows);
  } catch (err) {
    return res.json(MOCK_DATA.staff);
  }
});

app.post('/api/staff', async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO staff (name, email, password, role, phone, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, password, role, phone || null, 'active']
    );
    await logActivity(`New Staff Onboarded: ${name} (${role})`);
    return res.status(201).json({ id: result.insertId, name, email, role });
  } catch (err) {
    return res.status(500).json({ error: "Onboarding failed" });
  }
});

app.delete('/api/staff/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM staff WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Staff member identity not found" });
    }
    await logActivity(`Staff Member Purged (ID: ${req.params.id})`);
    return res.json({ success: true, message: "Staff record purged from Farmliv Team" });
  } catch (err) {
    return res.status(500).json({ error: "Purge protocol failed" });
  }
});

app.put('/api/staff/:id/profile', async (req, res) => {
  const { phone } = req.body;
  const staffId = req.params.id;
  try {
    await pool.query('UPDATE staff SET phone = ? WHERE id = ?', [phone, staffId]);
    const [rows] = await pool.query('SELECT * FROM staff WHERE id = ?', [staffId]);
    return res.json({ success: true, user: rows[0] });
  } catch (err) {
    return res.status(500).json({ error: "Profile update failed" });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT * FROM categories ORDER BY id ASC', [], 'categories');
    return res.json(rows);
  } catch (err) {
    return res.json(MOCK_DATA.categories);
  }
});

app.post('/api/categories', upload, async (req, res) => {
  try {
    const { name, description, parent_id } = req.body;
    let imageUrl = null;
    if (req.files && req.files['image']) {
      imageUrl = await processImage(req.files['image'][0]);
    }

    const [result] = await pool.query(
      'INSERT INTO categories (name, description, image, parent_id) VALUES (?, ?, ?, ?)',
      [name, description, imageUrl, parent_id || null]
    );
    
    await logActivity(`New Category Deployed: ${name}`);
    res.status(201).json({ id: result.insertId, name, success: true });
  } catch (err) {
    console.error("Category creation error:", err);
    res.status(500).json({ error: "Failed to add category: " + err.message });
  }
});

// Update Category (PUT)
app.put('/api/categories/:id', upload, async (req, res) => {
  const catId = req.params.id;
  try {
    const { name, description, parent_id } = req.body;
    
    // Fetch existing
    const [[existing]] = await pool.query('SELECT image FROM categories WHERE id = ?', [catId]);
    if (!existing) return res.status(404).json({ error: "Category not found" });

    let imageUrl = existing.image;
    if (req.files && req.files['image']) {
      imageUrl = await processImage(req.files['image'][0]);
    }

    await pool.query(
      'UPDATE categories SET name=?, description=?, image=?, parent_id=? WHERE id=?',
      [name, description, imageUrl, parent_id || null, catId]
    );

    await logActivity(`Category Updated: ${name}`);
    return res.json({ success: true, message: "Category Synchronized" });
  } catch (err) {
    console.error("Category update error:", err);
    return res.status(500).json({ error: "Category update failed: " + err.message });
  }
});

// DELETE Category
app.delete('/api/categories/:id', async (req, res) => {
  const catId = req.params.id;
  try {
    const [[cat]] = await pool.query('SELECT name FROM categories WHERE id = ?', [catId]);
    if (!cat) return res.status(404).json({ error: "Category identity not found" });

    // First, handle children (sub-categories) - reset their parent_id or delete them?
    // User said "Purge category and its sub-categories?" in frontend confirm, so we delete them.
    await pool.query('DELETE FROM categories WHERE parent_id = ?', [catId]);
    
    // Finally delete the main category
    await pool.query('DELETE FROM categories WHERE id = ?', [catId]);

    await logActivity(`Category Purged: ${cat.name} (ID: ${catId})`);
    return res.json({ success: true, message: "Category record purged from Farmliv Ecosystem" });
  } catch (err) {
    console.error("Category delete error:", err);
    return res.status(500).json({ error: "Purge protocol failed" });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT * FROM products ORDER BY id DESC', [], 'products');
    const parsedRows = rows.map(p => {
      let images = [];
      try {
        if (p.images) {
          images = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
        }
      } catch (e) {
        console.warn(`Invalid images data for product ${p.id}`);
      }
      return { ...p, images: Array.isArray(images) ? images : [] };
    });
    return res.json(parsedRows);
  } catch (err) { 
    return res.json(MOCK_DATA.products); 
  }
});

app.patch('/api/products/:id/stock', async (req, res) => {
  const { amount, action } = req.body; 
  const productId = req.params.id;
  const adj = parseInt(amount);

  if (isNaN(adj)) return res.status(400).json({ error: "Invalid volume quantity" });

  try {
    const adjustment = action === 'add' ? adj : -adj;
    await pool.query('UPDATE products SET stock = stock + ? WHERE id = ?', [adjustment, productId]);
    await logActivity(`Inventory Protocol: ${action?.toUpperCase()} ${adj} units (Product ID: ${productId})`);
    return res.json({ success: true, message: "Inventory Volume Calibrated" });
  } catch (err) {
    console.warn("Stock update fallback (mock logic):", err.message);
    return res.json({ success: true, message: "Inventory Managed (Offline Mode)" });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Product not found" });
    const product = rows[0];
    product.images = product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : [];
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ error: "Synchronization failed" });
  }
});

app.get('/api/products/related/:category', async (req, res) => {
  const { category } = req.params;
  const excludeId = req.query.exclude;
  try {
    const [rows] = await pool.query(
      'SELECT id, name, images, retail_price as price FROM products WHERE category = ? AND id != ? LIMIT 4',
      [category, excludeId]
    );
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Related products retrieval failed" });
  }
});

// Product creation with resilient fallback
app.post('/api/products', upload, async (req, res) => {
  try {
    const { name, description, category, subCategory, moq, gsm, durability, hsn, stock, status } = req.body;
    
    let images = [];
    if (req.files && req.files['images']) {
      images = await Promise.all(req.files['images'].map(file => processImage(file)));
    }
    
    let videoUrl = null;
    if (req.files && req.files['video']) {
      const videoFilename = `video_${Date.now()}${path.extname(req.files['video'][0].originalname)}`;
      fs.writeFileSync(path.join(uploadDir, videoFilename), req.files['video'][0].buffer);
      videoUrl = `/uploads/${videoFilename}`;
    }

    // Farmliv Logic: Handle multiple categories if sent as array, else fallback to string
    const processedCategory = Array.isArray(category) ? JSON.stringify(category) : category;

    const [result] = await pool.query(
      'INSERT INTO products (name, description, category, sub_category, moq, gsm, durability, hsn, stock, status, images, video) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, processedCategory, subCategory, moq || 0, gsm, durability, hsn, stock || 0, status || 'Active', JSON.stringify(images), videoUrl]
    );

    await logActivity(`New Product Deployed: ${name} (ID: ${result.insertId})`);
    return res.status(201).json({ id: result.insertId, success: true });
  } catch (err) {
    console.warn("Product creation fallback (offline):", err.message);
    return res.status(201).json({ id: Date.now(), success: true, message: "Product Logged in Offline Dossier" });
  }
});

// Update Product (PUT)
app.put('/api/products/:id', upload, async (req, res) => {
  const productId = req.params.id;
  try {
    const { name, description, category, subCategory, moq, gsm, durability, hsn, stock, status } = req.body;
    
    // Fetch existing product to preserve images/video if not updated
    const [[existing]] = await pool.query('SELECT images, video FROM products WHERE id = ?', [productId]);
    if (!existing) return res.status(404).json({ error: "Product not found" });

    // Robust Image Parsing
    let images = [];
    try {
      if (existing.images) {
        images = typeof existing.images === 'string' ? JSON.parse(existing.images) : existing.images;
      }
    } catch (e) {
      console.warn("Existing images parse failed, resetting for product:", productId);
    }

    if (req.files && req.files['images']) {
      images = await Promise.all(req.files['images'].map(file => processImage(file)));
    }
    
    let videoUrl = existing.video;
    if (req.files && req.files['video']) {
      try {
        const videoFilename = `video_${Date.now()}${path.extname(req.files['video'][0].originalname)}`;
        fs.writeFileSync(path.join(uploadDir, videoFilename), req.files['video'][0].buffer);
        videoUrl = `/uploads/${videoFilename}`;
      } catch (e) {
        console.error("Video upload failed:", e.message);
      }
    }

    // Farmliv Mapping Sync: Handle multiple categories if sent as array
    const processedCategory = Array.isArray(category) ? JSON.stringify(category) : category;

    await pool.query(
      'UPDATE products SET name=?, description=?, category=?, sub_category=?, moq=?, gsm=?, durability=?, hsn=?, stock=?, status=?, images=?, video=? WHERE id=?',
      [name, description, processedCategory, subCategory, moq || 0, gsm, durability, hsn, stock || 0, status || 'Active', JSON.stringify(images), videoUrl, productId]
    );

    await logActivity(`Product Updated: ${name} (ID: ${productId})`);
    return res.json({ success: true, message: "Product Synchronized Successfully" });
  } catch (err) {
    console.error(`❌ UPDATE FAILURE [Product ${productId}]:`, err.message);
    return res.status(500).json({ error: "Product update failed: " + err.message });
  }
});

app.get('/api/leads', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT * FROM leads ORDER BY created_at DESC', [], 'leads');
    return res.json(rows);
  } catch (err) {
    return res.json([]);
  }
});

app.post('/api/leads', async (req, res) => {
  const { customer_name, phone, email, company, location, product_id, quantity, notes } = req.body;
  try {
    // Get product name for email
    let productName = 'Unknown Product';
    if (product_id) {
      const [[prod]] = await pool.query('SELECT name FROM products WHERE id = ?', [product_id]);
      if (prod) productName = prod.name;
    }

    const query = `INSERT INTO leads (customer_name, phone, email, company, location, product_id, quantity, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`;
    const [result] = await pool.query(query, [customer_name, phone, email, company, location, product_id, quantity, notes]);

    // Send email to admin with full customer details
    const adminMail = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `🌾 New Quote Request from ${customer_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background: #2E7D32; padding: 20px; color: white;">
            <h2 style="margin: 0;">New Quote Request — Farmliv Industries</h2>
          </div>
          <div style="padding: 24px;">
            <h3 style="color: #2E7D32; border-bottom: 2px solid #e8f5e9; padding-bottom: 8px;">Customer Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold; width: 40%;">Name:</td><td style="padding: 8px;">${customer_name || 'N/A'}</td></tr>
              <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${phone || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${email || 'N/A'}</td></tr>
              <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Company:</td><td style="padding: 8px;">${company || 'Individual'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Location:</td><td style="padding: 8px;">${location || 'N/A'}</td></tr>
            </table>
            <h3 style="color: #2E7D32; border-bottom: 2px solid #e8f5e9; padding-bottom: 8px; margin-top: 20px;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold; width: 40%;">Product:</td><td style="padding: 8px;">${productName}</td></tr>
              <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Quantity:</td><td style="padding: 8px;">${quantity || 'N/A'} Units</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Notes:</td><td style="padding: 8px;">${notes || 'None'}</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 12px; background: #e8f5e9; border-radius: 6px; font-size: 13px; color: #555;">
              View in Admin Panel: <a href="https://farmliv.in/admin" style="color: #2E7D32;">farmliv.in/admin</a>
            </div>
          </div>
        </div>
      `
    };
    await transporter.sendMail(adminMail).catch(e => console.log("Email skip:", e.message));

    return res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("Leads error:", err);
    return res.status(500).json({ error: "Quote request failed" });
  }
});

app.put('/api/leads/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE leads SET status = ? WHERE id = ?', [status, req.params.id]);
    await logActivity(`Lead Status Updated: ID ${req.params.id} -> ${status}`);
    return res.json({ success: true, message: "Lead status synchronized." });
  } catch (err) {
    return res.status(500).json({ error: "Lead status update failed" });
  }
});

app.put('/api/leads/:id/assign', async (req, res) => {
  const { staff_id } = req.body;
  const leadId = req.params.id;
  try {
    await pool.query('UPDATE leads SET assigned_to = ?, status = "Contacted" WHERE id = ?', [staff_id, leadId]);
    
    // Fetch data safely for notification
    const [leads] = await pool.query('SELECT * FROM leads WHERE id = ?', [leadId]);
    const [staffList] = await pool.query('SELECT name, email FROM staff WHERE id = ?', [staff_id]);
    
    const lead = leads[0];
    const staff = staffList[0];

    if (staff && staff.email && lead) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: staff.email,
        subject: `New Lead Assigned: ${lead.customer_name || 'Prospect'}`,
        html: `<h3>Task Assignment Alert</h3><p>Namaste ${staff.name}, a new inquiry from <strong>${lead.company || 'Individual'}</strong> has been assigned to your pipeline.</p>`
      };
      await transporter.sendMail(mailOptions).catch(e => console.log("Email skip: ", e.message));
    }
    
    await logActivity(`Lead ID: ${leadId} Assigned to Staff ID: ${staff_id}`);
    return res.json({ success: true, message: "Lead assigned and staff notified." });
  } catch (err) {
    return res.status(500).json({ error: "Lead assignment failed" });
  }
});

app.put('/api/leads/:id/notes', async (req, res) => {
  const { notes } = req.body;
  try {
    await pool.query('UPDATE leads SET notes = ? WHERE id = ?', [notes, req.params.id]);
    await logActivity(`Technical Note Appended to Lead ID: ${req.params.id}`);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Note synchronization failed" });
  }
});

app.delete('/api/leads/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM leads WHERE id = ?', [req.params.id]);
    await logActivity(`Lead Inquiry Purged (ID: ${req.params.id})`);
    return res.json({ success: true, message: "Inquiry purged from Farmliv Ecosystem" });
  } catch (err) {
    return res.status(500).json({ error: "Lead purge protocol failed" });
  }
});

app.get('/api/quick-enquiries', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT * FROM quick_enquiries ORDER BY created_at DESC', [], 'quick_enquiries');
    return res.json(rows);
  } catch (err) {
    return res.json(MOCK_DATA.quick_enquiries);
  }
});

app.get('/api/quick-enquiries/salesman/:id', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT * FROM quick_enquiries WHERE assigned_to = ? ORDER BY created_at DESC', [req.params.id], 'quick_enquiries');
    return res.json(rows);
  } catch (err) {
    return res.json(MOCK_DATA.quick_enquiries);
  }
});

app.post('/api/quick-enquiries', async (req, res) => {
  const { representative_identity, primary_contact_hub, email_node, farmliv_entity, deployment_location, additional_protocols } = req.body;
  try {
    const query = `INSERT INTO quick_enquiries (customer_name, phone, email, company, location, notes, status) VALUES (?, ?, ?, ?, ?, ?, 'Pending')`;
    const [result] = await pool.query(query, [representative_identity, primary_contact_hub, email_node, farmliv_entity, deployment_location, additional_protocols]);

    const adminMail = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, 
      subject: `⚡ New Quick Enquiry from ${representative_identity}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background: #1e293b; padding: 20px; color: white;">
            <h2 style="margin: 0;">Quick Enquiry — Farmliv Industries</h2>
          </div>
          <div style="padding: 24px;">
            <h3 style="color: #2E7D32; border-bottom: 2px solid #e8f5e9; padding-bottom: 8px;">Customer Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold; width: 40%;">Name:</td><td style="padding: 8px;">${representative_identity || 'N/A'}</td></tr>
              <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${primary_contact_hub || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${email_node || 'N/A'}</td></tr>
              <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold;">Company:</td><td style="padding: 8px;">${farmliv_entity || 'Individual'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Location:</td><td style="padding: 8px;">${deployment_location || 'N/A'}</td></tr>
            </table>

            <h3 style="color: #2E7D32; border-bottom: 2px solid #e8f5e9; padding-bottom: 8px; margin-top: 20px;">Requirement Detail</h3>
            <div style="padding: 12px; background: #fdfdfd; border: 1px solid #eee; border-radius: 6px; font-style: italic; color: #444;">
              "${additional_protocols || 'No details provided.'}"
            </div>

            <div style="margin-top: 20px; padding: 12px; background: #f1f5f9; border-radius: 6px; font-size: 13px; color: #555; text-align: center;">
              View in Admin Hub: <a href="https://farmliv.in/admin" style="color: #2E7D32; font-weight: bold;">farmliv.in/admin</a>
            </div>
          </div>
        </div>
      `
    };
    await transporter.sendMail(adminMail).catch(e => console.log("Email skip: ", e.message));

    return res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    return res.status(500).json({ error: "Quick enquiry submission failed" });
  }
});

app.put('/api/quick-enquiries/:id/assign', async (req, res) => {
  const { staff_id } = req.body;
  const enquiryId = req.params.id;
  try {
    await pool.query('UPDATE quick_enquiries SET assigned_to = ?, status = "In Process" WHERE id = ?', [staff_id, enquiryId]);
    
    // Fetch data safely for notification
    const [enquiries] = await pool.query('SELECT * FROM quick_enquiries WHERE id = ?', [enquiryId]);
    const [staffList] = await pool.query('SELECT name, email FROM staff WHERE id = ?', [staff_id]);
    
    const enquiry = enquiries[0];
    const staff = staffList[0];

    if (staff && staff.email && enquiry) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: staff.email,
        subject: `New B2B Inquiry Assigned: ${enquiry.customer_name || 'Prospect'}`,
        html: `<h3>Task Assignment Alert</h3><p>Namaste ${staff.name}, a new general B2B enquiry from <strong>${enquiry.company || 'Individual'}</strong> has been assigned to your profile.</p>`
      };
      await transporter.sendMail(mailOptions).catch(e => console.log("Email skip: ", e.message));
    }
    
    await logActivity(`Quick Enquiry ID: ${enquiryId} Assigned to Staff ID: ${staff_id}`);
    return res.json({ success: true, message: "Inquiry assigned and staff notified." });
  } catch (err) {
    console.error("Assignment Error:", err);
    return res.status(500).json({ error: "Assignment protocol failure: " + err.message });
  }
});

app.get('/api/leads/salesman/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM leads WHERE assigned_to = ? ORDER BY updated_at DESC', [req.params.id]);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Sales pipeline retrieval failed" });
  }
});

app.post('/api/sales', async (req, res) => {
  const { lead_id, salesman_id, final_price, payment_method, transaction_id } = req.body;
  try {
    await pool.query(
      'INSERT INTO sales (lead_id, salesman_id, final_price, payment_method, transaction_id) VALUES (?, ?, ?, ?, ?)',
      [lead_id, salesman_id, final_price, payment_method, transaction_id]
    );
    await logActivity(`Sale Recorded: Lead ID ${lead_id} converted by Salesman ID ${salesman_id}`);
    return res.status(201).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Sale record failed" });
  }
});

app.get('/api/sales', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, l.customer_name, p.name as product_name, st.name as salesperson_name
      FROM sales s
      JOIN leads l ON s.lead_id = l.id
      LEFT JOIN products p ON l.product_id = p.id
      LEFT JOIN staff st ON s.salesman_id = st.id
      ORDER BY s.created_at DESC
    `);
    return res.json(rows);
  } catch (err) {
    console.warn("Fetch sales fallback (offline):", err.message);
    return res.json([]); // Balanced Resiliency
  }
});

app.get('/api/sales/salesman/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, l.customer_name, p.name as product_name 
      FROM sales s 
      JOIN leads l ON s.lead_id = l.id 
      LEFT JOIN products p ON l.product_id = p.id
      WHERE s.salesman_id = ? 
      ORDER BY s.created_at DESC
    `, [req.params.id]);
    return res.json(rows);
  } catch (err) {
    console.error("Sales history error:", err.message);
    return res.status(500).json({ error: "Sales history retrieval failed" });
  }
});

app.delete('/api/leads/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM leads WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: "Quote purged successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Purge failed" });
  }
});

app.put('/api/leads/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE leads SET status = ? WHERE id = ?', [status, req.params.id]);
    await logActivity(`Lead Status Updated to ${status} (ID: ${req.params.id})`);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Status update failed" });
  }
});

app.put('/api/leads/:id/notes', async (req, res) => {
  const { notes } = req.body;
  try {
    await pool.query('UPDATE leads SET notes = ? WHERE id = ?', [notes, req.params.id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Note update failed" });
  }
});

app.put('/api/leads/:id/assign', async (req, res) => {
  const { staff_id } = req.body;
  try {
    await pool.query('UPDATE leads SET assigned_to = ?, status = "assigned" WHERE id = ?', [staff_id, req.params.id]);
    await logActivity(`Lead ID: ${req.params.id} Assigned to Staff ID: ${staff_id}`);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Assignment failed" });
  }
});

app.delete('/api/quick-enquiries/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM quick_enquiries WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: "Enquiry purged successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete enquiry" });
  }
});

// --- BILLING & FINANCE ENGINE ---
app.get('/api/billing/stats', async (req, res) => {
  try {
    const [[{ total_receivables }]] = await pool.query("SELECT SUM(total_amount - (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE invoice_id = invoices.id AND status = 'Verified')) as total_receivables FROM invoices WHERE status != 'Paid'");
    const [[{ received_today }]] = await pool.query("SELECT SUM(amount) as received_today FROM payments WHERE DATE(created_at) = CURDATE() AND status = 'Verified'");
    const [[{ pending_invoices }]] = await pool.query("SELECT COUNT(*) as pending_invoices FROM invoices WHERE status = 'Sent'");
    
    return res.json({
      totalReceivables: total_receivables || 0,
      receivedToday: received_today || 0,
      pendingInvoices: pending_invoices || 0,
      fiscalHealth: 92 // Mock health index
    });
  } catch (err) {
    console.warn("Billing stats fallback (offline):", err.message);
    return res.json({
      totalReceivables: 450000.00,
      receivedToday: 12500.00,
      pendingInvoices: 18,
      fiscalHealth: 85
    });
  }
});

app.get('/api/billing/invoices', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT i.*, c.name as customer_name, o.id as order_ref
      FROM invoices i
      JOIN customers c ON i.customer_id = c.id
      LEFT JOIN orders o ON i.order_id = o.id
      ORDER BY i.created_at DESC
    `);
    return res.json(rows);
  } catch (err) {
    console.warn("Invoices fetch fallback (offline):", err.message);
    return res.json([
      { id: 1, invoice_number: 'INV-2024-001', customer_name: 'Niloy Das', total_amount: 15000.00, status: 'Sent', created_at: new Date() },
      { id: 2, invoice_number: 'INV-2024-002', customer_name: 'Pranjal Ahmed', total_amount: 28500.00, status: 'Paid', created_at: new Date() }
    ]);
  }
});

app.post('/api/billing/invoices', async (req, res) => {
  const { order_id, customer_id, subtotal, tax_amount, total_amount, due_date } = req.body;
  const invoice_number = `INV-${Date.now()}`;
  try {
    const [result] = await pool.query(
      "INSERT INTO invoices (invoice_number, order_id, customer_id, subtotal, tax_amount, total_amount, due_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'Sent')",
      [invoice_number, order_id, customer_id, subtotal, tax_amount, total_amount, due_date]
    );
    return res.status(201).json({ id: result.insertId, invoice_number });
  } catch (err) {
    console.error("Invoice creation error:", err.message);
    return res.status(500).json({ error: "Failed to create invoice" });
  }
});

app.get('/api/billing/payments', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as customer_name, i.invoice_number
      FROM payments p
      JOIN customers c ON p.customer_id = c.id
      LEFT JOIN invoices i ON p.invoice_id = i.id
      ORDER BY p.created_at DESC
    `);
    return res.json(rows);
  } catch (err) {
    console.warn("Payments fetch fallback (offline):", err.message);
    return res.json([
      { id: 1, customer_name: 'Niloy Das', amount: 5000.00, method: 'UPI', status: 'Verified', created_at: new Date() }
    ]);
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const [[stats]] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM products) as totalProducts,
        (SELECT COUNT(*) FROM categories) as totalCategories,
        (SELECT COUNT(*) FROM leads) as totalInquiries,
        (SELECT COUNT(*) FROM staff) as totalStaff,
        (SELECT COALESCE(SUM(final_price), 0) FROM sales) as totalRevenue,
        (SELECT COUNT(*) FROM sales) as totalOrders,
        (SELECT COUNT(*) FROM products WHERE stock <= 10) as lowStockAlerts,
        (SELECT COUNT(*) FROM leads WHERE is_seen = 0) as pendingLeadsCount,
        (SELECT COUNT(*) FROM quick_enquiries WHERE is_seen = 0) as pendingEnquiriesCount,
        (SELECT 
            CASE 
              WHEN (SELECT COUNT(*) FROM leads) = 0 THEN 0 
              ELSE ROUND(((SELECT COUNT(*) FROM sales) / (SELECT COUNT(*) FROM leads)) * 100, 1) 
            END
        ) as conversionRate
    `);
    return res.json(stats || {});
  } catch (err) {
    console.error("❌ ADMIN STATS FATAL ERROR:", err);
    // Return empty stats instead of 500 to keep dashboard alive
    return res.status(200).json({ 
      totalProducts: 0, totalCategories: 0, totalInquiries: 0, totalStaff: 0, 
      totalRevenue: 0, totalOrders: 0, lowStockAlerts: 0, 
      pendingLeadsCount: 0, pendingEnquiriesCount: 0, conversionRate: 0,
      error: "Analytics partially offline: " + err.message 
    });
  }
});

app.post('/api/admin/mark-seen', async (req, res) => {
  const { type, id } = req.body; // 'leads' or 'enquiries', optional id
  try {
    if (type === 'leads') {
      if (id) {
        await pool.query("UPDATE leads SET is_seen = 1 WHERE id = ?", [id]);
      } else {
        await pool.query("UPDATE leads SET is_seen = 1 WHERE is_seen = 0");
      }
    } else if (type === 'enquiries') {
      if (id) {
        await pool.query("UPDATE quick_enquiries SET is_seen = 1 WHERE id = ?", [id]);
      } else {
        await pool.query("UPDATE quick_enquiries SET is_seen = 1 WHERE is_seen = 0");
      }
    }
    return res.json({ success: true });
  } catch (err) {
    console.error("Mark seen error:", err);
    return res.status(500).json({ error: "Failed to mark as seen" });
  }
});

// New Endpoint for Chart Visualization
app.get('/api/admin/charts/sales-overview', async (req, res) => {
  try {
    // Weekly Sales (Last 7 Days)
    const [weeklySales] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%a') as day,
        SUM(final_price) as revenue,
        COUNT(*) as orders
      FROM sales 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY day, DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `);

    // Top Selling Products
    const [topProducts] = await pool.query(`
      SELECT 
        p.name,
        COUNT(s.id) as sales_count,
        SUM(s.final_price) as total_revenue
      FROM sales s
      JOIN leads l ON s.lead_id = l.id
      JOIN products p ON l.product_id = p.id
      GROUP BY p.id
      ORDER BY sales_count DESC
      LIMIT 5
    `);

    return res.json({ 
      weeklySales,
      topProducts
    });
  } catch (err) {
    return res.status(500).json({ error: "Chart data failure" });
  }
});

app.get('/api/admin/reports/staff-performance', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.name as executive_name,
        COUNT(l.id) as total_leads,
        SUM(CASE WHEN l.status = 'Converted' THEN 1 ELSE 0 END) as successful_conversions
      FROM staff s
      LEFT JOIN leads l ON s.id = l.assigned_to
      GROUP BY s.id, s.name
    `);
    return res.json(rows);
  } catch (err) {
    console.error("Staff performance error:", err);
    return res.status(500).json({ error: "Staff performance data retrieval failed" });
  }
});

app.get('/api/admin/activities', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT action, user, created_at FROM activities ORDER BY id DESC LIMIT 50', [], 'activities');
    const logData = Array.isArray(rows) ? rows : [];
    return res.json(logData);
  } catch (err) {
    console.error("❌ ACTIVITIES SYNC ERROR:", err);
    // Return empty array instead of 500 to keep dashboard alive
    return res.status(200).json([{ action: "Activity log temporarily unavailable", user: "System", created_at: new Date() }]);
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Product purge failed." });
  }
});


app.get('/api/orders', async (req, res) => {
  try {
    const rows = await safeQuery(`
      SELECT o.*, c.name as customer_name, c.location, s.name as salesman_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN staff s ON o.salesman_id = s.id
      ORDER BY o.id DESC
    `, [], 'orders');
    return res.json(rows);
  } catch (err) {
    return res.json(MOCK_DATA.orders);
  }
});

app.get('/api/customers', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT * FROM customers ORDER BY id DESC', [], 'customers');
    return res.json(rows);
  } catch (err) {
    return res.json(MOCK_DATA.customers);
  }
});


app.post('/api/customers', async (req, res) => {
  const { name, email, phone, company, address, location, type } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO customers (name, email, phone, company, address, location, type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, company, address, location, type || 'Farmer']
    );
    await logActivity(`Member Synchronized: ${name} (${type})`);
    return res.status(201).json({ id: result.insertId, name, type });
  } catch (err) {
    return res.status(500).json({ error: "Synchronization failed" });
  }
});

app.put('/api/customers/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE customers SET status = ? WHERE id = ?', [status, req.params.id]);
    await logActivity(`Customer ${status.toUpperCase()} (ID: ${req.params.id})`);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Status update failed" });
  }
});


app.put('/api/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    await logActivity(`Order Status Calibration: ${status} (ID: ${req.params.id})`);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Order status update failed" });
  }
});

// MISSING ENDPOINT: Update Quick Enquiry Status
app.put('/api/quick-enquiries/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE quick_enquiries SET status = ? WHERE id = ?', [status, req.params.id]);
    await logActivity(`Enquiry Status Updated to ${status} (ID: ${req.params.id})`);
    return res.json({ success: true });
  } catch (err) {
    console.error("Enquiry Status Error:", err);
    return res.status(500).json({ error: "Enquiry status update failed" });
  }
});


app.get('/api/salesman/:id/dashboard-stats', async (req, res) => {
  try {
    const salesmanId = req.params.id;
    const [[stats]] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM orders WHERE salesman_id = ? AND DATE(created_at) = CURDATE()) as todayOrders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE salesman_id = ? AND DATE(created_at) = CURDATE()) as todaySales,
        (SELECT COUNT(*) FROM customers WHERE assigned_salesman_id = ?) as totalCustomers,
        (SELECT COUNT(*) FROM leads WHERE assigned_to = ? AND status = 'assigned') as newLeads,
        (SELECT COUNT(*) FROM quick_enquiries WHERE assigned_to = ? AND status != 'Pending') as contactedEnquiries,
        (SELECT COUNT(*) FROM tasks WHERE assigned_to = ? AND status = 'Pending') as pendingFollowups,
        (SELECT target_amount FROM sales_targets WHERE salesman_id = ? ORDER BY id DESC LIMIT 1) as monthlyTarget
    `, [salesmanId, salesmanId, salesmanId, salesmanId, salesmanId, salesmanId, salesmanId]);

    const [[achievement]] = await pool.query(`
       SELECT COALESCE(SUM(total_amount), 0) as currentSales 
       FROM orders 
       WHERE salesman_id = ? AND MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())
    `, [salesmanId]);

    // Weekly Trend (Last 7 Days)
    const [weeklyTrend] = await pool.query(`
      SELECT DATE_FORMAT(dates.d, '%a') as day, COALESCE(SUM(orders.total_amount), 0) as amount
      FROM (
        SELECT CURDATE() as d UNION SELECT DATE_SUB(CURDATE(), INTERVAL 1 DAY) UNION 
        SELECT DATE_SUB(CURDATE(), INTERVAL 2 DAY) UNION SELECT DATE_SUB(CURDATE(), INTERVAL 3 DAY) UNION 
        SELECT DATE_SUB(CURDATE(), INTERVAL 4 DAY) UNION SELECT DATE_SUB(CURDATE(), INTERVAL 5 DAY) UNION 
        SELECT DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      ) as dates
      LEFT JOIN orders ON DATE(orders.created_at) = dates.d AND orders.salesman_id = ?
      GROUP BY dates.d
      ORDER BY dates.d ASC
    `, [salesmanId]);


    // Recent Activity
    const [recentActivities] = await pool.query(`
      SELECT action, user, created_at FROM activities 
      ORDER BY id DESC LIMIT 5
    `);

    // Safe fallbacks for empty query results
    const safeStats = stats || {
        todayOrders: 0, todaySales: 0, totalCustomers: 0,
        newLeads: 0, contactedEnquiries: 0, pendingFollowups: 0, monthlyTarget: 50000
    };
    const safeAchievement = achievement || { currentSales: 0 };

    const targetNum = parseFloat(safeStats.monthlyTarget) || 50000;
    const currentNum = parseFloat(safeAchievement.currentSales) || 0;
    const achievementPercent = Math.min(Math.round((currentNum / targetNum) * 100), 100);

    return res.json({
      ...safeStats,
      currentSales: currentNum,
      targetAchievement: achievementPercent,
      weeklyTrend: weeklyTrend || [],
      recentActivities: recentActivities || []
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    return res.status(500).json({ error: "Sales vitals offline" });
  }
});

app.get('/api/salesman/:id/reports', async (req, res) => {
  try {
    const salesmanId = req.params.id;

    // 1. Weekly Sales (Last 7 Days)
    const [weeklySales] = await pool.query(`
      SELECT DATE_FORMAT(dates.d, '%a') as day, COALESCE(SUM(orders.total_amount), 0) as sales, 5000 as target
      FROM (
        SELECT CURDATE() as d UNION SELECT DATE_SUB(CURDATE(), INTERVAL 1 DAY) UNION 
        SELECT DATE_SUB(CURDATE(), INTERVAL 2 DAY) UNION SELECT DATE_SUB(CURDATE(), INTERVAL 3 DAY) UNION 
        SELECT DATE_SUB(CURDATE(), INTERVAL 4 DAY) UNION SELECT DATE_SUB(CURDATE(), INTERVAL 5 DAY) UNION 
        SELECT DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      ) as dates
      LEFT JOIN orders ON DATE(orders.created_at) = dates.d AND orders.salesman_id = ?
      GROUP BY dates.d
      ORDER BY dates.d ASC
    `, [salesmanId]);

    // 2. Category Distribution
    const [categoryDistribution] = await pool.query(`
      SELECT p.category as name, COUNT(oi.id) as value
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.salesman_id = ?
      GROUP BY p.category
    `, [salesmanId]);

    // 3. Performance Vitals
    const [[vitals]] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM leads WHERE assigned_to = ?) as totalLeads,
        (SELECT COUNT(*) FROM leads WHERE assigned_to = ? AND status = 'Converted') as convertedLeads,
        (SELECT COALESCE(AVG(total_amount), 0) FROM orders WHERE salesman_id = ?) as avgOrderValue,
        (SELECT COUNT(*) FROM quick_enquiries WHERE assigned_to = ? AND status != 'Pending') as reachOuts
      `, [salesmanId, salesmanId, salesmanId, salesmanId]);

    const conversionRate = vitals.totalLeads > 0 ? Math.round((vitals.convertedLeads / vitals.totalLeads) * 100) : 0;

    // 4. Monthly Trend (Last 6 Months)
    const [monthlyTrend] = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%b') as month, SUM(total_amount) as value
      FROM orders
      WHERE salesman_id = ? AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY YEAR(created_at), MONTH(created_at), DATE_FORMAT(created_at, '%b')
      ORDER BY YEAR(created_at) ASC, MONTH(created_at) ASC
    `, [salesmanId]);


    return res.json({
      weeklySales,
      categoryDistribution: categoryDistribution.length > 0 ? categoryDistribution : [
        { name: 'Seeds', value: 0 },
        { name: 'Hardware', value: 0 },
        { name: 'Chemicals', value: 0 }
      ],
      performanceVitals: {
        conversionRate,
        avgOrderValue: vitals.avgOrderValue || 0,
        customerGrowth: 0, // Simplified for now
        reachOuts: vitals.reachOuts || 0
      },
      monthlyTrend
    });
  } catch (err) {
    console.error("Salesman reports error:", err);
    return res.status(500).json({ error: "Reports offline" });
  }
});

app.get('/api/payments', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT * FROM payments ORDER BY created_at DESC', [], 'payments');
    return res.json(rows);
  } catch (err) {
    return res.json(MOCK_DATA.payments);
  }
});

app.get('/api/salesman/:id/leads', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT l.*, p.name as product_name
      FROM leads l
      LEFT JOIN products p ON l.product_id = p.id
      WHERE l.assigned_to = ?
      ORDER BY l.id DESC
    `, [req.params.id]);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Lead retrieval failed" });
  }
});

app.get('/api/salesman/:id/customers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers WHERE assigned_salesman_id = ? ORDER BY id DESC', [req.params.id]);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Customer retrieval failed" });
  }
});

app.post('/api/field-visits', async (req, res) => {
  const { salesman_id, customer_id, check_in, check_out, notes, location } = req.body;
  try {
    await pool.query(
      'INSERT INTO field_visits (salesman_id, customer_id, check_in, check_out, notes, location) VALUES (?, ?, ?, ?, ?, ?)',
      [salesman_id, customer_id, check_in, check_out, notes, location]
    );
    await logActivity(`Field Visit Synchronized: (Salesman: ${salesman_id}, Customer: ${customer_id})`);
    return res.status(201).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Visit synchronization failed" });
  }
});

app.get('/api/salesman/:id/payments', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as customer_name 
      FROM payments p 
      JOIN customers c ON p.customer_id = c.id 
      WHERE p.salesman_id = ? 
      ORDER BY p.id DESC
    `, [req.params.id]);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Ledger retrieval failed" });
  }
});

app.post('/api/payments', async (req, res) => {
  const { salesman_id, customer_id, amount, method, notes } = req.body;
  try {
    await pool.query(
      'INSERT INTO payments (salesman_id, customer_id, amount, method, notes) VALUES (?, ?, ?, ?, ?)',
      [salesman_id, customer_id, amount, method, notes]
    );
    await logActivity(`Payment Recorded: ₹${amount} (Salesman: ${salesman_id}, Customer: ${customer_id})`);
    return res.status(201).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Payment synchronization failed" });
  }
});

app.get('/api/salesman/:id/tasks', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE assigned_to = ? ORDER BY due_date ASC', [req.params.id]);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Directive retrieval failed" });
  }
});

app.put('/api/tasks/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE tasks SET status = ? WHERE id = ?', [status, req.params.id]);
    await logActivity(`Task Intelligence Updated: ID ${req.params.id} -> ${status}`);
    return res.json({ success: true });
  } catch (err) {
    console.error("Task update error:", err);
    return res.status(500).json({ error: "Task update refusal" });
  }
});

const PORT = process.env.PORT || 5000;
// --- 4. FRONTEND HOSTING LOGIC ---
const frontendPath = path.resolve(__dirname, '..', 'client', 'dist');
const altFrontendPath = path.resolve(__dirname, 'dist'); 
const finalPath = fs.existsSync(frontendPath) ? frontendPath : altFrontendPath;

// Serve static files with aggressive caching (1 year)
app.use(express.static(finalPath, { 
  maxAge: '365d', // 1 year in milliseconds
  setHeaders: (res, filePath) => {
    // 1. Hashed assets (JS/CSS/WebP) should be immutable
    if (filePath.match(/\.(js|css|webp|png|jpg|jpeg|gif|ico|woff2|woff|ttf|otf)$/) && 
        filePath.includes(path.sep + 'assets' + path.sep)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    
    // 2. index.html should NEVER be cached to ensure users get latest JS/CSS hashes
    if (filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
})); 


// React app catch-all route
app.get('/product/2', (req, res) => {
    res.redirect(301, 'https://farmliv.com/heavy-duty-weed-control-mat-manufacturer');
});

app.get('{*path}', (req, res) => {
    // If request contains a dot (like .js, .css, .png) but isn't HTML, handle missing assets
    if (req.path.includes('.') && 
        !req.path.endsWith('.html') && 
        !req.path.startsWith('/api')) {
      
      // Self-Healing SPA Cache Buster: If browser asks for old JS/CSS, force reload!
      if (req.path.endsWith('.js') || req.path.endsWith('.css')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        if (req.path.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
          return res.send(`
            console.warn('Farmliv: Outdated cache detected. Forcing page reload...');
            if (window.location.search.indexOf('v=') === -1) {
              window.location.replace(window.location.pathname + '?v=' + new Date().getTime());
            }
          `);
        } else {
          res.setHeader('Content-Type', 'text/css');
          return res.send('/* Farmliv: Outdated CSS. Waiting for JS cache-buster to reload. */');
        }
      }
      return res.status(404).send('Product not found');
    }

  const indexPath = path.join(finalPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`Frontend build not found. Checked: ${finalPath}`);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Farmliv Server active on port ${PORT}`);
});
