import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tickets (
      id SERIAL PRIMARY KEY,
      sold BOOLEAN DEFAULT false,
      buyer_name VARCHAR(100),
      buyer_phone VARCHAR(20),
      buyer_state VARCHAR(50)
    );
  `);

  console.log("Generando boletos...");
  for (let i = 0; i < 100000; i++) {
    await pool.query("INSERT INTO tickets DEFAULT VALUES");
  }
  console.log("Listo ✅");
  process.exit();
})();
