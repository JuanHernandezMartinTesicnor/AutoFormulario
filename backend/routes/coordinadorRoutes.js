const express = require("express");

const router = express.Router();

const {
  generatePDF
} = require("../services/pdf/coordinador/generateCoordinadorPDF");

router.post("/generate-pdf", async (req, res) => {

  try {

    const pdf = await generatePDF(req.body);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=formulario.pdf",
      "Content-Length": pdf.length
    });

    res.send(pdf);

  } catch (error) {

    console.error(error);

    res.status(500).send("Error generando PDF");
  }
});

module.exports = router;