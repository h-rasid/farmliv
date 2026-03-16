const mysql = require('mysql2/promise');
require('dotenv').config({ path: './server/.env' });

async function checkNodes() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
  });

  try {
    const [products] = await pool.query("SELECT id, name, description FROM products WHERE name LIKE '%Node%' OR description LIKE '%Node%'");
    console.log('--- PRODUCTS CONTAINING "Node" ---');
    console.log(JSON.stringify(products, null, 2));

    const [activities] = await pool.query("SELECT id, action FROM activities WHERE action LIKE '%Node%' LIMIT 10");
    console.log('\n--- ACTIVITIES CONTAINING "Node" (Sample) ---');
    console.log(JSON.stringify(activities, null, 2));

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}

checkNodes();
