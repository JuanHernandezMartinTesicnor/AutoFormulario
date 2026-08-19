const bcrypt = require("bcrypt");
const db = require("../../database/database");

async function crearUsuario({
    nombre,
    email,
    password,
    rol = "tecnico"
}) {

    if (!nombre || !email || !password) {
        throw new Error(
            "Nombre, email y contraseña son obligatorios"
        );
    }

    const passwordHash =
        await bcrypt.hash(password, 12);

    const resultado = db.prepare(`
        INSERT INTO usuarios (
            nombre,
            email,
            password_hash,
            rol
        )
        VALUES (?, ?, ?, ?)
    `).run(
        nombre,
        email,
        passwordHash,
        rol
    );

    return {
        id: resultado.lastInsertRowid,
        nombre,
        email,
        rol
    };
}


async function verificarPassword(
    password,
    passwordHash
) {

    return bcrypt.compare(
        password,
        passwordHash
    );
}


function obtenerUsuarioPorEmail(email) {

    return db.prepare(`
        SELECT
            id,
            nombre,
            email,
            password_hash,
            rol,
            activo
        FROM usuarios
        WHERE email = ?
        AND activo = 1
    `).get(email);
}


module.exports = {
    crearUsuario,
    verificarPassword,
    obtenerUsuarioPorEmail
};