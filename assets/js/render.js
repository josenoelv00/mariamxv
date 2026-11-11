(() => {
  let temporizadorFotos;
  function desintegrar(foto, marco) {
    const alto = marco.clientHeight;
    const ancho = marco.clientWidth;
    if (!ancho || !alto || !foto.naturalHeight) return;
    const lienzo = document.createElement("canvas");
    lienzo.width = ancho;
    lienzo.height = alto;
    lienzo.setAttribute("aria-hidden", "true");
    const ctx = lienzo.getContext("2d");
    if (!ctx) return;
    marco.append(lienzo);

    const escala = Math.min(foto.naturalWidth / ancho, foto.naturalHeight / alto);
    const origenX = (foto.naturalWidth - ancho * escala) / 2;
    const origenY = (foto.naturalHeight - alto * escala) / 2;
    const paso = Math.max(4, Math.ceil(ancho / 48));
    const polvo = [];
    for (let y = 0; y < alto; y += paso) {
      for (let x = 0; x < ancho; x += paso) {
        polvo.push({
          x, y, w: Math.min(paso, ancho - x), h: Math.min(paso, alto - y),
          inicio: 0.45 * (1 - x / ancho) + Math.random() * 0.15,
          dx: ancho * (0.05 + Math.random() * 0.25),
          dy: alto * (Math.random() * 0.12 - 0.17),
        });
      }
    }
    const inicio = performance.now();
    function dibujar(ahora) {
      if (!lienzo.isConnected) return;
      const tiempo = (ahora - inicio) / 1500;
      ctx.clearRect(0, 0, ancho, alto);
      for (const p of polvo) {
        const avance = Math.max(0, (tiempo - p.inicio) / 0.4);
        if (avance >= 1) continue;
        ctx.globalAlpha = 1 - avance;
        ctx.drawImage(foto, origenX + p.x * escala, origenY + p.y * escala, p.w * escala, p.h * escala,
          p.x + avance * p.dx, p.y + avance * p.dy, p.w * (1 - avance), p.h * (1 - avance));
      }
      if (tiempo < 1) requestAnimationFrame(dibujar);
      else lienzo.remove();
    }
    dibujar(inicio);
  }

  function mostrarFotos(imagenes) {
    clearInterval(temporizadorFotos);
    const marco = document.querySelector(".photos-track");
    const fotos = imagenes.map(({ archivo, descripcion }, i) => {
      const foto = document.createElement("img");
      foto.src = "assets/img/" + archivo;
      foto.alt = descripcion ?? "";
      foto.hidden = i !== 0;
      return foto;
    });
    marco.replaceChildren(...fotos);
    let actual = 0;
    if (fotos.length > 1) {
      temporizadorFotos = setInterval(() => {
        const siguiente = (actual + 1) % fotos.length;
        if (document.hidden || !fotos[siguiente].naturalWidth) return;
        if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
          desintegrar(fotos[actual], marco);
        }
        fotos[actual].hidden = true;
        fotos[siguiente].hidden = false;
        actual = siguiente;
      }, 3100);
    }
  }

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
    title.setAttribute("aria-label", d.portada.titulo);
    aplicarEstilos(d);
  }
  function aplicarEstilos(d) {
    // Solo enlaza la configuración editable; CSS calcula los tamaños adaptables.
    for (const [tipo, estilo] of Object.entries(d.estilos)) {
      document.documentElement.style.setProperty("--tamano-" + tipo, String(estilo.altura));
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
    mostrarFotos(d.fotografias.imagenes);
    aplicarContenido(d);
  };
})();
