# Ravyn Web — Handoff de Rediseño v2.0
Estado al 2026-06-08 · para continuar en una sesión nueva

Este documento permite a una sesión nueva (o a Claude fresco) terminar el rediseño sin re-derivar contexto. Léelo completo antes de tocar código. El plan maestro está en `context/REDESIGN_PLAN.md` (v2.0).

---

## TL;DR — qué falta

- **Fase 9 — Ravynset** (6 secciones): NO empezada. Es el trabajo grande pendiente.
- **Fase 10 — Pulido**: NO empezada. Audit de CSS muerto, AuthModal/AccountModal restyle, revisión tipográfica/spacing.
- **Observaciones del usuario**: pendientes de aplicar (ver sección al final).

Fases 0–8: **COMPLETADAS**.

---

## Estado del proyecto (qué ya se hizo)

| Fase | Qué | Estado |
|---|---|---|
| 0 | Tokens, fuentes, assets, sin dark mode | ✅ |
| 1 | Navbar + Footer | ✅ |
| 2 | Hero (landing) | ✅ |
| 3 | Manifiesto + Arquitectura | ✅ |
| 4 | Studio (Servicios) | ✅ |
| 5 | Labs (Proyectos) + ProjectModal | ✅ |
| 6 | Proceso (motivo del tallo) | ✅ |
| 7 | Cierre (Contacto) + ContactModal | ✅ |
| 8 | Klino (6 secciones) | ✅ |
| 9 | Ravynset (6 secciones) | ⛔ PENDIENTE |
| 10 | Pulido | ⛔ PENDIENTE |

Landing actual (`src/views/Landing.tsx`): Hero → Manifiesto → Arquitectura → Servicios(Studio) → Proyectos(Labs) → Proceso → Contacto(Cierre) → Footer.

---

## Setup técnico (gotchas críticos — no re-descubrir)

1. **Tailwind v4.** `src/tailwind.css` usa `@import "tailwindcss";` + `@config "../tailwind.config.js";`. Los tokens de marca (pine/radish/sprout/cream/cream-2/muted, font-display/body/mono, radius, fontSize) están en `tailwind.config.js`. NO usar la sintaxis v3 `@tailwind base/...` (rompe utilidades). Breakpoint `md:` = `@media (min-width:48rem)` (v4 usa rem, no px).

2. **Fuentes locales** en `public/fonts/` cargadas vía `@font-face` en `index.html`:
   - `Fraunces-Variable.ttf` (Roman, 100–900)
   - `Fraunces-Italic-400.ttf` y `Fraunces-Italic-600.ttf` (italic REAL — el Variable del brand kit NO tiene italic; se bajaron de Google Fonts). `font-style: italic` ya funciona.
   - `SpaceGrotesk-Variable.ttf`, `JetBrainsMono-Variable.ttf`
   No usar Google Fonts por red.

3. **Sin dark mode.** `useTheme.ts` devuelve `'light'` fijo. No hay toggle.

4. **Assets de marca** en `public/brand/`: `logo-light.png` (lockup pine sobre claro, usado en nav), `logo-dark.png` (lockup sobre oscuro, usado en footer), `symbol-pine.png` (rábano pine), `symbol-cream.png` (rábano cream). Iconos del brand kit en `src/assets/icons/*.svg` (aún sin usar mucho).

5. **⚠️ Navbar sobre fondos oscuros.** El nav al tope (no scrolleado) es **transparente con logo y links en pine** (diseñado para cream). Sobre un fondo pine/oscuro al tope, el logo y links quedan invisibles. Por eso **los heroes deben ser cream**, no pine. Los momentos pine van más abajo (donde el nav ya tiene fondo cream por scroll) o en cards internas. Esto cambió el plan: el hero de Klino terminó cream, no pine.

---

## Tokens y reglas de marca (resumen operativo)

