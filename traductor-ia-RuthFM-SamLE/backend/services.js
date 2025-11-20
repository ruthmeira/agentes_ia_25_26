// backend/services.js
import fetch from "node-fetch";
import db from "./db.js";

// ------------------------------
// VALIDACIÓN DE IDIOMAS
// ------------------------------
export function validarIdioma(lang) {
  const validos = ["es", "en", "fr"];
  return validos.includes(lang);
}

// ------------------------------
// 2.5 - TRADUCIR TEXTO CON OLLAMA
// ------------------------------
export async function traducir(text, sourceLang, targetLang) {
  // Validaciones básicas
  if (!text || text.trim() === "") {
    throw new Error("El texto no puede estar vacío.");
  }

  if (!validarIdioma(sourceLang) || !validarIdioma(targetLang)) {
    throw new Error("Idioma no soportado.");
  }

  if (sourceLang === targetLang) {
    throw new Error("El idioma origen y destino no pueden ser iguales.");
  }

  if (text.length > 5000) {
    throw new Error("El texto supera el límite de 5000 caracteres.");
  }

  const OLLAMA_URL = process.env.AI_API_URL;
  const MODEL = process.env.AI_MODEL || "mistral";

  // Prompt para Ollama
  const prompt = `Traduce este texto del idioma ${sourceLang} al ${targetLang} sin añadir nada extra:
  
"${text}"`;

  const start = Date.now(); // tiempo inicial

  // Llamada a Ollama
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      prompt: prompt,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error("Error al conectar con Ollama.");
  }

  const data = await response.json();

  const end = Date.now();
  const duration = end - start;

  // Formato compatible con el backend
  return {
    texto_original: text,
    traduccion: data.response,
    idioma_origen: sourceLang,
    idioma_destino: targetLang,
    modelo: MODEL,
    duracion_ms: duration
  };
}

// --------------------------------------------------
// EL RESTO ES DE TU COMPAÑERO (PUNTO 2.4)
// LO DEJAMOS COMO PLACEHOLDER
// --------------------------------------------------

export async function obtenerHistorial() {
  throw new Error("Función obtenerHistorial() no implementada.");
}

export async function obtenerTraduccionPorId() {
  throw new Error("Función obtenerTraduccionPorId() no implementada.");
}

export async function eliminarTraduccion() {
  throw new Error("Función eliminarTraduccion() no implementada.");
}

export async function limpiarHistorial() {
  throw new Error("Función limpiarHistorial() no implementada.");
}
