// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- Mercado Pago SDK v2.x ---
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');


// Crear el cliente de Mercado Pago con tu token
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const app = express();
app.use(cors());
app.use(express.json());

// --- Configuración de base de datos ---
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// --- Middleware de autenticación ---
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).send({ error: 'no token' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).send({ error: 'invalid token' });
  }
}

// --- Registro ---
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const [result] = await pool.query(
      'INSERT INTO users (name,email,password_hash) VALUES (?,?,?)',
      [name, email, hash]
    );
    res.send({ id: result.insertId, name, email });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// --- Login ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
  const user = rows[0];
  if (!user) return res.status(400).send({ error: 'user not found' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(400).send({ error: 'wrong password' });
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.send({ token, user: { id: user.id, name: user.name, email: user.email } });
});


// Get current user data
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  res.send({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});


// --- Obtener productos ---
app.get('/api/products', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products');
  res.send(rows);
});



// --- Crear orden manual sin Mercado Pago ---
app.post('/api/orders', authMiddleware, async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).send({ error: "No hay items en la orden" });
  }

  // calcular total
  const total = items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  try {
    // crear orden con estado "pending"
    const [orderRes] = await pool.query(
      'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
      [req.user.id, total, 'pending']
    );

    const orderId = orderRes.insertId;

    // guardar items
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    return res.send({ 
      orderId,
      total,
      status: "pending"
    });

  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "No se pudo crear la orden" });
  }
});


// --- Crear preferencia de Mercado Pago y registrar orden ---
app.post('/api/create_preference', authMiddleware, async (req, res) => {
  const { items } = req.body;

  // Formatear ítems al formato del SDK nuevo
  const mp_items = items.map(it => ({
    title: it.name,
    quantity: Number(it.quantity),
    unit_price: Number(it.price),
    currency_id: 'ARS'
  }));

  try {
    // 1) Calcular total y crear orden primero (sin mercado_pago_id)
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

    const [orderRes] = await pool.query(
      'INSERT INTO orders (user_id, total, status) VALUES (?,?,?)',
      [req.user.id, total, 'pending']
    );
    const orderId = orderRes.insertId;

    // 2) Crear preferencia vinculando la orden
    const preference = await new Preference(mpClient).create({
      body: {
        items: mp_items,
        back_urls: {
          success: 'http://localhost:5173/confirmation',
          failure: 'http://localhost:5173/cart',
          pending: 'http://localhost:5173/cart'
        },
        external_reference: String(orderId)
      }
    });

    // 3) Guardar el id de MP en la orden
    await pool.query(
      'UPDATE orders SET mercado_pago_id=? WHERE id=?',
      [preference.id, orderId]
    );

    // 4) Guardar items
    await Promise.all(items.map(it =>
      pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)',
        [orderId, it.product_id, it.quantity, it.price]
      )
    ));

    // 5) Devolver datos al frontend
    res.send({
      orderId,
      preferenceId: preference.id,
      init_point: preference.init_point || preference.sandbox_init_point
    });

  } catch (e) {
    console.error(e);
    res.status(500).send({ error: e.message });
  }
});


// *****************************************************************************
// --- Webhook Mercado Pago ---
app.post('/api/mercadopago/webhook', async (req, res) => {
  try {
    console.log('🔔 Webhook recibido:', req.body);

    // Caso 1: Mercado Pago notifica que existe un pago
    if (req.body.type === 'payment') {

      const paymentId = req.body.data.id;

      // Consultar datos del pago real a MP
      const payment = await new Payment(mpClient).get({ id: paymentId });

      console.log("💳 Pago recibido:", payment);

      // Extraer external_reference (viene de la preferencia)
      const orderId = payment.external_reference;

      if (!orderId) {
        console.log("⚠ No hay external_reference en el pago");
        return res.sendStatus(200);
      }

      // Si el pago está aprobado → actualizar orden
      if (payment.status === 'approved') {
        await pool.query(
          "UPDATE orders SET status='approved' WHERE id=?",
          [orderId]
        );

        console.log("✅ Orden actualizada como aprobada:", orderId);
      }
    }

    res.sendStatus(200);

  } catch (err) {
    console.error("❌ Error en webhook:", err);
    res.sendStatus(500);
  }
});
// *****************************************************************************

// --- Iniciar servidor ---
app.listen(process.env.PORT || 4000, () =>
  console.log('✅ Backend listening on port', process.env.PORT || 4000)
);
