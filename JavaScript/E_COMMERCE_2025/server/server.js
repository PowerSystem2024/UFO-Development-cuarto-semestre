const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

// SDK v2 para MercadoPago actual 2025
const { MercadoPagoConfig, Preference } = require("mercadopago");

// Configuración de Mercado Pago (reemplazar aquí con el access token real)
const client = new MercadoPagoConfig({
  accessToken: "<ACCESS_TOKEN>" // ⚠️ poné tu token real
});

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));
app.use(cors());

// Ruta base
app.get("/", function (req, res) {
  res.sendFile(path.resolve(__dirname, "..", "client", "./media/index.html"));
});


// Crear preferencia
app.post("/create_preference", async (req, res) => {
  try {
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            title: req.body.description,
            unit_price: Number(req.body.price),
            quantity: Number(req.body.quantity),
          },
        ],
        back_urls: {
          success: "http://localhost:8080/feedback",
          failure: "http://localhost:8080/feedback",
          pending: "http://localhost:8080/feedback"
        },
        auto_return: "approved",
      }
    });

    res.json({ id: result.id }); // devolvemos el ID de la preferencia al frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la preferencia" });
  }
});

// Ruta de feedback (callback de MP)
app.get("/feedback", function (req, res) {
  res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id
  });
});

// Levantar servidor
app.listen(8080, () => {
  console.log("Servidor corriendo en http://localhost:8080");
});
