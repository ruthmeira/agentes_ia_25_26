//Imports
// backend/services.js
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
// 2 - TRADUCIR TEXTO CON OLLAMA
// ------------------------------


export async function traducir(text, sourceLang, targetLang, onChunk) {
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

  const OLLAMA_URL = process.env.AI_API_URL2;
  const MODEL = process.env.AI_MODEL || "mistral";

  // Prompt para Ollama
  const prompt = `
    Traduce el siguiente texto del idioma ${sourceLang} al idioma ${targetLang}.
    ⚠️ IMPORTANTE:
    - No añadas explicaciones.
    - No analices el idioma.
    - No digas si ya está traducido.
    - No añadas comillas.
    - Solo responde con la traducción final y nada más.

    Texto:
    ${text}
    `;

  const start = Date.now(); // tiempo inicial

  // Llamada a Ollama
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      prompt: prompt,
      stream: true
    })
  });

  if (!response.ok) {
    throw new Error("Error al conectar con Ollama.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    // Decodificar chunk
    const chunkStr = decoder.decode(value, { stream: true });

    // Cada chunk puede venir con varias líneas JSON
    const lines = chunkStr.split("\n").filter(Boolean);

    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        if (obj.response) {
          fullText += obj.response;       // concatenar fragmentos
          if (onChunk) onChunk(obj.response); // enviar fragmento al frontend
        }
      } catch (err) {
        // ignorar líneas inválidas
      }
    }
  }

  const end = Date.now();
  const duration = end - start;

  // Guardar finalmente en la BD
  const traduccionData = {
    texto_original: text,
    traduccion: fullText,
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

  query += ` ORDER BY id DESC`;
  query += ` LIMIT @limit`;

  params.limit = limit;

  const stmt = db.prepare(query);
  return stmt.all(params);
}

export async function obtenerTraduccionPorId(id) {
  // 1. Validar ID
    const numeroId = Number(id);

    if (isNaN(numeroId) || numeroId <= 0) {
        return {
          error: 400,
          mensaje: "ID inválido. Debe ser un número entero positivo."
        };
    }

    // 2. Consultar la BD
    const stmt = db.prepare("SELECT * FROM historial WHERE id = ?");
    const resultado = stmt.get(numeroId);

    // 3. Si no existe → 404
    if (!resultado) {
        return {
          error: 404,
          mensaje: "Traducción no encontrada"
        };
    }

    // 4. Si existe → devolver objeto completo
    return {
      data: resultado
    };
}

export async function eliminarTraduccion(id) {
  //comprobamos que exista id usando obtenerTraduccionPorId() 
  await obtenerTraduccionPorId(id)
  //hacemos la query
  const stmt = db.prepare("DELETE FROM historial WHERE id = ?");
  stmt.run(id);

  //devovemos confirmacion
  return  { 
    success: true, 
    mensaje: `Traducción con ID ${id} eliminada.` 
  } 


}

export async function limpiarHistorial() {
  //Eliminar todas las traducciones de historial
  const stmt = db.prepare("DELETE FROM historial");
  // Ejecutar el borrado
  const resultado = stmt.run();
  //Contar cuántas filas se borraron
  const filasEliminadas = resultado.changes;
  //devolver confirmación
  return {
    success: true,
    filasEliminadas,
    mensaje: `${filasEliminadas} traducciones eliminadas.`
  }
  
}

