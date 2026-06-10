const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

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

    /* =========================
       HTML + CSS
    ========================= */

    let html = fs.readFileSync(
        path.join(__dirname, "pdfTemplate.html"),
        "utf8"
    );

    const css = fs.readFileSync(
        path.join(__dirname, "pdfStyles.css"),
        "utf8"
    );

    /* =========================
       DATOS GENERALES
    ========================= */

    html = html.replace(/{{fecha}}/g, data.fecha || "");
    html = html.replace(/{{obra}}/g, data.obra || "");
    html = html.replace(/{{cliente}}/g, data.cliente || "");
    html = html.replace(/{{alcance}}/g, data.alcance || "");
    html = html.replace(/{{realizadoPor}}/g, data.realizadoPor || "");
    html = html.replace(/{{revisadoPor}}/g, data.revisadoPor || "");

    /* =========================
       PERSONAL
    ========================= */

    const personalRows =
        (data.personal || [])
            .map(p => `
                <tr>
                    <td>${p.empresa || ""}</td>
                    <td>${p.trabajador || ""}</td>
                    <td>${p.cargo || ""}</td>
                </tr>
            `)
            .join("");

    html = html.replace(
        /{{personalRows}}/g,
        personalRows
    );

    /* =========================
       MAQUINARIA
    ========================= */

    const maquinariaRows =
        (data.maquinaria || [])
            .map(m => `
                <tr>
                    <td>${m.equipo || ""}</td>
                    <td>${m.matricula || ""}</td>
                </tr>
            `)
            .join("");

    html = html.replace(
        /{{maquinariaRows}}/g,
        maquinariaRows
    );

    /* =========================
       EMPRESAS
    ========================= */

    const empresaRows =
        (data.empresas || [])
            .map(e => `
                <tr>
                    <td>${e.nombre || ""}</td>
                    <td>${e.observaciones || ""}</td>
                </tr>
            `)
            .join("");

    html = html.replace(
        /{{empresaRows}}/g,
        empresaRows
    );

    /* =========================
       INSPECCIONES
    ========================= */

    const inspeccionRows =
        (data.inspecciones || [])
            .map(i => `
                <tr>
                    <td>${i.fase || ""}</td>
                    <td>${i.observaciones || ""}</td>
                </tr>
            `)
            .join("");

    html = html.replace(
        /{{inspeccionRows}}/g,
        inspeccionRows
    );

    /* =========================
       FIRMA
    ========================= */

    html = html.replace(
        /{{firma}}/g,
        data.firma || ""
    );

    /* =========================
       CHECKLIST
    ========================= */

    let checklistHtml = "";

    if (data.checklist) {

        Object.entries(data.checklist).forEach(([grupo, items]) => {

            checklistHtml += `
                <h3>${formatearTitulo(grupo)}</h3>

                <table class="tabla">
                    <tr>
                        <th>Elemento</th>
                        <th>Resultado</th>
                    </tr>
            `;

            items.forEach(item => {

                checklistHtml += `
                    <tr>
                        <td>${item.texto}</td>
                        <td>${item.valor}</td>
                    </tr>
                `;
            });

            checklistHtml += `
                </table>
            `;
        });
    }

    html = html.replace(
        /{{checklist}}/g,
        checklistHtml
    );

    /* =========================
       CARGAR HTML
    ========================= */

    await page.setContent(
        html,
        {
            waitUntil: "networkidle0"
        }
    );

    /* =========================
       CSS
    ========================= */

    await page.addStyleTag({
        content: css
    });

    /* =========================
       PDF
    ========================= */

    const pdf = await page.pdf({

        format: "A4",

        printBackground: true,

        margin: {
            top: "15mm",
            bottom: "15mm",
            left: "10mm",
            right: "10mm"
        }
    });

    await browser.close();

    return pdf;
}

function formatearTitulo(texto) {

    return texto
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, c => c.toUpperCase());
}

module.exports = {
    generatePDF
};