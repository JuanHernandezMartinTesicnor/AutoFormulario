function fechaActual() {
    const partes = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Madrid",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date());

    const valores = Object.fromEntries(
        partes.map(parte => [parte.type, parte.value])
    );

    return `${valores.year}-${valores.month}-${valores.day}`;
}

function aplicarCabeceraProyecto(datos, proyecto) {
    return {
        ...datos,
        fecha: fechaActual(),
        obra: proyecto.nombre || "",
        cliente: proyecto.cliente || "",
        direccion: proyecto.direccion || ""
    };
}

module.exports = {
    aplicarCabeceraProyecto
};
