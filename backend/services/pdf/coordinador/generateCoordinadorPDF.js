const puppeteer = require("puppeteer");

const isLinux = process.platform === "linux";

async function generatePDF(data) {

    const browser = await puppeteer.launch({

        headless: true,

        ...(isLinux && {
            executablePath: "/snap/bin/chromium"
        }),

        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu"
        ]
    });

    const page = await browser.newPage();

    const html = `
    <!DOCTYPE html>
    <html>

    <head>

        <style>

            body {
                font-family: Arial, sans-serif;
                margin: 40px;
                font-size: 12px;
            }

            h1 {
                text-align: center;
                margin-bottom: 30px;
            }

            .field {
                margin-bottom: 10px;
            }

            .label {
                font-weight: bold;
            }

        </style>

    </head>

    <body>

        <h1>INFORME DE COORDINACIÓN</h1>

        <div class="field">
            <span class="label">Fecha:</span>
            ${data.fecha || ""}
        </div>

        <div class="field">
            <span class="label">Obra:</span>
            ${data.obra || ""}
        </div>

        <div class="field">
            <span class="label">Cliente:</span>
            ${data.cliente || ""}
        </div>

        <div class="field">
            <span class="label">Alcance:</span>
            ${data.alcance || ""}
        </div>

        <hr>

        <div class="field">
            <span class="label">Realizado por:</span>
            ${data.realizadoPor || ""}
        </div>

        <div class="field">
            <span class="label">Revisado por:</span>
            ${data.revisadoPor || ""}
        </div>

    </body>

    </html>
    `;

    await page.setContent(
        html,
        {
            waitUntil: "networkidle0"
        }
    );

    const pdf = await page.pdf({

        format: "A4",

        printBackground: true
    });

    await browser.close();

    return pdf;
}

module.exports = {
    generatePDF
};