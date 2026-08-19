const express = require("express");

const {
    obtenerUsuarioPorEmail,
    verificarPassword
} = require("../services/auth/usuariosService");

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


module.exports = router;