**Colores (CSS vars en `global.css`):** `--color-pine #10342A` · `--color-radish #E0436B` · `--color-sprout #34C759` · `--color-cream #FAF6EE` · `--color-cream-2 #F1EBDD` · `--color-muted #5C7268`. Alias útiles: `--text` (=pine), `--text-secondary`, `--text-muted`, `--border` (pine 8%), `--border-strong` (pine 15%), `--bg`, `--bg-raised`, `--bg-hover`.

**Tipografía:** `--font-display` (Fraunces 600; italic para momentos de marca, NUNCA en párrafos largos) · `--font-sans` (Space Grotesk, cuerpo/UI) · `--font-mono` (JetBrains Mono, labels/datos/números).

**Radios:** `--radius-pill` (100px, botones) · `--radius-lg` (18px, cards/modales) · `--radius-md` (14px, inputs).

**Botones:** clases globales `.btn-primary` (radish pill) y `.btn-secondary` (outline pine pill) en `global.css`.

**Animación (regla del sitio):** solo `opacity 0→1` + `translateY 16px→0`. Duración 0.4–0.65s. Easing `[0.22, 1, 0.36, 1]`. Stagger 80ms. Scroll-trigger: `whileInView` con `viewport={{ once: true, amount: 0.3–0.4 }}`. NADA de glow, gradientes animados, escalas en hover, 3D, blur. Excepción única: el "tallo" de Proceso (`scaleY 0→1`, origin top, 0.8s, ease `[0,0,0.2,1]`).

**Voz:** cálido, directo, con raíz, anti-humo. Prohibido: premium, disrupción, sinergia, llave en mano, revolucionario. Segunda persona (tú). Frases cortas.

**Estructura de sección típica (patrón editorial):**
```
<section id="x" className="cream-bg, padding clamp(80px,12vh,130px)">
  <span mono> 0X · Label </span>            // o label sin número en sub-apps
  <h2 Fraunces 600 clamp(34px,4.4vw,56px)>  // pine
  ...contenido editorial: listas con border-top pine/12, sin cards pesadas...
```

---

## Identidad de productos (CONFIRMADA por el usuario — el código las tenía cruzadas)

- **Klino** = app de **documentación clínica por voz**. Transcribe la consulta y genera la nota clínica conforme a NOM-004/NOM-024. El médico revisa y firma. BETA (gratis en beta, ~$600 MXN/mes al lanzar). 2º lugar Innovatec 2026 — Salud. Stack: Speech-to-Text, IA, Expo, n8n, Supabase. (Página ya reescrita en Fase 8.)
- **Ravynset** = **CRM para clínicas** (agenda/citas, expedientes de pacientes, WhatsApp automático, reseñas en Google Maps). Estado LIVE. **ESTE es el producto de la Fase 9.** NO es "experiencias de regalo digitales" (eso era la identidad vieja, muerta).
- **Shield Sense** = wearable IoT (detección de impactos en gorro para adultos mayores). CRECIENDO. 1er lugar Innovatec 2026. Sin página dedicada (solo modal en Labs).

---

## FASE 9 — Ravynset (instrucciones de ejecución)

**Objetivo:** reescribir las 6 secciones de Ravynset como CRM para clínicas, espejo de lo que se hizo en Klino. La página de Klino (Fase 8) es la **referencia de patrón** — copia su estructura, estilos y animaciones, cambiando el copy al CRM.

**Archivos a reescribir** (todos en `src/components/sections/`):
- `RavynsetHero.tsx` — copiar patrón de `KlinoHero.tsx` (cream bg, breadcrumb "← Ravyn Labs", badge radish "Ravynset · Live", símbolo pine textura). Copy CRM.
- `RavynsetProblema.tsx` — narrativa editorial estilo `KlinoProblema.tsx` (Fraunces italic, centrado). Persona: clínica que pierde citas/pacientes entre cuaderno, WhatsApp del recepcionista y Excel.
- `RavynsetIncluye.tsx` — lista editorial estilo `KlinoIncluye.tsx` (grid 40/60, sticky left). Capacidades reales: agenda 24/7 sincronizada con WhatsApp, expedientes centralizados, motor de reseñas Google Maps, recordatorios automáticos.
- `RavynsetProceso.tsx` — motivo del tallo estilo `KlinoProceso.tsx`.
- `RavynsetPlanes.tsx` — Ravynset es LIVE (no beta). Revisar el archivo actual para ver si hay precios reales que preservar; si los hay, mantenerlos; si no, planes simples. Restyle a marca (estilo `KlinoPlanes.tsx`). Mantener cualquier lógica de form/waitlist que exista.
- `RavynsetFAQ.tsx` — accordion estilo `KlinoFAQ.tsx`, preguntas de CRM.

