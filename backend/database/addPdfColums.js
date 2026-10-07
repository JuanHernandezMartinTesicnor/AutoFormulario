// backend/database/addPdfColumns.js

const db =
    require("./database");


const columnas =
    db.prepare(
        "PRAGMA table_info(formularios)"
    ).all();


const nombres =
    columnas.map(
        columna => columna.name
    );


if (
    !nombres.includes(
        "ultimo_pdf"
    )
) {

    db.exec(`
        ALTER TABLE formularios
        ADD COLUMN ultimo_pdf BLOB
    `);

}


if (
    !nombres.includes(
        "ultimo_pdf_nombre"
    )
) {

    db.exec(`
        ALTER TABLE formularios
        ADD COLUMN ultimo_pdf_nombre TEXT
    `);

}


if (
    !nombres.includes(
        "ultimo_pdf_generado_at"
    )
) {

    db.exec(`
        ALTER TABLE formularios
        ADD COLUMN ultimo_pdf_generado_at TEXT
    `);

}


console.log(
    "Columnas PDF añadidas correctamente."
);