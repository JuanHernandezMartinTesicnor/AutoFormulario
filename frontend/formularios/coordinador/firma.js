let canvas;
let ctx;
let dibujando = false;

function getPos(event) {

    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX || event.touches[0].clientX) - rect.left,
        y: (event.clientY || event.touches[0].clientY) - rect.top
    };
}

function startDraw(event) {

    dibujando = true;

    const pos = getPos(event);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function stopDraw() {

    dibujando = false;
    ctx.beginPath();
}

function draw(event) {

    if (!dibujando) return;

    event.preventDefault();

    const pos = getPos(event);

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

export function initFirma() {

    canvas = document.getElementById("firmaCanvas");

    if (!canvas) return;

    ctx = canvas.getContext("2d");

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mouseleave", stopDraw);

    canvas.addEventListener("touchstart", startDraw);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDraw);
}

export function limpiarFirma() {

    if (!ctx) return;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

export function getFirmaBase64() {

    if (!canvas) return "";

    return canvas.toDataURL("image/png");
}