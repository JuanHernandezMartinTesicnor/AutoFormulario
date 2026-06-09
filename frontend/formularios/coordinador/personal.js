import { personal } from "./state.js";

export function addPersonal() {

    personal.push({
        empresa: "",
        trabajador: "",
        cargo: ""
    });

    renderPersonal();
}

export function renderPersonal() {

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

export function removePersonal(index) {

    personal.splice(index, 1);

    renderPersonal();
}

