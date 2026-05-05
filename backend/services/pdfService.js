const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function generatePDF(data) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu"
    ]
  });

  const page = await browser.newPage();

  // Cargar plantilla HTML
  let html = fs.readFileSync(
    path.join(__dirname, "../templates/pdfTemplate.html"),
    "utf8"
  );

  // Reemplazos básicos
  html = html.replace(/{{fecha}}/g, data.fecha || "");
  html = html.replace(/{{observador}}/g, data.observador || "");

  // Configuración de render
  await page.setViewport({
    width: 1200,
    height: 1600,
    deviceScaleFactor: 1
  });

  await page.setContent(html, { waitUntil: "networkidle0" });

  // Forzar modo pantalla (evita estilos raros de impresión)
  await page.emulateMediaType("screen");

  // Forzar fondo blanco SIEMPRE
  await page.addStyleTag({
    content: `
      html, body {
        background: #ffffff !important;
        color: #000000 !important;
      }
    `
  });

  // Generar PDF
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    omitBackground: false
  });

  // DEBUG: Guardar imgen de PDF en disco para inspección
  //await page.screenshot({ path: "debug.png", fullPage: true });

  await browser.close();

  return pdf;
}

module.exports = { generatePDF };