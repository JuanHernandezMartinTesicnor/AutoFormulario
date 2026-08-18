/**
 * Generador de textos para los puntos del checklist.
 *
 * Combina:
 * - Título del punto
 * - Resultado del checklist (SI / NO)
 * - Texto base definido en checklistTexts.js
 * - Observación introducida por el técnico
 *
 * El texto final es generado mediante IA.
 */

const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

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
     * Si no hay texto base ni observación,
     * no tiene sentido realizar una llamada a IA.
     */
    if (!textoBaseLimpio && !observacionLimpia) {
        return "";
    }

    /*
     * Si solamente tenemos texto base, de momento
     * podemos devolverlo directamente.
     *
     * Esto además evita llamadas innecesarias a la API.
     */
    if (!observacionLimpia) {
        return textoBaseLimpio;
    }

    const prompt = `
Eres un técnico especializado en coordinación de seguridad y salud en obras.

Debes redactar el texto final correspondiente a un punto de un checklist
que aparecerá directamente en un informe profesional de seguridad y salud.

DATOS DEL PUNTO

Título:
${titulo}

Resultado:
${valor}

Texto base:
${textoBaseLimpio}

Observación introducida por el técnico:
${observacionLimpia}

INSTRUCCIONES

1. Utiliza el texto base como referencia para conocer el significado
   de la comprobación y su resultado.

2. Integra la observación del técnico dentro del texto final de forma
   natural y profesional.

3. La observación del técnico debe aportar contexto o información
   concreta a la redacción.

4. No inventes datos, circunstancias, riesgos, medidas ni hechos que
   no aparezcan en la información proporcionada.

5. Mantén el sentido original del texto base.

6. El resultado debe estar redactado en español técnico y profesional,
   adecuado para un informe de coordinación de seguridad y salud.

7. No menciones que el texto ha sido generado mediante inteligencia
   artificial.

8. No utilices encabezados como "Observaciones:", "Texto generado:"
   ni similares.

9. Devuelve únicamente el texto final que debe aparecer en el informe.
`;

    try {

        const response = await client.responses.create({
            model: "gpt-5-mini",
            input: prompt
        });

        const resultado =
            response.output_text?.trim();

        if (!resultado) {
            console.warn(
                "OpenAI no devolvió texto. Se utilizará el texto base."
            );

            return textoBaseLimpio;
        }

        return resultado;

    } catch (error) {

        console.error(
            "Error generando texto del checklist con OpenAI:",
            error.message
        );

        /*
         * Si la IA falla, no queremos que falle
         * la generación completa del PDF.
         *
         * Volvemos al comportamiento anterior.
         */
        if (textoBaseLimpio && observacionLimpia) {
            return `${textoBaseLimpio} ${observacionLimpia}`;
        }

        return textoBaseLimpio || observacionLimpia;
    }
}

module.exports = {
    generarTextoChecklist
};