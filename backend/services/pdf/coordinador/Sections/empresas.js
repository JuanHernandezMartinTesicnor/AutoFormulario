function renderEmpresas(html, data) {

    const empresasValidas =
        (data.empresas || []).filter(e =>
            (e.nombre || "").trim()
        );

    let empresasHtml = "";

    if (empresasValidas.length > 0) {

        empresasHtml = `

        <h2>Empresas / Contratas</h2>

        <table class="tabla">

            <tr>

                <th>Empresa</th>

                <th>Clasificación</th>

                <th>Contratista</th>

                <th>Autónomo</th>

                <th>Observaciones</th>

            </tr>

        `;

        empresasValidas.forEach(e => {

            empresasHtml += `

            <tr>

                <td>${e.nombre || ""}</td>

                <td>${obtenerTextoNivel(e.nivel)}</td>

                <td>

                    ${
                        e.nivel === "principal"
                            ? "-"
                            : (e.contratista || "")
                    }

                </td>

                <td>

                    ${e.autonomo ? "Sí" : "No"}

                </td>

                <td>

                    ${e.observaciones || ""}

                </td>

            </tr>

            `;

        });

        empresasHtml += `

        </table>

        `;

        const principales =
            empresasValidas.filter(
                e =>
                    e.nivel === "principal"
            );

        if (principales.length > 0) {

            empresasHtml += `

            <h2>

                Firmas empresas principales

            </h2>

            `;

            principales.forEach(e => {

                empresasHtml += `

                <div class="firma-bloque">

                    <strong>

                        ${e.nombre}

                    </strong>

                    <br><br>

                    ${
                        e.firma

                        ? `<img
                                class="firma-img"
                                src="${e.firma}">`

                        : `<div
                                class="firma-vacia">
                           </div>`
                    }

                </div>

                `;

            });

        }

    }

    return html.replace(
        "{{empresaSection}}",
        empresasHtml
    );

}

function obtenerTextoNivel(nivel) {

    switch (nivel) {

        case "principal":
            return "Principal";

        case "nivel1":
            return "Nivel 1";

        case "nivel2":
            return "Nivel 2";

        case "nivel3":
            return "Nivel 3";

        default:
            return "";

    }

}

module.exports = {
    renderEmpresas
};