export function ajustarPortada() {
  const title = document.querySelector('#titulo');
  const text = title.textContent.toLocaleUpperCase('es-MX');
  title.setAttribute('aria-label', text);
  const letters = [...text];
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = '100px Alice';
  const weights = letters.map(c => ctx.measureText(c).width);
  const total = weights.reduce((a,b) => a+b,0);
  let used = 0;
  title.replaceChildren(...letters.map((letter, i) => {
    const el = document.createElement('span');
    el.className = 'arc-letter';
    el.textContent = letter;
    el.setAttribute('aria-hidden', 'true');
    const degrees = letters.length > 1 ? -57 + (used + weights[i]/2) * 114 / total : 0; used += weights[i];
    const angle = degrees * Math.PI / 180;
    el.style.left = `${50 + Math.sin(angle) * 32}%`;
    el.style.top = `${26.6 + (1 - Math.cos(angle)) * 16}%`;
    el.style.setProperty('--angle', `${degrees}deg`);
    return el;
  }));
  const name = document.querySelector('#portada .name');
  // Keep long API-provided names inside the card without rasterizing the text.
  if (name.textContent.length > 9) name.style.fontSize = `${Math.max(8, 18 * 9 / name.textContent.length)}cqw`;
}
