function renderResumen(html, data) {

    let total = 0;
    let incumplimientos = 0;
    let incumplimientosGraves = 0;

    if (Array.isArray(data.checklist)) {

        data.checklist.forEach(grupo => {

            grupo.items.forEach(item => {

                if (item.valor === "NA")
                    return;

                total++;

                if (item.valor === "NO") {

                    incumplimientos++;

                    if (item.gravedad === "GRAVE") {

                        incumplimientosGraves++;

                    }

                }

            });

        });

    }

    const cumplimiento =
        total > 0
            ? Math.round(
                ((total - incumplimientos) / total) * 100
            )
            : 100;

    const resumenHtml = `

        <div class="resumen">

            <h2>Resumen Ejecutivo</h2>

            <p>

                Aspectos evaluados:
                ${total}

            </p>

            <p>

                Incumplimientos detectados:
                ${incumplimientos}

            </p>

            <p>

                Incumplimientos graves:
                ${incumplimientosGraves}

            </p>

            <p>

                Índice de cumplimiento:
                ${cumplimiento}%

            </p>

        </div>

    `;

    return html.replace(
        /{{resumen}}/g,
        resumenHtml
    );

}

module.exports = {
    renderResumen
};