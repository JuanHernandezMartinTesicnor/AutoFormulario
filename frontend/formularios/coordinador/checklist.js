export const checklist = {

    controlBasico: [
        "Presencia del Recurso Preventivo",
        "Listado de trabajadores en las instalaciones",
        "Existencia de Plan de Seguridad y Salud",
        "Botiquín de primeros auxilios",
        "Medios de lucha contra incendios",
        "Personal formado para manejo de equipos",
        "Cobertura de telefonía móvil",
        "Orden y limpieza de la zona",
        "Señalización y delimitación de trabajos",
        "Uso correcto de EPIs"
    ],

    herramientas: [
        "Herramientas manuales en buen estado",
        "Máquinas y herramientas en buen estado"
    ],

    escaleras: [
        "Escaleras de madera no pintadas",
        "Peldaños en buen estado",
        "Zapatas antideslizantes",
        "Escalera fijada correctamente",
        "Uso correcto de la escalera"
    ],

    electrico: [
        "Marcado CE",
        "Manual de uso",
        "Declaración de conformidad",
        "Certificado instalación BT"
    ],

    sistemaElectrico: [
        "Distancias de seguridad",
        "Cinco reglas de oro",
        "Protección de zanjas y canaletas"
    ],

    izado: [
        "Plan de izado",
        "Certificados de equipos",
        "Anemómetro operativo",
        "Certificación de útiles",
        "Reunión previa",
        "Coordinación CAE",
        "Zona de exclusión señalizada"
    ],

    logistica: [
        "Elementos de izado certificados",
        "Cadenas en buen estado",
        "Puntos de amarre correctos",
        "Comunicación entre operarios",
        "Zona de carga señalizada",
        "Inspecciones registradas",
        "Carga correctamente distribuida",
        "Uso de EPIs"
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

        items.forEach((texto, index) => {

            content.innerHTML += `
                <div class="check-row">

                    <span>${texto}</span>

                    <select id="${grupo}_${index}">
                        <option value="SI">SI</option>
                        <option value="NO">NO</option>
                        <option value="NA">NA</option>
                    </select>

                </div>
            `;
        });

        const header =
            section.querySelector(".check-header");

        header.onclick = () => {

            content.classList.toggle("collapsed");

            const arrow =
                header.querySelector(".toggle");

            arrow.textContent =
                content.classList.contains("collapsed")
                    ? "►"
                    : "▼";
        };

        container.appendChild(section);

        first = false;
    });
}

export function obtenerChecklist() {

    const resultado = {};

    Object.entries(checklist).forEach(([grupo, items]) => {

        resultado[grupo] = [];

        items.forEach((texto, index) => {

            const select =
                document.getElementById(
                    `${grupo}_${index}`
                );

            resultado[grupo].push({
                texto,
                valor: select ? select.value : "NA"
            });

        });
    });

    return resultado;
}