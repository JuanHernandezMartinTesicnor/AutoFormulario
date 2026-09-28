import { API_URL } from "/common/api.js";


/* =========================
   ID FORMULARIO
========================= */

const parametros =
  new URLSearchParams(
    window.location.search
  );

const formularioId =
  parametros.get("id");


/* =========================
   INICIO
========================= */

document.addEventListener(
  "DOMContentLoaded",
  iniciar
);


async function iniciar() {

  /*
   * Si tenemos ?id=...
   * estamos editando/cargando
   * un formulario existente.
   */

  if (formularioId) {

    await cargarFormularioExistente();

  } else {

    /*
     * Formulario nuevo.
     * Dejamos una acción vacía inicial.
     */
    agregarAccion();

  }

}


/* =========================
   CARGAR FORMULARIO
========================= */

async function cargarFormularioExistente() {

  try {

    const respuesta =
      await fetch(
        `${API_URL}/api/formularios/${formularioId}`,
        {
          credentials: "include"
        }
      );


    const resultado =
      await respuesta.json();


    if (!respuesta.ok) {

      throw new Error(
        resultado.error ||
        "No se pudo cargar el formulario"
      );

    }


    const formulario =
      resultado.formulario;


    /*
     * Seguridad adicional:
     * no queremos cargar aquí
     * un formulario coordinador.
     */
    if (
      formulario.tipo !==
      "contratista"
    ) {

      throw new Error(
        "El formulario seleccionado no es de contratista"
      );

    }


    rellenarFormulario(
      formulario.datos || {}
    );


  } catch (error) {

    console.error(
      "Error cargando formulario:",
      error
    );

    alert(
      error.message ||
      "Error cargando formulario"
    );

  }

}


/* =========================
   RELLENAR FORMULARIO
========================= */

function rellenarFormulario(
  data
) {

  /* =========================
     DATOS GENERALES
  ========================= */

  document.getElementById(
    "fecha"
  ).value =
    data.fecha || "";


  document.getElementById(
    "observador"
  ).value =
    data.observador || "";


  document.getElementById(
    "tipoTrabajo"
  ).value =
    data.tipoTrabajo || "";


  document.getElementById(
    "incidencias"
  ).value =
    data.incidencias || "";


  document.getElementById(
    "contrata"
  ).value =
    data.contrata || "";


  document.getElementById(
    "descripcion"
  ).value =
    data.descripcion || "";


  document.getElementById(
    "observaciones"
  ).value =
    data.observaciones || "";


  document.getElementById(
    "tipoAnomalia"
  ).value =
    data.tipoAnomalia || "";


  /* =========================
     CHECKLIST
  ========================= */

  const checklist =
    data.checklist || {};


  document.getElementById(
    "identificacion"
  ).value =
    checklist.identificacion || "";


  document.getElementById(
    "orden"
  ).value =
    checklist.orden || "";


  document.getElementById(
    "equipos"
  ).value =
    checklist.equipos || "";


  document.getElementById(
    "epis"
  ).value =
    checklist.epis || "";


  document.getElementById(
    "procedimientos"
  ).value =
    checklist.procedimientos || "";


  document.getElementById(
    "coordinacion"
  ).value =
    checklist.coordinacion || "";


  document.getElementById(
    "ambientales"
  ).value =
    checklist.ambientales || "";


  /* =========================
     ACCIONES CORRECTORAS
  ========================= */

  const container =
    document.getElementById(
      "accionesContainer"
    );


  /*
   * Limpiamos cualquier acción
   * que pudiera existir previamente.
   */
  container.innerHTML = "";


  const acciones =
    Array.isArray(
      data.accionesCorrectoras
    )
      ? data.accionesCorrectoras
      : [];


  if (
    acciones.length > 0
  ) {

    acciones.forEach(
      accion => {

        agregarAccion(
          accion
        );

      }
    );

  } else {

    /*
     * Si el formulario guardado
     * no tenía acciones dejamos
     * una vacía para poder añadirla.
     */
    agregarAccion();

  }

}


