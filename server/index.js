const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); 
const multer = require('multer'); 
const path = require('path');
const fs = require('fs');
const compression = require('compression'); 
const nodemailer = require('nodemailer');
const sharp = require('sharp'); 
require('dotenv').config();

const app = express();

// --- 1. MIDDLEWARE ---
app.use(compression()); 

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
      /\.vercel\.app$/,
      /farmliv\.in$/                  
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

// Static files management
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

app.use('/uploads', express.static(uploadDir, {
  maxAge: '30d', 
  etag: true
})); 

// --- 2. DATABASE & EMAIL CONFIG ---
// Hostinger server2205 Optimized Configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',           
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

// Database Connection Test with detailed logging
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Connected Successfully to server2205!');
        console.log(`📡 Host: ${process.env.DB_HOST || 'localhost'} | DB: ${process.env.DB_NAME || 'u868538679_farmliv_data'}`);
        connection.release();
    } catch (err) {
        console.error('❌ MySQL Connection Error Detail:', err.message);
        console.log('💡 TIP: 1. Ensure DB user is added to the DB in Hostinger Panel.');
        console.log('💡 TIP: 2. Ensure "localhost" is used for host if running on the same server.');
    }
})();

const storage = multer.memoryStorage(); 
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'video', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 }
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

// --- 3. ROUTES (API) ---

app.get('/api/status', (req, res) => res.json({ 
  status: "Live", 
  sync: true, 
  provider: "Hostinger/farmliv.in",
  server: "server2205",
  time: new Date().toISOString()
}));

app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM settings LIMIT 1');
    return res.json(rows[0] || {});
  } catch (err) {
    return res.status(500).json({ error: "Settings fetch failed" });
  }
});

app.post('/api/settings', upload, async (req, res) => {
  try {
    const b = req.body;
    let logoUrl = b.logo;
    let faviconUrl = b.favicon;

    if (req.files['logo']) logoUrl = await processImage(req.files['logo'][0]);
    if (req.files['favicon']) faviconUrl = await processImage(req.files['favicon'][0]);

    const [existing] = await pool.query('SELECT id FROM settings LIMIT 1');
    
    if (existing.length > 0) {
      await pool.query(
        `UPDATE settings SET gstNumber=?, whatsapp=?, smtpHost=?, smtpUser=?, smtpPass=?, facebook=?, instagram=?, isMaintenance=?, logo=?, favicon=? WHERE id=?`,
        [b.gstNumber, b.whatsapp, b.smtpHost, b.smtpUser, b.smtpPass, b.facebook, b.instagram, b.isMaintenance === 'true' ? 1 : 0, logoUrl, faviconUrl, existing[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO settings (gstNumber, whatsapp, smtpHost, smtpUser, smtpPass, facebook, instagram, isMaintenance, logo, favicon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [b.gstNumber, b.whatsapp, b.smtpHost, b.smtpUser, b.smtpPass, b.facebook, b.instagram, b.isMaintenance === 'true' ? 1 : 0, logoUrl, faviconUrl]
      );
    }
    res.json({ success: true, message: "Settings saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save settings" });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM admins WHERE LOWER(email) = LOWER(?)', [email]);
    if (rows.length > 0) {
      const admin = rows[0];
      if (admin.password === password) {
        return res.status(200).json({ 
          success: true, 
          message: "Authorized Connection",
          user: { id: admin.id, email: admin.email, role: 'admin', name: 'Farmliv Admin' },
          token: "session_" + Date.now() 
        });
      } else {
        return res.status(401).json({ success: false, message: "AUTHENTICATION FAILED" });
      }
    } else {
      return res.status(404).json({ success: false, message: "IDENTITY NOT FOUND" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/staff', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, phone, status FROM staff ORDER BY id DESC');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Staff directory offline" });
  }
});

app.post('/api/staff', async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO staff (name, email, password, role, phone, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, password, role, phone || null, 'active']
    );
    return res.status(201).json({ id: result.insertId, name, email, role });
  } catch (err) {
    return res.status(500).json({ error: "Onboarding failed" });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Category retrieval failed" });
  }
});

app.post('/api/categories', async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    res.status(500).json({ error: "Failed to add category node" });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
    const parsedRows = rows.map(p => ({
      ...p,
      images: p.images ? (typeof p.images === 'string' ? JSON.parse(p.images) : p.images) : []
    }));
    return res.json(parsedRows);
  } catch (err) { 
    return res.status(500).json({ error: "Inventory offline", details: err.message }); 
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
    return res.status(500).json({ error: "Node synchronization failed" });
  }
});

app.get('/api/products/related/:category', async (req, res) => {
  const { category } = req.params;
  const excludeId = req.query.exclude;
  try {
    const [rows] = await pool.query(
      'SELECT id, name, images, retail_price as price, stock FROM products WHERE category = ? AND id != ? LIMIT 4',
      [category, excludeId]
    );
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Related nodes retrieval failed" });
  }
});

