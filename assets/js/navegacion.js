(() => {
  // Resuelve enlaces a secciones después de cargar el contenido; no mide ni distribuye.
  window.Invitacion.iniciarNavegacion = function () {
    function irASeccion() {
      if (!location.hash) return;
      let id;
      try {
        id = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    }
    window.addEventListener("hashchange", irASeccion);
    document.fonts.ready.then(irASeccion);
  };
})();
