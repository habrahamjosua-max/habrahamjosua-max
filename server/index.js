import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();
const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const client = twilio(process.env.TW_SID, process.env.TW_TOKEN);

const app = express();
app.use(express.json());

// Comprar boletos
app.post("/api/purchase", async (req, res) => {
  const { name, phone, state, quantity } = req.body;

  const { rows } = await pool.query(
    "SELECT id FROM tickets WHERE sold = false ORDER BY RANDOM() LIMIT $1",
    [quantity]
  );
  if (rows.length < quantity) return res.status(400).json({ error: "No hay suficientes boletos" });

  const ids = rows.map(r => r.id);
  await pool.query(
    `UPDATE tickets SET sold = true, buyer_name=$1, buyer_phone=$2, buyer_state=$3 
     WHERE id = ANY($4::int[])`,
    [name, phone, state, ids]
  );

  await client.messages.create({
    from: process.env.WHATSAPP_FROM,
    to: `whatsapp:${phone}`,
    body: `Gracias ${name}, tus boletos son: ${ids.join(", ")}`
  });

  res.json({ success: true, tickets: ids });
});

// Ver estado
app.get("/api/tickets/status", async (_, res) => {
  const sold = await pool.query("SELECT COUNT(*) FROM tickets WHERE sold = true");
  const available = await pool.query("SELECT COUNT(*) FROM tickets WHERE sold = false");
  res.json({ sold: sold.rows[0].count, available: available.rows[0].count });
});

app.listen(3000, () => console.log("Servidor en puerto 3000"));
