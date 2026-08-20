const {
    crearProyecto,
    obtenerProyectos
} = require("../models/proyectosModel");

const {
    crearFormulario,
    obtenerFormularios
} = require("../models/formulariosModel");


console.log("\n=== CREANDO PROYECTO ===");

const proyecto = crearProyecto({
    nombre: "Proyecto de prueba",
    direccion: "Pamplona",
    cliente: "Cliente de prueba"
});

console.log(proyecto);


console.log("\n=== CREANDO FORMULARIO ===");

const formulario = crearFormulario({
    proyecto_id: proyecto.id,
    usuario_id: 1,
    tipo: "coordinador",

    datos: {
        fecha: "20/08/2026",
        coordinador: "Jesus",

        checklist: [
            {
                categoria: "general",
                items: [
                    {
                        id: "estadoGeneral",
                        titulo: "Estado general",
                        valor: "NO",
                        comentario: "Hay materiales acumulados."
                    }
                ]
            }
        ]
    }
});

console.log(formulario);


console.log("\n=== PROYECTOS ===");

console.table(
    obtenerProyectos()
);


console.log("\n=== FORMULARIOS ===");

console.dir(
    obtenerFormularios(),
    {
        depth: null
    }
);