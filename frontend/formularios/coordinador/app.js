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
   FOTOS CHECKLIST
========================= */

async function fileToBase64(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);

        reader.onerror = reject;

        reader.readAsDataURL(file);
    });
}

async function obtenerFotosChecklist() {

    const resultado = {};

    document
        .querySelectorAll(".check-foto")
        .forEach(async input => { });

    const fotosInputs =
        document.querySelectorAll(".check-foto");

    for (const input of fotosInputs) {

        const grupo =
            input.dataset.grupo;

        resultado[grupo] = [];

        if (!input.files.length) {
            continue;
        }

        for (const file of input.files) {

            const base64 =
                await fileToBase64(file);

            resultado[grupo].push({
                nombre: file.name,
                imagen: base64
            });
        }
    }

    return resultado;
}

/* =========================
   ENVÍO PDF
========================= */

async function enviar() {

    try {

        const fotosChecklist =
            await obtenerFotosChecklist();

        console.log(
            "FOTOS CHECKLIST:",
            fotosChecklist
        );

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
                obtenerChecklist(),

            fotosChecklist
        };

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
   EXPORTAR
========================= */

window.enviar = enviar;