export const checklist = {

    documentacion: [

        {
            id: "planSeguridad",
            titulo: "Plan de Seguridad y Salud aprobado",
            gravedad: "MODERADA"
        },

        {
            id: "libroIncidencias",
            titulo: "Libro de Incidencias",
            gravedad: "MODERADA"
        },

        {
            id: "aperturaCentro",
            titulo: "Comunicación Apertura Centro Trabajo",
            gravedad: "MODERADA"
        }
    ],

    recursosPreventivos: [

        {
            id: "recursoPreventivo",
            titulo: "Presencia de Recurso Preventivo",
            gravedad: "GRAVE"
        },

        {
            id: "formacionPreventiva",
            titulo: "Formación Preventiva",
            gravedad: "MODERADA"
        }
    ],

    ordenLimpieza: [

        {
            id: "estadoGeneral",
            titulo: "Estado General",
            gravedad: "MODERADA"
        },

        {
            id: "gestionResiduos",
            titulo: "Gestión de Residuos",
            gravedad: "MODERADA"
        }
    ],

    delimitacionSenalizacion: [

        {
            id: "vallado",
            titulo: "Vallado",
            gravedad: "MODERADA"
        },

        {
            id: "senalizacion",
            titulo: "Señalización",
            gravedad: "MODERADA"
        }
    ],

    epis: [

        {
            id: "casco",
            titulo: "Casco",
            gravedad: "GRAVE"
        },

        {
            id: "calzado",
            titulo: "Calzado de Seguridad",
            gravedad: "MODERADA"
        },

        {
            id: "arnes",
            titulo: "Arnés Anticaídas",
            gravedad: "GRAVE"
        }
    ],

    trabajosAltura: [

        {
            id: "proteccionesColectivas",
            titulo: "Protecciones Colectivas",
            gravedad: "GRAVE"
        },

        {
            id: "escaleras",
            titulo: "Escaleras",
            gravedad: "MODERADA"
        }
    ],

    maquinaria: [

        {
            id: "marcadoCE",
            titulo: "Marcado CE",
            gravedad: "MODERADA"
        },

        {
            id: "estadoMaquinaria",
            titulo: "Estado General",
            gravedad: "MODERADA"
        }
    ],

    electricidad: [

        {
            id: "cuadrosElectricos",
            titulo: "Cuadros Eléctricos",
            gravedad: "GRAVE"
        },

        {
            id: "cableado",
            titulo: "Cableado",
            gravedad: "GRAVE"
        }
    ],

    excavaciones: [

        {
            id: "estabilidad",
            titulo: "Estabilidad",
            gravedad: "GRAVE"
        },

        {
            id: "accesos",
            titulo: "Accesos",
            gravedad: "GRAVE"
        }
    ],

    izados: [

        {
            id: "planIzado",
            titulo: "Plan de Izado",
            gravedad: "GRAVE"
        },

        {
            id: "eslingas",
            titulo: "Eslingas y Accesorios",
            gravedad: "GRAVE"
        },

        {
            id: "zonaExclusion",
            titulo: "Zona de Exclusión",
            gravedad: "GRAVE"
        }
    ],

    emergencias: [

        {
            id: "botiquin",
            titulo: "Botiquín",
            gravedad: "MODERADA"
        },

        {
            id: "extintores",
            titulo: "Extintores",
            gravedad: "MODERADA"
        }
    ]
};

export function formatTitulo(texto) {

    return texto
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, c => c.toUpperCase());
}

export function renderChecklist() {

    const container =
        document.getElementById("checklistContainer");

    if (!container) return;

    container.innerHTML = "";

    let first = true;

    Object.entries(checklist).forEach(([grupo, items]) => {

        const section =
            document.createElement("div");

        section.className = "check-section";

        section.innerHTML = `
            <div class="check-header">
                ${formatTitulo(grupo)}
                <span class="toggle">
                    ${first ? "▼" : "►"}
                </span>
            </div>

            <div class="check-content">
            </div>
        `;

        const content =
            section.querySelector(".check-content");

        if (!first) {
            content.classList.add("collapsed");
        }

        items.forEach(item => {

            content.innerHTML += `

                <div class="check-row">

                    <div class="check-info">

                        <strong>${item.titulo}</strong>

                        <small>
                            Gravedad: ${item.gravedad}
                        </small>

                    </div>

                    <select
                        id="${item.id}"
                        onchange="toggleDetalle('${item.id}')">

                        <option value="NA" selected>
                            NA
                        </option>

                        <option value="SI">
                            SI
                        </option>

                        <option value="NO">
                            NO
                        </option>

                        <option value="OBS">
                            OBS
                        </option>

                    </select>

                </div>

                <div
                    id="${item.id}_detalle"
                    class="detalle-check oculto">

                    <textarea
                        id="${item.id}_comentario"
                        placeholder="Observaciones">
                    </textarea>

                    <input
                        type="text"
                        id="${item.id}_responsable"
                        placeholder="Responsable">

                    <input
                        type="date"
                        id="${item.id}_fechaLimite">

                </div>

            `;
        });

        content.innerHTML += `

        <div class="categoria-fotos">

            <label>
                Fotografías de ${formatTitulo(grupo)}
            </label>

            <input
                type="file"
                class="check-foto"
                data-grupo="${grupo}"
                id="${grupo}_fotos"
                multiple
                accept="image/*">

        </div>

        `;

        const header =
            section.querySelector(".check-header");

        header.onclick = () => {

            content.classList.toggle("collapsed");

            header.querySelector(".toggle").textContent =
                content.classList.contains("collapsed")
                    ? "►"
                    : "▼";
        };

        container.appendChild(section);

        first = false;
    });
}

export function obtenerChecklist() {

    const resultado = [];

    Object.entries(checklist).forEach(([grupo, items]) => {

        const fotosInput =
            document.getElementById(
                `${grupo}_fotos`
            );

        const fotos =
            fotosInput
                ? [...fotosInput.files]
                : [];

        resultado.push({

            categoria: grupo,

            fotos,

            items: items.map(item => ({

                id: item.id,

                titulo: item.titulo,

                gravedad: item.gravedad,

                valor:
                    document.getElementById(
                        item.id
                    )?.value || "NA",

                comentario:
                    document.getElementById(
                        `${item.id}_comentario`
                    )?.value || "",

                responsable:
                    document.getElementById(
                        `${item.id}_responsable`
                    )?.value || "",

                fechaLimite:
                    document.getElementById(
                        `${item.id}_fechaLimite`
                    )?.value || ""

            }))
        });
    });

    return resultado;
}

window.toggleDetalle = function (id) {

    const valor =
        document.getElementById(id).value;

    const detalle =
        document.getElementById(
            `${id}_detalle`
        );

    detalle.style.display =
        (valor === "NO" || valor === "OBS")
            ? "flex"
            : "none";
};