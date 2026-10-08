
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


async function generatePDF(data, files) {

    let browser;

    try {

        /* =========================
           INICIAR CHROME
        ========================= */

        browser = await puppeteer.launch({

            headless: true,

            executablePath: puppeteer.executablePath(),

            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu"
            ]
        });

        const page = await browser.newPage();

        /* =========================
           CARGAR IMÁGENES
        ========================= */

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

        /* =========================
           FIRMA COORDINADOR
        ========================= */

        let firmaCoordinador = "";

        if (
            data.coordinador &&
            data.coordinador.includes("Maria")
        ) {

            firmaCoordinador =
                "data:image/png;base64," + firmaMaria;

        } else if (
            data.coordinador &&
            data.coordinador.includes("Jes")
        ) {

            firmaCoordinador =
                "data:image/png;base64," + firmaJesus;
        }

        /* =========================
           DATOS GENERALES
        ========================= */

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

        /* =========================
           PERSONAL
        ========================= */

        html = renderPersonal(html, data);

        /* =========================
           MAQUINARIA
        ========================= */

        html = renderMaquinaria(html, data);

        /* =========================
           EMPRESAS
        ========================= */

        html = renderEmpresas(html, data);

        /* =========================
           INSPECCIONES
        ========================= */

        html = renderInspecciones(html, data, files);

        /* =========================
           CHECKLIST
        ========================= */

        html = await renderChecklist(
            html,
            data,
            files,
            textosChecklist,
            formatearTitulo
        );

        /* =========================
           FIRMAS DE CONTRATAS
        ========================= */

        let contratasHtml = "";

        const empresas = Array.isArray(data.empresas)
            ? data.empresas
            : [];

        const contrtaPrincipal = empresas.find(
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

        if (empresas.length) {

            contratasHtml += `
                <table class="tabla">
                    <tr>
                        <th>Empresa</th>
                        <th>Firma</th>
                    </tr>
            `;

            empresas.forEach(e => {

                contratasHtml += `
                    <tr>
                        <td>${e.nombre}</td>
                        <td style="height:70px;"></td>
                    </tr>
                `;
            });

            contratasHtml += "</table>";
        }

        html = html.replace(
            /{{firmasContratas}}/g,
            contratasHtml
        );

        /* =========================
           CARGAR HTML
        ========================= */

        await page.setContent(html, {
            waitUntil: "domcontentloaded",
            timeout: 0
        });

        /* =========================
           APLICAR ESTILOS
        ========================= */

        await page.addStyleTag({
            content: css
        });

        await page.emulateMediaType("screen");

        /* =========================
           GENERAR PDF
        ========================= */

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

        /* =========================
           CERRAR NAVEGADOR
        ========================= */

        if (browser) {

            try {
                await browser.close();
            } catch (error) {
                console.warn(
                    "No se pudo cerrar Chrome:",
                    error.message
                );
            }
        }

        /* =========================
           LIMPIAR ARCHIVOS TEMPORALES
        ========================= */

        if (files) {

            for (const file of files) {

                if (!file.path) {
                    continue;
                }

                try {

                    await fs.promises.unlink(
                        file.path
                    );

                } catch (error) {

                    console.warn(
                        "No se pudo borrar:",
                        file.path,
                        error.message
                    );
                }
            }
        }
    }
}

module.exports = {
    generatePDF
};
