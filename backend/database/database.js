const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(
    __dirname,
    "autoformulario.db"
);

const db = new Database(dbPath);

// Activamos las foreign keys de SQLite
db.pragma("foreign_keys = ON");

module.exports = db;