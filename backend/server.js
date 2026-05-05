const express = require("express");
const cors = require("cors");
const formRoutes = require("./routes/formRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", formRoutes);

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});