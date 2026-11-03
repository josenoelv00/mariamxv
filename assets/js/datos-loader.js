window.Invitacion = {};
(() => {
  function validarDatos(d) {
    if (
      !d?.portada ||
      !d.evento ||
      !d.invitado ||
      !d.confirmacion ||
      !d.vestimenta ||
      !d.regalos ||
      !Array.isArray(d.ubicaciones)
    )
      throw new Error(d?.textos?.errorDatos || "Datos incompletos");
    if (d.invitado.pases != null && (!Number.isInteger(d.invitado.pases) || d.invitado.pases < 0))
      throw new Error(d.textos.errorPases);
    return d;
  }
  async function obtenerDatos() {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const url = new URL("datos.js", document.baseURI);
      url.searchParams.set("v", String(Date.now()));
      script.src = url.href;
      script.onload = resolve;
      script.onerror = () => reject(new Error("No se pudo abrir datos.js"));
      document.head.append(script);
    });
    return validarDatos(window.INVITACION_DATOS);
  }

  window.Invitacion.cargarDatos = obtenerDatos;
})();
