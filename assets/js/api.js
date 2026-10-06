// Public configuration only. Agree the backend contract before setting endpoints.
export const config = {datosUrl: new URL('../../datos.json', import.meta.url), confirmacionUrl: null};
export function validarDatos(d) {
  if (!d?.portada || !d.evento || !d.invitado || !d.confirmacion || !d.vestimenta || !d.regalos || !Array.isArray(d.ubicaciones) || !Array.isArray(d.hospedaje)) throw new Error('Formato de invitación inválido');
  if (d.invitado.pases != null && (!Number.isInteger(d.invitado.pases) || d.invitado.pases < 0)) throw new Error('Cantidad de pases inválida');
  return d;
}
export async function obtenerDatos() {
  const response = await fetch(config.datosUrl, {cache:'no-store', signal:AbortSignal.timeout(15000)});
  if (!response.ok) throw new Error('No se pudieron cargar los datos');
  return validarDatos(await response.json());
}
export function prepararRespuesta(form, invitado) {
  const f = new FormData(form), asistencia = f.get('asistencia');
  const nombre = String(f.get('nombre') || '').trim();
  const adultos = asistencia === 'si' ? Number(f.get('adultos')) : 0;
  const ninos = asistencia === 'si' ? Number(f.get('ninos')) : 0;
  if (!nombre || !['si','no'].includes(asistencia) || !Number.isInteger(adultos) || !Number.isInteger(ninos) || adultos < 0 || ninos < 0 || (asistencia === 'si' && adultos + ninos < 1)) throw new Error('Revisa el nombre, la asistencia y las cantidades.');
  if (invitado.pases != null && adultos + ninos > invitado.pases) throw new Error(`Tu invitación incluye ${invitado.pases} pases.`);
  return {invitadoId:invitado.id, nombre, asistencia, adultos, ninos};
}
export async function enviarRespuesta(payload) {
  if (!config.confirmacionUrl) return {modo:'demostracion'};
  const response = await fetch(config.confirmacionUrl, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload), signal:AbortSignal.timeout(15000)});
  if (!response.ok) throw new Error('No se confirmó el envío. Inténtalo de nuevo más tarde.');
  return {modo:'enviado'};
}
