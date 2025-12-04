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
- [ ] Crear `validacion.http`
- [ ] Test `GET /api/health`
- [ ] Test `POST /api/translate` válido
- [ ] Test `POST /api/translate` con errores
- [ ] Test `GET /api/translations`
- [ ] Test `GET /api/languages`
- [ ] Test `GET /api/translations/:id`
- [ ] Test `DELETE /api/translations/:id`
- [ ] Test `DELETE /api/translations`

---

## 🐳 Parte 5: Dockerización 

### 5.1 `backend/Dockerfile` (**ruth**)
- [ ] Imagen base `node:20-alpine`
- [ ] `WORKDIR /app`
- [ ] Copiar `package.json` e instalar dependencias
- [ ] Copiar código fuente
- [ ] `EXPOSE` puerto
- [ ] `CMD: npm start`

### 5.2 `docker-compose.yml` (**samuel**)     
- [ ] Servicio `backend`
- [ ] Servicio `ollama`
- [ ] Servicio `frontend` (opcional)
- [ ] Configurar red compartida
- [ ] Variables de entorno
- [ ] Montar volúmenes si es necesario

### 5.3 Verificación (**ruth**)
- [ ] Ejecutar `docker compose up --build`
- [ ] Verificar acceso `http://localhost:3000`
- [ ] Comprobar `http://localhost:11434` (Ollama activo)

---

## 📖 Parte 6: Documentación (`README.md`) (**samuel/ruth**) 
- [ ] Descripción general del proyecto
- [ ] Autores
- [ ] Requisitos del sistema
- [ ] Instalación y configuración
- [ ] Ejecución local y con Docker
- [ ] Detalle de API endpoints con ejemplos
- [ ] Explicación de estructura de carpetas
- [ ] Decisiones de diseño (SQLite3, Vanilla JS)
- [ ] Limitaciones conocidas
- [ ] Extensiones futuras

---

## 🌿 Parte 7: Git y Control de versiones
- [ ] Rama `hito2/desarrollo-ia` creada
- [ ] Commits incrementales y descriptivos
- [ ] Pull Request hacia `main`
- [ ] Título PR: “Entrega: Traductor Inteligente con Ollama”
- [ ] Descripción con resumen, autores y pruebas
- [ ] Co-authored commits de ambos integrantes

---

## 📊 Rúbrica y requisitos de entrega
- [ ] Backend configurado correctamente
- [ ] Integración Ollama funcional
- [ ] Base de datos persistente
- [ ] 7 endpoints operativos
- [ ] Frontend funcional y claro
- [ ] Validaciones y manejo de errores
- [ ] Docker Compose funcional
- [ ] README completo
- [ ] Tests `validacion.http`
- [ ] Uso correcto de Git
- [ ] `Checklist.md` completado
- [ ] `.env.example` incluido y `.env` excluido del repositorio
- [ ] Trabajo en pareja documentado (autores y división de tareas)