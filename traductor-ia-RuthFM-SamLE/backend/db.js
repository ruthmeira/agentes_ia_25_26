import Database from 'better-sqlite3';

export const db = new Database('backend/db/traducciones.db');
db.pragma('journal_mode = WAL');

export default db; // <-- exportación por defecto

//"server:start": "node backend/src/db.js" en package.json

//Crear tablas


db.exec(`
  CREATE TABLE IF NOT EXISTS historial (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    texto_original TEXT NOT NULL,
    traduccion TEXT NOT NULL,
    idioma_origen TEXT NOT NULL,
    idioma_destino TEXT NOT NULL,
    modelo TEXT NOT NULL,
    duracion_ms INTEGER NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);