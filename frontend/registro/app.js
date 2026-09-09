import { API_URL } from "../common/api.js";


const formulario =
    document.getElementById(
        "registroForm"
    );

const mensaje =
    document.getElementById(
        "mensaje"
    );


formulario.addEventListener(
    "submit",
    registrar
);


async function registrar(event) {

    event.preventDefault();


    const nombre =
        document.getElementById(
            "nombre"
        ).value.trim();


    const email =
        document.getElementById(
            "email"
        ).value.trim()
        .toLowerCase();


    const password =
        document.getElementById(
            "password"
        ).value;


    const passwordConfirmacion =
        document.getElementById(
            "passwordConfirmacion"
        ).value;


    const rol =
        document.querySelector(
            'input[name="rol"]:checked'
        ).value;


    if (
        password !==
        passwordConfirmacion
    ) {

        mostrarMensaje(
            "Las contraseñas no coinciden.",
            "error"
        );

        return;
    }


    try {

        mostrarMensaje(
            "Creando cuenta...",
            ""
        );


        const respuesta =
            await fetch(
                `${API_URL}/api/auth/registro`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        nombre,

                        email,

                        password,

                        rol

                    })
                }
            );


        const resultado =
            await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                resultado.error ||
                "No se pudo crear la cuenta"
            );

        }


        mostrarMensaje(
            "Cuenta creada correctamente. Redirigiendo al login...",
            "ok"
        );


        setTimeout(
            () => {

                window.location.href =
                    "/login/";

            },
            1500
        );


    } catch (error) {

        console.error(error);


        mostrarMensaje(
            error.message,
            "error"
        );

    }

}


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