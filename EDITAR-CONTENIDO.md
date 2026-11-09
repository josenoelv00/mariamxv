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
| Mensaje y título de confirmación | confirmacion.mensaje / confirmacion.titulo |
| Datos del invitado | invitado |
| Etiquetas y avisos | textos |

Cada estilo tiene fuente, altura (base de 1000 unidades) e interlineado. JavaScript enlaza esos valores a variables; CSS calcula el tamaño según el ancho de composición. No hay zoom global ni mediciones de pantalla en JavaScript.

Para elegir cortes de línea:

```js
"frase": [
  "Primera línea",
  "Segunda línea"
]
```

También se acepta un texto simple. Una línea demasiado larga se ajusta al ancho disponible. `confirmacion.titulo` es opcional: actualmente está omitido, por lo que no aparece un encabezado sobre el mensaje de confirmación.

Las fotos variables se configuran una sola vez en datos.js. Los adornos pertenecen al diseño y están en HTML/CSS. El título de fotografías y el nombre/edad del cierre reutilizan los datos de portada.

`index.html` contiene las 11 secciones. Sus atributos data-field, data-src y data-alt enlazan contenido, imágenes y descripciones. JavaScript carga esos enlaces; no guarda otra copia de las frases. Los avisos de carga y JavaScript desactivado permanecen en HTML porque deben funcionar cuando los datos no cargan.

Todos los archivos de la invitación están en la carpeta principal: `index.html`, `datos.js` y la carpeta `assets`. Para verla localmente, abre `index.html`.

El formulario de confirmación funciona en modo de prueba: valida los campos, pero no envía ni guarda respuestas. El horario de recepción se edita en `ubicaciones[1].hora`.

## Dónde cambiar cada cosa

- `index.html`: las 11 pantallas y sus contenedores están definidos aquí; los scripts no los crean ni los reordenan.
- `assets/css/base.css`: fuentes locales, elementos generales, botones y estados accesibles.
- `assets/css/secciones.css`: composición de cada sección, fotos, marcos, adornos y capas.
- `assets/css/layout.css`: ancho adaptable, altura de las pantallas, espacio mínimo de las tarjetas, distribución y desplazamiento por secciones.
- `assets/css/tipografia.css`: tamaños, interlineados, estilos y excepciones tipográficas.
- `assets/js/render.js`: llena textos, imágenes, enlaces y colores desde `datos.js`. Copia la configuración tipográfica a variables CSS sin medir ni posicionar elementos.
- `assets/js/contador.js` y `confirmacion.js`: cuenta regresiva y formulario.
- `assets/js/navegacion.js`: abre enlaces directos a secciones después de cargar el contenido.

El antiguo `scroll.js` se eliminó. La altura mínima y el espacio libre se resuelven con CSS (`min-height`, flex y unidades de viewport), sin `ResizeObserver`, márgenes negativos calculados ni una escala impuesta por otra sección. Si el contenido necesita más altura, la pantalla crece y permite desplazarse para leerlo.
