 const db = require("../database/database");


function crearFormulario({
    proyecto_id,
    usuario_id = null,
    tipo,
    datos = {},
    estado = "borrador"
}) {

    const stmt = db.prepare(`
        INSERT INTO formularios (
            proyecto_id,
            usuario_id,
            tipo,
            estado,
            datos
        )
        VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
        proyecto_id,
        usuario_id,
        tipo,
        estado,
        JSON.stringify(datos)
    );

    return obtenerFormularioPorId(
        result.lastInsertRowid
    );
}


function obtenerFormularios() {

    const formularios = db.prepare(`
        SELECT
            f.*,
            p.nombre AS proyecto_nombre
        FROM formularios f
        LEFT JOIN proyectos p
            ON p.id = f.proyecto_id
        ORDER BY f.updated_at DESC
    `).all();

    return formularios.map(formatearFormulario);
}


function obtenerFormularioPorId(id) {

    const formulario = db.prepare(`
        SELECT
            f.*,
            p.nombre AS proyecto_nombre
        FROM formularios f
        LEFT JOIN proyectos p
            ON p.id = f.proyecto_id
        WHERE f.id = ?
    `).get(id);

    if (!formulario) {
        return null;
    }

    return formatearFormulario(formulario);
}


function obtenerFormulariosPorProyecto(proyectoId) {

    const formularios = db.prepare(`
        SELECT
            f.*,
            p.nombre AS proyecto_nombre
        FROM formularios f
        LEFT JOIN proyectos p
            ON p.id = f.proyecto_id
        WHERE f.proyecto_id = ?
        ORDER BY f.updated_at DESC
    `).all(proyectoId);

    return formularios.map(formatearFormulario);
}


function actualizarFormulario(
    id,
    {
        datos,
        estado,
        tipo
    }
) {

    const actual = obtenerFormularioPorId(id);

    if (!actual) {
        return null;
    }

    db.prepare(`
        UPDATE formularios
        SET
            datos = ?,
            estado = ?,
            tipo = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(
        JSON.stringify(
            datos !== undefined
                ? datos
                : actual.datos
        ),
        estado !== undefined
            ? estado
            : actual.estado,
        tipo !== undefined
            ? tipo
            : actual.tipo,
        id
    );

    return obtenerFormularioPorId(id);
}


function eliminarFormulario(id) {

    return db.prepare(`
        DELETE FROM formularios
        WHERE id = ?
    `).run(id);
}


function formatearFormulario(formulario) {

    return {
        ...formulario,
        datos: JSON.parse(
            formulario.datos || "{}"
        )
    };
}


module.exports = {
    crearFormulario,
    obtenerFormularios,
    obtenerFormularioPorId,
    obtenerFormulariosPorProyecto,
    actualizarFormulario,
    eliminarFormulario
};