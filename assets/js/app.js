import {ajustarPortada} from './portada.js';
import {obtenerDatos, prepararRespuesta, enviarRespuesta, config} from './api.js';
import {mostrarDatos} from './render.js?v=reception-1';
const form = document.querySelector('#formulario-rsvp');
const status = document.querySelector('#rsvp-estado');
const button = form.querySelector('button[type=submit]');
let datos;
form.addEventListener('change', () => {
  for (const name of ['adultos','ninos']) form.elements[name].disabled = form.elements.asistencia.value === 'no';
});
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!datos || button.disabled) return;
  try {
    const payload = prepararRespuesta(form, datos.invitado);
    button.disabled = true;
    form.setAttribute('aria-busy','true');
    status.textContent = config.confirmacionUrl ? 'Enviando respuesta…' : 'Validando…';
    const result = await enviarRespuesta(payload);
    status.textContent = result.modo === 'demostracion' ? 'Prueba completada. No se enviaron ni guardaron datos.' : 'Tu respuesta se ha enviado.';
  } catch (error) { status.textContent = error.message; }
  finally { button.disabled = false; form.removeAttribute('aria-busy'); }
});
try {
  datos = await obtenerDatos();
  mostrarDatos(datos);
  await document.fonts.load("100px Alice");
  ajustarPortada();
  form.elements.nombre.value = datos.invitado.nombre || '';
  document.querySelector('#pases').textContent = datos.invitado.pases == null ? '' : `Esta invitación incluye ${datos.invitado.pases} pases.`;
  const respuesta = datos.invitado.respuesta;
  if (['si','no'].includes(respuesta?.asistencia)) {
    form.elements.asistencia.value = respuesta.asistencia;
    form.elements.adultos.value = respuesta.adultos;
    form.elements.ninos.value = respuesta.ninos;
    form.dispatchEvent(new Event('change'));
  }
  button.textContent = config.confirmacionUrl ? 'Confirmar asistencia' : 'Probar confirmación';
  status.textContent = config.confirmacionUrl ? '' : 'Formulario de prueba. El envío aún no está conectado.';
  const inicio = datos.evento.inicio;
  const objetivo = typeof inicio === 'string' && /(Z|[+-]\d{2}:\d{2})$/.test(inicio) ? Date.parse(inicio) : NaN;
  if (Number.isFinite(objetivo)) {
    document.querySelector('#fecha-pendiente').hidden = true;
    const tick = () => {
      const n = Math.max(0, objetivo - Date.now());
      const values = [Math.floor(n/86400000),Math.floor(n/3600000)%24,Math.floor(n/60000)%60,Math.floor(n/1000)%60];
      document.querySelectorAll('#contador span').forEach((el,i) => { el.firstChild.textContent = String(values[i]).padStart(2,'0'); });
      if (!n) { const note = document.querySelector('#fecha-pendiente'); note.hidden = false; note.textContent = datos.evento.mensajeFinalContador; }
      return n;
    };
    if (tick()) { const timer = setInterval(() => { if (!tick()) clearInterval(timer); },1000); }
  }
  document.querySelector('#invitacion').hidden = false;
  document.querySelector('#estado').hidden = true;
} catch (error) {
  document.querySelector('#estado').textContent = 'No se pudo cargar la invitación. Recarga la página para intentarlo de nuevo.';
  console.error(error);
}
