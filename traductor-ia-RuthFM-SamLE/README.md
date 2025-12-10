# 📖 Traductor Inteligente con IA (Full-Stack)

## Estructura General

### Descripción del Proyecto
Aplicación web Full-Stack que permite traducir texto entre múltiples idiomas (Español, Inglés, Francés) utilizando Inteligencia Artificial Generativa. El sistema procesa las traducciones mediante el modelo `mistral:instruct` alojado en un servidor Ollama, almacena un historial persistente en SQLite y ofrece una interfaz moderna en tiempo real.

### Autores
*   **Ruth Meira Faouzi**
*   **Samuel Lara Enríquez**

### Requisitos del Sistema
*   **Node.js**: v20 o superior.
*   **Docker Desktop**: Para ejecución contenerizada.
*   **Conexión a Internet**: Necesaria para conectar con el servidor Ollama externo (`jarvis.ieshlanz.es`) o una instancia local de Ollama.
*   **Navegador Web**: Chrome, Firefox o Edge (Soporte ES6 Modules).

---

## Instalación

### 1. Obtención del Código

#### Opción A: Creación Manual y Colaboración
Si estás creando el proyecto desde cero o quieres configurar un entorno colaborativo:

1.  **Crear el directorio de trabajo**:
    Crea una carpeta vacía en tu ordenador para alojar el proyecto:
    ```bash
    mkdir mi-proyecto-ia
    cd mi-proyecto-ia
    ```

2.  **Vincular con GitHub**:
    Inicializa el repositorio local y conéctalo con tu repositorio en GitHub:
    ```bash
    git init
    # Asigna la rama principal
    git branch -M main
    # Vincula con el repositorio remoto (sustituye la URL)
    git remote add origin <URL_DE_TU_NUEVO_REPOSITORIOEN_GITHUB>
    # Sube los cambios iniciales (opcional pero recomendado crear un README primero)
    # echo "# Mi Proyecto" >> README.md
    # git add README.md
    # git commit -m "first commit"
    # git push -u origin main
    ```

3.  **Dar acceso a un compañero (GitHub)**:
    Si el proyecto está alojado en GitHub y quieres que un compañero colabore:
    *   Ve a la pestaña **Settings** de tu repositorio en GitHub.
    *   Selecciona **Collaborators** en el menú de la izquierda.
    *   Pulsa en **Add people**, busca el usuario de tu compañero e invítalo.

4.  **Qué debe hacer el compañero**:
    El compañero recibirá una invitación (por email o notificación). Tras aceptarla, podrá clonar el repositorio y trabajar en él:
    ```bash
    # El compañero clona el repositorio compartido
    git clone <URL_DEL_REPOSITORIO>
    ```

5.  **Crear una rama de trabajo**:
    Es importante no trabajar directamente sobre la rama principal (`main` o `master`). Crea una rama independiente para desarrollar tus cambios:
    ```bash
    # Crear la rama
    git branch nombre-de-tu-rama
    # Cambiar a la rama
    git switch nombre-de-tu-rama
    ```

#### Opción B: Clonar este Repositorio
Asegúrate de tener [Git](https://git-scm.com/) instalado. Abre tu terminal y ejecuta los siguientes comandos para descargar el código y situarte en la carpeta del proyecto:

```bash
# Clonar el repositorio general
git clone git@github.com:ruthmeira/agentes_ia_25_26.git

# Entrar en la carpeta específica de este proyecto
cd agentes_ia_25_26/traductor-ia-RuthFM-SamLE
```

### 2. Configurar Variables de Entorno
Copia el archivo de ejemplo y ajústalo si es necesario:
```bash
cp .env.example .env
```
Asegúrate de que `.env` tenga la URL correcta de la IA:
```ini
PORT=3002
AI_API_URL=https://jarvis.ieshlanz.es 
AI_MODEL=mistral:instruct
```
o si estamos en la red del centro:
```ini
PORT=3002
AI_API_URL=http://192.168.50.99:11434
AI_MODEL=mistral:instruct
```
o si tienes una instancia local de Ollama:
```ini
PORT=3002
AI_API_URL=http://localhost:11434
AI_MODEL=mistral:instruct
```

### 3. Instalar Dependencias

El proyecto tiene dependencias tanto en la raíz (herramientas de desarrollo) como en el backend (lógica del servidor).

#### A. Dependencias de Raíz (Entorno de Desarrollo)
Estas herramientas facilitan el desarrollo local.
```bash
npm install
```
*   **`nodemon`**: Utilidad que monitorea cambios en el código y reinicia el servidor automáticamente.
*   **`node-fetch`**: Permite realizar peticiones HTTP (útil para scripts de mantenimiento).

#### B. Dependencias del Backend (Producción)
Librerías necesarias para que funcione el servidor.
```bash
cd backend
npm install
cd ..
```
*   **`express`**: Framework web rápido y minimalista para crear la API REST.
*   **`better-sqlite3`**: Driver de base de datos SQLite de alto rendimiento y síncrono.
*   **`cors`**: Middleware para permitir peticiones HTTP desde el frontend (que corre en otro puerto).
*   **`dotenv`**: Carga variables de entorno desde el archivo `.env` para configuración segura.

#### Usar tu ollama local (opcional)
Si prefieres usar tu ollama local en vez de una externa:
0. **Requisitos**
    * Docker
    * Docker Compose
    * Ollama => pull de imagen de ollama
1.  **Iniciar Ollama**:
    ```bash
    docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
    ```
2.  **Descargar modelo**:
    ```bash
    docker exec -it ollama ollama pull mistral:instruct
    ```
3.  **Importante**: Si ejecutas tu aplicación con `docker compose` y Ollama está en tu máquina local (o en otro contenedor), usa esta configuración en `.env` para que se vean entre sí:
    ```ini
    AI_API_URL=http://host.docker.internal:11434
    ```

---

## Ejecución

### Opción A: Desarrollo Local (3 Terminales)

**Terminal 1: Backend**
```bash
cd backend
npm start
# Servidor inicia en http://localhost:3002
```

**Terminal 2: Frontend**
Utiliza un servidor estático (ej. `http-server`):
```bash
cd frontend
npx http-server -p 5173
# Accede en http://localhost:5173
```

**Terminal 3: Gestión/Pruebas**
Úsala para ejecutar comandos git o pruebas de validación:
```bash
# Ejemplo: probar endpoints
curl http://localhost:3002/api/health
```

### Opción B: Docker Compose (Recomendada)
Levanta todo el entorno con un solo comando:
```bash
docker compose up --build
```
> **Nota**: Asegúrate de detener cualquier servicio local (como `npm run dev`) para evitar conflictos de puertos o bloqueos de base de datos.

### URLs de Acceso
*   **Frontend**: [http://localhost:5173](http://localhost:5173)
*   **Backend API**: [http://localhost:3002](http://localhost:3002) (Puerto mapeado por Docker)

---

