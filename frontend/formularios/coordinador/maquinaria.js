import { maquinaria } from "./state.js";

export function addMaquinaria() {

    maquinaria.push({
        equipo: "",
        matricula: ""
    });

    renderMaquinaria();
}


export function renderMaquinaria() {

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


export function removeMaquinaria(index) {

    maquinaria.splice(index, 1);

    renderMaquinaria();
}