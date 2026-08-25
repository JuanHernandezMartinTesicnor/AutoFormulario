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
} = require("../database/formulariosModel");


/* =========================
   OBTENER TODOS
========================= */

router.get("/", requireAuth, (req, res) => {

    try {

        const formularios =
            obtenerFormularios();

        res.json(formularios);

    } catch (error) {

        console.error(
            "Error obteniendo formularios:",
            error
        );

        res.status(500).json({
            error: "Error obteniendo formularios"
        });

    }

});


/* =========================
   OBTENER POR ID
========================= */

router.get("/:id", requireAuth, (req, res) => {

    try {

        const formulario =
            obtenerFormularioPorId(
                req.params.id
            );

        if (!formulario) {

            return res.status(404).json({
                error: "Formulario no encontrado"
            });

        }

        res.json(formulario);

    } catch (error) {

        console.error(
            "Error obteniendo formulario:",
            error
        );

        res.status(500).json({
            error: "Error obteniendo formulario"
        });

    }

});


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

            res.json(formularios);

        } catch (error) {

            console.error(
                "Error obteniendo formularios del proyecto:",
                error
            );

            res.status(500).json({
                error:
                    "Error obteniendo formularios del proyecto"
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

            if (!tipo) {

                return res.status(400).json({
                    error: "El tipo de formulario es obligatorio"
                });

            }

            const formulario =
                crearFormulario({

                    proyecto_id,

                    usuario_id:
                        req.session.usuario.id,

                    tipo,

                    datos,

                    estado

                });

            res.status(201).json(
                formulario
            );

        } catch (error) {

            console.error(
                "Error creando formulario:",
                error
            );

            res.status(500).json({
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
    requireAuth,
    (req, res) => {

        try {

            const formulario =
                obtenerFormularioPorId(
                    req.params.id
                );

            if (!formulario) {

                return res.status(404).json({
                    error: "Formulario no encontrado"
                });

            }

            const actualizado =
                actualizarFormulario(
                    req.params.id,
                    req.body
                );

            res.json(
                actualizado
            );

        } catch (error) {

            console.error(
                "Error actualizando formulario:",
                error
            );

            res.status(500).json({
                error:
                    "Error actualizando formulario"
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

            const formulario =
                obtenerFormularioPorId(
                    req.params.id
                );

            if (!formulario) {

                return res.status(404).json({
                    error: "Formulario no encontrado"
                });

            }

            eliminarFormulario(
                req.params.id
            );

            res.json({
                ok: true
            });

        } catch (error) {

            console.error(
                "Error eliminando formulario:",
                error
            );

            res.status(500).json({
                error:
                    "Error eliminando formulario"
            });

        }

    }
);


module.exports = router;