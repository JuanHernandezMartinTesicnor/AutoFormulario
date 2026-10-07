const express = require("express");

const router =
  express.Router();


/* =========================
   GENERADOR PDF
========================= */

const {
  generatePDF
} = require(
  "../services/pdf/contratista/generateContratistaPDF"
);


/* =========================
   MODELO
========================= */

const {
  crearFormulario,
  obtenerFormularioPorId,
  actualizarFormulario,
  guardarUltimoPdf
} = require(
  "../models/formulariosModel"
);


/* =========================
   GUARDAR CONTRATISTA
========================= */

router.post(
  "/save",

  async (req, res) => {

    try {

      const {
        id,
        datos,
        estado = "borrador"
      } = req.body;


      const usuario =
        req.session?.usuario ||
        null;


      /* =========================
         ACTUALIZAR EXISTENTE
      ========================= */

      if (id) {

        /*
         * Para editar un formulario
         * existente exigimos sesión.
         */

        if (!usuario) {

          return res
            .status(401)
            .json({

              ok: false,

              error:
                "Debes iniciar sesión para editar un formulario existente"

            });

        }


        const actual =
          obtenerFormularioPorId(
            id
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
          actual.tipo !==
          "contratista"
        ) {

          return res
            .status(400)
            .json({

              ok: false,

              error:
                "El formulario no es de contratista"

            });

        }


        const esCoordinador =
          usuario.rol ===
          "coordinador";


        const esPropietario =
          Number(
            actual.usuario_id
          ) ===
          Number(
            usuario.id
          );


        if (
          !esCoordinador &&
          !esPropietario
        ) {

          return res
            .status(403)
            .json({

              ok: false,

              error:
                "No tienes permisos para editar este formulario"

            });

        }


        const formulario =
          actualizarFormulario(
            id,
            {
              datos,
              estado
            }
          );


        return res.json({

          ok: true,
          formulario

        });

      }


      /* =========================
         CREAR NUEVO
      ========================= */

      const formulario =
        crearFormulario({

          proyecto_id:
            null,

          usuario_id:
            usuario?.id ??
            null,

          tipo:
            "contratista",

          datos:
            datos || {},

          estado

        });


      res
        .status(201)
        .json({

          ok: true,
          formulario

        });


    } catch (error) {

      console.error(
        "Error guardando contratista:",
        error
      );


      res
        .status(500)
        .json({

          ok: false,

          error:
            "Error guardando formulario"

        });

    }

  }
);


/* =========================
   GENERAR PDF
========================= */

router.post(
  "/generate-pdf",

  async (req, res) => {

    try {

      const {
        formularioId,
        datos
      } = req.body;


      /* =========================
         VALIDAR ID
      ========================= */

      const id =
        Number(
          formularioId
        );


      if (
        !id ||
        Number.isNaN(id)
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
          id
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
        "contratista"
      ) {

        return res
          .status(400)
          .send(
            "El formulario no es de contratista"
          );

      }


      /* =========================
         COMPROBAR DATOS
      ========================= */

      if (!datos) {

        return res
          .status(400)
          .send(
            "No se han recibido los datos del formulario"
          );

      }


      /* =========================
         GENERAR PDF
      ========================= */

      const pdf =
        await generatePDF(
          datos
        );


      /* =========================
         GUARDAR ÚLTIMO PDF
      ========================= */

      const nombrePdf =
        `formulario-${id}.pdf`;


      const resultadoGuardado =
        guardarUltimoPdf(
          id,
          pdf,
          nombrePdf
        );


      if (
        resultadoGuardado.changes ===
        0
      ) {

        throw new Error(
          "No se pudo guardar el PDF"
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
        "Error generando PDF contratista:",
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