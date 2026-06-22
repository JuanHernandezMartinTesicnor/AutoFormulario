import { empresas } from "./state.js";

export function addEmpresa() {

    empresas.push({
        nombre: "",
        observaciones: "",
        principal: false
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

            <label class="empresa-principal">

                <input
                    type="checkbox"
                    ${item.principal ? "checked" : ""}
                    onchange="setEmpresaPrincipal(${index}, this.checked)">

                Contrata principal

            </label>

            <button
                type="button"
                onclick="removeEmpresa(${index})">
                Eliminar
            </button>

        `;

        container.appendChild(div);
    });
}

export function setEmpresaPrincipal(index, checked) {

    empresas.forEach((empresa, i) => {

        empresa.principal =
            checked && i === index;

    });

    renderEmpresas();
}

export function removeEmpresa(index) {

    empresas.splice(index, 1);

    renderEmpresas();
}

window.empresas = empresas;
window.removeEmpresa = removeEmpresa;
window.setEmpresaPrincipal = setEmpresaPrincipal;