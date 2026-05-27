const express = require("express");
const cors = require("cors");
const path = require("path");

const contratistaRoutes = require("./routes/contratistaRoutes");
const coordinadorRoutes = require("./routes/coordinadorRoutes");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   API
========================= */

app.use("/api/contratista", contratistaRoutes);

app.use("/api/coordinador", coordinadorRoutes);

/* =========================
   FRONTEND
========================= */

// Archivos estáticos
app.use(express.static(path.join(__dirname, "../frontend")));

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});