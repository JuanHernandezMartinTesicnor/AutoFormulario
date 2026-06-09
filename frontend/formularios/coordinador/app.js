let personal = [];
let maquinaria = [];
let empresas = [];
let inspecciones = [];

function addPersonal() {

    personal.push({
        empresa: "",
        trabajador: "",
        cargo: ""
    });

    renderPersonal();
}


function addMaquinaria() {

    maquinaria.push({
        equipo: "",
        matricula: ""
    });

    renderMaquinaria();
}


function addEmpresa() {

    empresas.push({
        nombre: "",
        observaciones: ""
    });

    renderEmpresas();
}


function addInspeccion() {

    inspecciones.push({
        fase: "",
        observaciones: "",
        fotos: []
    });

    renderInspecciones();
}


function renderPersonal() {

    const container =
        document.getElementById("personalContainer");

    container.innerHTML = "";

    personal.forEach((p, index) => {

        container.innerHTML += `
            <div class="dynamic-item">

                <input
                    type="text"
                    placeholder="Empresa"
                    value="${p.empresa}"
                    onchange="personal[${index}].empresa=this.value">

                <input
                    type="text"
                    placeholder="Trabajador"
                    value="${p.trabajador}"
                    onchange="personal[${index}].trabajador=this.value">

                <input
                    type="text"
                    placeholder="Cargo"
                    value="${p.cargo}"
                    onchange="personal[${index}].cargo=this.value">

                <button
                    class="delete-btn"
                    onclick="removePersonal(${index})">
                    Eliminar
                </button>

            </div>
        `;
    });
}


function removePersonal(index) {

    personal.splice(index, 1);

    renderPersonal();
}

function renderMaquinaria() {

    const container =
        document.getElementById("maquinariaContainer");

    container.innerHTML = "";

    maquinaria.forEach((m, index) => {

        container.innerHTML += `
            <div class="dynamic-item">

                <input
                    type="text"
                    placeholder="Equipo"
                    value="${m.equipo}"
                    onchange="maquinaria[${index}].equipo=this.value">

                <input
                    type="text"
                    placeholder="Matrícula"
                    value="${m.matricula}"
                    onchange="maquinaria[${index}].matricula=this.value">

                <button
                    class="delete-btn"
                    onclick="removeMaquinaria(${index})">
                    Eliminar
                </button>

            </div>
        `;
    });
}

function removeMaquinaria(index) {

    maquinaria.splice(index, 1);

    renderMaquinaria();
}


function renderEmpresas() {

    const container =
        document.getElementById("empresaContainer");

    container.innerHTML = "";

    empresas.forEach((e, index) => {

        container.innerHTML += `
            <div class="dynamic-item">

                <input
                    type="text"
                    placeholder="Empresa"
                    value="${e.nombre}"
                    onchange="empresas[${index}].nombre=this.value">

                <textarea
                    placeholder="Observaciones"
                    onchange="empresas[${index}].observaciones=this.value">${e.observaciones}</textarea>

                <button
                    class="delete-btn"
                    onclick="removeEmpresa(${index})">
                    Eliminar
                </button>

            </div>
        `;
    });
}

function removeEmpresa(index) {

    empresas.splice(index, 1);

    renderEmpresas();
}


function renderInspecciones() {

    const container =
        document.getElementById("inspeccionesContainer");

    container.innerHTML = "";

    inspecciones.forEach((i, index) => {

        container.innerHTML += `
            <div class="inspeccion-item">

                <label>Fase de trabajo</label>

                <input
                    type="text"
                    value="${i.fase}"
                    onchange="inspecciones[${index}].fase=this.value">

                <label>Observaciones</label>

                <textarea
                    onchange="inspecciones[${index}].observaciones=this.value">${i.observaciones}</textarea>

                <label>Fotografías</label>

                <input
                    type="file"
                    multiple>

                <button
                    class="delete-btn"
                    onclick="removeInspeccion(${index})">
                    Eliminar inspección
                </button>

            </div>
        `;
    });
}

function removeInspeccion(index) {

    inspecciones.splice(index, 1);

    renderInspecciones();
}


async function enviar() {

    const data = {

        fecha: document.getElementById("fecha").value,
        obra: document.getElementById("obra").value,
        cliente: document.getElementById("cliente").value,
        alcance: document.getElementById("alcance").value,

        realizadoPor:
            document.getElementById("realizadoPor").value,

        revisadoPor:
            document.getElementById("revisadoPor").value,

        personal,
        maquinaria,
        empresas,
        inspecciones
    };

    console.log(data);

    const res = await fetch(
        "/api/coordinador/generate-pdf",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );

    if (!res.ok) {

        alert("Error generando PDF");

        return;
    }

    const blob = await res.blob();

    const url =
        window.URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "InformeCoordinacion.pdf";

    a.click();
}


const checklist = {
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



function renderChecklist() {

    const container =
        document.getElementById("checklistContainer");

    container.innerHTML = "";

    Object.entries(checklist).forEach(([grupo, items]) => {

        const section =
            document.createElement("div");

        section.className = "check-section";

        section.innerHTML =
            `<h4>${grupo}</h4>`;

        items.forEach((texto, index) => {

            section.innerHTML += `

            <div class="check-row">

                <span>${texto}</span>

                <select
                    id="${grupo}_${index}"
                >
                    <option value="SI">SI</option>
                    <option value="NO">NO</option>
                    <option value="NA">NA</option>
                </select>

            </div>
            `;
        });

        container.appendChild(section);
    });
}


function obtenerChecklist() {

    const resultado = {};

    Object.entries(checklist).forEach(([grupo, items]) => {

        resultado[grupo] = [];

        items.forEach((texto, index) => {

            resultado[grupo].push({
                texto,
                valor: document.getElementById(
                    `${grupo}_${index}`
                ).value
            });

        });
    });

    return resultado;
}


renderChecklist();