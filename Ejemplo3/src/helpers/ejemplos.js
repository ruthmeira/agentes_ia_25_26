// importaciones
import dovent from 'dotenv';
import { exec } from 'child_process';
//declaraciones
dovent.config(); // ha cargado en process.env las cariavles del .env

const API_URL = process.env.API_URL;


export const getallUsers = () => {
    // logica para obtener todos los usuarios
    const url = `${API_URL}/users`;
    const cmd = `curl -s -X GET ${url}`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error("Error al ejecutar el comando:", error.message);
            return;
        }
        if (stderr) {
            console.error("Error en la salida:", stderr);
            return;
        }
        const data = JSON.parse(stdout);
        console.log(data);
    
});
}