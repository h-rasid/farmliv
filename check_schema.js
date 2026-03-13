const mysql = require('mysql2/promise');
require('dotenv').config({ path: './server/.env' });

async function checkSchema() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: 3306
    });

    try {
        const [quickCols] = await pool.query('SHOW COLUMNS FROM quick_enquiries');
        console.log('--- quick_enquiries columns ---');
        console.table(quickCols);

        const [leadCols] = await pool.query('SHOW COLUMNS FROM leads');
        console.log('--- leads columns ---');
        console.table(leadCols);

        process.exit(0);
    } catch (err) {
        console.error('Error checking schema:', err.message);
        process.exit(1);
    }
}

checkSchema();
