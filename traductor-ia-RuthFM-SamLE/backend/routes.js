// backend/routes.js
import express from "express";
import {
  traducir,
  obtenerHistorial,
  obtenerTraduccionPorId,
  eliminarTraduccion,
  limpiarHistorial
} from "./services.js";

const router = express.Router();

// ------------------------------
// 1. CHECK HEALTH
// ------------------------------
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ------------------------------
// 2. TRADUCIR TEXTO NORMAL
// ------------------------------

router.post("/translate", async (req, res) => {
  const { text, sourceLang, targetLang } = req.body;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");

  try {
    await traducir(text, sourceLang, targetLang, (chunk) => {
      res.write(chunk);
    });
    res.end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ------------------------------
// 3. OBTENER HISTORIAL
// ------------------------------
router.get("/translations", async (req, res) => {
  try {
    const filtros = { sourceLang: req.query.sourceLang, targetLang: req.query.targetLang, limit: req.query.limit };
    const historial = await obtenerHistorial(filtros);
    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// 4. OBTENER TRADUCCIÓN POR ID
// ------------------------------
router.get("/translations/:id", async (req, res) => {
  try {
    const traduccion = await obtenerTraduccionPorId(req.params.id);
    res.json(traduccion);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// ------------------------------
// 5. ELIMINAR TRADUCCIÓN POR ID
// ------------------------------
router.delete("/translations/:id", async (req, res) => {
  try {
    const resultado = await eliminarTraduccion(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// ------------------------------
// 6. LIMPIAR HISTORIAL
// ------------------------------
router.delete("/translations", async (req, res) => {
  try {
    const resultado = await limpiarHistorial();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// 7. LISTA DE IDIOMAS
// ------------------------------
router.get("/languages", (req, res) => {
  res.json([
    { code: "es", name: "Español" },
    { code: "en", name: "Inglés" },
    { code: "fr", name: "Francés" }
  ]);
});

export default router;