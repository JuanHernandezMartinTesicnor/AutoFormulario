const firmas = {};

function getPos(canvas, event) {

    const rect = canvas.getBoundingClientRect();

    return {

        x:
            (event.clientX || event.touches[0].clientX) - rect.left,

        y:
            (event.clientY || event.touches[0].clientY) - rect.top

    };

}

export function initFirma(canvasId, firmaId = canvasId) {

    const canvas =
        document.getElementById(canvasId);

    if (!canvas) return;

    // Ajustar el tamaño al ancho real disponible
    canvas.width =
        canvas.clientWidth;

    // Ajustar al ancho disponible
    canvas.width =
        canvas.parentElement.clientWidth - 10;

    canvas.height = 140;

    const ctx =
        canvas.getContext("2d");

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    const firma = {

        canvas,
        ctx,
        dibujando: false

    };

    firmas[firmaId] = firma;

    function startDraw(event) {

        firma.dibujando = true;

        const pos =
            getPos(canvas, event);

        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);

    }

    function stopDraw() {

        firma.dibujando = false;
        ctx.beginPath();

    }

    function draw(event) {

        if (!firma.dibujando)
            return;

        event.preventDefault();

        const pos =
            getPos(canvas, event);

        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

    }

    canvas.addEventListener(
        "mousedown",
        startDraw
    );

    canvas.addEventListener(
        "mousemove",
        draw
    );

    canvas.addEventListener(
        "mouseup",
        stopDraw
    );

    canvas.addEventListener(
        "mouseleave",
        stopDraw
    );

    canvas.addEventListener(
        "touchstart",
        startDraw
    );

    canvas.addEventListener(
        "touchmove",
        draw
    );

    canvas.addEventListener(
        "touchend",
        stopDraw
    );

}

export function limpiarFirma(id = "firmaCanvas") {

    const canvas =
        document.getElementById(id);

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

export function getFirmaBase64(id = "firmaCanvas") {

    const canvas =
        document.getElementById(id);

    if (!canvas) return "";

    return canvas.toDataURL("image/png");
}

export function cargarFirma(id, base64) {

    if (!base64) return;

    const canvas =
        document.getElementById(id);

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");

    const img =
        new Image();

    img.onload = () => {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.drawImage(
            img,
            0,
            0,
            canvas.width,
            canvas.height
        );

    };

    img.src = base64;

}