const fs = require("fs");
const { generarTextoChecklist } = require("./checklistAI");

async function renderChecklist(
    html,
    data,
    files,
    textosChecklist,
    formatearTitulo
) {

    let checklistHtml = "";

    if (Array.isArray(data.checklist)) {

        for (const grupo of data.checklist) {

            const itemsValidos =
                grupo.items.filter(
                    item => item.valor !== "NA"
                );

            if (!itemsValidos.length)
                continue;

            checklistHtml += `

                <h3>
                    ${formatearTitulo(grupo.categoria)}
                </h3>

            `;

            for (const item of itemsValidos) {

                const textoBase =
                    textosChecklist[item.id]?.[item.valor] || "";

                const descripcion =
                    await generarTextoChecklist({
                        titulo: item.titulo,
                        valor: item.valor,
                        textoBase,
                        observacion: item.comentario
                    });

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

                /*
                 * De momento mantenemos las observaciones
                 * originales visibles para comprobar el funcionamiento.
                 *
                 * Cuando conectemos la IA definitivamente,
                 * podremos decidir si eliminamos este bloque
                 * y dejamos únicamente el texto generado.
                 */

                if (
                    item.comentario &&
                    item.comentario.trim()
                ) {

                    checklistHtml += `

                        <p>

                            <strong>
                                Observaciones:
                            </strong>

                            ${item.comentario}

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