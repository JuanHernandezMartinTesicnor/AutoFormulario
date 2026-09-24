const express = require("express");

const router = express.Router();

const {
    requireAuth
} = require("../middleware/authMiddleware");


const {
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
} = require("../models/formulariosModel");


/* =========================
   UTILIDADES
========================= */

function esCoordinador(req) {

    return (
        req.session.usuario.rol ===
        "coordinador"
    );
}


function puedeAccederFormulario(
    req,
    formulario
) {

    if (esCoordinador(req)) {
        return true;
    }

    return (
        Number(formulario.usuario_id) ===
        Number(req.session.usuario.id)
    );
}


/* =========================
   OBTENER TODOS
========================= */

router.get(
    "/",
    requireAuth,
    (req, res) => {

        try {

            let formularios;


            if (esCoordinador(req)) {

                formularios =
                    obtenerFormularios();

            } else {

                formularios =
                    obtenerFormulariosPorUsuario(
                        req.session.usuario.id
                    );

            }


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
                error:
                    "Error obteniendo formularios"
            });

        }

    }
);


/* =========================
   CONTRATISTA
========================= */

router.get(
    "/contratista",
    requireAuth,
    (req, res) => {

        try {

            let formularios;


            if (esCoordinador(req)) {

                formularios =
                    obtenerFormulariosContratista();

            } else {

                formularios =
                    obtenerFormulariosContratistaPorUsuario(
                        req.session.usuario.id
                    );

            }


            res.json({
                ok: true,
                formularios
            });


        } catch (error) {

            console.error(
                "Error obteniendo formularios de contratista:",
                error
            );

            res.status(500).json({
                ok: false,
                error:
                    "Error obteniendo formularios"
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

            let formularios;


            if (esCoordinador(req)) {

                formularios =
                    obtenerFormulariosPorProyecto(
                        req.params.proyectoId
                    );

            } else {

                formularios =
                    obtenerFormulariosPorProyectoYUsuario(
                        req.params.proyectoId,
                        req.session.usuario.id
                    );

            }


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
                error:
                    "Error obteniendo formularios"
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

                return res
                    .status(404)
                    .json({
                        ok: false,
                        error:
                            "Formulario no encontrado"
                    });

            }


            if (
                !puedeAccederFormulario(
                    req,
                    formulario
                )
            ) {

                return res
                    .status(403)
                    .json({
                        ok: false,
                        error:
                            "No tienes permisos para acceder a este formulario"
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
                error:
                    "Error obteniendo formulario"
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

                return res
                    .status(400)
                    .json({
                        ok: false,
                        error:
                            "tipo es obligatorio"
                    });

            }


            /* =========================
               VALIDAR TIPO
            ========================= */

            if (
                tipo !== "contratista" &&
                tipo !== "coordinador"
            ) {

                return res
                    .status(400)
                    .json({
                        ok: false,
                        error:
                            "Tipo de formulario no válido"
                    });

            }


            /* =========================
               COORDINADOR:
               PROYECTO OBLIGATORIO
            ========================= */

            if (
                tipo === "coordinador" &&
                !proyecto_id
            ) {

                return res
                    .status(400)
                    .json({
                        ok: false,
                        error:
                            "proyecto_id es obligatorio para formularios de coordinador"
                    });

            }


            /* =========================
               CONTRATISTA:
               SIN PROYECTO
            ========================= */

            const proyectoFormulario =
                tipo === "contratista"
                    ? null
                    : proyecto_id;


            const formulario =
                crearFormulario({

                    proyecto_id:
                        proyectoFormulario,

                    usuario_id:
                        req.session.usuario.id,

                    tipo,

                    datos:
                        datos || {},

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
                error:
                    "Error creando formulario"
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

            const actual =
                obtenerFormularioPorId(
                    req.params.id
                );


            if (!actual) {

                return res
                    .status(404)
                    .json({
                        ok: false,
                        error:
                            "Formulario no encontrado"
                    });

            }


            if (
                !puedeAccederFormulario(
                    req,
                    actual
                )
            ) {

                return res
                    .status(403)
                    .json({
                        ok: false,
                        error:
                            "No tienes permisos para editar este formulario"
                    });

            }


            const {
                datos,
                estado
            } = req.body;


            const formulario =
                actualizarFormulario(
                    req.params.id,
                    {
                        datos,
                        estado
                    }
                );


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
    requireAuth,
    (req, res) => {

        try {

            const formulario =
                obtenerFormularioPorId(
                    req.params.id
                );


            if (!formulario) {

                return res
                    .status(404)
                    .json({
                        ok: false,
                        error:
                            "Formulario no encontrado"
                    });

            }


            if (
                !puedeAccederFormulario(
                    req,
                    formulario
                )
            ) {

                return res
                    .status(403)
                    .json({
                        ok: false,
                        error:
                            "No tienes permisos para eliminar este formulario"
                    });

            }


            const resultado =
                eliminarFormulario(
                    req.params.id
                );


            if (
                resultado.changes === 0
            ) {

                return res
                    .status(404)
                    .json({
                        ok: false,
                        error:
                            "Formulario no encontrado"
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
                error:
                    "Error eliminando formulario"
            });

        }

    }
);


module.exports = router;