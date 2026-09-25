const express = require("express");

const router = express.Router();

const {
  generatePDF
} = require(
  "../services/pdf/contratista/generateContratistaPDF"
);

const {
  crearFormulario
} = require(
  "../models/formulariosModel"
);


/* =========================
   GENERAR PDF CONTRATISTA
========================= */

router.post(
  "/generate-pdf",
  async (req, res) => {

    try {

      const datos =
        req.body || {};


      /* =========================
         USUARIO
      ========================= */

      /*
       * El formulario de contratista
       * también puede utilizarse sin
       * iniciar sesión.
       *
       * Si existe una sesión guardamos
       * quién creó el formulario.
       *
       * Si no existe:
       * usuario_id = null
       */

      const usuarioId =
        req.session?.usuario?.id
          ?? null;


      /* =========================
         GUARDAR FORMULARIO
      ========================= */

      const formulario =
        crearFormulario({

          /*
           * Contratista no pertenece
           * a ningún proyecto real.
           */
          proyecto_id: null,

          usuario_id:
            usuarioId,

          tipo:
            "contratista",

          /*
           * Guardamos TODO el contenido
           * del formulario dentro de datos.
           */
          datos,

          /*
           * Al generar el PDF consideramos
           * que el formulario está terminado.
           */
          estado:
            "finalizado"

        });


      /* =========================
         GENERAR PDF
      ========================= */

      const pdf =
        await generatePDF(
          datos
        );


      /* =========================
         RESPUESTA
      ========================= */

      res.set({

        "Content-Type":
          "application/pdf",

        "Content-Disposition":
          `attachment; filename=formulario-${formulario.id}.pdf`,

        "Content-Length":
          pdf.length,

        /*
         * Nos puede resultar útil
         * posteriormente para edición.
         */
        "X-Formulario-Id":
          String(formulario.id)

      });


      res.send(
        pdf
      );


    } catch (error) {

      console.error(
        "Error guardando/generando formulario de contratista:",
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


module.exports = router;