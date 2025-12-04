// =============================
// CONFIGURACIÓN
// =============================
const API_URL = "http://localhost:3002/api";

// ELEMENTOS DEL DOM
const form = document.getElementById("translate-form");
const sourceText = document.getElementById("source-text");
const langFrom = document.getElementById("lang-from");
const langTo = document.getElementById("lang-to");
const resultArea = document.getElementById("result-area");
const errorBox = document.getElementById("form-error");
const loader = document.getElementById("loading");
const btnClear = document.getElementById("btn-clear");
const btnClearHistory = document.getElementById("btn-clear-history");
const historyList = document.getElementById("history-list");

// =============================
// UTILIDADES
// =============================
function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove("hidden");
}

function clearError() {
  errorBox.classList.add("hidden");
  errorBox.textContent = "";
}

// =============================
// 1. TRADUCIR TEXTO (STREAMING)
// =============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError();

  const text = sourceText.value.trim();
  const sourceLang = langFrom.value;
  const targetLang = langTo.value;

  if (!text) {
    showError("El texto no puede estar vacío.");
    return;
  }

  resultArea.textContent = "";
  showLoader();

  try {
    // SSE stream del backend
    const response = await fetch(`${API_URL}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, sourceLang, targetLang })
    });

    if (!response.ok) {
      const data = await response.json();
      showError(data.error || "Error desconocido.");
      hideLoader();
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value);
        resultArea.textContent += chunk;
      }
    }

    // Una vez terminado, recargar historial
    loadHistory();

  } catch (err) {
    showError("Error al conectar con el servidor.");
  } finally {
    hideLoader();
  }
});

// =============================
// 2. ACTUALIZAR SELECTS DE IDIOMAS
// =============================
function actualizarIdiomas() {
  const from = langFrom.value;
  const to = langTo.value;

  [...langTo.options].forEach(opt => {
    opt.disabled = opt.value === from;
  });

  [...langFrom.options].forEach(opt => {
    opt.disabled = opt.value === to;
  });
}

langFrom.addEventListener("change", actualizarIdiomas);
langTo.addEventListener("change", actualizarIdiomas);
actualizarIdiomas();

// =============================
// 3. LIMPIAR FORMULARIO
// =============================
btnClear.addEventListener("click", () => {
  sourceText.value = "";
  resultArea.textContent = "—";
  clearError();
});

// =============================
// 4. CARGAR HISTORIAL
// =============================
async function loadHistory() {
  historyList.innerHTML = "<li>Cargando historial...</li>";

  try {
    const res = await fetch(`${API_URL}/translations`);
    const data = await res.json();

    historyList.innerHTML = "";

    if (!data || data.length === 0) {
      historyList.innerHTML = "<li>No hay traducciones guardadas.</li>";
      return;
    }

    data.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${item.id}</strong> —
        <em>${item.idioma_origen}</em> → <em>${item.idioma_destino}</em><br>
        <small>${item.texto_original}</small><br>
        <span><strong>${item.traduccion}</strong></span>
      `;
      historyList.appendChild(li);
    });

  } catch (error) {
    historyList.innerHTML = "<li>Error al cargar el historial.</li>";
  }
}

// =============================
// 5. BORRAR TODO EL HISTORIAL
// =============================
btnClearHistory.addEventListener("click", async () => {
  if (!confirm("¿Seguro que quieres borrar todo el historial?")) return;

  try {
    const res = await fetch(`${API_URL}/translations`, { method: "DELETE" });
    const data = await res.json();
    alert(data.mensaje);
    loadHistory();
  } catch (error) {
    showError("No se pudo borrar el historial.");
  }
});

// =============================
// INICIALIZACIÓN
// =============================
loadHistory();