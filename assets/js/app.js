// Único punto de arranque. Scripts clásicos para conservar apertura con file://.
(async () => {
  const app = window.Invitacion;
  try {
    const datos = await app.cargarDatos();
    app.renderizar(datos);
    app.iniciarConfirmacion(datos);
    app.iniciarContador(datos);
    document.querySelector("#invitacion").hidden = false;
    document.querySelector("#estado").hidden = true;
    app.iniciarNavegacion();
  } catch (error) {
    document.querySelector("#estado").textContent =
      window.INVITACION_DATOS?.textos?.errorCarga ||
      "No se pudo leer datos.js. Revisa las comillas y comas del archivo de contenido.";
    console.error(error);
  }
})();
