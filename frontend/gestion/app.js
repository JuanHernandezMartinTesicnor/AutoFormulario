import { API_URL } from "../common/api.js";


const listaProyectos =
    document.getElementById("listaProyectos");

const mensaje =
    document.getElementById("mensaje");

const usuarioNombre =
    document.getElementById("usuarioNombre");

const btnNuevoProyecto =
    document.getElementById("btnNuevoProyecto");

const btnCerrarSesion =
    document.getElementById("btnCerrarSesion");

const modalProyecto =
    document.getElementById("modalProyecto");

const btnCerrarModal =
    document.getElementById("btnCerrarModal");

const btnCancelarProyecto =
    document.getElementById("btnCancelarProyecto");

const formProyecto =
    document.getElementById("formProyecto");


/* =========================
   INICIO
========================= */

document.addEventListener(
    "DOMContentLoaded",
    iniciar
);


async function iniciar() {

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

        await cargarProyectos();

    } catch (error) {

        console.error(error);

        mostrarMensaje(
            "No se pudo comprobar la sesión.",
            "error"
        );
    }
}


/* =========================
   PROYECTOS
========================= */

async function cargarProyectos() {

    listaProyectos.innerHTML =
        "<p>Cargando proyectos...</p>";

    try {

        const respuesta =
            await fetch(
                `${API_URL}/api/proyectos`,
                {
                    credentials: "include"
                }
            );

        const resultado =
            await respuesta.json();

        if (!respuesta.ok) {

            throw new Error(
                resultado.error ||
                "Error obteniendo proyectos"
            );
        }

        mostrarProyectos(
            resultado.proyectos
        );

    } catch (error) {

        console.error(error);

        mostrarMensaje(
            error.message,
            "error"
        );
    }
}


/* =========================
   MOSTRAR PROYECTOS
========================= */

function mostrarProyectos(
    proyectos
) {

    listaProyectos.innerHTML = "";

    if (!proyectos.length) {

        listaProyectos.innerHTML = `

            <div class="sin-proyectos">

                <h3>No hay proyectos</h3>

                <p>
                    Crea el primer proyecto para comenzar.
                </p>

            </div>

        `;

        return;
    }


    proyectos.forEach(
        proyecto => {

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
                            proyecto.nombre
                        )}
                    </h3>

                    <p>
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


                <div class="proyecto-acciones">

                    <button
                        class="btn-secundario"
                        data-id="${proyecto.id}"
                    >
                        Ver proyecto
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

                    abrirProyecto(
                        proyecto.id
                    );

                }
            );


            listaProyectos.appendChild(
                tarjeta
            );

        }
    );
}


/* =========================
   ABRIR PROYECTO
========================= */

function abrirProyecto(
    id
) {

    /*
     * De momento solamente guardamos
     * el ID en la URL.
     *
     * En el siguiente paso crearemos
     * la pantalla del proyecto y allí
     * cargaremos sus formularios.
     */

    window.location.href =
        `/gestion/proyecto.html?id=${id}`;
}


/* =========================
   CREAR PROYECTO
========================= */

formProyecto.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const nombre =
            document.getElementById(
                "proyectoNombre"
            ).value.trim();

        const direccion =
            document.getElementById(
                "proyectoDireccion"
            ).value.trim();

        const cliente =
            document.getElementById(
                "proyectoCliente"
            ).value.trim();


        try {

            const respuesta =
                await fetch(
                    `${API_URL}/api/proyectos`,
                    {
                        method: "POST",

                        credentials: "include",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            nombre,
                            direccion,
                            cliente
                        })
                    }
                );


            const resultado =
                await respuesta.json();


            if (!respuesta.ok) {

                throw new Error(
                    resultado.error ||
                    "No se pudo crear el proyecto"
                );
            }


            cerrarModal();

            formProyecto.reset();

            await cargarProyectos();


            mostrarMensaje(
                "Proyecto creado correctamente.",
                "ok"
            );


        } catch (error) {

            console.error(error);

            mostrarMensaje(
                error.message,
                "error"
            );

        }

    }
);


/* =========================
   MODAL
========================= */

btnNuevoProyecto.addEventListener(
    "click",
    () => {

        modalProyecto.classList.remove(
            "oculto"
        );

    }
);


btnCerrarModal.addEventListener(
    "click",
    cerrarModal
);


btnCancelarProyecto.addEventListener(
    "click",
    cerrarModal
);


function cerrarModal() {

    modalProyecto.classList.add(
        "oculto"
    );

}


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

    setTimeout(
        () => {

            mensaje.innerHTML = "";

        },
        4000
    );
}


/* =========================
   SEGURIDAD HTML
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