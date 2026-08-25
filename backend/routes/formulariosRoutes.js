const express = require("express");

const router = express.Router();

const {
    requireAuth,
    requireCoordinador
} = require("../middleware/authMiddleware");

const {
    crearFormulario,
    obtenerFormularios,
    obtenerFormularioPorId,
    obtenerFormulariosPorProyecto,
    actualizarFormulario,
    eliminarFormulario
} = require("../models/formulariosModel");


/* =========================
   OBTENER TODOS
========================= */

router.get(
    "/",
    requireAuth,
    (req, res) => {

        try {

            const formularios =
                obtenerFormularios();

            res.json({
                ok: true,
                formularios
            });

        } catch (error) {

            console.error(
                "Error obteniendo formularios:",
                error
            );

            res.status(500).json({
                ok: false,
                error: "Error obteniendo formularios"
            });

        }

    }
);


/* =========================
   OBTENER POR PROYECTO
========================= */

router.get(
    "/proyecto/:proyectoId",
    requireAuth,
    (req, res) => {

        try {

            const formularios =
                obtenerFormulariosPorProyecto(
                    req.params.proyectoId
                );

            res.json({
                ok: true,
                formularios
            });

        } catch (error) {

            console.error(
                "Error obteniendo formularios del proyecto:",
                error
            );

            res.status(500).json({
                ok: false,
                error: "Error obteniendo formularios"
            });

        }

    }
);


/* =========================
   OBTENER UNO
========================= */

router.get(
    "/:id",
    requireAuth,
    (req, res) => {

        try {

            const formulario =
                obtenerFormularioPorId(
                    req.params.id
                );

            if (!formulario) {

                return res.status(404).json({
                    ok: false,
                    error: "Formulario no encontrado"
                });

            }

            res.json({
                ok: true,
                formulario
            });

        } catch (error) {

            console.error(
                "Error obteniendo formulario:",
                error
            );

            res.status(500).json({
                ok: false,
                error: "Error obteniendo formulario"
            });

        }

    }
);


/* =========================
   CREAR
========================= */

router.post(
    "/",
    requireAuth,
    (req, res) => {

        try {

            const {
                proyecto_id,
                tipo,
                datos,
                estado
            } = req.body;

            if (!proyecto_id) {

                return res.status(400).json({
                    ok: false,
                    error: "proyecto_id es obligatorio"
                });

            }

            if (!tipo) {

                return res.status(400).json({
                    ok: false,
                    error: "tipo es obligatorio"
                });

            }

            const formulario =
                crearFormulario({

                    proyecto_id,

                    usuario_id:
                        req.session.usuario.id,

                    tipo,

                    datos: datos || {},

                    estado:
                        estado || "borrador"

                });

            res.status(201).json({
                ok: true,
                formulario
            });

        } catch (error) {

            console.error(
                "Error creando formulario:",
                error
            );

            res.status(500).json({
                ok: false,
                error: "Error creando formulario"
            });

        }

    }
);


/* =========================
   ACTUALIZAR
========================= */

router.put(
    "/:id",
    requireCoordinador,
    (req, res) => {

        try {

            const {
                datos,
                estado,
                tipo
            } = req.body;

            const formulario =
                actualizarFormulario(
                    req.params.id,
                    {
                        datos,
                        estado,
                        tipo
                    }
                );

            if (!formulario) {

                return res.status(404).json({
                    ok: false,
                    error: "Formulario no encontrado"
                });

            }

            res.json({
                ok: true,
                formulario
            });

        } catch (error) {

            console.error(
                "Error actualizando formulario:",
                error
            );

            res.status(500).json({
                ok: false,
                error: "Error actualizando formulario"
            });

        }

    }
);


/* =========================
   ELIMINAR
========================= */

router.delete(
    "/:id",
    requireCoordinador,
    (req, res) => {

        try {

            const resultado =
                eliminarFormulario(
                    req.params.id
                );

            if (
                resultado.changes === 0
            ) {

                return res.status(404).json({
                    ok: false,
                    error: "Formulario no encontrado"
                });

            }

            res.json({
                ok: true
            });

        } catch (error) {

            console.error(
                "Error eliminando formulario:",
                error
            );

            res.status(500).json({
                ok: false,
                error: "Error eliminando formulario"
            });

        }

    }
);


module.exports = router;