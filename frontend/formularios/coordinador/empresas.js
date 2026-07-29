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

            <div class="empresa-card-content">

                <div class="empresa-datos">

                    <input
                        placeholder="Empresa"
                        value="${item.nombre}"
                        onchange="empresas[${index}].nombre=this.value">

                    <textarea
                        rows="3"
                        placeholder="Observaciones"
                        onchange="empresas[${index}].observaciones=this.value">${item.observaciones}</textarea>

                </div>

                <div class="empresa-acciones">

                    <label class="principal-check">

                        <input
                            type="radio"
                            name="contrataPrincipal"
                            ${item.principal ? "checked" : ""}
                            onchange="setEmpresaPrincipal(${index})">

                        Principal

                    </label>

                    <button
                        type="button"
                        onclick="removeEmpresa(${index})">

                        Eliminar

                    </button>

                </div>

            </div>

            `;

        container.appendChild(div);
    });
}

export function setEmpresaPrincipal(index) {

    empresas.forEach((empresa, i) => {

        empresa.principal = i === index;

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