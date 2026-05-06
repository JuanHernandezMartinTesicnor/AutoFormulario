async function enviar() {
  const data = {
    fecha: document.getElementById("fecha").value,
    observador: document.getElementById("observador").value,
    tipoTrabajo: document.getElementById("tipoTrabajo").value,
    incidencias: document.getElementById("incidencias").value,
    contrata: document.getElementById("contrata").value,
    descripcion: document.getElementById("descripcion").value,
    observaciones: document.getElementById("observaciones").value,

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

  const res = await fetch("http://localhost:3000/api/generate-pdf", {
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