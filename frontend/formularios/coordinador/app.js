import {
    addPersonal
} from "./personal.js";

import {
    addMaquinaria
} from "./maquinaria.js";

import {
    addEmpresa
} from "./empresas.js";

import {
    addInspeccion
} from "./inspecciones.js";

import {
    renderChecklist,
    obtenerChecklist
} from "./checklist.js";

import {
    initFirma,
    limpiarFirma,
    getFirmaBase64
} from "./firma.js";

/* =========================
   ESTADO
========================= */

import {
    personal,
    maquinaria,
    empresas,
    inspecciones
} from "./state.js";

/* =========================
   INICIALIZACIÓN
========================= */

renderChecklist();
initFirma();

/* =========================
   BOTONES HTML
========================= */

window.addPersonal = addPersonal;
window.addMaquinaria = addMaquinaria;
window.addEmpresa = addEmpresa;
window.addInspeccion = addInspeccion;
window.limpiarFirma = limpiarFirma;

/* =========================
   ENVÍO PDF
========================= */

async function enviar() {

    const data = {

        fecha:
            document.getElementById("fecha")?.value || "",

        obra:
            document.getElementById("obra")?.value || "",

        cliente:
            document.getElementById("cliente")?.value || "",

        alcance:
            document.getElementById("alcance")?.value || "",

        realizadoPor:
            document.getElementById("realizadoPor")?.value || "",

        revisadoPor:
            document.getElementById("revisadoPor")?.value || "",

        firma:
            getFirmaBase64(),

        personal,
        maquinaria,
        empresas,
        inspecciones,

        checklist:
            obtenerChecklist()
    };

    console.log(data);

    try {

        const res = await fetch(
            "/api/coordinador/generate-pdf",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error generando PDF"
            );
        }

        const blob =
            await res.blob();

        const url =
            window.URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;

        a.download =
            "informe-coordinacion.pdf";

        document.body.appendChild(a);

        a.click();

        a.remove();

        window.URL.revokeObjectURL(url);

    } catch (error) {

        console.error(error);

        alert(
            "Error generando PDF"
        );
    }
}

/* =========================
   EXPORTAR A HTML
========================= */

window.enviar = enviar;