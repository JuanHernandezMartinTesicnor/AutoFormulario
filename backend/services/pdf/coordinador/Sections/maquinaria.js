function renderMaquinaria(html, data) {

    const maquinariaValida =
        (data.maquinaria || []).filter(m =>
            (m.equipo || "").trim() ||
            (m.matricula || "").trim() ||
            (m.empresaTitular || "").trim()
        );

    let maquinariaHtml = "";

    if (maquinariaValida.length > 0) {

        maquinariaHtml = `

        <h2>Maquinaria</h2>

        <table class="tabla">

            <tr>

                <th>Equipo</th>

                <th>Matrícula</th>

                <th>Empresa titular</th>

            </tr>

            ${maquinariaValida.map(m => `

                <tr>

                    <td>${m.equipo || ""}</td>

                    <td>${m.matricula || ""}</td>

                    <td>${m.empresaTitular || ""}</td>

                </tr>

            `).join("")}

        </table>

        `;

    }

    return html.replace(
        "{{maquinariaSection}}",
        maquinariaHtml
    );

}

module.exports = {
    renderMaquinaria
};