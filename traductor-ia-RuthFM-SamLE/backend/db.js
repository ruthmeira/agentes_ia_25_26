import Database from 'better-sqlite3';

const db = new Database('./db/traducciones.db');
db.pragma('journal_mode = WAL');

//"server:start": "node backend/src/db.js" en package.json

//Crear tablas

