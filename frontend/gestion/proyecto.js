import { API_URL } from "../common/api.js";


const informacionProyecto =
    document.getElementById(
        "informacionProyecto"
    );

const listaFormularios =
    document.getElementById(
        "listaFormularios"
    );

const usuarioNombre =
    document.getElementById(
        "usuarioNombre"
    );

const btnVolver =
    document.getElementById(
        "btnVolver"
    );

const btnCerrarSesion =
    document.getElementById(
        "btnCerrarSesion"
    );

const mensaje =
    document.getElementById(
        "mensaje"
    );


/* =========================
   ID DEL PROYECTO
========================= */

const parametros =
    new URLSearchParams(
        window.location.search
    );

const proyectoId =
    parametros.get("id");


/* =========================
   INICIO
========================= */

document.addEventListener(
    "DOMContentLoaded",
    iniciar
);


async function iniciar() {

    if (!proyectoId) {

        window.location.href =
            "/gestion";

        return;
    }


    try {

        const respuesta =
            await fetch(
                `${API_URL}/api/auth/me`,
                {
                    credentials: "include"
                }
            );


        const resultado =
            await respuesta.json();


        if (
            !respuesta.ok ||
            !resultado.autenticado
        ) {

            window.location.href = "/";

            return;
        }


        usuarioNombre.textContent =
            resultado.usuario.nombre;


        await cargarProyecto();

        await cargarFormularios();


    } catch (error) {

        console.error(error);

        mostrarMensaje(
            "No se pudo cargar el proyecto.",
            "error"
        );

    }

}


/* =========================
   PROYECTO
========================= */

async function cargarProyecto() {

    const respuesta =
        await fetch(
            `${API_URL}/api/proyectos/${proyectoId}`,
            {
                credentials: "include"
            }
        );


    const resultado =
        await respuesta.json();


    if (!respuesta.ok) {

        throw new Error(
            resultado.error ||
            "No se pudo obtener el proyecto"
        );

    }


    const proyecto =
        resultado.proyecto;


    informacionProyecto.innerHTML = `

        <div class="proyecto">

            <div class="proyecto-info">

                <h2>
                    ${escapeHtml(
                        proyecto.nombre
                    )}
                </h2>

                <p>
                    <strong>Dirección:</strong>
                    ${
                        escapeHtml(
                            proyecto.direccion ||
                            "Sin dirección"
                        )
                    }
                </p>

                <p>
                    <strong>Cliente:</strong>
                    ${
                        escapeHtml(
                            proyecto.cliente ||
                            "Sin cliente"
                        )
                    }
                </p>

            </div>

        </div>

    `;

}


/* =========================
   FORMULARIOS
========================= */

async function cargarFormularios() {

    listaFormularios.innerHTML =
        "<p>Cargando formularios...</p>";


    const respuesta =
        await fetch(
            `${API_URL}/api/formularios/proyecto/${proyectoId}`,
            {
                credentials: "include"
            }
        );


    const resultado =
        await respuesta.json();


    if (!respuesta.ok) {

        throw new Error(
            resultado.error ||
            "No se pudieron obtener los formularios"
        );

    }


    mostrarFormularios(
        resultado.formularios
    );

}


/* =========================
   MOSTRAR FORMULARIOS
========================= */

function mostrarFormularios(
    formularios
) {

    listaFormularios.innerHTML = "";


    if (!formularios.length) {

        listaFormularios.innerHTML = `

            <div class="sin-proyectos">

                <h3>
                    No hay formularios
                </h3>

                <p>
                    Este proyecto todavía no tiene
                    formularios asociados.
                </p>

            </div>

        `;

        return;
    }


    formularios.forEach(
        formulario => {

            const tarjeta =
                document.createElement(
                    "div"
                );


            tarjeta.className =
                "proyecto";


            tarjeta.innerHTML = `

                <div class="proyecto-info">

                    <h3>
                        ${escapeHtml(
                            formulario.tipo
                        )}
                    </h3>

                    <p>
                        <strong>Estado:</strong>
                        ${escapeHtml(
                            formulario.estado
                        )}
                    </p>

                    <p>
                        <strong>Creado:</strong>
                        ${escapeHtml(
                            formulario.created_at
                        )}
                    </p>

                </div>


                <div class="proyecto-acciones">

                    <button
                        class="btn-secundario"
                        data-id="${formulario.id}"
                    >
                        Ver formulario
                    </button>

                </div>

            `;


            const boton =
                tarjeta.querySelector(
                    "button"
                );


            boton.addEventListener(
                "click",
                () => {

                    console.log(
                        "Formulario seleccionado:",
                        formulario.id
                    );

                }
            );


            listaFormularios.appendChild(
                tarjeta
            );

        }
    );

}


/* =========================
   VOLVER
========================= */

btnVolver.addEventListener(
    "click",
    () => {

        window.location.href =
            "/gestion";

    }
);


/* =========================
   LOGOUT
========================= */

btnCerrarSesion.addEventListener(
    "click",
    async () => {

        try {

            await fetch(
                `${API_URL}/api/auth/logout`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

        } finally {

            window.location.href = "/";

        }

    }
);


/* =========================
   MENSAJES
========================= */

function mostrarMensaje(
    texto,
    tipo
) {

    mensaje.innerHTML = `

        <div class="mensaje ${tipo}">

            ${escapeHtml(texto)}

        </div>

    `;

}


/* =========================
   SEGURIDAD
========================= */

function escapeHtml(
    valor
) {

    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}