**Datos reales de Ravynset (de `Proyectos.tsx`, fuente de verdad):**
- description: "CRM para clínicas que centraliza la gestión de citas y pacientes en un solo lugar, con agenda inteligente y comunicación automática por WhatsApp."
- problem: "La gestión de citas y pacientes vive dispersa entre cuadernos, WhatsApp del recepcionista y hojas de Excel. Las clínicas pierden tiempo, citas y seguimiento de pacientes."
- solution: "Un CRM diseñado para clínicas: agenda 24/7 sincronizada con WhatsApp, expedientes de pacientes centralizados y motor automático de reseñas en Google Maps."
- tech: React, n8n, WhatsApp API, Google Maps API, CRM.
- Estado: LIVE.

**Pasos concretos:**
1. Leer los 6 archivos `Ravynset*.tsx` actuales (usan `BlurText` + estilos viejos, identidad probablemente vieja de "regalos digitales" o genérica) para extraer cualquier dato real (precios, planes, lógica de form).
2. Reescribir cada uno copiando el patrón del `Klino*.tsx` equivalente, con copy de CRM. Reemplazar `BlurText` por fade-up `motion` sobrio (ver cualquier sección de Klino).
3. Revisar el orden en `src/views/Ravynset.tsx` (debe ser Hero → Problema → Incluye → Proceso → Planes → FAQ). Actualizar `document.title` a algo como `'Ravynset — CRM para clínicas · Ravyn Labs'`.
4. `BlurText` quedará huérfano tras la Fase 9 → eliminar `src/components/animations/BlurText.tsx` y verificar que nada más lo importa.
5. Verificar: `npx tsc --noEmit` (sin output = OK), `npx vite build` (buscar "built in"; luego `rm -rf dist`), `curl -s -o /dev/null -w "%{http_code}" http://localhost:5176/ravynset`.

**Diferenciador Ravynset vs Klino:** Ravynset es LIVE (no beta) → el CTA es "Empieza hoy" / "Agenda una demo", no "Únete al beta". El badge es `Ravynset · Live` (usar color sprout en el dot para LIVE, como en `Proyectos.tsx` statusColor).

---

## FASE 10 — Pulido (instrucciones)

1. **AuthModal.tsx + AccountModal.tsx**: aún usan estilos viejos. Las clases `.form-*` en `global.css` siguen con fondo oscuro (`rgba(255,255,255,0.03)`, `--accent-glow`). Restyle a tema claro cream/pine/radish (referencia: `ContactModal.tsx` campos `.cm-input`). Revisar que se vean bien sobre cream.

2. **Audit de CSS muerto en `global.css`** (dejado para esta fase): tras Fases 8–9, las sub-apps ya no usan `.section`, `.section-label`, ni los viejos `.hero-*`/`.hero-card-*`. Grep para confirmar 0 refs y eliminar. También quedan reglas responsive viejas de `.servicio-*`, `.servicios-rotating-*`, `.hero-title`, `#servicios` que están muertas (el viejo Servicios y Hero ya no existen). Verificar con grep antes de borrar.

3. **Revisión tipográfica:** confirmar que `font-display` (Fraunces) no aparezca en ningún párrafo largo; que todos los CTAs sean radish; que no haya azul techno ni glow en ningún lado.

4. **Iconos del brand kit** (`src/assets/icons/`): opcional, usarlos donde aporten (hoy se usa Lucide solo funcionalmente).

