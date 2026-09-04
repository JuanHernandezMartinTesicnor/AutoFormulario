const db = require("./database");
const bcrypt = require("bcrypt");

const email = "jesus@tesicnor.com";
const nuevaPassword = "Jesus1234";

const usuario = db
    .prepare(`
        SELECT id, nombre, email
        FROM usuarios
        WHERE email = ?
    `)
    .get(email);

if (!usuario) {
    console.error("❌ Usuario no encontrado");
    process.exit(1);
}

const passwordHash =
    bcrypt.hashSync(nuevaPassword, 10);

db.prepare(`
    UPDATE usuarios
    SET password_hash = ?
    WHERE email = ?
`).run(
    passwordHash,
    email
);

console.log("✅ Contraseña actualizada");
console.log("Usuario:", usuario.email);
console.log("Nueva contraseña:", nuevaPassword);