app.post('/api/products', upload, async (req, res) => {
  try {
    const b = req.body;
    let images = [];
    if (req.files['images']) {
      images = await Promise.all(req.files['images'].map(file => processImage(file)));
    }
    
    let videoUrl = null;
    if (req.files['video']) {
      const videoFilename = `video_${Date.now()}${path.extname(req.files['video'][0].originalname)}`;
      fs.writeFileSync(path.join(uploadDir, videoFilename), req.files['video'][0].buffer);
      videoUrl = `/uploads/${videoFilename}`;
    }

    const [result] = await pool.query(
      `INSERT INTO products (name, description, category, sub_category, retail_price, bulk_price, stock, gsm, durability, hsn, status, images, video_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [b.name, b.description, b.category, b.subCategory, b.retailPrice, b.bulkPrice, b.stock, b.gsm, b.durability, b.hsn, b.status, JSON.stringify(images), videoUrl]
    );
    return res.status(201).json({ id: result.insertId, ...b });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Asset creation failed" });
  }
});

app.get('/api/leads', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Leads retrieval failed" });
  }
});

app.post('/api/leads', async (req, res) => {
  const { customer_name, phone, email, company, location, product_id, quantity, timeline, notes } = req.body;
  try {
    const query = `INSERT INTO leads (customer_name, phone, email, company, location, product_id, quantity, timeline, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`;
    const [result] = await pool.query(query, [customer_name, phone, email, company, location, product_id, quantity, timeline, notes]);
    return res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    return res.status(500).json({ error: "Quote request failed" });
  }
});

app.get('/api/quick-enquiries', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM quick_enquiries ORDER BY created_at DESC');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Quick enquiries retrieval failed" });
  }
});

app.post('/api/quick-enquiries', async (req, res) => {
  const { representative_identity, primary_contact_hub, email_node, enterprise_entity, deployment_location, additional_protocols } = req.body;
  try {
    const query = `INSERT INTO quick_enquiries (customer_name, phone, email, company, location, notes, status) VALUES (?, ?, ?, ?, ?, ?, 'Pending')`;
    const [result] = await pool.query(query, [representative_identity, primary_contact_hub, email_node, enterprise_entity, deployment_location, additional_protocols]);

    const adminMail = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, 
      subject: `New Quick Enquiry: ${representative_identity}`,
      html: `<h3>New Popup Enquiry Received</h3><p><strong>Name:</strong> ${representative_identity}</p><p><strong>Phone:</strong> ${primary_contact_hub}</p><p><strong>Company:</strong> ${enterprise_entity}</p><hr/><p><strong>Details:</strong> ${additional_protocols}</p>`
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
    const [[enquiry]] = await pool.query('SELECT * FROM quick_enquiries WHERE id = ?', [enquiryId]);
    const [[staff]] = await pool.query('SELECT name, email FROM staff WHERE id = ?', [staff_id]);
    
    if (staff && staff.email) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: staff.email,
        subject: `New B2B Inquiry Assigned: ${enquiry.customer_name}`,
        html: `<h3>Task Assignment Alert</h3><p>Namaste ${staff.name}, a new general B2B enquiry from <strong>${enquiry.company || 'Individual'}</strong> has been assigned to your profile.</p>`
      };
      await transporter.sendMail(mailOptions).catch(e => console.log("Email skip: ", e.message));
    }
    return res.json({ success: true, message: "Inquiry assigned and staff notified." });
  } catch (err) {
    return res.status(500).json({ error: "Assignment protocol failure" });
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

app.delete('/api/quick-enquiries/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM quick_enquiries WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: "Enquiry purged successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete enquiry node" });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const [[stats]] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM products) as products,
        (SELECT COUNT(*) FROM leads) as leads,
        (SELECT COUNT(*) FROM quick_enquiries) as quick_enquiries,
        (SELECT COALESCE(SUM(id), 0) FROM leads WHERE status = 'Converted') as revenue,
        (SELECT COUNT(*) FROM products WHERE stock <= 10) as lowStock,
        (SELECT COUNT(*) FROM leads WHERE status = 'Pending') as pendingOrders
    `);
    return res.json(stats);
  } catch (err) {
    return res.status(500).json({ error: "Analytics Offline" });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Asset purge failed." });
  }
});

// --- 4. FRONTEND HOSTING LOGIC ---
const frontendPath = path.resolve(__dirname, '..', 'client', 'dist');
const altFrontendPath = path.resolve(__dirname, 'dist'); 
const finalPath = fs.existsSync(frontendPath) ? frontendPath : altFrontendPath;

app.use(express.static(finalPath, { maxAge: '7d' })); 

app.use('/api/{*path}', (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.get('{*path}', (req, res) => {
  const indexPath = path.join(finalPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`Frontend build not found. Checked: ${finalPath}`);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Farmliv Server active on port ${PORT}`);
});