5. **Checklist final** del plan v2 (sección "Checklist de coherencia") en `REDESIGN_PLAN.md`.

---

## Verificación rápida (cualquier fase)

Dev server: `http://localhost:5176/` (puede variar el puerto; arrancar con `npm run dev` si no responde).
```
npx tsc --noEmit            # sin output = limpio (ojo: NO encadenar con && echo, da falso positivo)
npx vite build              # buscar "✓ built in"; luego rm -rf dist
```
Rutas: `/` (landing), `/klino`, `/ravynset`.

---

## Componentes huérfanos ya eliminados (no recrear)
QuienesSomos, SolucionPersonalizada, Portafolio, Folder (+css), SplitText. Tras Fase 9: eliminar BlurText.

Animaciones que SÍ se conservan y usan: `RotatingText` (Hero landing), `CountUp` (si se usa con datos reales). Magnet lo usa MagicBento (probablemente huérfano; revisar en Fase 10).

---

## OBSERVACIONES DEL USUARIO (pendientes de aplicar)

> Correcciones del usuario sobre Fases 0–8. Aplicarlas ANTES de la Fase 9 (varias se propagan a Klino/Ravynset). Cada una tiene archivo + fix concreto. Validar en navegador tras cada una.

### O1 — Navbar: demasiado espacio vacío, fuente muy chica, botón CTA comprimido
**Archivo:** `src/components/Navbar.tsx`
- El nav usa `justify-between` que separa logo / links / login con mucho hueco vacío. Los links son `0.82rem` (muy chicos). El botón "Siembra tu proyecto" (`px-[18px] py-[9px]`, `text-[0.82rem]`) está tan comprimido que el texto+flecha se salen del fondo.
- **Fix:** Subir tamaño de fuente de links y CTA (~0.9–0.95rem). Agrandar el padding del botón CTA (ej. `px-[22px] py-[11px]`) para que el texto y "→" quepan con aire. Reducir el espacio vacío: agrupar links + CTA + login más juntos a la derecha (o poner un `max-width` al contenedor del nav y centrar), en vez de `justify-between` puro que reparte todo el ancho. Revisar que el conjunto respire pero no quede disperso.

### O2 — Hero: el texto rotativo causa "layout shift" (salta a 2 o 3 renglones)
**Archivo:** `src/components/sections/Hero.tsx`
- "Siembra tu [pill] con nosotros." a veces ocupa 2 renglones y a veces 3 (cuando la palabra del pill es larga, ej. "sistema"), y todo el sitio se recorre hacia arriba/abajo cada vez que rota. Se ve mal.
- **Fix (elegir uno, el usuario aceptó ambos):**
  - (a) **Forzar siempre 3 renglones** con el pill SIEMPRE en el 2º renglón: estructura fija "Siembra tu" / "[pill]" / "con nosotros." (cada uno su línea). Así nunca cambia de altura.
  - (b) **Reducir el tamaño de fuente** del H1 lo suficiente para que SIEMPRE quepa en 2 renglones sin importar la palabra.
  - En cualquier caso, **reservar altura fija** (min-height) en `.hero2-title` para que la rotación no desplace el resto. Recomendado: opción (a) + `min-height` o `nowrap` en la línea del pill.

### O3 — Eliminar los tags mono "0X · Label" ("01 · Semillero", "02 · Nosotros", etc.)
**Archivos:** `Hero.tsx` (`.hero2-overline` "01 · Semillero"), `Manifiesto.tsx` (`.manifiesto-label` "02 · Nosotros"), `Servicios.tsx` (`.studio2-label` "04 · Ravyn Studio"), `Proyectos.tsx` (`.labs2-label` "05 · Ravyn Labs"), `Proceso.tsx` (`.proceso2-label` "06 · Proceso").
- No aportan y son muy chicos. **Fix:** eliminarlos. Si se quieren conservar para SEO, dejarlos como `sr-only` (visualmente ocultos), pero la preferencia del usuario es quitarlos. Ajustar el `margin-bottom` del heading que les seguía para que no quede hueco raro.
- **PROPAGAR:** en Klino/Ravynset NO agregar labels numerados. (Klino usa labels con palabras como "El problema", "Qué hace Klino" — evaluar si el usuario también los quiere fuera; por defecto, en la landing quitarlos; en sub-apps preguntar o dejar solo si tienen palabra significativa, sin número.)

