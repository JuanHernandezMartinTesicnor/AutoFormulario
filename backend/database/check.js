const db = require("./database");

const tablas = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
    ORDER BY name
`).all();

console.log("Tablas:");

console.table(tablas);

db.close();