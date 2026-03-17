const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'farmliv',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const salesmanId = 1;

    console.log("Running Query 1: Stats");
    const [[stats]] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM orders WHERE salesman_id = ? AND DATE(created_at) = CURDATE()) as todayOrders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE salesman_id = ? AND DATE(created_at) = CURDATE()) as todaySales,
        (SELECT COUNT(*) FROM customers WHERE assigned_salesman_id = ?) as totalCustomers,
        (SELECT COUNT(*) FROM leads WHERE assigned_to = ? AND status = 'assigned') as newLeads,
        (SELECT COUNT(*) FROM quick_enquiries WHERE assigned_to = ? AND status != 'Pending') as contactedEnquiries,
        (SELECT COUNT(*) FROM tasks WHERE assigned_to = ? AND status = 'Pending') as pendingFollowups,
        (SELECT COALESCE(MAX(target_amount), 50000) FROM sales_targets WHERE salesman_id = ? ORDER BY id DESC LIMIT 1) as monthlyTarget
    `, [salesmanId, salesmanId, salesmanId, salesmanId, salesmanId, salesmanId, salesmanId]);
    console.log("Stats Success:", stats);

    console.log("Running Query 2: Achievement");
    const [[achievement]] = await pool.query(`
       SELECT COALESCE(SUM(total_amount), 0) as currentSales 
       FROM orders 
       WHERE salesman_id = ? AND MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())
    `, [salesmanId]);
    console.log("Achievement Success:", achievement);

    console.log("Running Query 3: Weekly Trend");
    const [weeklyTrend] = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%a') as day, COALESCE(SUM(total_amount), 0) as amount
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
    console.log("Weekly Trend Success:", weeklyTrend);

    console.log("Running Query 4: Recent Activities");
    const [recentActivities] = await pool.query(`
      SELECT action, user, created_at FROM activities 
      ORDER BY id DESC LIMIT 5
    `);
    console.log("Recent Activities Success:", recentActivities);

    process.exit(0);
  } catch (err) {
    console.error("FATAL ERROR:", err);
    process.exit(1);
  }
}

test();
