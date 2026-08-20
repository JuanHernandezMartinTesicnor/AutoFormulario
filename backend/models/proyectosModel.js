const db = require("../database/database");

function crearProyecto({
    nombre,
    direccion = "",
    cliente = ""
}) {

    const stmt = db.prepare(`
        INSERT INTO proyectos (
            nombre,
            direccion,
            cliente
        )
        VALUES (?, ?, ?)
    `);

    const result = stmt.run(
        nombre,
        direccion,
        cliente
    );

    return obtenerProyectoPorId(result.lastInsertRowid);
}


function obtenerProyectos() {

    return db.prepare(`
        SELECT *
        FROM proyectos
        ORDER BY updated_at DESC
    `).all();
}


function obtenerProyectoPorId(id) {

    return db.prepare(`
        SELECT *
        FROM proyectos
        WHERE id = ?
    `).get(id);
}


function actualizarProyecto(
    id,
    {
        nombre,
        direccion = "",
        cliente = ""
    }
) {

    db.prepare(`
        UPDATE proyectos
        SET
            nombre = ?,
            direccion = ?,
            cliente = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(
        nombre,
        direccion,
        cliente,
        id
    );

    return obtenerProyectoPorId(id);
}


function eliminarProyecto(id) {

    return db.prepare(`
        DELETE FROM proyectos
        WHERE id = ?
    `).run(id);
}


module.exports = {
    crearProyecto,
    obtenerProyectos,
    obtenerProyectoPorId,
    actualizarProyecto,
    eliminarProyecto
};