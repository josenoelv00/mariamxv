// Generado por tools/generar_arranque.py. No editar a mano.
(async () => {
// Public configuration only. Agree the backend contract before setting endpoints.
const config = {datosUrl: new URL('datos.json', document.baseURI), confirmacionUrl: null};
function validarDatos(d) {
  if (!d?.portada || !d.evento || !d.invitado || !d.confirmacion || !d.vestimenta || !d.regalos || !Array.isArray(d.ubicaciones) || !Array.isArray(d.hospedaje)) throw new Error('Formato de invitación inválido');
  if (d.invitado.pases != null && (!Number.isInteger(d.invitado.pases) || d.invitado.pases < 0)) throw new Error('Cantidad de pases inválida');
  return d;
}
async function obtenerDatos() {
  if (location.protocol === "file:") return validarDatos({"tituloPagina": "Mis quince años · Marian", "idioma": "es-MX", "zonaHoraria": "America/Mexico_City", "invitado": {"id": null, "nombre": "", "contacto": "", "pases": null, "respuesta": {"asistencia": "pendiente", "adultos": 0, "ninos": 0, "mensaje": ""}}, "portada": {"introduccion": "Estás invitado a celebrar conmigo", "titulo": "Mis quince años", "protagonista": "Marian"}, "mensaje": {"titulo": "Mis quince años", "texto": ""}, "familia": {"titulo": "", "grupos": []}, "evento": {"inicio": "2026-12-26T18:00:00-06:00", "fin": null, "titulo": "Mis quince años · Marian", "descripcion": "", "lugar": "Santa Iglesia Catedral Teziutlán", "mensajeFinalContador": "La fecha del evento ha llegado.", "dia": 26, "mes": "Diciembre", "diaSemana": "Sábado", "anio": 2026}, "ubicaciones": [{"titulo": "Ceremonia religiosa", "nombre": "Santa Iglesia Catedral Teziutlán", "direccion": "", "hora": "18:00", "mapaUrl": "https://maps.app.goo.gl/rNKbdZCgygEtRpni8", "imagen": "catedral-teziutlan.png", "descripcion": ""}, {"titulo": "Recepción", "nombre": "Centro de Convenciones", "direccion": "", "hora": null, "mapaUrl": "https://maps.app.goo.gl/hVikkhAvacAYZX6H9", "imagen": "centro-convenciones.jpg", "descripcion": "Después de la ceremonia religiosa, los esperamos en"}], "itinerario": [], "confirmacion": {"mensaje": "Esperamos contar con tu presencia en este día tan especial para mí.", "modo": "demostracion", "destino": null}, "notas": {"titulo": "", "texto": ""}, "vestimenta": {"titulo": "Código de vestimenta", "tipo": "Formal", "nota": "Colores reservados para la festejada", "colores": [{"nombre": "Fucsia", "valor": "#D226C6"}, {"nombre": "Dorado", "valor": "#DBAF47"}, {"nombre": "Blanco", "valor": "#FFFFFF"}]}, "regalos": {"titulo": "Lluvia de sobres", "texto": "Tu presencia es lo más importante para compartir y disfrutar, pero si deseas tener un detalle, agradecería que fuera en efectivo."}, "hospedaje": [{"nombre": "Hotel Blue city", "mapaUrl": "https://maps.app.goo.gl/fhqYUdDgf3K7RZeG6"}, {"nombre": "Hotel Danini", "mapaUrl": "https://maps.app.goo.gl/9G1BNrn88nbVLxUc7"}, {"nombre": "Hotel Central", "mapaUrl": "https://maps.app.goo.gl/fB6YG1opVFdtbMQ2A"}], "reproduccion": {"width": 1024.5, "height": 10637.25, "imagen": "assets/fiel/invitacion.svg", "contador": "referencia-estatica", "campos": [{"id": "nombre", "rect": [255.879, 9449.398, 805.768, 9511.261]}, {"id": "asistencia-si", "rect": [255.307, 9611.501, 806.341, 9679.092]}, {"id": "asistencia-no", "rect": [255.307, 9691.693, 806.341, 9760.429]}, {"id": "adultos", "rect": [255.879, 9859.523, 805.768, 9922.531]}, {"id": "ninos", "rect": [255.879, 10022.199, 805.768, 10085.207]}, {"id": "enviar", "rect": [255.307, 10110.983, 806.341, 10184.302]}], "mapas": [{"nombre": "Santa Iglesia Catedral Teziutlán", "url": "https://maps.app.goo.gl/rNKbdZCgygEtRpni8", "rect": [397.314697265625, 4534.5625, 622.314697265625, 4577.3125]}, {"nombre": "Centro de Convenciones", "url": "https://maps.app.goo.gl/hVikkhAvacAYZX6H9", "rect": [397.314697265625, 5519.3701171875, 622.314697265625, 5562.1201171875]}, {"nombre": "Hotel Blue city", "url": "https://maps.app.goo.gl/fhqYUdDgf3K7RZeG6", "rect": [389.9261779785156, 8292.203125, 614.9261474609375, 8334.953125]}, {"nombre": "Hotel Danini", "url": "https://maps.app.goo.gl/9G1BNrn88nbVLxUc7", "rect": [389.9261779785156, 8404.6103515625, 614.9261474609375, 8447.3603515625]}, {"nombre": "Hotel Central", "url": "https://maps.app.goo.gl/fB6YG1opVFdtbMQ2A", "rect": [389.9261779785156, 8528.837890625, 614.9261474609375, 8571.587890625]}]}});
  const response = await fetch(config.datosUrl, {cache:'no-store', signal:AbortSignal.timeout(15000)});
  if (!response.ok) throw new Error('No se pudieron cargar los datos');
  return validarDatos(await response.json());
}
function prepararRespuesta(form, invitado) {
  const f = new FormData(form), asistencia = f.get('asistencia');
  const nombre = String(f.get('nombre') || '').trim();
  const adultos = asistencia === 'si' ? Number(f.get('adultos')) : 0;
  const ninos = asistencia === 'si' ? Number(f.get('ninos')) : 0;
  if (!nombre || !['si','no'].includes(asistencia) || !Number.isInteger(adultos) || !Number.isInteger(ninos) || adultos < 0 || ninos < 0 || (asistencia === 'si' && adultos + ninos < 1)) throw new Error('Revisa el nombre, la asistencia y las cantidades.');
  if (invitado.pases != null && adultos + ninos > invitado.pases) throw new Error(`Tu invitación incluye ${invitado.pases} pases.`);
  return {invitadoId:invitado.id, nombre, asistencia, adultos, ninos};
}
async function enviarRespuesta(payload) {
  if (!config.confirmacionUrl) return {modo:'demostracion'};
  const response = await fetch(config.confirmacionUrl, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload), signal:AbortSignal.timeout(15000)});
  if (!response.ok) throw new Error('No se confirmó el envío. Inténtalo de nuevo más tarde.');
  return {modo:'enviado'};
}

