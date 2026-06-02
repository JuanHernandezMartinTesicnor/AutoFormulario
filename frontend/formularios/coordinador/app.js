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