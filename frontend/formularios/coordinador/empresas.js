import { empresas } from "./state.js";

export function addEmpresa() {

    empresas.push({
        nombre: "",
        observaciones: ""
    });

    renderEmpresas();
}

export function renderEmpresas() {

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

export function removeEmpresa(index) {

    empresas.splice(index, 1);

    renderEmpresas();
}