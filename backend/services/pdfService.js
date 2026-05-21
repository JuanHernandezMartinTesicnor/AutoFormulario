const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

function getImageBase64(relativePath) {
  const filePath = path.join(__dirname, "../../", relativePath);

  const image = fs.readFileSync(filePath);

  return `data:image/png;base64,${image.toString("base64")}`;
}

const isLinux = process.platform === "linux";

function getSignatureBase64(filename) {
  const filePath = path.join(__dirname, "../../frontend/signatures", filename);

  const image = fs.readFileSync(filePath);

  return `data:image/png;base64,${image.toString("base64")}`;
}

async function generatePDF(data) {

  const browser = await puppeteer.launch({
    headless: true,

    ...(isLinux && {
      executablePath: "/snap/bin/chromium"
    }),

    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu"
    ]
  });

  const page = await browser.newPage();

  /* =========================
     CARGAR HTML + CSS
  ========================= */

  let html = fs.readFileSync(
    path.join(__dirname, "../templates/pdfTemplate.html"),
    "utf8"
  );

  const css = fs.readFileSync(
    path.join(__dirname, "../templates/pdfStyles.css"),
    "utf8"
  );

  /* =========================
     REEMPLAZOS BÁSICOS
  ========================= */

  html = html.replace(/{{fecha}}/g, data.fecha || "");
  html = html.replace(/{{observador}}/g, data.observador || "");
  html = html.replace(/{{tipoTrabajo}}/g, data.tipoTrabajo || "");
  html = html.replace(/{{incidencias}}/g, data.incidencias || "");
  html = html.replace(/{{contrata}}/g, data.contrata || "");
  html = html.replace(/{{descripcion}}/g, data.descripcion || "");
  html = html.replace(/{{observaciones}}/g, data.observaciones || "");

  /* =========================
     CASILLAS TIPO TRABAJO
  ========================= */

  html = html.replace(
    /{{ingenieria}}/g,
    data.tipoTrabajo === "INGENIERIA" ? "X" : ""
  );

  html = html.replace(
    /{{mantenimiento}}/g,
    data.tipoTrabajo === "MANTENIMIENTO" ? "X" : ""
  );

  html = html.replace(
    /{{conIncidencias}}/g,
    data.incidencias === "CON INCIDENCIAS" ? "X" : ""
  );

  html = html.replace(
    /{{sinIncidencias}}/g,
    data.incidencias === "SIN INCIDENCIAS" ? "X" : ""
  );

  /* =========================
     FIRMA OBSERVADOR
  ========================= */

  let firmaObservador = "";

  if (data.observador === "Maria Rodríguez") {
    firmaObservador = getSignatureBase64("maria.png");
  }

  if (data.observador === "antonio") {
    firmaObservador = getSignatureBase64("antonio.png");
  }

  html = html.replace(
    /{{firmaObservador}}/g,
    firmaObservador
  );

  /* =========================
     LOGOS
  ========================= */

  const tesicnorLogo = getImageBase64(
    "frontend/logos/tesicnor.png"
  );

  const graftechLogo = getImageBase64(
    "frontend/logos/grafTech.png"
  );

  html = html.replace(
    /{{tesicnorLogo}}/g,
    tesicnorLogo
  );

  html = html.replace(
    /{{graftechLogo}}/g,
    graftechLogo
  );

  /* =========================
     CHECKLIST
  ========================= */

  html = fillSimpleChecklist(
    html,
    data.checklist || {}
  );

  /* =========================
     VIEWPORT
  ========================= */

  await page.setViewport({
    width: 1200,
    height: 1600,
    deviceScaleFactor: 1
  });

  /* =========================
     CARGAR HTML
  ========================= */

  await page.setContent(
    html,
    { waitUntil: "networkidle0" }
  );

  /* =========================
     CARGAR CSS EXTERNO
  ========================= */

  await page.addStyleTag({
    content: css
  });

  /* =========================
     MODO SCREEN
  ========================= */

  await page.emulateMediaType("screen");

  /* =========================
     FORZAR FONDO BLANCO
  ========================= */

  await page.addStyleTag({
    content: `
      html, body {
        background: #ffffff !important;
        color: #000000 !important;
      }
    `
  });

  /* =========================
     GENERAR PDF
  ========================= */

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    omitBackground: false
  });

  await browser.close();

  return pdf;
}



function fillSimpleChecklist(html, checklist) {
  Object.keys(checklist).forEach((key) => {
    const value = checklist[key] || "";

    html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
  });

  return html;
}

module.exports = { generatePDF };