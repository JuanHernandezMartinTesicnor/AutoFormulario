const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const {
    renderGeneral
} = require("./sections/general");

const {
    renderPersonal
} = require("./sections/personal");

const {
    renderMaquinaria
} = require("./sections/maquinaria");

const {
    renderEmpresas
} = require("./sections/empresas");

const {
    renderInspecciones
} = require("./sections/inspecciones");

const {
    renderChecklist
} = require("./sections/checklist");

const {
    renderResumen
} = require("./sections/resumen");

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

        const firmaAna = fs.readFileSync(
            path.join(__dirname, "../../../assets/firmas/ana.png"),
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
            data.coordinador.includes("Ana")
        ) {

            firmaCoordinador =
                "data:image/png;base64," + firmaAna;

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
        html = renderChecklist(
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

function formatearTitulo(texto) {

    return texto
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, c => c.toUpperCase());
}

module.exports = {
    generatePDF
};


const textosChecklist = {

    planSeguridad: {
        SI: "SI: Se verificó la existencia del Plan de Seguridad y Salud aprobado y disponible en obra, encontrándose accesible para consulta por parte de las empresas intervinientes.",
        NO: "NO: Durante la visita realizada no pudo verificarse la existencia del Plan de Seguridad y Salud aprobado. Esta situación supone un incumplimiento de las obligaciones establecidas en el RD 1627/1997 y dificulta la correcta implantación de las medidas preventivas previstas para la obra."
    },

    libroIncidencias: {
        SI: "SI: El Libro de Incidencias se encontraba disponible en obra y correctamente custodiado.",
        NO: "NO: No se evidenció la presencia del Libro de Incidencias durante la visita realizada, impidiendo el adecuado seguimiento documental de las observaciones y requerimientos emitidos por la Coordinación de Seguridad y Salud."
    },

    aperturaCentro: {
        SI: "SI: Se verificó la existencia de la comunicación de apertura de centro de trabajo.",
        NO: "NO: No pudo acreditarse la comunicación de apertura de centro de trabajo correspondiente a la obra visitada."
    },

    recursoPreventivo: {
        SI: "SI: Se constató la presencia del recurso preventivo designado durante la ejecución de los trabajos observados.",
        NO: "NO: Durante la inspección no se encontraba presente el recurso preventivo exigible para las actividades desarrolladas. Esta circunstancia supone una deficiencia organizativa relevante al no garantizarse la vigilancia preventiva requerida durante la ejecución de trabajos con riesgos especiales."
    },

    formacionPreventiva: {
        SI: "SI: Los trabajadores presentes acreditaron disponer de la formación preventiva exigible para las tareas desarrolladas.",
        NO: "NO: No pudo verificarse la formación preventiva de uno o varios trabajadores presentes en la obra, circunstancia que puede comprometer la correcta ejecución de los trabajos desde el punto de vista preventivo."
    },

    estadoGeneral: {
        SI: "SI: La obra presentaba unas adecuadas condiciones de orden y limpieza.",
        NO: "NO: Se observaron deficiencias de orden y limpieza consistentes en acumulación de materiales, residuos y obstáculos en zonas de tránsito. Esta situación incrementa el riesgo de tropiezos, caídas al mismo nivel y dificultades de evacuación en caso de emergencia."
    },

    gestionResiduos: {
        SI: "SI: Los residuos generados se encontraban correctamente segregados y gestionados.",
        NO: "NO: Se detectó acumulación incontrolada de residuos de obra en distintas zonas de trabajo, observándose una gestión deficiente de los mismos."
    },

    vallado: {
        SI: "SI: Las zonas de trabajo se encontraban correctamente delimitadas.",
        NO: "NO: Se detectaron deficiencias en el vallado y delimitación de las zonas de trabajo, permitiendo potencialmente el acceso de personal ajeno a las actividades desarrolladas."
    },

    senalizacion: {
        SI: "SI: La señalización de seguridad era suficiente y visible.",
        NO: "NO: Se observaron carencias en la señalización de riesgos y medidas preventivas aplicables en las zonas inspeccionadas."
    },

    casco: {
        SI: "SI: Los trabajadores utilizaban correctamente el casco de seguridad.",
        NO: "NO: Se observó personal realizando trabajos sin utilizar casco de protección, exponiéndose a riesgos derivados de golpes o caída de objetos."
    },

    calzado: {
        SI: "SI: Los trabajadores utilizaban calzado de seguridad adecuado.",
        NO: "NO: Se observó personal sin el correspondiente calzado de seguridad reglamentario."
    },

    arnes: {
        SI: "SI: Los trabajadores utilizaban correctamente los sistemas anticaídas.",
        NO: "NO: Se observaron trabajos en altura sin utilización adecuada de sistemas anticaídas, existiendo riesgo de caída con consecuencias potencialmente graves o mortales."
    },

    proteccionesColectivas: {
        SI: "SI: Las zonas con riesgo de caída disponían de protecciones colectivas adecuadas.",
        NO: "NO: Se detectaron zonas con riesgo de caída en altura sin protección colectiva suficiente mediante barandillas, redes o sistemas equivalentes."
    },

    escaleras: {
        SI: "SI: Las escaleras utilizadas presentaban un estado adecuado de conservación.",
        NO: "NO: Se observaron escaleras con deficiencias estructurales o utilizadas de forma inadecuada."
    },

    marcadoCE: {
        SI: "SI: La maquinaria inspeccionada disponía de marcado CE visible.",
        NO: "NO: No pudo verificarse la conformidad documental o el marcado CE de la maquinaria utilizada."
    },

    estadoMaquinaria: {
        SI: "SI: La maquinaria observada presentaba un adecuado estado de conservación.",
        NO: "NO: Se detectaron deficiencias de mantenimiento o conservación en la maquinaria empleada."
    },

    cuadrosElectricos: {
        SI: "SI: Los cuadros eléctricos presentaban adecuadas condiciones de seguridad.",
        NO: "NO: Se observaron cuadros eléctricos sin protección suficiente frente a contactos directos o indirectos."
    },

    cableado: {
        SI: "SI: Las conexiones eléctricas se encontraban en buen estado.",
        NO: "NO: Se detectaron cables deteriorados, empalmes no protegidos o conexiones provisionales inadecuadas."
    },

    estabilidad: {
        SI: "SI: Las excavaciones presentaban condiciones adecuadas de estabilidad.",
        NO: "NO: Se detectaron excavaciones sin medidas suficientes para evitar desprendimientos o colapsos de tierras."
    },

    accesos: {
        SI: "SI: Existían accesos seguros al interior de la excavación.",
        NO: "NO: No se observaron medios seguros para el acceso y salida de trabajadores."
    },

    planIzado: {
        SI: "SI: Se verificó la existencia del correspondiente plan de izado.",
        NO: "NO: No pudo acreditarse la existencia de un plan de izado para la maniobra observada."
    },

    eslingas: {
        SI: "SI: Los accesorios de elevación se encontraban identificados y en buen estado.",
        NO: "NO: Se observaron accesorios de elevación deteriorados o sin identificación visible."
    },

    zonaExclusion: {
        SI: "SI: La zona de maniobra se encontraba correctamente delimitada.",
        NO: "NO: No existía una delimitación efectiva de la zona de exclusión durante la maniobra de izado."
    },

    botiquin: {
        SI: "SI: Se disponía de botiquín operativo y accesible.",
        NO: "NO: No se localizó botiquín o su contenido resultó insuficiente."
    },

    extintores: {
        SI: "SI: Los medios de extinción se encontraban disponibles y accesibles.",
        NO: "NO: Se detectaron deficiencias en la disponibilidad, señalización o mantenimiento de los medios de extinción."
    }
};