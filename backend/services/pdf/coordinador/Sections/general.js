function renderGeneral(html, data) {

    return html

        .replace(
            /{{fecha}}/g,
            data.fecha || ""
        )

        .replace(
            /{{obra}}/g,
            data.obra || ""
        )

        .replace(
            /{{cliente}}/g,
            data.cliente || ""
        )

        .replace(
            /{{direccion}}/g,
            data.direccion || ""
        )

        .replace(
            /{{tecnicoResponsable}}/g,
            data.tecnicoResponsable || ""
        )

        .replace(
            /{{coordinador}}/g,
            data.coordinador || ""
        );

}

module.exports = {
    renderGeneral
};