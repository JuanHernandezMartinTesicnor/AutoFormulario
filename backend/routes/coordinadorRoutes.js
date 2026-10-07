const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const router = express.Router();


/* =========================
   MIDDLEWARE AUTH
========================= */

const {
    requireAuth
} = require(
    "../middleware/authMiddleware"
);


/* =========================
   MODELOS
========================= */

const {
    obtenerFormularioPorId,
    guardarUltimoPdf
} = require(
    "../models/formulariosModel"
);


/* =========================
   GENERADOR PDF
========================= */

const {
    generatePDF
} = require(
    "../services/pdf/coordinador/generateCoordinadorPDF"
);


/* =========================
   MULTER
========================= */

const storage =
    multer.diskStorage({

        destination:
            (req, file, cb) => {

                cb(
                    null,
                    path.join(
                        __dirname,
                        "../uploads/tmp"
                    )
                );

            },

        filename:
            (req, file, cb) => {

                cb(
                    null,
                    crypto.randomUUID() +
                    path.extname(
                        file.originalname
                    )
                );

            }

    });


const upload =
    multer({

        storage,

        limits: {

            fileSize:
                20 * 1024 * 1024

        }

    });


/* =========================
   PERMISOS
========================= */

function puedeModificarFormulario(
    req,
    formulario
) {

    const usuario =
        req.session.usuario;


    if (
        usuario.rol ===
        "coordinador"
    ) {

        return true;

    }


    return (
        Number(
            formulario.usuario_id
        ) ===
        Number(
            usuario.id
        )
    );

}


/* =========================
   GENERAR PDF
========================= */

router.post(
    "/generate-pdf",

    requireAuth,

    upload.any(),

    async (req, res) => {

        try {

            /* =========================
               ID FORMULARIO
            ========================= */

            const formularioId =
                Number(
                    req.body.formularioId
                );


            if (
                !formularioId ||
                Number.isNaN(
                    formularioId
                )
            ) {

                return res
                    .status(400)
                    .send(
                        "formularioId es obligatorio"
                    );

            }


            /* =========================
               COMPROBAR FORMULARIO
            ========================= */

            const formulario =
                obtenerFormularioPorId(
                    formularioId
                );


            if (!formulario) {

                return res
                    .status(404)
                    .send(
                        "Formulario no encontrado"
                    );

            }


            if (
                formulario.tipo !==
                "coordinador"
            ) {

                return res
                    .status(400)
                    .send(
                        "El formulario no es de coordinador"
                    );

            }


            /* =========================
               COMPROBAR PERMISOS
            ========================= */

            if (
                !puedeModificarFormulario(
                    req,
                    formulario
                )
            ) {

                return res
                    .status(403)
                    .send(
                        "No tienes permisos para generar el PDF de este formulario"
                    );

            }


            /* =========================
               DATOS
            ========================= */

            if (!req.body.datos) {

                return res
                    .status(400)
                    .send(
                        "No se han recibido los datos del formulario"
                    );

            }


            const datos =
                JSON.parse(
                    req.body.datos
                );


            /* =========================
               GENERAR PDF
            ========================= */

            const pdf =
                await generatePDF(
                    datos,
                    req.files
                );


            /* =========================
               GUARDAR ÚLTIMO PDF
            ========================= */

            const nombrePdf =
                `informe-coordinacion-${formularioId}.pdf`;


            const resultadoGuardado =
                guardarUltimoPdf(
                    formularioId,
                    pdf,
                    nombrePdf
                );


            if (
                resultadoGuardado.changes ===
                0
            ) {

                throw new Error(
                    "No se pudo guardar el PDF en el formulario"
                );

            }


            /* =========================
               RESPUESTA
            ========================= */

            res.set({

                "Content-Type":
                    "application/pdf",

                "Content-Disposition":
                    `attachment; filename="${nombrePdf}"`,

                "Content-Length":
                    pdf.length

            });


            res.send(
                pdf
            );


        } catch (error) {

            console.error(
                "Error generando PDF coordinador:",
                error
            );


            res
                .status(500)
                .send(
                    "Error generando PDF"
                );

        }

    }

);


module.exports =
    router;