/* =========================
   ACCIONES CORRECTORAS
========================= */

function agregarAccion(
  data = {}
) {

  const container =
    document.getElementById(
      "accionesContainer"
    );


  const div =
    document.createElement(
      "div"
    );


  div.className =
    "accion-item";


  div.innerHTML = `
  
    <label>Acción</label>

    <textarea
      class="accion"
    ></textarea>


    <label>Responsable</label>

    <input
      class="responsable"
      type="text"
    >


    <label>
      Control de realización
    </label>

    <input
      class="control"
      type="text"
    >


    <button
      type="button"
      class="delete-btn"
    >
      Eliminar
    </button>

    <hr>
  `;


  div.querySelector(
    ".accion"
  ).value =
    data.accion || "";


  div.querySelector(
    ".responsable"
  ).value =
    data.responsable || "";


  div.querySelector(
    ".control"
  ).value =
    data.control || "";


  div.querySelector(
    ".delete-btn"
  ).onclick =
    () => {

      div.remove();

    };


  container.appendChild(
    div
  );

}


/* =========================
   RECOGER DATOS
========================= */

function obtenerDatosFormulario() {

  const accionesCorrectoras =
    [];


  document
    .querySelectorAll(
      ".accion-item"
    )
    .forEach(
      item => {

        accionesCorrectoras.push({

          accion:
            item.querySelector(
              ".accion"
            ).value,

          responsable:
            item.querySelector(
              ".responsable"
            ).value,

          control:
            item.querySelector(
              ".control"
            ).value

        });

      }
    );


  return {

    fecha:
      document.getElementById(
        "fecha"
      ).value,

    observador:
      document.getElementById(
        "observador"
      ).value,

    tipoTrabajo:
      document.getElementById(
        "tipoTrabajo"
      ).value,

    incidencias:
      document.getElementById(
        "incidencias"
      ).value,

    contrata:
      document.getElementById(
        "contrata"
      ).value,

    descripcion:
      document.getElementById(
        "descripcion"
      ).value,

    observaciones:
      document.getElementById(
        "observaciones"
      ).value,

    tipoAnomalia:
      document.getElementById(
        "tipoAnomalia"
      ).value,


    checklist: {

      identificacion:
        document.getElementById(
          "identificacion"
        ).value,

      orden:
        document.getElementById(
          "orden"
        ).value,

      equipos:
        document.getElementById(
          "equipos"
        ).value,

      epis:
        document.getElementById(
          "epis"
        ).value,

      procedimientos:
        document.getElementById(
          "procedimientos"
        ).value,

      coordinacion:
        document.getElementById(
          "coordinacion"
        ).value,

      ambientales:
        document.getElementById(
          "ambientales"
        ).value

    },


    accionesCorrectoras

  };

}


/* =========================
   GENERAR PDF
========================= */

async function enviar() {

  const data =
    obtenerDatosFormulario();


  try {

    const res =
      await fetch(
        "/api/contratista/generate-pdf",
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(
              data
            )
        }
      );


    if (!res.ok) {

      throw new Error(
        "Error generando PDF"
      );

    }


    const nuevoFormularioId =
      res.headers.get(
        "X-Formulario-Id"
      );


    const blob =
      await res.blob();


    const url =
      window.URL.createObjectURL(
        blob
      );


    const a =
      document.createElement(
        "a"
      );


    a.href = url;


    a.download =
      nuevoFormularioId
        ? `formulario-${nuevoFormularioId}.pdf`
        : "formulario.pdf";


    a.click();


    window.URL.revokeObjectURL(
      url
    );


  } catch (error) {

    console.error(error);

    alert(
      "Error generando PDF"
    );

  }

}


/* =========================
   HACER FUNCIONES GLOBALES
========================= */

/*
 * Esto es necesario si en el HTML
 * tienes algo como:
 *
 * onclick="agregarAccion()"
 * onclick="enviar()"
 */

window.agregarAccion =
  agregarAccion;

window.enviar =
  enviar;