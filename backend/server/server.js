import "dotenv/config";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";

import authRoutes from "./authRoutes.js";
import articulosRoutes from "./articulosRoutes.js";
import contactoRoutes from "./contactoRoutes.js";
import facturasRoutes from "./facturasRoutes.js";
// -----------------------------
// CONFIGURACIÓN BÁSICA
// -----------------------------

const app = express();
const PORT = process.env.PORT || 5000;

// Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Resolver __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------
// MIDDLEWARES (SIEMPRE PRIMERO)
// -----------------------------

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());

app.use("/api/facturas", facturasRoutes);
// Servir uploads como estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -----------------------------
// RUTA STRIPE CHECKOUT
// -----------------------------

app.post("/crear-checkout-session", async (req, res) => {
  try {
    const { items } = req.body;
    console.log("Items recibidos para checkout:", items);

    if (!items || !items.length) {
      return res.status(400).json({ error: "No hay items en la cesta" });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.nombre,
        },
        unit_amount: Math.round(item.precio * 100), // céntimos
      },
      quantity: item.cantidad,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Error creando sesión de Stripe:", error);
    res.status(500).json({ error: "Error creando sesión de pago" });
  }
});

// -----------------------------
// OTRAS RUTAS DE TU APP
// -----------------------------

app.use("/api/auth", authRoutes);
app.use("/api/articulos", articulosRoutes);
app.use("/api/contacto", contactoRoutes);

// -----------------------------
// CONEXIÓN MONGODB (OPCIONAL)
// -----------------------------

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch((err) => console.error("❌ Error MongoDB:", err));
} else {
  console.warn("⚠️ MONGODB_URI no definido — se omite MongoDB");
}

// -----------------------------
// INICIAR SERVIDOR
// -----------------------------

app.listen(PORT, () => {
  console.log(`🚀 Server Express corriendo en http://localhost:${PORT}`);
});
