(() => {
  window.Invitacion.iniciarContador = function (datos) {
    const inicio = datos.evento.inicio;
    const objetivo =
      typeof inicio === "string" && /(Z|[+-]\d{2}:\d{2})$/.test(inicio) ? Date.parse(inicio) : NaN;
    if (Number.isFinite(objetivo)) {
      document.querySelector("#fecha-pendiente").hidden = true;
      const tick = () => {
        const n = Math.max(0, objetivo - Date.now());
        const values = [
          Math.floor(n / 86400000),
          Math.floor(n / 3600000) % 24,
          Math.floor(n / 60000) % 60,
          Math.floor(n / 1000) % 60,
        ];
        document.querySelectorAll("#contador span").forEach((el, i) => {
          el.firstChild.textContent = String(values[i]).padStart(2, "0");
        });
        if (!n) {
          const note = document.querySelector("#fecha-pendiente");
          note.hidden = false;
          note.textContent = datos.evento.mensajeFinalContador;
        }
        return n;
      };
      if (tick()) {
        const timer = setInterval(() => {
          if (!tick()) clearInterval(timer);
        }, 1000);
      }
    }
  };
})();
