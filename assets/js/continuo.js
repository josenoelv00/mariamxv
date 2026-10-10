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
