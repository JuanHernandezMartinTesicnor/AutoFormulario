

import {
    API_URL
} from "../../common/api.js";

import {
    addPersonal,
    renderPersonal
} from "./personal.js";

import {
    addMaquinaria,
    renderMaquinaria
} from "./maquinaria.js";

import {
    addEmpresa,
    renderEmpresas
} from "./empresas.js";

import {
    addInspeccion,
    renderInspecciones
} from "./inspecciones.js";

import {
    renderChecklist,
    obtenerChecklist,
    cargarChecklist
} from "./checklist.js";

import {
    initFirma,
    limpiarFirma,
    getFirmaBase64,
    cargarFirma
} from "./firma.js";

import {
    personal,
    maquinaria,
    empresas,
    inspecciones
} from "./state.js";


/* =========================
   PARÁMETROS URL
========================= */

const params =
    new URLSearchParams(
        window.location.search
    );

const proyectoId =
    params.get("proyecto");

const formularioId =
    params.get("id");


/* =========================
   INICIALIZACIÓN
========================= */

document.addEventListener(
    "DOMContentLoaded",
    iniciar
);


async function iniciar() {

    /*
     * Primero construimos el HTML
     * dinámico.
     */

    renderChecklist();

    initFirma(
        "firmaCanvas"
    );


    /*
     * Si tenemos ID estamos abriendo
     * un formulario existente.
     */

    if (formularioId) {

        await cargarFormularioExistente();

    }

}




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

        const grupo =
            input.dataset.grupo;

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
   FOTOS INSPECCIONES
========================= */

function prepararFotosInspecciones(formData) {

    inspecciones.forEach((inspeccion, i) => {

        if (!inspeccion.fotos)
            return;

        const fotosServidor = [];

        inspeccion.fotos.forEach((file, j) => {

            const nombreServidor =
                `inspeccion_${i}_${j}`;

            formData.append(
                nombreServidor,
                file
            );

            fotosServidor.push({

                archivo: nombreServidor

            });

        });

        inspeccion.fotosServidor = fotosServidor;

    });

}



/* =========================
   ENVÍO PDF
========================= */

async function enviar() {

    try {

        const proyectoId =
            obtenerProyectoId();

        console.log(
            "Proyecto seleccionado:",
            proyectoId
        );

        if (!proyectoId) {

            alert(
                "No se ha seleccionado ningún proyecto."
            );

            return;
        }

        const formData =
            new FormData();

        const fotosChecklist =
            await obtenerFotosChecklist(
                formData
            );

        prepararFotosInspecciones(
            formData
        );

        empresas.forEach((empresa, index) => {

            if (
                empresa.nivel === "principal"
            ) {

                empresa.firma =
                    getFirmaBase64(
                        `firmaEmpresa${index}`
                    );

            }

        });

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
                getFirmaBase64(
                    "firmaCanvas"
                ),

            personal,

            maquinaria,

            empresas,

            inspecciones,

            checklist:
                obtenerChecklist(),

            fotosChecklist

        };

        const respuestaFormulario =
            await fetch(
                `${API_URL}/api/formularios`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({

                        proyecto_id:
                            Number(proyectoId),

                        tipo:
                            "coordinador",

                        datos:
                            data,

                        estado:
                            "completado"

                    })
                }
            );

        const resultadoFormulario =
            await respuestaFormulario.json();

        if (!respuestaFormulario.ok) {

            throw new Error(
                resultadoFormulario.error ||
                "No se pudo guardar el formulario"
            );

        }

        console.log(
            "Formulario guardado:",
            resultadoFormulario
        );

        for (const pair of formData.entries()) {

            console.log(pair[0], pair[1]);

        }

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
            window.URL.createObjectURL(
                blob
            );

        const a =
            document.createElement("a");

        a.href =
            url;

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


function obtenerProyectoId() {

    return proyectoId;
}


/* =========================
   CARGAR FORMULARIO EXISTENTE
========================= */

async function cargarFormularioExistente() {

    try {

        const respuesta =
            await fetch(
                `${API_URL}/api/formularios/${formularioId}`,
                {
                    credentials:
                        "include"
                }
            );


        const resultado =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                resultado.error ||
                "No se pudo cargar el formulario"
            );

        }


        const formulario =
            resultado.formulario;


        if (
            formulario.tipo !==
            "coordinador"
        ) {

            throw new Error(
                "El formulario seleccionado no es de coordinador"
            );

        }


        rellenarFormulario(
            formulario.datos || {}
        );


    } catch (error) {

        console.error(
            "Error cargando formulario:",
            error
        );

        alert(
            error.message ||
            "No se pudo cargar el formulario"
        );

    }

}


/* =========================
   RELLENAR FORMULARIO
========================= */

function rellenarFormulario(
    data
) {

    /* =========================
       DATOS GENERALES
    ========================= */

    document.getElementById(
        "fecha"
    ).value =
        data.fecha || "";


    document.getElementById(
        "obra"
    ).value =
        data.obra || "";


    document.getElementById(
        "cliente"
    ).value =
        data.cliente || "";


    document.getElementById(
        "direccion"
    ).value =
        data.direccion || "";


    document.getElementById(
        "tecnicoResponsable"
    ).value =
        data.tecnicoResponsable ||
        "";


    document.getElementById(
        "coordinador"
    ).value =
        data.coordinador || "";


    /* =========================
       PERSONAL
    ========================= */

    personal.splice(
        0,
        personal.length
    );


    if (
        Array.isArray(
            data.personal
        )
    ) {

        personal.push(
            ...data.personal
        );

    }


    renderPersonal();


    /* =========================
       MAQUINARIA
    ========================= */

    maquinaria.splice(
        0,
        maquinaria.length
    );


    if (
        Array.isArray(
            data.maquinaria
        )
    ) {

        maquinaria.push(
            ...data.maquinaria
        );

    }


    renderMaquinaria();


    /* =========================
       EMPRESAS
    ========================= */

    empresas.splice(
        0,
        empresas.length
    );


    if (
        Array.isArray(
            data.empresas
        )
    ) {

        empresas.push(
            ...data.empresas
        );

    }


    /*
     * renderEmpresas ya sabe
     * reconstruir las firmas
     * guardadas de las empresas.
     */

    renderEmpresas();


    /* =========================
       INSPECCIONES
    ========================= */

    inspecciones.splice(
        0,
        inspecciones.length
    );


    if (
        Array.isArray(
            data.inspecciones
        )
    ) {

        /*
         * Al cargar desde JSON,
         * las fotos antiguas ya no son
         * objetos File del navegador.
         *
         * Las conservamos como datos,
         * pero limpiamos fotos para evitar
         * tratarlas como archivos nuevos.
         */

        data.inspecciones.forEach(
            inspeccion => {

                inspecciones.push({

                    ...inspeccion,

                    fotos: []

                });

            }
        );

    }


    renderInspecciones();


    /* =========================
       CHECKLIST
    ========================= */

    cargarChecklist(
        data.checklist || []
    );


    /* =========================
       FIRMA TÉCNICO
    ========================= */

    if (
        data.firmaTecnico
    ) {

        cargarFirma(
            "firmaCanvas",
            data.firmaTecnico
        );

    }

}