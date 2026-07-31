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

async function obtenerFotosChecklist(formData) {

    const resultado = {};

    const fotosInputs =
        document.querySelectorAll(".check-foto");

    let contador = 0;

    for (const input of fotosInputs) {

        const grupo = input.dataset.grupo;

        resultado[grupo] = [];

        if (!input.files.length)
            continue;

        for (const file of input.files) {

            const nombreServidor =
                `foto_${contador++}`;

            formData.append(
                nombreServidor,
                file
            );

            resultado[grupo].push({

                nombre: file.name,

                archivo: nombreServidor

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

        const formData = new FormData();

        const fotosChecklist =
            await obtenerFotosChecklist(formData);

        const data = {

            fecha:
                document.getElementById("fecha")?.value || "",

            obra:
                document.getElementById("obra")?.value || "",

            cliente:
                document.getElementById("cliente")?.value || "",

            direccion:
                document.getElementById("direccion")?.value || "",

            tecnicoResponsable:
                document.getElementById("tecnicoResponsable")?.value || "",

            coordinador:
                document.getElementById("coordinador")?.value || "",

            firmaTecnico:
                getFirmaBase64(),

            personal,

            maquinaria,

            empresas,

            inspecciones,

            checklist:
                obtenerChecklist(),

            fotosChecklist

        };

        formData.append(
            "datos",
            JSON.stringify(data)
        );

        const res =
            await fetch(
                "/api/coordinador/generate-pdf",
                {
                    method: "POST",
                    body: formData
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

    }
    catch (error) {

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