function mostrarDatos(d){document.title=d.tituloPagina;document.documentElement.lang=d.idioma;document.querySelectorAll('[data-field]').forEach(el=>{el.textContent=el.dataset.field.split('.').reduce((o,k)=>o?.[k],d)??'';});for(const u of d.ubicaciones){const node=document.querySelector('#ubicacion-template').content.cloneNode(true);node.querySelector('h2').textContent=u.titulo;const img=node.querySelector('.venue');img.src='assets/img/'+u.imagen;img.alt=u.nombre;node.querySelector('.venue-name').textContent=u.nombre;node.querySelector('.description').textContent=u.descripcion;node.querySelector('.time').textContent=u.hora?u.hora+' hrs.':'';const link=node.querySelector('a');link.href=u.mapaUrl;link.setAttribute('aria-label','Ver ubicación de '+u.nombre);if(u===d.ubicaciones[0]){const card=node.querySelector('article');card.classList.add('ceremony');for(const [cls,asset] of [['ceremony-flowers','ramita-dos-flores.svg'],['ceremony-leaves','ramo-delicado.svg'],['ceremony-butterfly','mariposa-dorada.svg']]){const decor=document.createElement('img');decor.className=cls;decor.src='assets/img/'+asset;decor.alt='';card.append(decor);}for(const cls of ['ornate-top','ornate-bottom']){const line=document.createElement('span');line.className=cls;line.setAttribute('aria-hidden','true');line.textContent='✧';card.append(line);}}if(u===d.ubicaciones[1]){const card=node.querySelector('article');card.classList.add('reception');card.id='recepcion';for(const [cls,asset] of [['reception-flower','flor-dorada.svg'],['reception-flowers','ramita-dos-flores.svg'],['reception-branch','rama-floral-horizontal.svg'],['reception-butterfly','mariposa-dorada.svg']]){const decor=document.createElement('img');decor.className=cls;decor.src='assets/img/'+asset;decor.alt='';card.append(decor);}for(const cls of ['ornate-top','ornate-bottom']){const line=document.createElement('span');line.className=cls;line.setAttribute('aria-hidden','true');line.textContent='✧';card.append(line);}}document.querySelector('#lista-ubicaciones').append(node);}for(const hotel of d.hospedaje){const row=document.createElement('div'),h=document.createElement('h3'),a=document.createElement('a');h.textContent=hotel.nombre;a.textContent='Ubicación ↗';a.href=hotel.mapaUrl;a.target='_blank';a.rel='noopener noreferrer';a.className='button';a.setAttribute('aria-label','Ver ubicación de '+hotel.nombre);row.append(h,a);document.querySelector('#hoteles').append(row);}for(const c of d.vestimenta.colores){const span=document.createElement('span');span.className='swatch';span.style.backgroundColor=c.valor;span.title=c.nombre;span.setAttribute('role','img');span.setAttribute('aria-label',c.nombre+' reservado para la festejada');document.querySelector('#colores').append(span);}}

function ajustarPortada() {
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

})();
