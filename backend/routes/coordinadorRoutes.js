const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const router = express.Router();

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            path.join(__dirname, "../uploads/tmp")
        );

    },

    filename: (req, file, cb) => {

        cb(
            null,
            crypto.randomUUID() +
            path.extname(file.originalname)
        );

    }

});

const upload = multer({

    storage,

    limits: {

        fileSize: 20 * 1024 * 1024 // 20 MB por foto

    }

});

const {
    generatePDF
} = require("../services/pdf/coordinador/generateCoordinadorPDF");

router.post(

    "/generate-pdf",

    upload.any(),

    async (req, res) => {

        try {

            const datos =
                JSON.parse(req.body.datos);

            const pdf =
                await generatePDF(
                    datos,
                    req.files
                );

            res.set({

                "Content-Type": "application/pdf",

                "Content-Disposition":
                    "attachment; filename=formulario.pdf",

                "Content-Length":
                    pdf.length

            });

            res.send(pdf);

        }
        catch (error) {

            console.error(error);

            res
                .status(500)
                .send("Error generando PDF");

        }

    }

);

module.exports = router;