### O4 — 🐛 Sección 3 (Arquitectura) aparece VACÍA, solo se ve una línea vertical
**Archivo:** `src/components/sections/Arquitectura.tsx`
- Bug real: las dos columnas usan animación `clipPath: inset(...100%...)` que las colapsa (oculta). Si el `whileInView` no completa, quedan invisibles y solo se ve el divisor radish central. Además la columna Labs es `cream-2` (casi igual al cream del fondo) → bajo contraste aunque aparezca.
- **Fix:** Reemplazar la animación `clip-path` por el fade-up estándar del sitio (`opacity 0→1` + `translateY 16px→0`, `whileInView`, `viewport amount 0.2`). Esto garantiza que el contenido SIEMPRE se vea. Verificar que las dos columnas (pine + cream-2) muestren su texto. Si Labs (cream-2) queda con poco contraste contra la página, darle un borde o un fondo un poco más marcado.

### O5 — CTA "Cotiza tu proyecto" debe llevar el número real
**Archivo:** `src/components/sections/Servicios.tsx`
- Hoy apunta a `https://wa.me/528180000000` (placeholder).
- **Fix:** cambiar a `https://wa.me/528361168007` (+52 836 116 8007). (Es el mismo número que ya usa el Cierre/ContactModal.)

### O6 — Proceso: los números (01,02,03,04) quedan en MEDIO de la línea vertical
**Archivos:** `src/components/sections/Proceso.tsx` Y `src/components/sections/KlinoProceso.tsx` (mismo patrón, **propagar a ambos**; y a `RavynsetProceso.tsx` cuando se cree).
- `.proceso2-num` (y `.kproc-num`) está centrado en el rail, sobre el tallo, y la línea lo corta a la mitad. Se ve mal.
- **Fix:** Mover el número **a la izquierda** del tallo para que la línea no lo atraviese, hacerlo **más grande y en bold**. Opciones: sacar el número del rail y ponerlo en una columna propia a la izquierda del marcador, o desplazarlo. Que el círculo/marcador siga sobre el tallo pero el número quede limpio (más grande, `font-weight: 700`, en radish).

### O7 — Footer se funde con la sección "¿Qué quieres construir?" + agregar contacto y redes
**Archivos:** `src/components/Footer.tsx` (y el Cierre es `src/components/sections/Contacto.tsx`, ambos pine → se mezclan).
- El footer (pine) pega contra el Cierre (pine) y no se distingue; parece parte de la sección.
- **Fix de separación:** darle al footer un `border-top` visible (ej. `rgba(250,246,238,0.12)` o un hairline radish), o un fondo ligeramente distinto (pine más oscuro / cream-2), o más padding vertical. Que se lea como footer, no como continuación.
- **Agregar al footer:**
  - Teléfono de contacto: **+52 836 116 8007** (`https://wa.me/528361168007`).
  - Redes sociales: **Instagram** → `https://www.instagram.com/ravynstudio/` (por ahora solo IG; dejar estructura para sumar más después).
  - Mantener: logo (logo-dark.png), tagline, links Studio/Labs/Contacto, © año.

---

## Sugerencia de arranque para la sesión nueva

1. Lee `context/REDESIGN_PLAN.md` y este handoff.
2. Aplica primero las "Observaciones del usuario" de arriba.
3. Ejecuta la Fase 9 copiando el patrón de los archivos `Klino*.tsx`.
4. Ejecuta la Fase 10.
5. La memoria del proyecto (`ravyn-brand-semillero`) tiene el contexto de marca e identidades de producto.
