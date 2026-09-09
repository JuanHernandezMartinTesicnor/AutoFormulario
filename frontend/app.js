import { API_URL } from "./common/api.js";


const navUsuario =
    document.getElementById(
        "navUsuario"
    );

const usuarioPanel =
    document.getElementById(
        "usuarioPanel"
    );

const usuarioNombre =
    document.getElementById(
        "usuarioNombre"
    );

const btnGestion =
    document.getElementById(
        "btnGestion"
    );

const btnCerrarSesion =
    document.getElementById(
        "btnCerrarSesion"
    );

const cardsContainer =
    document.getElementById(
        "cardsContainer"
    );

const mensaje =
    document.getElementById(
        "mensaje"
    );


document.addEventListener(
    "DOMContentLoaded",
    iniciar
);


async function iniciar() {

    mostrarFormularioContratista();

    await comprobarSesion();

}


/* =========================
   CONTRATISTA
========================= */

function mostrarFormularioContratista() {

    const tarjeta =
        document.createElement(
            "a"
        );

    tarjeta.className =
        "form-card generico";

    tarjeta.href =
        "/formularios/contratista/";

    tarjeta.innerHTML = `

        <div class="card-title">
            Formulario Contratista
        </div>

        <div class="card-description">
            Control de actuación del contratista
            y acciones correctoras.
        </div>

        <div class="card-info">
            Formulario genérico
        </div>

    `;

    cardsContainer.appendChild(
        tarjeta
    );

}


/* =========================
   SESIÓN
========================= */

async function comprobarSesion() {

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

            mostrarUsuarioNoAutenticado();

            return;
        }


        mostrarUsuarioAutenticado(
            resultado.usuario
        );


        await cargarProyectos();


    } catch (error) {

        console.error(
            "Error comprobando sesión:",
            error
        );

        mostrarUsuarioNoAutenticado();

    }

}


/* =========================
   USUARIO NO AUTENTICADO
========================= */

function mostrarUsuarioNoAutenticado() {

    navUsuario.innerHTML = `

        <a
            href="/login/"
            class="btn-header"
        >
            Iniciar sesión
        </a>

        <a
            href="/registro/"
            class="btn-header btn-registro"
        >
            Registrarse
        </a>

    `;

}


/* =========================
   USUARIO AUTENTICADO
========================= */

function mostrarUsuarioAutenticado(
    usuario
) {

    navUsuario.innerHTML = `

        <span>
            ${escapeHtml(
                usuario.nombre
            )}
        </span>

    `;


    usuarioPanel.style.display =
        "flex";


    usuarioNombre.textContent =
        usuario.nombre;


    if (
        usuario.rol === "coordinador"
    ) {

        btnGestion.style.display =
            "inline-block";

    }

}


/* =========================
   PROYECTOS
========================= */

async function cargarProyectos() {

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
                "No se pudieron cargar los proyectos"
            );

        }


        const proyectos =
            resultado.proyectos;


        proyectos.forEach(
            mostrarProyecto
        );


    } catch (error) {

        console.error(
            "Error cargando proyectos:",
            error
        );

        mensaje.textContent =
            "No se pudieron cargar los proyectos.";

    }

}


/* =========================
   MOSTRAR PROYECTO
========================= */

function mostrarProyecto(
    proyecto
) {

    const tarjeta =
        document.createElement(
            "a"
        );


    tarjeta.className =
        "form-card proyecto";


    tarjeta.href =
        `/formularios/coordinador/?proyecto=${proyecto.id}`;


    tarjeta.innerHTML = `

        <div class="card-title">

            ${escapeHtml(
                proyecto.nombre
            )}

        </div>


        <div class="card-description">

            Formulario de coordinación

        </div>


        <div class="card-info">

            <strong>Cliente:</strong>
            ${
                escapeHtml(
                    proyecto.cliente ||
                    "Sin cliente"
                )
            }

            <br>

            <strong>Dirección:</strong>
            ${
                escapeHtml(
                    proyecto.direccion ||
                    "Sin dirección"
                )
            }

        </div>

    `;


    cardsContainer.appendChild(
        tarjeta
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

            window.location.href =
                "/";

        }

    }
);


/* =========================
   SEGURIDAD
========================= */

function escapeHtml(
    valor
) {

    return String(
        valor ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}