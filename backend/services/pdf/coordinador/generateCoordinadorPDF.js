const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const isLinux = process.platform === "linux";

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

    let html = fs.readFileSync(
        path.join(__dirname, "pdfTemplate.html"),
        "utf8"
    );

    html = html.replace(/{{fecha}}/g, data.fecha || "");
    html = html.replace(/{{obra}}/g, data.obra || "");
    html = html.replace(/{{cliente}}/g, data.cliente || "");
    html = html.replace(/{{alcance}}/g, data.alcance || "");
    html = html.replace(/{{realizadoPor}}/g, data.realizadoPor || "");
    html = html.replace(/{{revisadoPor}}/g, data.revisadoPor || "");

    await page.setContent(
        html,
        {
            waitUntil: "networkidle0"
        }
    );

    const pdf = await page.pdf({

        format: "A4",

        printBackground: true
    });

    await browser.close();

    return pdf;
}

module.exports = {
    generatePDF
};