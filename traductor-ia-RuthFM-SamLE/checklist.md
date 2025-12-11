# ✅ Checklist - Hito 2: Traductor Inteligente (Full-Stack con Ollama)

## 🧱 Parte 1: Configuración inicial del proyecto   (**ruth**)
- [x] Crear carpeta `traductor-ia-[nombre-iniciales]`
- [x] Inicializar repositorio Git (`git init`)
- [x] Crear rama de trabajo `git checkout -b hito2/desarrollo-ia`

### 🗄 Base de datos SQLite3 (**samuel**)
- [x] Crear carpeta `backend/db/`
- [x] No crear `traducciones.db` manualmente
- [x] Implementar `db.js` que genere la BD automáticamente al iniciar el servidor

---

## ⚙️ Parte 2: Backend - Implementación 

### 2.1 `backend/db.js` (**samuel**)
- [x] Importar `better-sqlite3`
- [x] Crear o abrir BD `./db/traducciones.db`
- [x] Crear tabla `traducciones`
- [x] Exportar instancia de BD

### 2.2 `backend/server.js` (**ruth**)
- [x] Importar `express`, `cors`, `dotenv`
- [x] Configurar middlewares (`express.json()`, `cors()`)
- [x] Cargar variables de entorno (`.env`)
- [x] Importar rutas (`routes.js`)
- [x] Levantar servidor en puerto del `.env`
- [x] Manejar errores 404 y globales

### 2.3 `backend/routes.js` (**ruth**)
**Endpoints requeridos:**
- [x] `GET /api/health` — comprobar estado
- [x] `POST /api/translate` — traducir texto
- [x] `GET /api/translations` — historial de traducciones
- [x] `GET /api/translations/:id` — traducción por ID
- [x] `DELETE /api/translations/:id` — eliminar una traducción
- [x] `DELETE /api/translations` — limpiar historial
- [x] `GET /api/languages` — lista de idiomas soportados

### 2.4 `backend/services.js` (**samuel**)
**Funciones requeridas:**
- [x] `traducir(text, sourceLang, targetLang, onChuck)` (**ruth**)
- [x] `obtenerHistorial(filtros)`
- [x] `obtenerTraduccionPorId(id)`
- [x] `eliminarTraduccion(id)`
- [x] `limpiarHistorial()`
- [x] `validarIdioma(codigo)`

### 2.5 Integración con Ollama (**ruth**)
- [x] Configurar `.env` con `OLLAMA_URL=http://192.168.50.99:11434`
- [x] Conectarse a `/api/generate` (POST)
- [x] Medir tiempo de respuesta
- [x] Insertar traducción en BD
- [x] Manejar errores y timeouts

### 2.6 Base de datos SQLite3 (**samuel**)
- [x] Insertar traducciones al recibir respuesta
- [x] Consultar historial al iniciar o filtrar
- [x] Evitar reconsultas a Ollama
- [x] Permitir filtrado eficiente por idioma
- [x] Ordenar resultados por fecha

---

## 🎨 Parte 3: Frontend - Implementación

### 3.1 `frontend/index.html` (**Ruth**)
- [x] Input/textarea para texto
- [x] Select idioma origen y destino
- [x] Botones: “Traducir” y “Limpiar”
- [x] Área resultado de traducción
- [x] Área historial
- [x] Indicadores de carga
- [x] Mensajes de error

### 3.2 `frontend/style.css` (**ruth**)
- [x] Estilos básicos (sin frameworks)
- [x] Layout responsivo
- [x] Estados de carga y error
- [x] Interfaz clara y diferenciada

### 3.3 `frontend/main.js` (**ruth**)
- [x] Manejar estado de la app
- [x] `fetch` a `/api/translate`
- [x] Mostrar resultado en pantalla
- [x] `fetch` a `/api/translations`
- [x] Eliminar traducciones individuales
- [x] Manejar errores y mostrar mensajes

---

## 🧪 Parte 4: Validación y Tests (**samuel**)
- [x] Crear `validacion.http`
- [x] Test `GET /api/health`
- [x] Test `POST /api/translate` válido
- [x] Test `POST /api/translate` con errores
- [x] Test `GET /api/translations`
- [x] Test `GET /api/languages`
- [x] Test `GET /api/translations/:id`
- [x] Test `DELETE /api/translations/:id`
- [x] Test `DELETE /api/translations`

---

## 🐳 Parte 5: Dockerización 

### 5.1 `backend/Dockerfile` (**ruth**)
- [x] Usar imagen `node:20-alpine`
- [x] Definir `WORKDIR /app`
- [x] Copiar `package.json`
- [x] Instalar dependencias
- [x] Copiar código del backend
- [x] Exponer puerto del backend
- [x] Establecer comando `npm start`

### 5.2 `docker-compose.yml` (**samuel**)     
- [x] Crear servicio `backend`
- [x] Crear servicio `frontend` (opcional)
- [x] Configurar redes necesarias
- [x] Importar variables desde `.env`
- [x] No incluir servicio Ollama
- [x] Montar volúmenes si es necesario

### 5.3 Verificación (**ruth**)
- [x] Ejecutar `docker compose up --build`
- [x] Verificar acceso `http://localhost:5173`

---

## 📖 Parte 6: Documentación (`README.md`) (**samuel/ruth**) 
- [x] Descripción general del proyecto
- [x] Autores
- [x] Requisitos del sistema
- [x] Instalación y configuración
- [x] Ejecución local y con Docker
- [x] Detalle de API endpoints con ejemplos
- [x] Explicación de estructura de carpetas
- [x] Decisiones de diseño (SQLite3, Vanilla JS)
- [x] Limitaciones conocidas
- [x] Extensiones futuras

---

## 🌿 Parte 7: Git y Control de versiones
- [x] Rama `hito2/desarrollo-ia` creada
- [x] Commits incrementales y descriptivos
- [x] Pull Request hacia `main`
- [x] Título PR: “Entrega: Traductor Inteligente con Ollama”
- [x] Descripción con resumen, autores y pruebas
- [x] Co-authored commits de ambos integrantes

---

## 📊 Rúbrica y requisitos de entrega
- [x] Backend funcionando
- [x] Frontend funcionando
- [x] Conexión con Ollama remoto
- [x] Historial en SQLite3 persistente
- [x] Todos los endpoints operativos
- [x] Docker del backend funcional
- [x] README completo
- [x] Checklist incluido
- [x] `.env` ignorado
- [x] `.env.example` incluido