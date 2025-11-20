// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes.js";

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", routes);

// Ruta para 404 (cuando no existe la ruta)
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error("❌ Error interno:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Configurar puerto y host desde .env
const PORT = process.env.PORT || 3002;
const HOST = process.env.HOST || "0.0.0.0";

// Iniciar servidor
app.listen(PORT, HOST, () => {
  console.log(`✅ Servidor iniciado en http://${HOST}:${PORT}`);
});
