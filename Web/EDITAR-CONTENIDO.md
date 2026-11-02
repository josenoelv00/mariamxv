# Editar la invitación

El único archivo de contenido es `datos.js`. Funciona al abrir `index.html` directamente y en GitHub Pages. Guarda y recarga después de editar.

| Contenido | Campo |
|---|---|
| Seis estilos globales | estilos: 15, quince, marian, titulo, frase, texto |
| Portada y nombre/edad del cierre | portada |
| Papás y padrinos | familia.papas / familia.padrinos |
| Fotografías y sus descripciones | fotografias.imagenes |
| Fecha, contador y frase inferior | evento |
| Ceremonia y recepción | ubicaciones[0] / ubicaciones[1] |
| Vestimenta | vestimenta |
| Regalos | regalos |
| Hoteles | hospedaje |
| Mensaje y título de confirmación | confirmacion.mensaje / confirmacion.titulo |
| Datos del invitado | invitado |
| Etiquetas y avisos | textos |

Cada estilo tiene fuente, altura (base de 1000 unidades) e interlineado. La escala se calcula igual para todas las secciones.

Para elegir cortes de línea:

```js
"frase": [
  "Primera línea",
  "Segunda línea"
]
```

También se acepta un texto simple. Una línea demasiado larga se ajusta al ancho disponible. `confirmacion.titulo` es opcional: actualmente está omitido, por lo que no aparece un encabezado sobre el mensaje de confirmación.

Las fotos variables se configuran una sola vez en datos.js. Los adornos pertenecen al diseño y están en HTML/CSS. El título de fotografías y el nombre/edad del cierre reutilizan los datos de portada.

`index.html` contiene las 12 secciones. Sus atributos data-field, data-src y data-alt enlazan contenido, imágenes y descripciones. JavaScript carga esos enlaces; no guarda otra copia de las frases. Los avisos de carga y JavaScript desactivado permanecen en HTML porque deben funcionar cuando los datos no cargan.

Todos los archivos de la invitación están en `Web`: `index.html`, `datos.js` y la carpeta `assets`. Para verla localmente, abre `Web/index.html`.

El formulario de confirmación funciona en modo de prueba: valida los campos, pero no envía ni guarda respuestas. El horario de recepción está pendiente (`ubicaciones[1].hora` es `null`).
