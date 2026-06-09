let personal = [];
let maquinaria = [];
let empresas = [];
let inspecciones = [];

/* =========================
   CHECKLIST
========================= */

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

/* =========================
   PERSONAL
========================= */

function addPersonal() {

    personal.push({
        empresa: "",
        trabajador: "",
        cargo: ""
    });

    renderPersonal();
}

function renderPersonal() {

    const container =
        document.getElementById("personalContainer");

    container.innerHTML = "";

    personal.forEach((item, index) => {

        const div =
            document.createElement("div");

        div.className = "item-card";

        div.innerHTML = `
            <input
                placeholder="Empresa"
                value="${item.empresa}"
                onchange="personal[${index}].empresa=this.value">

            <input
                placeholder="Trabajador"
                value="${item.trabajador}"
                onchange="personal[${index}].trabajador=this.value">

            <input
                placeholder="Cargo"
                value="${item.cargo}"
                onchange="personal[${index}].cargo=this.value">

            <button type="button"
                onclick="removePersonal(${index})">
                Eliminar
            </button>
        `;

        container.appendChild(div);
    });
}

function removePersonal(index) {

    personal.splice(index, 1);

    renderPersonal();
}

/* =========================
   MAQUINARIA
========================= */

function addMaquinaria() {

    maquinaria.push({
        equipo: "",
        matricula: ""
    });

    renderMaquinaria();
}

function renderMaquinaria() {

    const container =
        document.getElementById("maquinariaContainer");

    container.innerHTML = "";

    maquinaria.forEach((item, index) => {

        const div =
            document.createElement("div");

        div.className = "item-card";

        div.innerHTML = `
            <input
                placeholder="Equipo"
                value="${item.equipo}"
                onchange="maquinaria[${index}].equipo=this.value">

            <input
                placeholder="Matrícula"
                value="${item.matricula}"
                onchange="maquinaria[${index}].matricula=this.value">

            <button type="button"
                onclick="removeMaquinaria(${index})">
                Eliminar
            </button>
        `;

        container.appendChild(div);
    });
}

function removeMaquinaria(index) {

    maquinaria.splice(index, 1);

    renderMaquinaria();
}

/* =========================
   EMPRESAS
========================= */

function addEmpresa() {

    empresas.push({
        nombre: "",
        observaciones: ""
    });

    renderEmpresas();
}

function renderEmpresas() {

    const container =
        document.getElementById("empresaContainer");

    container.innerHTML = "";

    empresas.forEach((item, index) => {

        const div =
            document.createElement("div");

        div.className = "item-card";

        div.innerHTML = `
            <input
                placeholder="Empresa"
                value="${item.nombre}"
                onchange="empresas[${index}].nombre=this.value">

            <textarea
                placeholder="Observaciones"
                onchange="empresas[${index}].observaciones=this.value">${item.observaciones}</textarea>

            <button type="button"
                onclick="removeEmpresa(${index})">
                Eliminar
            </button>
        `;

        container.appendChild(div);
    });
}

function removeEmpresa(index) {

    empresas.splice(index, 1);

    renderEmpresas();
}

/* =========================
   INSPECCIONES
========================= */

function addInspeccion() {

    inspecciones.push({
        fase: "",
        observaciones: "",
        fotos: []
    });

    renderInspecciones();
}

function renderInspecciones() {

    const container =
        document.getElementById("inspeccionesContainer");

    container.innerHTML = "";

    inspecciones.forEach((item, index) => {

        const div =
            document.createElement("div");

        div.className = "item-card";

        div.innerHTML = `
            <input
                placeholder="Fase"
                value="${item.fase}"
                onchange="inspecciones[${index}].fase=this.value">

            <textarea
                placeholder="Observaciones"
                onchange="inspecciones[${index}].observaciones=this.value">${item.observaciones}</textarea>

            <input
                type="file"
                multiple
                onchange="guardarFotos(event, ${index})">

            <button type="button"
                onclick="removeInspeccion(${index})">
                Eliminar
            </button>
        `;

        container.appendChild(div);
    });
}

function guardarFotos(event, index) {

    inspecciones[index].fotos =
        [...event.target.files];
}

function removeInspeccion(index) {

    inspecciones.splice(index, 1);

    renderInspecciones();
}

/* =========================
   CHECKLIST DINÁMICO
========================= */

function formatTitulo(texto) {

    return texto
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, c => c.toUpperCase());
}

function renderChecklist() {

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

function obtenerChecklist() {

    const resultado = {};

    Object.entries(checklist).forEach(([grupo, items]) => {

        resultado[grupo] = [];

        items.forEach((texto, index) => {

            resultado[grupo].push({
                texto,
                valor:
                    document.getElementById(
                        `${grupo}_${index}`
                    ).value
            });

        });
    });

    return resultado;
}

/* =========================
   ENVÍO
========================= */

async function enviar() {

    const firmaBase64 =
        canvas.toDataURL("image/png");

    const data = {

        fecha:
            document.getElementById("fecha").value,

        obra:
            document.getElementById("obra").value,

        cliente:
            document.getElementById("cliente").value,

        alcance:
            document.getElementById("alcance").value,

        firma: canvas.toDataURL("image/png"),

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

        a.click();

        window.URL.revokeObjectURL(url);

    } catch (error) {

        console.error(error);

        alert(
            "Error generando PDF"
        );
    }
}

/* =========================
   INICIO
========================= */

renderChecklist();


/* =========================
   FIRMA
========================= */

const canvas =
    document.getElementById("firmaCanvas");

const ctx =
    canvas.getContext("2d");

let dibujando = false;

ctx.lineWidth = 2;
ctx.lineCap = "round";
ctx.strokeStyle = "#000";

function getPos(event) {

    const rect =
        canvas.getBoundingClientRect();

    return {

        x:
            (event.clientX || event.touches[0].clientX)
            - rect.left,

        y:
            (event.clientY || event.touches[0].clientY)
            - rect.top
    };
}


function startDraw(event) {

    dibujando = true;

    const pos = getPos(event);

    ctx.beginPath();

    ctx.moveTo(
        pos.x,
        pos.y
    );
}


function draw(event) {

    if (!dibujando) return;

    event.preventDefault();

    const pos = getPos(event);

    ctx.lineTo(
        pos.x,
        pos.y
    );

    ctx.stroke();
}


function stopDraw() {

    dibujando = false;

    ctx.beginPath();
}


function limpiarFirma() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}


canvas.addEventListener(
    "mousedown",
    startDraw
);

canvas.addEventListener(
    "mousemove",
    draw
);

canvas.addEventListener(
    "mouseup",
    stopDraw
);

canvas.addEventListener(
    "mouseleave",
    stopDraw
);


canvas.addEventListener(
    "touchstart",
    startDraw
);

canvas.addEventListener(
    "touchmove",
    draw
);

canvas.addEventListener(
    "touchend",
    stopDraw
);