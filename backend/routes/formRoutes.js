const express = require("express");
const router = express.Router();
const { generatePDF } = require("../services/pdfService");

router.post("/generate-pdf", async (req, res) => {
  try {
    const pdf = await generatePDF(req.body);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=formulario.pdf"
    });

    res.send(pdf);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

module.exports = router;