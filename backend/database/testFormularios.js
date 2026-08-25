const {
    crearFormulario,
    obtenerFormularios,
    obtenerFormularioPorId,
    obtenerFormulariosPorProyecto,
    actualizarFormulario,
    eliminarFormulario
} = require("../models/formulariosModel");


console.log("\n=== TEST FORMULARIOS ===\n");


/* =========================
   CREAR
========================= */

console.log("=== CREANDO FORMULARIO ===");

const formularioCreado =
    crearFormulario({

        proyecto_id: 1,

        usuario_id: 1,

        tipo: "coordinador",

        estado: "borrador",

        datos: {

            fecha: "25/08/2026",

            coordinador: "Jesus",

            direccion: "Pamplona",

            checklist: [

                {
                    categoria: "general",

                    items: [

                        {
                            id: "estadoGeneral",

                            titulo: "Estado general",

                            valor: "NO",

                            comentario:
                                "Hay materiales acumulados."
                        }

                    ]
                }

            ]

        }

    });


console.log(formularioCreado);


/* =========================
   OBTENER POR ID
========================= */

console.log("\n=== OBTENIENDO POR ID ===");

const formulario =
    obtenerFormularioPorId(
        formularioCreado.id
    );

console.dir(
    formulario,
    { depth: null }
);


/* =========================
   OBTENER TODOS
========================= */

console.log("\n=== OBTENIENDO TODOS ===");

const formularios =
    obtenerFormularios();

console.dir(
    formularios,
    { depth: null }
);


/* =========================
   OBTENER POR PROYECTO
========================= */

console.log(
    "\n=== OBTENIENDO POR PROYECTO ==="
);

const formulariosProyecto =
    obtenerFormulariosPorProyecto(1);

console.dir(
    formulariosProyecto,
    { depth: null }
);


/* =========================
   ACTUALIZAR
========================= */

console.log("\n=== ACTUALIZANDO ===");

const formularioActualizado =
    actualizarFormulario(

        formularioCreado.id,

        {

            estado: "completado",

            datos: {

                fecha: "25/08/2026",

                coordinador: "Jesus",

                direccion: "Pamplona",

                checklist: [

                    {
                        categoria: "general",

                        items: [

                            {
                                id: "estadoGeneral",

                                titulo: "Estado general",

                                valor: "NO",

                                comentario:
                                    "Se han retirado los materiales acumulados."
                            }

                        ]
                    }

                ]

            }

        }

    );


console.dir(
    formularioActualizado,
    { depth: null }
);


/* =========================
   COMPROBAR ACTUALIZACIÓN
========================= */

console.log(
    "\n=== COMPROBANDO ACTUALIZACIÓN ==="
);

const formularioComprobacion =
    obtenerFormularioPorId(
        formularioCreado.id
    );

console.dir(
    formularioComprobacion,
    { depth: null }
);


/* =========================
   ELIMINAR
========================= */

console.log("\n=== ELIMINANDO ===");

const eliminado =
    eliminarFormulario(
        formularioCreado.id
    );

console.log(eliminado);


/* =========================
   COMPROBAR ELIMINACIÓN
========================= */

console.log(
    "\n=== COMPROBANDO ELIMINACIÓN ==="
);

const despuesDeEliminar =
    obtenerFormularioPorId(
        formularioCreado.id
    );

console.log(
    despuesDeEliminar
);


console.log(
    "\n=== TEST FINALIZADO ===\n"
);