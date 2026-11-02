(() => {
  window.Invitacion.iniciarConfirmacion = function (datos, config = { confirmacionUrl: null }) {
    function prepararRespuesta(form, invitado) {
      const f = new FormData(form),
        asistencia = f.get("asistencia");
      const nombre = String(f.get("nombre") || "").trim();
      const adultos = asistencia === "si" ? Number(f.get("adultos")) : 0;
      const ninos = asistencia === "si" ? Number(f.get("ninos")) : 0;
      if (
        !nombre ||
        !["si", "no"].includes(asistencia) ||
        !Number.isInteger(adultos) ||
        !Number.isInteger(ninos) ||
        adultos < 0 ||
        ninos < 0 ||
        (asistencia === "si" && adultos + ninos < 1)
      )
        throw new Error(datos.textos.errorRespuesta);
      if (invitado.pases != null && adultos + ninos > invitado.pases)
        throw new Error(datos.textos.excesoPases.replace("{pases}", invitado.pases));
      return { invitadoId: invitado.id, nombre, asistencia, adultos, ninos };
    }
    async function enviarRespuesta(payload) {
      if (!config.confirmacionUrl) return { modo: "demostracion" };
      const response = await fetch(config.confirmacionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error(datos.textos.errorEnvio);
      return { modo: "enviado" };
    }

    const form = document.querySelector("#formulario-rsvp");
    const status = document.querySelector("#rsvp-estado");
    const button = form.querySelector("button[type=submit]");

    form.addEventListener("change", () => {
      for (const name of ["adultos", "ninos"])
        form.elements[name].disabled = form.elements.asistencia.value === "no";
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!datos || button.disabled) return;
      try {
        const payload = prepararRespuesta(form, datos.invitado);
        button.disabled = true;
        form.setAttribute("aria-busy", "true");
        status.textContent = config.confirmacionUrl
          ? datos.textos.enviando
          : datos.textos.validando;
        const result = await enviarRespuesta(payload);
        status.textContent =
          result.modo === "demostracion" ? datos.textos.pruebaCompleta : datos.textos.enviado;
      } catch (error) {
        status.textContent = error.message;
      } finally {
        button.disabled = false;
        form.removeAttribute("aria-busy");
      }
    });

    form.elements.nombre.value = datos.invitado.nombre || "";
    document.querySelector("#pases").textContent =
      datos.invitado.pases == null
        ? ""
        : datos.textos.pases.replace("{pases}", datos.invitado.pases);
    const respuesta = datos.invitado.respuesta;
    if (["si", "no"].includes(respuesta?.asistencia)) {
      form.elements.asistencia.value = respuesta.asistencia;
      form.elements.adultos.value = respuesta.adultos;
      form.elements.ninos.value = respuesta.ninos;
      form.dispatchEvent(new Event("change"));
    }
    button.textContent = config.confirmacionUrl ? datos.textos.confirmar : datos.textos.probar;
    status.textContent = config.confirmacionUrl ? "" : datos.textos.demo;
  };
})();
