# Flores-Marina 🌸

Una web estática de regalo para Marina: jardín interactivo donde se plantan flores,
pétalos cayendo de fondo y una carta que se abre al voltearla.

## Archivos

- `index.html` — estructura y textos (carta, título, mensajes).
- `styles.css` — diseño y animaciones (colores en `:root`).
- `script.js` — lógica (pétalos, flores, carta). Paletas de color en `PALETTES`.

No necesita compilación ni dependencias: solo HTML, CSS y JS.

## Cómo verlo en local

Abre `index.html` con doble clic, o sirve la carpeta con un servidor:

```bash
cd Flores-Marina
python -m http.server 8000
# abrir http://localhost:8000
```

## Cómo subirlo a GitHub Pages

### Opción A — Sitio de usuario (URL: https://AndresMontesAl.github.io)

1. Crea en GitHub un repositorio llamado exactamente `AndresMontesAl.github.io`.
2. Sube el contenido de esta carpeta (index.html, styles.css, script.js).
3. En Settings → Pages → Source, elige la rama `main` (carpeta raíz `/`).

### Opción B — Sitio de proyecto (URL: https://AndresMontesAl.github.io/flores-marina)

1. Crea un repositorio llamado `flores-marina`.
2. Sube el contenido de esta carpeta.
3. Settings → Pages → Source → rama `main`, carpeta raíz `/`.

Desde esta carpeta:

```bash
git init
git add .
git commit -m "Web para Marina"
git branch -M main
git remote add origin https://github.com/AndresMontesAl/flores-marina.git
git push -u origin main
```

Tarda ~1 minuto en publicarse la primera vez.

## Personalizar

- Carta y mensajes: edita los `<p>` dentro de `.card-back` en `index.html`.
- Firma ("— Andrés"): busca `.signature` en `index.html`.
- Colores del tema: variables en `:root` de `styles.css`.
- Colores de flores: `PALETTES` en `script.js`.
- Tipos de flor: `buildBloom` en `script.js` (loop, spiral, pompom — flores de limpiapipas).
