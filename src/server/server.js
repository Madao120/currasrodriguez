import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./authRoutes.js"; // ruta al router backend de autenticación
import articulosRoutes from "./articulosRoutes.js"; // ruta al router backend de artículos
import contactoRoutes from "../api/contacto.js"; // ruta al router backend de contacto

// Cargar variables de entorno
dotenv.config();

// Crear app
const app = express();
const PORT = process.env.PORT || 5000;

// Configurar fileURLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());

// Servir uploads como estáticos (asegúrate de que la carpeta exista)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Parsear JSON
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/articulos", articulosRoutes);

// Conexión a MongoDB (opcional si no está configurado)
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB:", err));
} else {
  console.warn("MONGODB_URI no definido — se omite la conexión a MongoDB");
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server Express está corriendo en el puerto: ${PORT}`);
});

//Contacto
app.use("/api/contacto", contactoRoutes);

console.log("Server abierto en el puerto 5000");
