function agregarAccion(data = {}) {

  const container = document.getElementById("accionesContainer");

  const div = document.createElement("div");

  div.className = "accion-item";

  div.innerHTML = `
  
    <label>Acción</label>
    <textarea class="accion"></textarea>

    <label>Responsable</label>
    <input class="responsable" type="text">

    <label>Control de realización</label>
    <input class="control" type="text">

    <button type="button" class="delete-btn">
      Eliminar
    </button>

    <hr>
  `;

  div.querySelector(".accion").value = data.accion || "";
  div.querySelector(".responsable").value = data.responsable || "";
  div.querySelector(".control").value = data.control || "";

  div.querySelector(".delete-btn").onclick = () => {
    div.remove();
  };

  container.appendChild(div);
}

async function enviar() {

  const acciones = [];

  document.querySelectorAll(".accion-item").forEach(item => {

    acciones.push({
      accion: item.querySelector(".accion").value,
      responsable: item.querySelector(".responsable").value,
      control: item.querySelector(".control").value
    });

  });

  const data = {
    accionesCorrectoras: acciones,
    fecha: document.getElementById("fecha").value,
    observador: document.getElementById("observador").value,
    tipoTrabajo: document.getElementById("tipoTrabajo").value,
    incidencias: document.getElementById("incidencias").value,
    contrata: document.getElementById("contrata").value,
    descripcion: document.getElementById("descripcion").value,
    tipoAnomalia: document.getElementById("tipoAnomalia").value,

    checklist: {
      tipoTrabajo: document.getElementById("tipoTrabajo").value,
      incidencias: document.getElementById("incidencias").value,
      identificacion: document.getElementById("identificacion").value,
      orden: document.getElementById("orden").value,
      equipos: document.getElementById("equipos").value,
      epis: document.getElementById("epis").value,
      procedimientos: document.getElementById("procedimientos").value,
      coordinacion: document.getElementById("coordinacion").value,
      ambientales: document.getElementById("ambientales").value
    }
  };

  const res = await fetch("/api/generate-pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "formulario.pdf";
  a.click();
}

agregarAccion();