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


/* =========================================================
   PARÁMETROS URL
========================================================= */

const params =
    new URLSearchParams(
        window.location.search
    );

const proyectoId =
    params.get("proyecto");

let formularioId =
    params.get("id");

let estadoFormulario =
    "borrador";


/* =========================================================
   INICIALIZACIÓN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    iniciar
);


async function iniciar() {

    renderChecklist();

    initFirma(
        "firmaCanvas"
    );


    const btnGuardar =
        document.getElementById(
            "btnGuardar"
        );


    if (btnGuardar) {

        btnGuardar.addEventListener(
            "click",
            guardar
        );

    }


    if (formularioId) {

        await cargarFormularioExistente();

    }

}


/* =========================================================
   BOTONES HTML
========================================================= */

window.addPersonal =
    addPersonal;

window.addMaquinaria =
    addMaquinaria;

window.addEmpresa =
    addEmpresa;

window.addInspeccion =
    addInspeccion;

window.limpiarFirma =
    limpiarFirma;


/* =========================================================
   CARGAR FORMULARIO EXISTENTE
========================================================= */

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


        estadoFormulario =
            formulario.estado ||
            "borrador";


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


/* =========================================================
   RELLENAR FORMULARIO
========================================================= */

function rellenarFormulario(data) {

    /* =========================
       DATOS GENERALES
    ========================= */

    const fecha =
        document.getElementById(
            "fecha"
        );

    const obra =
        document.getElementById(
            "obra"
        );

    const cliente =
        document.getElementById(
            "cliente"
        );

    const direccion =
        document.getElementById(
            "direccion"
        );

    const tecnicoResponsable =
        document.getElementById(
            "tecnicoResponsable"
        );

    const coordinador =
        document.getElementById(
            "coordinador"
        );


    if (fecha) {

        fecha.value =
            data.fecha || "";

    }


    if (obra) {

        obra.value =
            data.obra || "";

    }


    if (cliente) {

        cliente.value =
            data.cliente || "";

    }


    if (direccion) {

        direccion.value =
            data.direccion || "";

    }


    if (tecnicoResponsable) {

        tecnicoResponsable.value =
            data.tecnicoResponsable ||
            "";

    }


    if (coordinador) {

        coordinador.value =
            data.coordinador || "";

    }


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
     * renderEmpresas también
     * reconstruye las firmas
     * guardadas.
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

        data.inspecciones.forEach(
            inspeccion => {

                inspecciones.push({

                    ...inspeccion,

                    /*
                     * Un input file no puede
                     * restaurarse automáticamente.
                     */

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


/* =========================================================
   OBTENER DATOS DEL FORMULARIO
========================================================= */

function obtenerDatosFormulario() {

    /* =========================
       FIRMAS EMPRESAS
    ========================= */

    empresas.forEach(
        (empresa, index) => {

            if (
                empresa.nivel ===
                "principal"
            ) {

                empresa.firma =
                    getFirmaBase64(
                        `firmaEmpresa${index}`
                    );

            }

        }
    );


    /* =========================
       DATOS
    ========================= */

    return {

        fecha:
            document.getElementById(
                "fecha"
            )?.value || "",

        obra:
            document.getElementById(
                "obra"
            )?.value || "",

        cliente:
            document.getElementById(
                "cliente"
            )?.value || "",

        direccion:
            document.getElementById(
                "direccion"
            )?.value || "",

        tecnicoResponsable:
            document.getElementById(
                "tecnicoResponsable"
            )?.value || "",

        coordinador:
            document.getElementById(
                "coordinador"
            )?.value || "",

        firmaTecnico:
            getFirmaBase64(
                "firmaCanvas"
            ),

        personal,

        maquinaria,

        empresas,

        inspecciones,

        checklist:
            obtenerChecklist()

    };

}


/* =========================================================
   GUARDAR FORMULARIO
========================================================= */

/* =========================================================
   GUARDAR FORMULARIO
========================================================= */

async function guardarFormulario(
    data,
    estado = "borrador"
) {

    let url;
    let method;
    let body;


    /* =========================
       EDITAR EXISTENTE
    ========================= */

    if (formularioId) {

        url =
            `${API_URL}/api/formularios/${formularioId}`;

        method =
            "PUT";

        body = {

            datos:
                data,

            estado:
                estado

        };

    }


    /* =========================
       CREAR NUEVO
    ========================= */

    else {

        if (!proyectoId) {

            throw new Error(
                "No se ha seleccionado ningún proyecto."
            );

        }


        url =
            `${API_URL}/api/formularios`;

        method =
            "POST";

        body = {

            proyecto_id:
                Number(
                    proyectoId
                ),

            tipo:
                "coordinador",

            datos:
                data,

            estado:
                estado

        };

    }


    console.log(
        "Guardando formulario:",
        {
            url,
            method,
            body
        }
    );


    const respuesta =
        await fetch(
            url,
            {
                method:

                    method,

                credentials:
                    "include",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(
                        body
                    )
            }
        );


    /*
     * Primero leemos como texto para
     * poder ver incluso errores que no
     * vengan en JSON.
     */

    const texto =
        await respuesta.text();


    console.log(
        "Respuesta servidor:",
        respuesta.status,
        texto
    );


    let resultado;


    try {

        resultado =
            JSON.parse(
                texto
            );

    } catch {

        throw new Error(
            texto ||
            `Error HTTP ${respuesta.status}`
        );

    }


    if (!respuesta.ok) {

        throw new Error(
            resultado.error ||
            "No se pudo guardar el formulario"
        );

    }


    if (
        !resultado.formulario
    ) {

        throw new Error(
            "El servidor no devolvió el formulario guardado"
        );

    }


    /* =========================
       NUEVO FORMULARIO
    ========================= */

    if (!formularioId) {

        formularioId =
            String(
                resultado.formulario.id
            );


        const urlActual =
            new URL(
                window.location.href
            );


        urlActual.searchParams.set(
            "id",
            formularioId
        );


        window.history.replaceState(
            {},
            "",
            urlActual
        );


        console.log(
            "Nuevo formulario creado con ID:",
            formularioId
        );

    }


    estadoFormulario =
        resultado.formulario.estado ||
        estado;


    return resultado.formulario;

}


/* =========================================================
   GUARDAR SIN GENERAR PDF
========================================================= */

async function guardar() {

    try {

        console.log(
            "Iniciando guardado..."
        );


        const data =
            obtenerDatosFormulario();


        console.log(
            "Datos a guardar:",
            data
        );


        console.log(
            "Formulario ID:",
            formularioId
        );


        console.log(
            "Proyecto ID:",
            proyectoId
        );


        const estado =
            formularioId
                ? estadoFormulario
                : "borrador";


        const formulario =
            await guardarFormulario(
                data,
                estado
            );


        console.log(
            "Formulario guardado:",
            formulario
        );


        alert(
            "Formulario guardado correctamente"
        );


    } catch (error) {

        console.error(
            "Error guardando formulario:",
            error
        );


        alert(
            error.message ||
            "Error guardando formulario"
        );

    }

}


/* =========================================================
   FOTOS CHECKLIST
========================================================= */

async function obtenerFotosChecklist(
    formData
) {

    const resultado =
        {};

    const fotosInputs =
        document.querySelectorAll(
            ".check-foto"
        );

    let contador =
        0;


    for (
        const input
        of fotosInputs
    ) {

        const grupo =
            input.dataset.grupo;


        resultado[grupo] =
            [];


        if (
            !input.files ||
            !input.files.length
        ) {

            continue;

        }


        for (
            const file
            of input.files
        ) {

            const nombreServidor =
                `foto_${contador++}`;


            formData.append(
                nombreServidor,
                file
            );


            resultado[
                grupo
            ].push({

                nombre:
                    file.name,

                archivo:
                    nombreServidor

            });

        }

    }


    return resultado;

}


/* =========================================================
   FOTOS INSPECCIONES
========================================================= */

function prepararFotosInspecciones(
    formData
) {

    inspecciones.forEach(
        (inspeccion, i) => {

            if (
                !Array.isArray(
                    inspeccion.fotos
                ) ||
                inspeccion.fotos.length === 0
            ) {

                return;

            }


            const fotosServidor =
                [];


            inspeccion.fotos.forEach(
                (file, j) => {

                    const nombreServidor =
                        `inspeccion_${i}_${j}`;


                    formData.append(
                        nombreServidor,
                        file
                    );


                    fotosServidor.push({

                        nombre:
                            file.name,

                        archivo:
                            nombreServidor

                    });

                }
            );


            inspeccion.fotosServidor =
                fotosServidor;

        }
    );

}


/* =========================================================
   GENERAR PDF
========================================================= */

async function enviar() {

    try {

        /* =========================
           VALIDAR PROYECTO
        ========================= */

        if (!proyectoId) {

            alert(
                "No se ha seleccionado ningún proyecto."
            );

            return;

        }


        /* =========================
           PREPARAR ARCHIVOS
        ========================= */

        const formData =
            new FormData();


        const fotosChecklist =
            await obtenerFotosChecklist(
                formData
            );


        prepararFotosInspecciones(
            formData
        );


        /* =========================
           RECOGER DATOS
        ========================= */

        const data =
            obtenerDatosFormulario();


        data.fotosChecklist =
            fotosChecklist;


        /* =========================
           GUARDAR / ACTUALIZAR
        ========================= */

        /*
         * Si es nuevo:
         *
         * POST
         * → crea formulario
         * → obtiene formularioId
         *
         * Si existe:
         *
         * PUT
         * → actualiza el mismo.
         */

        await guardarFormulario(
            data,
            "completado"
        );


        /* =========================
           DATOS PARA EL PDF
        ========================= */

        formData.append(
            "datos",
            JSON.stringify(
                data
            )
        );


        /* =========================
           GENERAR PDF
        ========================= */

        const respuesta =
            await fetch(
                "/api/coordinador/generate-pdf",
                {
                    method:
                        "POST",

                    credentials:
                        "include",

                    body:
                        formData
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error generando PDF"
            );

        }


        /* =========================
           DESCARGAR PDF
        ========================= */

        const blob =
            await respuesta.blob();


        const url =
            window.URL.createObjectURL(
                blob
            );


        const enlace =
            document.createElement(
                "a"
            );


        enlace.href =
            url;


        enlace.download =
            formularioId
                ? `informe-coordinacion-${formularioId}.pdf`
                : "informe-coordinacion.pdf";


        document.body.appendChild(
            enlace
        );


        enlace.click();


        enlace.remove();


        window.URL.revokeObjectURL(
            url
        );


    } catch (error) {

        console.error(
            "Error guardando/generando PDF:",
            error
        );


        alert(
            error.message ||
            "Error generando PDF"
        );

    }

}


/* =========================================================
   EXPORTAR FUNCIONES AL HTML
========================================================= */

window.enviar =
    enviar;