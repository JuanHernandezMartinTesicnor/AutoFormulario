const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const { renderGeneral } = require("./Sections/general");
const { renderPersonal } = require("./Sections/personal");
const { renderMaquinaria } = require("./Sections/maquinaria");
const { renderEmpresas } = require("./Sections/empresas");
const { renderInspecciones } = require("./Sections/inspecciones");
const { renderChecklist } = require("./Sections/checklist");
const { renderResumen } = require("./Sections/resumen");
const { textosChecklist, formatearTitulo } = require("./Sections/checklistTexts");

const isLinux = process.platform === "linux";

async function generatePDF(data, files) {

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

    try {

        const page = await browser.newPage();

        const logoTesicnor = fs.readFileSync(
            path.join(__dirname, "../../../assets/logos/tesicnor.png"),
            "base64"
        );

        const portada = fs.readFileSync(
            path.join(__dirname, "../../../assets/logos/tesicnorPortada.png"),
            "base64"
        );

        const firmaMaria = fs.readFileSync(
            path.join(__dirname, "../../../assets/firmas/maria.png"),
            "base64"
        );

        const firmaJesus = fs.readFileSync(
            path.join(__dirname, "../../../assets/firmas/jesus.png"),
            "base64"
        );

        let html = fs.readFileSync(
            path.join(__dirname, "pdfTemplate.html"),
            "utf8"
        );

        const css = fs.readFileSync(
            path.join(__dirname, "pdfStyles.css"),
            "utf8"
        );

        html = html.replace(
            /{{logoTesicnor}}/g,
            logoTesicnor
        );

        html = html.replace(
            /{{coverImage}}/g,
            portada
        );

        let firmaCoordinador = "";

        if (
            data.coordinador &&
            data.coordinador.includes("Maria")
        ) {

            firmaCoordinador =
                "data:image/png;base64," + firmaMaria;

        }
        else if (
            data.coordinador &&
            data.coordinador.includes("Jes")
        ) {

            firmaCoordinador =
                "data:image/png;base64," + firmaJesus;

        }

        /* DATOS GENERALES */
        html = renderGeneral(html, data);
        html = renderResumen(html, data);

        html = html.replace(
            /{{firmaTecnico}}/g,
            data.firmaTecnico || ""
        );

        html = html.replace(
            /{{firmaCoordinador}}/g,
            firmaCoordinador
        );

        /* PERSONAL */
        html = renderPersonal(html, data);

        /* MAQUINARIA */
        html = renderMaquinaria(html, data);

        /* EMPRESAS */
        html = renderEmpresas(html, data);

        /*INSPECCIONES*/
        html = renderInspecciones(html, data, files);

        /*CHECKLIST*/
        html = await renderChecklist(
            html,
            data,
            files,
            textosChecklist,
            formatearTitulo
        );

        /* =========================
           GENERAR PDF
        ========================= */

        let contratasHtml = "";

        const contrtaPrincipal =
            (data.empresas || []).find(
                e =>
                    e.principal === true ||
                    e.principal === "SI"
            );

        if (contrtaPrincipal) {

            contratasHtml += `
        <p>
            <strong>
                Contrata principal:
            </strong>
            ${contrtaPrincipal.nombre}
        </p>
    `;
        }

        if (data.empresas.length) {

            contratasHtml += `

        <table class="tabla">

            <tr>

                <th>Empresa</th>

                <th>Firma</th>

            </tr>

    `;

            data.empresas.forEach(e => {

                contratasHtml += `

            <tr>

                <td>

                    ${e.nombre}

                </td>

                <td style="height:70px;">

                </td>

            </tr>

        `;

            });

            contratasHtml += "</table>";
        }

        html = html.replace(
            /{{firmasContratas}}/g,
            contratasHtml
        );

        await page.setContent(html, {
            waitUntil: "domcontentloaded",
            timeout: 0
        });

        await page.addStyleTag({
            content: css
        });

        await page.emulateMediaType("screen");
        const pdf = await page.pdf({

            format: "A4",

            printBackground: true,

            margin: {
                top: "0mm",
                bottom: "0mm",
                left: "10mm",
                right: "10mm"
            }
        });

        return pdf;

    } finally {

        if (browser) {
            await browser.close();
        }

        // Esperamos un poco para que Windows libere los archivos
        await new Promise(resolve => setTimeout(resolve, 500));

        if (files) {

            for (const file of files) {

                try {

                    await fs.promises.unlink(file.path);

                } catch (e) {

                    console.warn("No se pudo borrar", file.path);

                }

            }
        }
    }

}

module.exports = {
    generatePDF
};


