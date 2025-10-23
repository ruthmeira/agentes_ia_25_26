// Fichero encargado de levantar una API REST con Express

import { config } from 'dotenv';
import express from 'express';
import dataAPI from './db/db.js';
import cors from 'cors';

// Cargar variables de entorno desde el fichero .env
config();

const PORT=process.env.PORT;
const NODE_ENV=process.env.NODE_ENV;
const SERVER_URL=process.env.SERVER_URL;
const HOST=process.env.HOST;

const app = express();

//cors: voy a permitir cors
app.use(cors());

// voy a permitir JSON como cuerpo de peticiones
app.use(express.json());

//midleware

app.use((req, res, next) => {
    const timeData = new Date().toISOString();
    console.log(`[${timeData}] ${req.method} ${req.url} - IP ${req.ip}`);
    next();
});

//Bienvenida...

app.get('/', (req, res) => {
    res.json({
        message: 'Mini API de post de alumnos',
        version: "1.0.0",
        endpoints: {
            "GET /posts": "Obtiene todos los posts de mi api",

        }
    });
});

app.get('/posts', (req, res) => {
    console.log("Peticiones GET para traer los post de mi api");
    res.json({
        succes: true,
        data: dataAPI,
        // para que se auto incrementen: count:posts.length
        count: dataAPI.length
    });
});

/*app.delete('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = dataAPI.findIndex(post => post.id === id);
    if (index !== -1) {
        dataAPI.splice(index, 1);
        res.json({
            success: true,
            message: `Post con id ${id} eliminado`,
            data: dataAPI
        }); 
    } else {
        res.status(404).json({
            success: false,
            message: `Post con id ${id} no encontrado`
        });
    }
});*/

//--iniciar el servidor
app.listen(PORT, HOST, () => {
    console.log(`Servidor de RUTH: ${PORT}:${HOST}`);
});