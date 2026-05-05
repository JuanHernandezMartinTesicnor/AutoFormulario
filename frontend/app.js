async function enviar() {
  const data = {
    fecha: document.getElementById("fecha").value,
    observador: document.getElementById("observador").value
  };

  const res = await fetch("http://localhost:3000/api/generate-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const blob = await res.blob();
  window.open(URL.createObjectURL(blob));
}