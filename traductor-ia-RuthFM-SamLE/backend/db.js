import Database from 'better-sqlite3';

const db = new Database('backend/db/traducciones.db');
db.pragma('journal_mode = WAL');

export default db; // <-- exportación por defecto

//"server:start": "node backend/src/db.js" en package.json

//Crear tablas

