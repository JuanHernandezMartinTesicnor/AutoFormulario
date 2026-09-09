const express = require("express");

const {
    obtenerUsuarioPorEmail,
    verificarPassword,
    crearUsuario
} = require(
    "../services/auth/usuariosService"
);

const router = express.Router();


router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({
                error: "Email y contraseña son obligatorios"
            });

        }


        const usuario =
            obtenerUsuarioPorEmail(email);


        if (!usuario) {

            return res.status(401).json({
                error: "Credenciales incorrectas"
            });

        }


        const passwordCorrecta =
            await verificarPassword(
                password,
                usuario.password_hash
            );


        if (!passwordCorrecta) {

            return res.status(401).json({
                error: "Credenciales incorrectas"
            });

        }


        req.session.usuario = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        };


        return res.json({
            ok: true,
            usuario: req.session.usuario
        });

    } catch (error) {

        console.error(
            "Error durante el login:",
            error
        );

        return res.status(500).json({
            error: "Error interno del servidor"
        });

    }

});


router.post("/logout", (req, res) => {

    req.session.destroy(error => {

        if (error) {

            console.error(
                "Error cerrando sesión:",
                error
            );

            return res.status(500).json({
                error: "No se pudo cerrar la sesión"
            });

        }


        res.clearCookie("connect.sid");

        return res.json({
            ok: true
        });

    });

});


router.get("/me", (req, res) => {

    if (!req.session.usuario) {

        return res.status(401).json({
            autenticado: false
        });

    }


    return res.json({
        autenticado: true,
        usuario: req.session.usuario
    });

});


/* =========================
   REGISTRO
========================= */

router.post(
    "/registro",
    async (req, res) => {

        try {

            const {
                nombre,
                email,
                password,
                rol
            } = req.body;


            if (
                !nombre ||
                !email ||
                !password ||
                !rol
            ) {

                return res.status(400).json({
                    ok: false,
                    error:
                        "Todos los campos son obligatorios"
                });

            }


            if (
                rol !== "tecnico" &&
                rol !== "coordinador"
            ) {

                return res.status(400).json({
                    ok: false,
                    error:
                        "Rol no válido"
                });

            }


            if (
                password.length < 6
            ) {

                return res.status(400).json({
                    ok: false,
                    error:
                        "La contraseña debe tener al menos 6 caracteres"
                });

            }


            const emailNormalizado =
                email.trim().toLowerCase();

            const usuarioExistente =
                obtenerUsuarioPorEmail(
                    emailNormalizado
                );


            if (usuarioExistente) {

                return res.status(409).json({
                    ok: false,
                    error:
                        "Ya existe un usuario con ese email"
                });

            }


            const usuario =
                await crearUsuario({
                    nombre: nombre.trim(),
                    email: emailNormalizado,
                    password,
                    rol
                });


            return res.status(201).json({

                ok: true,

                usuario

            });


        } catch (error) {

            console.error(
                "Error en registro:",
                error
            );


            return res.status(500).json({

                ok: false,

                error:
                    "Error creando el usuario"

            });

        }

    }
);


module.exports = router;