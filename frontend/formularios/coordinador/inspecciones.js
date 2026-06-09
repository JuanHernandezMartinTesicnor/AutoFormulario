import { inspecciones } from "./state.js";

export function addInspeccion() {

    inspecciones.push({
        fase: "",
        observaciones: "",
        fotos: []
    });

    renderInspecciones();
}

export function renderInspecciones() {

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

export function guardarFotos(event, index) {

    inspecciones[index].fotos =
        [...event.target.files];
}

export function removeInspeccion(index) {

    inspecciones.splice(index, 1);

    renderInspecciones();
}