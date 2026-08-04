import { empresas } from "./state.js";
import {

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

                ${item.nivel !== "principal" && item.nivel !== "" ? `

                    <label>

                        Contratista

                    </label>

                    <input
                        placeholder="Contratista"
                        value="${item.contratista || ""}"
                        onchange="empresas[${index}].contratista=this.value">

                ` : ""}

                ${item.nivel === "principal" ? `

                    <div class="firma-empresa">

                        <label>Firma</label>

                        <canvas
                            id="firmaEmpresa${index}"
                            class="firma-canvas-empresa"
                            width="1"
                            height="140">
                        </canvas>

                        <div class="firma-botones">

                            <button
                                type="button"
                                onclick="limpiarFirma('firmaEmpresa${index}')">

                                Limpiar firma

                            </button>

                        </div>

                    </div>

                ` : ""}

            </div>

            <div class="empresa-acciones">

                <label>

                    Clasificación

                    <select
                        onchange="cambiarNivelEmpresa(${index}, this.value)">

                        <option value="">Seleccionar...</option>

                        <option value="principal"
                            ${item.nivel === "principal" ? "selected" : ""}>

                            Principal

                        </option>

                        <option value="nivel1"
                            ${item.nivel === "nivel1" ? "selected" : ""}>

                            Nivel 1

                        </option>

                        <option value="nivel2"
                            ${item.nivel === "nivel2" ? "selected" : ""}>

                            Nivel 2

                        </option>

                        <option value="nivel3"
                            ${item.nivel === "nivel3" ? "selected" : ""}>

                            Nivel 3

                        </option>

                    </select>

                </label>

                <label>

                    <input
                        type="checkbox"
                        ${item.autonomo ? "checked" : ""}
                        onchange="empresas[${index}].autonomo=this.checked">

                    Autónomo

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

    empresas.forEach((item, index) => {

        if (item.nivel === "principal") {

            initFirma(`firmaEmpresa${index}`);
            const canvas =
                document.getElementById(
                    `firmaEmpresa${index}`
                );

            canvas.addEventListener("mouseup", () => {

                empresas[index].firma =
                    getFirmaBase64(
                        `firmaEmpresa${index}`
                    );

            });

            canvas.addEventListener("touchend", () => {

                empresas[index].firma =
                    getFirmaBase64(
                        `firmaEmpresa${index}`
                    );

            });

            if (empresas[index].firma) {

                cargarFirma(

                    `firmaEmpresa${index}`,

                    empresas[index].firma

                );

            }
        }

    });

}

export function cambiarNivelEmpresa(index, nivel) {

    empresas[index].nivel = nivel;

    renderEmpresas();

}

export function removeEmpresa(index) {

    empresas.splice(index, 1);

    renderEmpresas();

}

window.empresas = empresas;
window.removeEmpresa = removeEmpresa;
window.cambiarNivelEmpresa = cambiarNivelEmpresa;
window.limpiarFirma = limpiarFirma;