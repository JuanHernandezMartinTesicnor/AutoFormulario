const express = require("express");

const {
    crearProyecto,
    obtenerProyectos,
    obtenerProyectoPorId,
    actualizarProyecto,
    eliminarProyecto
} = require("../models/proyectosModel");

const {
    requireAuth,
    requireCoordinador
} = require("../middleware/authMiddleware");

const router = express.Router();


/*
========================================
LISTAR PROYECTOS
GET /api/proyectos
========================================
*/

router.get("/", requireAuth, (req, res) => {

    try {

        const proyectos =
            obtenerProyectos();

        res.json({
            ok: true,
            proyectos
        });

    } catch (error) {

        console.error(
            "Error obteniendo proyectos:",
            error
        );

        res.status(500).json({
            ok: false,
            error: "Error obteniendo proyectos"
        });
    }
});


/*
========================================
OBTENER PROYECTO
GET /api/proyectos/:id
========================================
*/

router.get("/:id", requireAuth, (req, res) => {

    try {

        const proyecto =
            obtenerProyectoPorId(
                req.params.id
            );

        if (!proyecto) {

            return res.status(404).json({
                ok: false,
                error: "Proyecto no encontrado"
            });
        }

        res.json({
            ok: true,
            proyecto
        });

    } catch (error) {

        console.error(
            "Error obteniendo proyecto:",
            error
        );

        res.status(500).json({
            ok: false,
            error: "Error obteniendo proyecto"
        });
    }
});


/*
========================================
CREAR PROYECTO
POST /api/proyectos
========================================
*/

router.post("/", requireCoordinador, (req, res) => {

    try {

        const {
            nombre,
            direccion,
            cliente
        } = req.body;

        if (!nombre || !nombre.trim()) {

            return res.status(400).json({
                ok: false,
                error: "El nombre del proyecto es obligatorio"
            });
        }

        const proyecto =
            crearProyecto({
                nombre: nombre.trim(),
                direccion,
                cliente
            });

        res.status(201).json({
            ok: true,
            proyecto
        });

    } catch (error) {

        console.error(
            "Error creando proyecto:",
            error
        );

        res.status(500).json({
            ok: false,
            error: "Error creando proyecto"
        });
    }
});


/*
========================================
ACTUALIZAR PROYECTO
PUT /api/proyectos/:id
========================================
*/

router.put("/:id", requireCoordinador, (req, res) => {

    try {

        const {
            nombre,
            direccion,
            cliente
        } = req.body;

        if (!nombre || !nombre.trim()) {

            return res.status(400).json({
                ok: false,
                error: "El nombre del proyecto es obligatorio"
            });
        }

        const proyecto =
            actualizarProyecto(
                req.params.id,
                {
                    nombre: nombre.trim(),
                    direccion,
                    cliente
                }
            );

        if (!proyecto) {

            return res.status(404).json({
                ok: false,
                error: "Proyecto no encontrado"
            });
        }

        res.json({
            ok: true,
            proyecto
        });

    } catch (error) {

        console.error(
            "Error actualizando proyecto:",
            error
        );

        res.status(500).json({
            ok: false,
            error: "Error actualizando proyecto"
        });
    }
});


/*
========================================
ELIMINAR PROYECTO
DELETE /api/proyectos/:id
========================================
*/

router.delete("/:id", requireCoordinador, (req, res) => {

    try {

        const result =
            eliminarProyecto(
                req.params.id
            );

        if (!result.changes) {

            return res.status(404).json({
                ok: false,
                error: "Proyecto no encontrado"
            });
        }

        res.json({
            ok: true
        });

    } catch (error) {

        console.error(
            "Error eliminando proyecto:",
            error
        );

        res.status(500).json({
            ok: false,
            error: "Error eliminando proyecto"
        });
    }
});


module.exports = router;