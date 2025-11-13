import express, { json } from "express";
import cors from "cors";
import { config  } from "dotenv";


// 0- cargar las variables de entorno cargadas en memoria
config();

// 1- crear un servidor express
const app = express();

// 2- crear variables basandonos en las variables de entorno cargadas con config
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const NODE_ENV = process.env.NODE_ENV;
const SERVER_URL = process.env.SERVER_URL;
const AI_API_URL = process.env.AI_API_URL;
const AI_MODEL = process.env.AI_MODEL;

// 3- midleware 
// a) para habilitar los cors en los navegadores
app.use(cors());

// b)Habilitar JSON para preguntas y respuestas
app.use(express.json());

// 4- (opcional) Crear una funcion que muestre info al usuario
const getInfoApi = () =>  ({// el () es para no pòner return y que las {} no las detecte como uno
        service: "Servicio api-ollama",
        status: "ready",
        endpoints: {
            "GET /api": "Mostramos información de la API-OLLAMA",
            "GET /api/modelos": "Mostramos información de los modelos disponibles",
            "POST /api/consulta": "Envia un prompt para realizar consultas a la IA",
        },
        model: AI_MODEL,
        host: `${HOST}:${PORT}`,
        ollama_url: AI_API_URL
    });

// 5- generar los endpoints
// --> /
app.get("/", (req, res) => {
    res.json(getInfoApi());
})

// --> /api
app.get("/api", (req, res) => {
    res.json(getInfoApi());
})

// --> /api/modelos
app.get("/api/modelos", async (req, res) => {
    try {
        const response = await fetch(`${AI_API_URL}/api/tags`, 
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: AbortSignal.timeout(5000)
            });
        if (!response.ok) throw new Error("Error al realizar la petición");
        const data = await response.json();
        const models = data.models || [];
        const nameModelos = models.map((model) => ({ modelos: model.name }));
        res.json(nameModelos);
    } catch (error) {
        res.status(502).json({
            error: "Fallo en el acceso al servidor con los modelos",
            message: error.message
        })
    }
})

// --> /api/consulta
app.post("/api/consulta", async (req, res) => {
    try {
        const { prompt, model } = req.body || {};

        //el prompt es de tipo string o si no hay
        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({ 
                error: "Falta el campo 'prompt' o no es un string",
                //message: error.message
            });
        }
    
        const modelSelected = model || AI_MODEL;
        const response = await fetch(`${AI_API_URL}/api/generate`, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: modelSelected,
                    prompt,
                    stream: false
                }),
                signal: AbortSignal.timeout(30000)
            });
        if (!response.ok) throw new Error("Error en la peticion ollama");
        const data = await response.json();
        const responseOllama = data.response;
        res.json({
            prompt,
            model: modelSelected,
            response: responseOllama
        });
    } catch (error) {
        res.status(502).json({
            error: "Fallo en el acceso al servidor con los modelos",
            message: error.message
        });
    }
})


// 6 Levantar el sevidor express para escuchar peticiones a mis endpoints
app.listen(PORT, HOST, () => {
    console.log("----Servidor express funcionando----");
    console.log(`\t Servidor escuchando en http://${HOST} en el puerto ${PORT}`);
    console.log("\t Escuchando peticiones");
})