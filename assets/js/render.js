(() => {
  function mostrarDatos(d) {
    const fecha = new Date(d.evento.inicio);
    if (Number.isFinite(fecha.getTime())) {
      const partes = new Intl.DateTimeFormat(d.idioma, {
        timeZone: d.zonaHoraria,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).formatToParts(fecha);
      const value = (type) => partes.find((p) => p.type === type)?.value;
      Object.assign(d.evento, {
        dia: value("day"),
        mes: value("month"),
        diaSemana: value("weekday"),
        anio: value("year"),
      });
    }
    document.title = d.tituloPagina;
    document.documentElement.lang = d.idioma;
    for (const section of document.querySelectorAll("[data-ubicacion]")) {
      const u = d.ubicaciones[Number(section.dataset.ubicacion)];
      section.querySelector(".time").textContent = u.hora ? u.hora + d.textos.sufijoHora : "";
      const link = section.querySelector("a");
      link.href = u.mapaUrl;
      link.textContent = d.textos.ubicacion;
      link.setAttribute("aria-label", d.textos.verUbicacion.replace("{nombre}", u.nombre));
    }
    for (const hotel of d.hospedaje) {
      const row = document.createElement("div"),
        h = document.createElement("h3"),
        a = document.createElement("a");
      h.textContent = hotel.nombre;
      h.dataset.estilo = "texto";
      a.textContent = d.textos.ubicacion;
      a.href = hotel.mapaUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "button";
      a.dataset.estilo = "texto";
      a.setAttribute("aria-label", d.textos.verUbicacion.replace("{nombre}", hotel.nombre));
      row.append(h, a);
      document.querySelector("#hoteles").append(row);
    }
    for (const c of d.vestimenta.colores) {
      const span = document.createElement("span");
      span.className = "swatch";
      span.style.backgroundColor = c.valor;
      span.title = c.nombre;
      span.setAttribute("role", "img");
      span.setAttribute("aria-label", d.textos.colorReservado.replace("{color}", c.nombre));
      document.querySelector("#colores").append(span);
    }
  }

  // Textos simples o listas: cada elemento de la lista conserva su salto de línea.
  function ponerTexto(elemento, valor) {
    const texto = Array.isArray(valor) ? valor.join("\n") : String(valor ?? "");
    elemento.textContent = texto;
  }
  // Enlaces entre contenido y elementos; no contiene frases de la invitación.
  function aplicarContenido(d) {
    const valor = (path) => path.split(".").reduce((o, k) => o?.[k], d);
    document
      .querySelectorAll("[data-field]")
      .forEach((el) => ponerTexto(el, valor(el.dataset.field)));
    document.querySelectorAll("[data-src]").forEach((el) => {
      el.src = "assets/img/" + valor(el.dataset.src);
    });
    document.querySelectorAll("[data-alt]").forEach((el) => {
      el.alt = valor(el.dataset.alt) ?? "";
    });
    document
      .querySelectorAll("[data-aria]")
      .forEach((el) => el.setAttribute("aria-label", valor(el.dataset.aria) ?? ""));
    const title = document.querySelector("#titulo");
    const text = d.portada.titulo.toLocaleUpperCase(d.idioma);
    title.setAttribute("aria-label", text);
    const letters = [...text.replace(/\s/g, "")];
    title.replaceChildren(
      ...letters.map((letter, i) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.setAttribute("aria-hidden", "true");
        span.className =
          "cover-letter cover-letter-" + Math.round((i * 12) / Math.max(1, letters.length - 1));
        return span;
      }),
    );
    const message = document.querySelector("#confirmacion .rsvp-intro .body-copy");
    const originalMessage = message.textContent;
    const messageLines = Array.isArray(d.confirmacion.mensaje)
      ? d.confirmacion.mensaje
      : d.confirmacion.mensaje.split("\n");
    const updateMessage = () => {
      if (messageLines.length > 1) {
        message.replaceChildren(
          ...messageLines.map((text) => {
            const line = document.createElement("span");
            line.className = "rsvp-message-line";
            line.textContent = text;
            return line;
          }),
        );
      } else message.textContent = originalMessage;
    };
    updateMessage();

    aplicarEstilos(d);
  }
  function aplicarEstilos(d) {
    for (const [tipo, estilo] of Object.entries(d.estilos)) {
      document.documentElement.style.setProperty(
        "--fuente-" + tipo,
        JSON.stringify(estilo.fuente) + ", serif",
      );
      document.documentElement.style.setProperty(
        "--interlineado-" + tipo,
        String(estilo.interlineado),
      );
    }
  }

  window.Invitacion.renderizar = (d) => {
    mostrarDatos(d);
    aplicarContenido(d);
  };
})();
