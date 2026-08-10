/**
 * Generador de textos para los puntos del checklist.
 *
 * Este módulo se encarga de combinar:
 * - El título del punto
 * - El resultado del checklist (SI / NO)
 * - El texto base definido en checklistTexts.js
 * - La observación introducida por el técnico
 *
 * Posteriormente esta función podrá sustituirse por una llamada
 * a un modelo de IA sin tener que modificar renderChecklist().
 */

async function generarTextoChecklist({
    titulo,
    valor,
    textoBase,
    observacion
}) {

    const observacionLimpia =
        typeof observacion === "string"
            ? observacion.trim()
            : "";

    const textoBaseLimpio =
        typeof textoBase === "string"
            ? textoBase.trim()
            : "";

    /*
     * Si no hay observación del técnico,
     * utilizamos directamente el texto estándar.
     */
    if (!observacionLimpia) {
        return textoBaseLimpio;
    }

    /*
     * Por ahora no hacemos todavía la llamada a IA.
     *
     * Construimos una redacción combinada para poder
     * probar todo el flujo del PDF antes de conectar
     * el servicio de IA.
     */

    if (!textoBaseLimpio) {
        return observacionLimpia;
    }

    return `${textoBaseLimpio} ${observacionLimpia}`;
}

module.exports = {
    generarTextoChecklist
};