// Variante independiente: conserva los nodos HTML y sus eventos originales.
const invitation = document.querySelector('#invitacion');
function iniciarScroll() {
  document.documentElement.classList.add('scroll-apolo');
  invitation.tabIndex = 0;
  invitation.setAttribute('aria-label', 'Invitación de Marian, lectura continua');
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
  // El espacio entre contenidos es siempre 24 px; las flores pueden sobresalir.
  const compactar = () => {
    const selectors = {
      portada: '.cover-frame', recuerdos: '.photos, .memory-frame, .frame-crown, .eyebrow',
      fecha: '.date-row, [data-field="evento.anio"], .script, #contador, .pending:not([hidden])',
      cierre: '.footer-number, .name'
    };
    for (const [id, selector] of Object.entries(selectors)) {
      const panel = document.getElementById(id);
      const bounds = panel.getBoundingClientRect();
      const boxes = [...panel.querySelectorAll(selector)].map(node => node.getBoundingClientRect());
      panel.style.marginTop = `${bounds.top - Math.min(...boxes.map(box => box.top))}px`;
      panel.style.marginBottom = `${Math.max(...boxes.map(box => box.bottom)) - bounds.bottom}px`;
    }
  };
  const resize = new ResizeObserver(compactar);
  compositions.forEach(composition => resize.observe(composition));
  compactar();
  document.fonts.ready.then(compactar);
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
