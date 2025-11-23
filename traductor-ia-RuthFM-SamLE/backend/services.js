//Imports
// backend/services.js
import fetch from "node-fetch";
import { db } from './db.js';


// ------------------------------
// VALIDACIÓN DE IDIOMAS
// ------------------------------
export function validarIdioma(lang) {
  const validos = ["es", "en", "fr"];
  return validos.includes(lang);
}

//

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

  // Construimos el objeto final
  const traduccionData = {
    texto_original: text,
    traduccion: data.response,
    idioma_origen: sourceLang,
    idioma_destino: targetLang,
    modelo: MODEL,
    duracion_ms: duration
  };


  // GUARDAR DIRECTAMENTE EN LA BASE DE DATOS 🖥️

  db.prepare(`
    INSERT INTO historial (
      texto_original,
      traduccion,
      idioma_origen,
      idioma_destino,
      modelo,
      duracion_ms
    )
    VALUES (
      @texto_original,
      @traduccion,
      @idioma_origen,
      @idioma_destino,
      @modelo,
      @duracion_ms
    )
  `).run(traduccionData);

  // ---------------------------------------

  return traduccionData;

}

export async function obtenerHistorial(filtros = {}) {
  const { sourceLang, targetLang } = filtros;


  // VALIDACIÓN DE IDIOMAS

  if (sourceLang && !validarIdioma(sourceLang)) {
    throw new Error(`Idioma origen no válido: ${sourceLang}`);
  }
  if (targetLang && !validarIdioma(targetLang)) {
    throw new Error(`Idioma destino no válido: ${targetLang}`);
  }


  // VALIDACIÓN DE LIMIT


  // Si viene algo, se usa. Si no, default = 50.
  let limit = filtros.limit ?? 50;

  // Convertir a número
  limit = Number(limit);

  if (!Number.isInteger(limit)) {
    throw new Error("El límite debe ser un número entero.");
  }

  if (limit <= 0) {
    throw new Error("El límite debe ser mayor que 0.");
  }

  if (limit > 50) {
    throw new Error("El límite máximo permitido es 50.");
  }

  // ------------------------------
  // CONSTRUCCIÓN DE QUERY
  // ------------------------------

  let query = `SELECT * FROM historial`;
  const condiciones = [];
  const params = {};

  if (sourceLang) {
    condiciones.push("idioma_origen = @sourceLang");
    params.sourceLang = sourceLang;
  }

  if (targetLang) {
    condiciones.push("idioma_destino = @targetLang");
    params.targetLang = targetLang;
  }

  if (condiciones.length > 0) {
    query += ` WHERE ${condiciones.join(" AND ")}`;
  }

  query += ` ORDER BY fecha DESC`;
  query += ` LIMIT @limit`;

  params.limit = limit;

  const stmt = db.prepare(query);
  return stmt.all(params);
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
