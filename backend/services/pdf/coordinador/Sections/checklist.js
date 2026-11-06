const fs = require("fs");
const { generarTextosChecklist } = require("./checklistAI");

async function renderChecklist(
    html,
    data,
    files,
    textosChecklist,
    formatearTitulo
) {

    let checklistHtml = "";
    const elementosChecklist = [];
    const indicesChecklist = [];

    if (Array.isArray(data.checklist)) {
        data.checklist.forEach(grupo => {
            const indicesGrupo = [];

            for (const item of grupo.items) {
                if (item.valor === "NA") {
                    indicesGrupo.push(null);
                    continue;
                }

                const indice = elementosChecklist.length;
                indicesGrupo.push(indice);
                elementosChecklist.push({
                    indice,
                    titulo: item.titulo,
                    valor: item.valor,
                    textoBase: textosChecklist[item.id]?.[item.valor] || "",
                    observacion: item.comentario
                });
            }

            indicesChecklist.push(indicesGrupo);
        });
    }

    const textosGenerados =
        await generarTextosChecklist(elementosChecklist);

    if (Array.isArray(data.checklist)) {
        for (const [indiceGrupo, grupo] of data.checklist.entries()) {
            const itemsValidos = grupo.items
                .map((item, indiceItem) => ({
                    item,
                    indice: indicesChecklist[indiceGrupo][indiceItem]
                }))
                .filter(({ indice }) => indice !== null);

            if (!itemsValidos.length)
                continue;

            checklistHtml += `

                <h3>
                    ${formatearTitulo(grupo.categoria)}
                </h3>

            `;

            for (const { item, indice } of itemsValidos) {
                const descripcion = textosGenerados.get(indice) || "";

                checklistHtml += `

                    <div class="check-item">

                        <h4>
                            ${item.titulo}
                        </h4>

                `;

                if (descripcion) {

                    checklistHtml += `

                        <p>
                            ${descripcion}
                        </p>

                    `;

                }

                if (
                    item.responsable &&
                    item.responsable.trim()
                ) {

                    checklistHtml += `

                        <p>

                            <strong>
                                Responsable:
                            </strong>

                            ${item.responsable}

                        </p>

                    `;

                }

                if (
                    item.fechaLimite &&
                    item.fechaLimite.trim()
                ) {

                    checklistHtml += `

                        <p>

                            <strong>
                                Fecha límite:
                            </strong>

                            ${item.fechaLimite}

                        </p>

                    `;

                }

                checklistHtml += `

                    </div>

                    <hr>

                `;

            }

            const fotosGrupo =
                data.fotosChecklist?.[
                    grupo.categoria
                ] || [];

            if (fotosGrupo.length) {

                checklistHtml += `

                    <h4>
                        Evidencias fotográficas
                    </h4>

                    <div class="galeria-fotos">

                `;

                fotosGrupo.forEach(foto => {

                    const archivo =
                        files.find(
                            f =>
                                f.fieldname === foto.archivo
                        );

                    if (!archivo)
                        return;

                    const imagenBase64 =
                        fs.readFileSync(
                            archivo.path,
                            "base64"
                        );

                    checklistHtml += `

                        <img

                            src="data:${archivo.mimetype};base64,${imagenBase64}"

                            style="

                                width:220px;

                                margin:8px;

                                border:1px solid #ccc;

                                border-radius:4px;

                            "

                        >

                    `;

                });

                checklistHtml += `

                    </div>

                    <hr>

                `;

            }

        }

    }

    return html.replace(
        /{{checklist}}/g,
        checklistHtml
    );
}

module.exports = {
    renderChecklist
};