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

    html = html.replace(
        /{{personalRows}}/g,
        (data.personal || [])
            .map(p => `
                <tr>
                    <td>${p.empresa || ""}</td>
                    <td>${p.trabajador || ""}</td>
                    <td>${p.cargo || ""}</td>
                </tr>
            `)
            .join("")
    );

    /* =========================
       MAQUINARIA
    ========================= */

    html = html.replace(
        /{{maquinariaRows}}/g,
        (data.maquinaria || [])
            .map(m => `
                <tr>
                    <td>${m.equipo || ""}</td>
                    <td>${m.matricula || ""}</td>
                </tr>
            `)
            .join("")
    );

    /* =========================
       EMPRESAS
    ========================= */

    html = html.replace(
        /{{empresaRows}}/g,
        (data.empresas || [])
            .map(e => `
                <tr>
                    <td>${e.nombre || ""}</td>
                    <td>${e.observaciones || ""}</td>
                </tr>
            `)
            .join("")
    );

    /* =========================
       INSPECCIONES
    ========================= */

    html = html.replace(
        /{{inspeccionRows}}/g,
        (data.inspecciones || [])
            .map(i => `
                <tr>
                    <td>${i.fase || ""}</td>
                    <td>${i.observaciones || ""}</td>
                </tr>
            `)
            .join("")
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

    let total = 0;
    let incumplimientos = 0;
    let incumplimientosGraves = 0;

    if (Array.isArray(data.checklist)) {

        data.checklist.forEach(grupo => {

            const itemsValidos =
                grupo.items.filter(
                    item => item.valor !== "NA"
                );

            if (itemsValidos.length === 0) {
                return;
            }

            checklistHtml += `
                <h3>
                    ${formatearTitulo(grupo.categoria)}
                </h3>
            `;

            itemsValidos.forEach(item => {

                total++;

                if (item.valor === "NO") {

                    incumplimientos++;

                    if (
                        item.gravedad === "GRAVE"
                    ) {
                        incumplimientosGraves++;
                    }
                }

                checklistHtml += `
                    <div class="check-item">

                        <strong>
                            ${item.titulo}
                        </strong>

                        <br>

                        Resultado:
                        ${item.valor}

                        <br>

                        Gravedad:
                        ${item.gravedad}
                `;

                if (
                    item.comentario &&
                    item.comentario.trim()
                ) {

                    checklistHtml += `
                        <br>
                        Observaciones:
                        ${item.comentario}
                    `;
                }

                if (
                    item.responsable &&
                    item.responsable.trim()
                ) {

                    checklistHtml += `
                        <br>
                        Responsable:
                        ${item.responsable}
                    `;
                }

                if (
                    item.fechaLimite &&
                    item.fechaLimite.trim()
                ) {

                    checklistHtml += `
                        <br>
                        Fecha límite:
                        ${item.fechaLimite}
                    `;
                }

                checklistHtml += `
                    </div>
                    <hr>
                `;
            });
        });
    }

    html = html.replace(
        /{{checklist}}/g,
        checklistHtml
    );

    /* =========================
       RESUMEN
    ========================= */

    const cumplimiento =
        total > 0
            ? Math.round(
                ((total - incumplimientos) / total) * 100
            )
            : 100;

    const resumenHtml = `

        <div class="resumen">

            <h2>Resumen Ejecutivo</h2>

            <p>
                Aspectos evaluados:
                ${total}
            </p>

            <p>
                Incumplimientos detectados:
                ${incumplimientos}
            </p>

            <p>
                Incumplimientos graves:
                ${incumplimientosGraves}
            </p>

            <p>
                Índice de cumplimiento:
                ${cumplimiento}%
            </p>

        </div>

    `;

    html = html.replace(
        /{{resumen}}/g,
        resumenHtml
    );

    /* =========================
       FOTOS CHECKLIST
    ========================= */

    let fotosHtml = "";

    if (data.fotosChecklist) {

        Object.entries(
            data.fotosChecklist
        ).forEach(([grupo, fotos]) => {

            if (!fotos || !fotos.length) {
                return;
            }

            fotosHtml += `
                <h3>
                    ${formatearTitulo(grupo)}
                </h3>
            `;

            fotos.forEach(foto => {

                fotosHtml += `
                    <img
                        src="${foto.imagen}"
                        style="
                            max-width:300px;
                            margin:10px;
                            border:1px solid #ccc;
                        "
                    >
                `;
            });
        });
    }

    html = html.replace(
        /{{fotosChecklist}}/g,
        fotosHtml
    );

    /* =========================
       GENERAR PDF
    ========================= */

    await page.setContent(
        html,
        {
            waitUntil: "networkidle0"
        }
    );

    await page.addStyleTag({
        content: css
    });

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