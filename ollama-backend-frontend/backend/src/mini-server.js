import { config } from "dotenv";
import express from "express";
import cors from "cors";

// Cargamos las variables de entorno desde el archivo .env
config();

const app = express();
const PORT = process.env.PORT || 3002;
const HOST = process.env.HOST || "0.0.0.0";
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
const AI_API_URL = process.env.AI_API_URL || "http://localhost:11434";
const AI_MODEL = process.env.AI_MODEL || "llama3.2:1b";

// middlewares
app.use(cors());
app.use(express.json());

// RUTA DE PRUEBA
// 1. Info de estado
const getAppInfo = () => {
  return {
    name: "Mini Server Backend Ollama",
    version: "1.0.0",
    status: "running",
    description: "Servidor backend para manejar solicitudes de IA",
    endpoints: {
      "GET /api": "Informacion básica del servidor y del modelo",
      "GET /api/modelos": "Información del modelo configurado en Ollama",
      "POST /api/consulta": "Enviar un prompt al modelo",
    },
    model: AI_MODEL,
    host: `${HOST}:${PORT}`,
    ollama: {
      url: AI_API_URL,
    },
  };
};

// ENDPOINTS utilizados por el frontend
// Endpoint de información básica del servidor
app.get("/", (req, res) => {
  res.json(getAppInfo());
});

// Endpoint /api
app.get("/api", (req, res) => {
  res.json(getAppInfo());
});

// Endpoint para obtener información del modelo de IA configurado en Ollama
app.get("/api/modelos", async (req, res) => {
  try {
    const response = await fetch(`${AI_API_URL}/api/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      return res.status(500).json({
        error: `Error fetching ollama models: ${response.statusText}`,
      });
    }
    const data = await response.json();
    const modelos = data.models || [];
    res.json({ total: modelos.length, modelos, origen: AI_API_URL });
  } catch (error) {
    res
      .status(502)
      .json({ error: "Error al obtener el modelo", message: error.message });
  }
});

// Endpoint para enviar una consulta al modelo de IA
app.post("/api/consulta", async (req, res) => {
  const { prompt, model } = req.body || {};

  if (!prompt || typeof prompt !== "string") {
    return res
      .status(400)
      .json({ error: "El prompt es obligatorio y debe ser un string" });
  }

  const targetModel = model || AI_MODEL;

  try {
    const response = await fetch(`${AI_API_URL}/chat/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: targetModel,
        prompt,
        stream: false,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      return res.status(500).json({
        error: `Error fetching ollama models: ${response.statusText}`,
      });
    }

    const data = await response.json();
    res.json({
      prompt,
      modelo: targetModel,
      response: data.response || "",
      latencyMs: data.latencyMs || undefined,
      origen: AI_API_URL,
    });
  } catch (error) {
    res
      .status(502)
      .json({ error: "Error al obtener el modelo", message: error.message });
  }
});

// Lanzamos el servidor HTTP de express con los endpoints definidos
app.listen(PORT, HOST, () => {
  console.log(`
    ======================================
    💻 Mini Server Backend Ollama by Sergio Ramírez
    Servidor escuchando en ${SERVER_URL}
    Por favor, accede a ${SERVER_URL}/api para obtener información del servidor
    ======================================
    `);
});

export default app;