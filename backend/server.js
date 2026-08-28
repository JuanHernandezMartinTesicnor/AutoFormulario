require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const contratistaRoutes =
    require("./routes/contratistaRoutes");

const coordinadorRoutes =
    require("./routes/coordinadorRoutes");

const authRoutes =
    require("./routes/authRoutes");

const proyectosRoutes =
    require("./routes/proyectosRoutes");

const formulariosRoutes =
    require("./routes/formulariosRoutes");


const app = express();


/* =========================
   CORS
========================= */

app.use(cors());


/* =========================
   BODY
========================= */

app.use(express.json({
    limit: "300mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "300mb"
}));


/* =========================
   SESIONES
========================= */

app.use(session({

    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 1000 * 60 * 60 * 8
    }

}));


/* =========================
   API
========================= */

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/contratista",
    contratistaRoutes
);

app.use(
    "/api/coordinador",
    coordinadorRoutes
);

app.use(
    "/api/proyectos",
    proyectosRoutes
);

app.use(
    "/api/formularios",
    formulariosRoutes
);


/* =========================
   FRONTEND
========================= */

/* =========================
   LOGIN
========================= */

app.get("/login", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/login/index.html"
        )
    );

});

/* =========================
   GESTIÓN
========================= */

app.get("/gestion", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/gestion/index.html"
        )
    );
});

app.get("/gestion/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/gestion/index.html"
        )
    );

});


// Página principal

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/index.html"
        )
    );

});

// Archivos estáticos

app.use(
    express.static(
        path.join(
            __dirname,
            "../frontend"
        )
    )
);




/* =========================
   START SERVER
========================= */

const PORT =
    process.env.PORT || 3000;


app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Servidor corriendo en puerto ${PORT}`
        );

    }
);