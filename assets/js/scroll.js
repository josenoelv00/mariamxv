// Variante independiente: conserva los nodos HTML y sus eventos originales.
const invitation = document.querySelector('#invitacion');
function iniciarScroll() {
  document.documentElement.classList.add('scroll-apolo');
  invitation.tabIndex = 0;
  invitation.setAttribute('aria-label', 'Invitación de Marian, desplazamiento por secciones');
  const panels = invitation.querySelectorAll('#portada, #recuerdos, #fecha, .location, #vestimenta, #sobres, #hospedaje, #confirmacion, #cierre');
  for (const panel of panels) {
    const screen = document.createElement('div');
    screen.className = 'scroll-screen';
    panel.before(screen);
    screen.append(panel);
    if (panel.classList.contains('ceremony')) {
      screen.prepend(document.querySelector('#details-title'));
      screen.classList.add('scroll-screen-details');
    }
    {
      const composition = document.createElement('div');
      composition.className = 'scroll-composition';
      composition.append(...screen.childNodes);
      screen.append(composition);
    }
  }
  // Cada composición cabe completa en la pantalla, sin recortar elementos.
  const compositions = invitation.querySelectorAll('.scroll-composition');
  const message = invitation.querySelector('#confirmacion .rsvp-intro .body-copy');
  const originalMessage = message.textContent;
  const messageLines = ['Esperamos contar', 'con tu presencia', 'en este día tan', 'especial para mí.'];
  const updateMessage = () => {
    if (originalMessage.trim() === 'Esperamos contar con tu presencia en este día tan especial para mí.') {
      message.replaceChildren(...messageLines.map(text => {
        const line = document.createElement('span');
        line.className = 'rsvp-message-line';
        line.textContent = text;
        return line;
      }));
    } else message.textContent = originalMessage;
  };
  updateMessage();
  const fit = () => {
    const scales = [];
    const available = Math.max(1, invitation.clientHeight - 12);
    for (const composition of compositions) {
      const widthFactor = 1.12;
      // Misma base de composición en vertical y horizontal.
      composition.style.width = `${invitation.clientWidth * widthFactor}px`;
      const panel = composition.querySelector('#portada, #recuerdos, #fecha, #cierre');
      if (panel) {
        // Medir únicamente el contenido principal; los adornos no reservan altura.
        const zoom = Number(composition.style.zoom) || 1;
        const bounds = panel.getBoundingClientRect();
        const selectors = {
          portada: '.cover-frame',
          recuerdos: '.photos, .memory-frame, .frame-crown, .eyebrow',
          fecha: '.date-row, [data-field="evento.anio"], .script, #contador, .pending:not([hidden])',
          cierre: '.footer-number, .name'
        };
        const content = [...panel.querySelectorAll(selectors[panel.id])]
          .map(element => element.getBoundingClientRect());
        const top = Math.min(...content.map(rect => rect.top));
        const bottom = Math.max(...content.map(rect => rect.bottom));
        panel.style.marginTop = `${-Math.max(0, (top - bounds.top) / zoom - 8)}px`;
        panel.style.marginBottom = `${-Math.max(0, (bounds.bottom - bottom) / zoom - 8)}px`;
      }
      const scale = Math.min(1, available / Math.ceil(composition.getBoundingClientRect().height / (Number(composition.style.zoom) || 1)));
      scales.push(scale);
    }
    // Comparación: aplicar la misma escala mínima en ambas orientaciones.
    const commonScale = Math.min(...scales);
    compositions.forEach(composition => { composition.style.zoom = String(commonScale); });
  };
  const resize = new ResizeObserver(fit);
  resize.observe(invitation);
  compositions.forEach(composition => resize.observe(composition));
  fit();
  document.fonts.ready.then(fit);
  // Los enlaces directos se resuelven después de preparar la estructura.
  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    target?.scrollIntoView({behavior: 'instant', block: 'start'});
  }
}
if (!invitation.hidden) iniciarScroll();
else {
  const observer = new MutationObserver(() => {
    if (invitation.hidden) return;
    observer.disconnect();
    iniciarScroll();
  });
  observer.observe(invitation, {attributes: true, attributeFilter: ['hidden']});
}
