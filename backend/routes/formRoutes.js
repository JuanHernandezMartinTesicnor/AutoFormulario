const express = require("express");
const router = express.Router();

const { generatePDF } = require("../services/pdfService");

router.post("/generate-pdf", async (req, res) => {
  try {
    console.log("PETICION PDF RECIBIDA");

    const pdf = await generatePDF(req.body);

    console.log("PDF GENERADO");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdf.length
    });

    res.send(pdf);

  } catch (err) {
    console.error("ERROR GENERANDO PDF:");
    console.error(err);

    res.status(500).send(err.toString());
  }
});

module.exports = router;