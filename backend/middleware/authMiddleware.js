function requireAuth(req, res, next) {

    if (!req.session || !req.session.usuario) {

        return res.status(401).json({
            ok: false,
            error: "No autenticado"
        });

    }

    next();
}


function requireCoordinador(req, res, next) {

    if (!req.session || !req.session.usuario) {

        return res.status(401).json({
            ok: false,
            error: "No autenticado"
        });

    }

    if (req.session.usuario.rol !== "coordinador") {

        return res.status(403).json({
            ok: false,
            error: "No tienes permisos de coordinador"
        });

    }

    next();
}


module.exports = {
    requireAuth,
    requireCoordinador
};