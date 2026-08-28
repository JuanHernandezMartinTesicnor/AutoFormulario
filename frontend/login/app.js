import { API_URL } from "../common/api.js";


const loginForm =
    document.getElementById("loginForm");

const mensaje =
    document.getElementById("mensaje");

const btnLogin =
    document.querySelector(".btn-login");


/* =========================
   LOGIN
========================= */

loginForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;


        mensaje.innerHTML = "";

        btnLogin.disabled = true;

        btnLogin.textContent =
            "Iniciando sesión...";


        try {

            const respuesta =
                await fetch(
                    `${API_URL}/api/auth/login`,
                    {
                        method: "POST",

                        credentials: "include",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );


            const resultado =
                await respuesta.json();


            if (!respuesta.ok) {

                throw new Error(
                    resultado.error ||
                    "Credenciales incorrectas"
                );

            }


            console.log(
                "Login correcto:",
                resultado.usuario
            );


            /*
             * Login correcto.
             *
             * La sesión ya ha sido creada
             * por el servidor.
             */

            window.location.href =
                "/gestion";


        } catch (error) {

            console.error(
                "Error en login:",
                error
            );


            mostrarError(
                error.message
            );


            btnLogin.disabled = false;

            btnLogin.textContent =
                "Iniciar sesión";

        }

    }
);


/* =========================
   MENSAJE ERROR
========================= */

function mostrarError(texto) {

    mensaje.innerHTML = `

        <div class="mensaje error">

            ${escapeHtml(texto)}

        </div>

    `;

}


/* =========================
   SEGURIDAD
========================= */

function escapeHtml(valor) {

    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}