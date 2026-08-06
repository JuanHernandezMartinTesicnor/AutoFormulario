const fs = require("fs");

function renderInspecciones(html, data, files = []) {

    const inspeccionesValidas =
        (data.inspecciones || []).filter(i =>
            (i.fase || "").trim() ||
            (i.observaciones || "").trim()
        );

    let inspeccionesHtml = "";

    if (inspeccionesValidas.length > 0) {

        inspeccionesHtml = `

            <h2>Inspecciones realizadas</h2>

            <table class="tabla">

                <tr>

                    <th>Fase</th>

                    <th>Observaciones</th>

                </tr>

                ${inspeccionesValidas.map(i => `

                    <tr>

                        <td>${i.fase || ""}</td>

                        <td>${i.observaciones || ""}</td>

                    </tr>

                `).join("")}

            </table>

        `;

        // Fotografías de las inspecciones
        inspeccionesValidas.forEach((inspeccion, index) => {

            const fotos =
                inspeccion.fotosServidor || [];

            if (!fotos.length)
                return;

            inspeccionesHtml += `

        <h4>

            Fotografías de la inspección ${index + 1}

        </h4>

        <div class="galeria-fotos">

    `;

            fotos.forEach(foto => {

                const archivo =
                    files.find(
                        f => f.fieldname === foto.archivo
                    );

                if (!archivo)
                    return;

                const imagenBase64 =
                    fs.readFileSync(
                        archivo.path,
                        "base64"
                    );

                inspeccionesHtml += `

            <img
                src="data:${archivo.mimetype};base64,${imagenBase64}"
                style="
                    width:220px;
                    margin:8px;
                    border:1px solid #ccc;
                    border-radius:4px;
                ">

        `;

            });

            inspeccionesHtml += `

        </div>

    `;

        });

    }

    return html.replace(
        "{{inspeccionSection}}",
        inspeccionesHtml
    );

}

module.exports = {
    renderInspecciones
};