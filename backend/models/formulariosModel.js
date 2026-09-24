const db = require("../database/database");


/* =========================
   CREAR
========================= */

function crearFormulario({
    proyecto_id = null,
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


/* =========================
   OBTENER TODOS
========================= */

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

    return formularios.map(
        formatearFormulario
    );
}


/* =========================
   OBTENER POR USUARIO
========================= */

function obtenerFormulariosPorUsuario(
    usuarioId
) {

    const formularios = db.prepare(`
        SELECT
            f.*,
            p.nombre AS proyecto_nombre
        FROM formularios f
        LEFT JOIN proyectos p
            ON p.id = f.proyecto_id
        WHERE f.usuario_id = ?
        ORDER BY f.updated_at DESC
    `).all(usuarioId);

    return formularios.map(
        formatearFormulario
    );
}


/* =========================
   OBTENER UNO
========================= */

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

    return formatearFormulario(
        formulario
    );
}


/* =========================
   OBTENER POR PROYECTO
========================= */

function obtenerFormulariosPorProyecto(
    proyectoId
) {

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

    return formularios.map(
        formatearFormulario
    );
}


/* =========================
   OBTENER POR PROYECTO
   Y USUARIO
========================= */

function obtenerFormulariosPorProyectoYUsuario(
    proyectoId,
    usuarioId
) {

    const formularios = db.prepare(`
        SELECT
            f.*,
            p.nombre AS proyecto_nombre
        FROM formularios f
        LEFT JOIN proyectos p
            ON p.id = f.proyecto_id
        WHERE
            f.proyecto_id = ?
            AND f.usuario_id = ?
        ORDER BY f.updated_at DESC
    `).all(
        proyectoId,
        usuarioId
    );

    return formularios.map(
        formatearFormulario
    );
}


/* =========================
   CONTRATISTA
========================= */

function obtenerFormulariosContratista() {

    const formularios = db.prepare(`
        SELECT
            f.*,
            p.nombre AS proyecto_nombre
        FROM formularios f
        LEFT JOIN proyectos p
            ON p.id = f.proyecto_id
        WHERE
            f.tipo = 'contratista'
            AND f.proyecto_id IS NULL
        ORDER BY f.updated_at DESC
    `).all();

    return formularios.map(
        formatearFormulario
    );
}


function obtenerFormulariosContratistaPorUsuario(
    usuarioId
) {

    const formularios = db.prepare(`
        SELECT
            f.*,
            p.nombre AS proyecto_nombre
        FROM formularios f
        LEFT JOIN proyectos p
            ON p.id = f.proyecto_id
        WHERE
            f.tipo = 'contratista'
            AND f.proyecto_id IS NULL
            AND f.usuario_id = ?
        ORDER BY f.updated_at DESC
    `).all(usuarioId);

    return formularios.map(
        formatearFormulario
    );
}


/* =========================
   ACTUALIZAR
========================= */

function actualizarFormulario(
    id,
    {
        datos,
        estado,
        tipo
    }
) {

    const actual =
        obtenerFormularioPorId(id);

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


/* =========================
   ELIMINAR
========================= */

function eliminarFormulario(id) {

    return db.prepare(`
        DELETE FROM formularios
        WHERE id = ?
    `).run(id);
}


/* =========================
   FORMATEAR
========================= */

function formatearFormulario(
    formulario
) {

    return {
        ...formulario,

        datos: JSON.parse(
            formulario.datos || "{}"
        )
    };
}


/* =========================
   EXPORTS
========================= */

module.exports = {
    crearFormulario,
    obtenerFormularios,
    obtenerFormulariosPorUsuario,
    obtenerFormularioPorId,
    obtenerFormulariosPorProyecto,
    obtenerFormulariosPorProyectoYUsuario,
    obtenerFormulariosContratista,
    obtenerFormulariosContratistaPorUsuario,
    actualizarFormulario,
    eliminarFormulario
};