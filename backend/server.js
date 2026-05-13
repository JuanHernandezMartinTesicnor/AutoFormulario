const express = require("express");
const cors = require("cors");
const path = require("path");

const formRoutes = require("./routes/formRoutes");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   API
========================= */

app.use("/api", formRoutes);

/* =========================
   FRONTEND
========================= */

// Servir archivos frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Ruta principal
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