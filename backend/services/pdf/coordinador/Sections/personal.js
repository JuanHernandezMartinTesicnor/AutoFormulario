function renderPersonal(html, data) {

    const personalValido =
        (data.personal || []).filter(p =>
            (p.empresa || "").trim() ||
            (p.trabajador || "").trim() ||
            (p.cargo || "").trim()
        );

    let personalHtml = "";

    if (personalValido.length > 0) {

        personalHtml = `

        <h2>Personal presente</h2>

        <table class="tabla">

            <tr>

                <th>Empresa</th>

                <th>Trabajador</th>

                <th>Cargo</th>

            </tr>

            ${personalValido.map(p => `

                <tr>

                    <td>${p.empresa || ""}</td>

                    <td>${p.trabajador || ""}</td>

                    <td>${p.cargo || ""}</td>

                </tr>

            `).join("")}

        </table>

        `;

    }

    return html.replace(
        "{{personalSection}}",
        personalHtml
    );

}

module.exports = {
    renderPersonal
};