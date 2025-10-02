//importaciones
import dotenv from "dotenv";


//añodo las variables .env a este fichero
dotenv.config();
//todas las variables estan en process.env.NOMBRE_DE_LA_VARIABLE

// mostrar por consola el valor de las variables de entorno
console.log("URL de acceso: ", process.env.URL);
console.log("Puerto: ", process.env.PORT);
console.log(`Url con Puerto: , ${process.env.URL}:${process.env.PORT}`);