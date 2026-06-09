# Ravyn Web — Plan de Rediseño v2.0 (Semillero)
Versión 2.0 · 2026-06-08 · Replanteamiento completo

Este plan reemplaza v1.0. La diferencia fundamental: v1.0 era un _reskin_ — misma estructura de secciones, mismos patrones de UI, nueva paleta. Este plan reconstruye el sitio desde la identidad del negocio, no desde lo que ya existía.

La única pieza que sobrevive del sitio anterior: el concepto **"Siembra tu proyecto con nosotros"** — que se convierte en el hilo narrativo del sitio.

---

## Concepto rector: Invernadero-Estudio

El brand spec dice: "invernadero que también es estudio — plantas junto a pantallas, tierra, manos, cosas creciendo al lado de la tecnología."

Ese es el feeling que debe transpolar a cada decisión de diseño. No con ilustraciones de plantas. Con la **temperatura** de las decisiones: cream generoso, pine profundo, Fraunces editorial, espacio que respira como aire de invernadero, estructura que crece de arriba abajo.

**Anti-referencia:** cualquier agencia de software o SaaS típico. No queremos feature grids, no queremos isometrías, no queremos glow gradients. Queremos algo más cercano a Aesop, Patagonia, Notion — claridad cálida con filo editorial.

**Principio de diseño central:** Text-first, space-heavy. El peso visual lo carga Fraunces a tamaños grandes, no iconos ni ilustraciones.

---

## Sistema de diseño (base antes de cualquier sección)

### Paleta
| Token | Valor | Uso |
|---|---|---|
| `pine` | `#10342A` | Textos, fondos oscuros, bordes |
| `radish` | `#E0436B` | Único color de acción (botones, CTAs, links de énfasis) |
| `sprout` | `#34C759` | Solo para estados de éxito, nunca decorativo |
| `cream` | `#FAF6EE` | Fondo base — el lienzo |
| `cream-2` | `#F1EBDD` | Fondos secundarios, separación sutil |
| `muted` | `#5C7268` | Textos de soporte, etiquetas |

El sitio es **light-only**. No existe dark mode en esta identidad. Pine sobre Cream es el 90% del UI.

### Tipografía
| Rol | Fuente | Uso correcto |
|---|---|---|
| Display | Fraunces 600, opsz alto | H1, H2, momentos de marca. NUNCA en párrafos |
| Cuerpo | Space Grotesk 400/500 | Todo lo funcional: párrafos, etiquetas de UI, nav |
| Datos | JetBrains Mono 400 | Números, labels de sección, badges, código, precios |

Escala de tipo:
- H1: 96px / lh 0.98 (solo Hero)
- H2: 64px / lh 1.02 (titulares de sección)
- H3: 40px / lh 1.1 (sub-titulares)
- Body: 17px / lh 1.65 (párrafos)
- Small: 14px / lh 1.5 (labels, metadata)
- Caption: 11px / lh 1.4 (mono labels)

### Geometría
Los `borderRadius` del brand kit se aplican literalmente:
- Botones: `pill` (100px) — bordes completamente redondeados, forma de píldora
- Cards si las hay: `lg` (18px)
- Inputs: `md` (14px)

### El rábano-R como elemento estructural
El símbolo de logo (`symbol-pine.png`) aparece en el sitio a tres escalas distintas:
1. **Micro** (24px): favicon
2. **Normal** (en el lockup de nav)
3. **Monumental** (300-500px): en la pantalla de apertura, al 6% de opacidad, como textura de fondo — recortado por el borde derecho. No decoración: ancla.

---

## Arquitectura de páginas

```
/ (Landing) — El semillero completo
/klino — Producto de Labs, mini-brand propia
/ravynset — Producto de Labs, mini-brand propia
```

---

## Landing — Estructura y diseño sección por sección

El sitio se lee como una historia que crece de arriba abajo. Cada sección tiene una función narrativa, no solo de "feature coverage".

```
Nav
│
├── 01 · Apertura          "Siembra tu proyecto con nosotros."
├── 02 · Manifiesto        ¿Qué es Ravyn? En un párrafo, sin bullets.
├── 03 · Arquitectura      Studio vs Labs — split screen
├── 04 · Studio            Lo que hacemos para clientes
├── 05 · Labs              Nuestros productos
├── 06 · Proceso           Semilla → Cosecha
├── 07 · Cierre            Pine full-bleed. Solo el CTA.
│
Footer
```

---

### Nav

**Concepto:** mínimo, invisible hasta que lo necesitas.

- Fondo: `cream` con `border-bottom: 1px solid pine/10`
- Izquierda: lockup logo horizontal en pine (`lockup-h-onlight.png`)
- Derecha: dos links de texto en Space Grotesk 14px — "Studio" · "Labs" — luego botón píldora en radish: "Siembra tu proyecto →"
- Sin dropdown. Sin más links. Sin toggle de tema.
- Comportamiento: sticky, se oculta al scrollear hacia abajo, reaparece al subir (ya existe este comportamiento — mantenerlo)
- Mobile: solo logo + hamburger. Menú overlay cream con los dos links + CTA radish centrado.
- La barra de progreso de scroll: línea de 2px en radish bajo el nav. Se mantiene.

**Qué se elimina del nav actual:** servicios dropdown, toggle de tema, todo link que no sea Studio/Labs.

---

### 01 · Apertura (Hero)

**Concepto:** una pantalla de créditos de película. Solo tipografía y silencio. El rábano-R monumental como textura.

**Layout:** 100vh, cream background. Grid de dos columnas asimétrico (60/40).

**Columna izquierda (60%):** texto, alineado izquierda, centrado vertical.
```
[mono caption, radish, 11px] → 01 · Semillero
[Fraunces, pine, 96px, lh 0.98]
"Siembra tu
proyecto
con nosotros."
[Space Grotesk, muted, 17px, mt 24px]
"Estudio y laboratorio de producto. Construimos
lo que tu negocio necesita — y lo dejamos corriendo."
[mt 40px, flex gap-3]
[Botón píldora radish sólido] "Comienza aquí →"
[Botón outline pine] "Ver Labs"
```

**Columna derecha (40%):** el símbolo rábano-R a 400-500px, pine al 7% de opacidad, recortado verticalmente por el borde derecho del viewport. No tiene marco, no tiene fondo, no tiene sombra. Es puro peso visual.

**Mobile:** columna única, H1 a 56px, imagen del rábano desaparece o se mueve como fondo al 4%.

**Animación de entrada:** solo fade-up escalonado por elemento (Framer Motion). 0.4s delay escalonado. Sin parallax, sin rotación, sin glow.

**Qué no tiene este hero:** TiltCards. Gradientes animados. CTAs flotantes. Ilustraciones. Video. "Bienvenidos a Ravyn". Todo eso sale.

---

### 02 · Manifiesto

**Concepto:** el "acerca de" que no parece un "acerca de". Un párrafo largo en Fraunces italic, centrado en la página. Patagonia-style. Sin stats. Sin foto del equipo. Sin bullets.

**Layout:** padding vertical de 120px. Ancho máximo 680px, centrado. Fondo cream.

```
[mono label, muted, 11px, tracking widest, mb-8] → 02 · NOSOTROS

[Fraunces italic, pine, 32px, lh 1.4, text-center]
"Ravyn nació como un semillero:
un lugar donde una idea se siembra,
se cuida, y se cosecha como producto real.

Algunas semillas las traen los clientes.
Otras las plantamos nosotros.
Mismo método. Mismas manos."

[Space Grotesk, muted, 17px, mt-32, text-center]
"Operamos desde México.
Construimos software que ya está corriendo —
no presentaciones que envejecen."
```

Un separador visual al final: línea horizontal `pine/15`, ancho total.

**Qué no tiene:** foto. Stats de "50+ proyectos". Logos de tecnologías. Párrafo de "somos apasionados por la tecnología". Nada de eso.

---

### 03 · Arquitectura

**Concepto:** el sitio explica su propia estructura de marca visualmente, una vez, de forma clara. Dos ramas. Sin más.

**Layout:** full-width, sin padding lateral. Dos columnas exactamente iguales. Fondo: columna izquierda pine, columna derecha cream-2. En mobile: dos bloques apilados.

**Columna izquierda — Ravyn Studio** (pine background):
```
[mono label, radish, caption] → STUDIO
[Fraunces, cream, 44px, mt-16] "A la medida
de tu negocio."
[Space Grotesk, cream/70, 15px, mt-12, max-w 280px]
"Desarrollamos sistemas web, apps de gestión y automatizaciones
para clínicas y negocios de servicios. Sin equipo interno propio."
[mt-24] [botón outline cream pequeño] "Ver qué construimos"
```

**Columna derecha — Ravyn Labs** (cream-2 background):
```
[mono label, muted, caption] → LABS
[Fraunces, pine, 44px, mt-16] "Productos que
sembramos nosotros."
[Space Grotesk, muted, 15px, mt-12, max-w 280px]
"Klino, Ravynset, Shield Sense. Proyectos propios construidos
con el mismo método que aplicamos para clientes."
[mt-24] [botón outline pine pequeño] "Ver productos"
```

**Divisor centro:** una línea vertical de 1px en radish, exactamente en la mitad. En mobile desaparece.

**Animación:** al entrar en viewport, las dos columnas "crecen" desde 0% a 100% de su altura con un clip-path — la columna izquierda desde arriba, la derecha desde abajo. 0.6s, ease-out cubic.

---

### 04 · Studio

**Concepto:** lista editorial de servicios. No cards. No iconos. No "desde X MXN". Solo nombres, una línea de descripción, y una línea separadora. Como un menú de restaurante serio.

**Layout:** dos columnas. Izquierda (40%): ancla textual y descripción del Studio. Derecha (60%): lista de servicios.

**Izquierda:**
```
[mono label, muted, caption, mb-6] → 04 · RAVYN STUDIO
[Fraunces, pine, 56px]
"Software propio
sin equipo
propio."
[Space Grotesk, muted, 16px, mt-20, max-w-320]
"Trabajamos directo con quien nos contrata.
Si ya sabes qué construir, perfecto.
Si solo sabes qué problema tienes, también."
[mt-32] [botón píldora radish] "Cotiza tu proyecto →"
```

**Derecha — lista de servicios:**
Cada entrada es una fila separada por una línea `pine/10`:
```
[border-top pine/10, py-6, flex justify-between items-start]

[Fraunces, pine, 28px] "Sitios y sistemas web"
[Space Grotesk, muted, 14px, max-w-240px]
"Para negocios que necesitan
crecer online y que los encuentren."
[mono, muted, caption, self-end] → 01

— (repetir para cada servicio) —

"Apps de gestión interna"
"Reemplaza cuadernos, Excel y WhatsApp."
→ 02

"Automatización e IoT"
"Procesos que corren solos."
→ 03
```

Al hover de cada fila: el número mono cambia a radish. Sin transformaciones de escala ni sombras.

Debajo de la lista: en mono pequeño, muted — "Las tecnologías varían según el proyecto. El método no."

---

### 05 · Labs

**Concepto:** cada producto de Labs es una fila de tabla editorial. No cards con shadow. No grid de 3 columnas. Filas horizontales como en un catálogo.

**Layout:** full-width. Fondo cream. Encabezado de sección, luego tres filas de productos.

**Encabezado:**
```
[mono label] → 05 · RAVYN LABS
[Fraunces, pine, 56px, mt-12]
"Productos que
sembramos nosotros."
```

**Cada fila de producto** (separated by `border-top pine/10`):
```
[grid 4 cols, py-8, items-center]

Col 1: [Fraunces, pine, 36px] nombre del producto
Col 2: [Space Grotesk, muted, 15px] descripción en dos líneas
Col 3: [mono badge, radish/pine/muted] estado (LIVE · BETA · EN DESARROLLO)
Col 4: [link arrow, pine, hover:radish] "Conocer más →"
```

Productos:
- **Klino** · Agenda digital para clínicas. Deja de perder citas. · `LIVE` · `/klino`
- **Ravynset** · Experiencias web para negocios de servicios. · `BETA` · `/ravynset`
- **Shield Sense** · Monitoreo IoT para espacios industriales y clínicos. · `EN DESARROLLO` · link deshabilitado, cursor default

**Fondo de filas:** alternas entre `cream` y `cream-2`. La fila "EN DESARROLLO" tiene fondo `pine/4` y el texto está en muted más tenue.

**Mobile:** las filas colapsan a stacked — nombre → descripción → badge → link.

---

### 06 · Proceso

**Concepto:** un tallo que crece. La línea vertical corre por el centro de la sección como una vena del sitio. Los pasos son nodos en ese tallo.

**Layout:** columna única, max-width 680px, centrado. Un `::before` o `div` de 2px de ancho en pine corre verticalmente conectando los cuatro nodos.

**Encabezado:**
```
[mono label] → 06 · PROCESO
[Fraunces, pine, 56px]
"De la semilla
al producto."
```

**Cada nodo:**
```
[flex, items-start, gap-8, position-relative]

[el nodo en sí: círculo 16px, fondo cream, borde 2px pine, centrado sobre la línea vertical]
[mono, radish, 11px, mt-2] 01
[div, ml-auto, max-w-440px]
  [Fraunces, pine, 28px] "Semilla"
  [Space Grotesk, muted, 16px, mt-2]
  "Entendemos el problema.
  Sin presentaciones, sin humo."
```

Los cuatro pasos:
1. **Semilla** — Entendemos el problema. Sin presentaciones, sin humo.
2. **Cultivo** — Construimos en iteraciones cortas. Tú lo ves crecer.
3. **Cosecha** — Entregamos algo que ya está corriendo. No una promesa.
4. **Raíz** — Soporte vivo. El producto sigue creciendo contigo.

**Animación:** el tallo (la línea vertical) "crece" de arriba a abajo al entrar en viewport via `scaleY` desde `0` a `1`, `transform-origin: top`. Luego los nodos aparecen escalonados. 0.8s total.

---

### 07 · Cierre

**Concepto:** la última pantalla. 100vh. Pine background. Solo el CTA. Sin noise, sin grids, sin features adicionales. El equivalente de la contraportada de un libro.

**Layout:** centrado horizontal y vertical.
```
[Fraunces italic, cream, 64px, text-center, max-w-500px]
"¿Qué quieres
construir?"
[Space Grotesk, cream/60, 17px, mt-16, text-center]
"Cuéntanos. Si no sabes por dónde empezar,
también. Para eso estamos."
[mt-32, flex gap-4, justify-center]
[botón píldora radish grande] "Siembra tu proyecto →"
[botón outline cream, opacity-70] "WhatsApp directo →"
```

El rábano-R monumental reaparece aquí: a 600px, blanco al 4%, centrado como fondo, recortado por el borde inferior. Espejo del hero, crea simetría narrativa.

**No hay formulario.** El contacto es una acción directa — CTA a Supabase/CRM y WhatsApp. Si se necesita capturar datos, es el modal de auth existente con mínimos campos.

---

### Footer

Minimal. No toma protagonismo — el Cierre es el final real de la historia.

```
[fondo pine, py-8, flex justify-between items-center]
[logo lockup ondark, h-6]
[Space Grotesk, cream/40, 12px] "© 2026 Ravyn. De la semilla al producto."
[flex gap-6]
  [links cream/60, 12px] Studio · Labs · Contacto
```

Sin columnas, sin newsletter, sin social links, sin repetir el copy del sitio. Una línea.

---

## Páginas de producto (Labs)

### /klino

Klino es la apuesta más madura de Labs. Su página debe sentirse como un producto real con identidad propia, no como una subsección de Ravyn.

**Paleta propia:** usa Pine/Radish/Cream del sistema, pero el acento puede enriquecerse con una variante más cálida para sentir diferencia. El badge "Ravyn Labs" es la conexión de marca — no necesita ser todo igual.

**Estructura de página — narrativa, no feature-dump:**

```
Nav (idéntico al general, con breadcrumb "Labs / Klino")
│
├── KA · Apertura          "Tus citas, sin el caos."
├── KB · El problema       Un día en la vida de Daniela
├── KC · La solución       Qué hace Klino concretamente
├── KD · Incluye           Lista limpia, no feature grid
├── KE · Planes            Precios directos
├── KF · FAQ               Accordion minimal
└── KG · CTA               Pine full-bleed
```

**KA · Apertura:**
- Pine background, cream text, 100vh
- Fraunces 80px: "Tus citas,\nsin el caos."
- Space Grotesk 17px, cream/70: "Agenda digital para clínicas. Sin apps complicadas, sin Excel."
- Badge mono, radish: "Klino · Ravyn Labs"
- Botón radish: "Empieza hoy →"
- Fondo: el rábano-R monumental en cream/5

**KB · El problema:**
No una lista de "¿Te suena familiar?" No bullets. Una narrativa corta en segunda persona:

```
[Fraunces italic, pine, 32px]
"Daniela llega a las 8am.
Ya tiene 3 WhatsApps preguntando
si hay cita disponible."
[Space Grotesk, muted, 16px, mt-16]
"Anota en el cuaderno. Llama para confirmar. Dos pacientes llegan
al mismo horario. El cuaderno no avisa."
[Fraunces italic, pine, 24px, mt-24]
"Klino avisa."
```

Layout: centrado, max-width 600px, mucho air. Un `——` separador en radish al final.

**KC · La solución:**
Tres columnas simples (en mobile: apiladas):
1. "Agenda en línea" — pacientes se agendan solos, sin llamar
2. "Recordatorios automáticos" — WhatsApp automático antes de la cita
3. "Vista del día" — todos los consultorios en una pantalla

Cada columna: un número mono en radish (01, 02, 03), título en Fraunces 24px, descripción en Space Grotesk 15px. Sin iconos, sin ilustraciones.

**KD · Incluye:**
Lista tipográfica limpia, dos columnas en desktop:
- Agenda web personalizada
- Recordatorios por WhatsApp
- Vista multi-consultorio
- Panel de pacientes
- Reportes de asistencia
- Soporte directo con el equipo

Format: `[radish checkmark] · [Space Grotesk, pine, 15px]`

**KE · Planes:**
Dos planes, comparación simple:
- `Semilla` — para 1 consultorio. $X/mes.
- `Cosecha` — para clínicas de 2+ consultorios. $Y/mes.

Cada plan: nombre en Fraunces, precio en mono grande, lista de diferencias, CTA.

Sin plan "Enterprise" genérico. Sin toggle mensual/anual por ahora.

**KG · CTA:**
Pine full-bleed, espejo del cierre del landing. "Empieza tu primer mes." Botón radish.

---

### /ravynset

Ravynset es un producto de Labs en etapa Beta. Su página comunica eso — no finge ser un producto maduro.

**Estructura:**
```
Nav (Labs / Ravynset)
│
├── RA · Apertura      "Tu negocio, bien presentado en línea."
├── RB · Qué es        Descripción directa, sin jargon
├── RC · Incluye       Lo concreto
├── RD · Beta          Honestidad sobre el estado del producto
└── RE · CTA           "Únete a los primeros"
```

La honestidad sobre el estado Beta es una ventaja de marca, no un problema. En el brand kit: "Construir gana a prometer." Ravynset no promete — enseña lo que ya hace.

---

## Animaciones — principios

El sitio no es una demo de animación. Las animaciones tienen una sola función: guiar la atención, no entretener.

**Reglas:**
- Entrada de elementos: solo `opacity 0→1` + `translateY 16px→0`. Nada más.
- Duración: 0.35s para elementos pequeños, 0.55s para secciones.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` — decelera rápido, orgánico.
- Stagger entre elementos: 80ms.
- La única excepción: el `scaleY` del tallo en la sección Proceso (0.8s, `ease-out`).
- Scroll-trigger: cuando el elemento entra al 15% del viewport desde abajo.

**Eliminar completamente:**
- `PixelTrail`
- Glow neon / `box-shadow` coloreado
- Gradient animados en background
- Hover que escala cards
- Rotación 3D (TiltCard)
- Cualquier animación que solo exista para "verse bonita"

**Mantener:**
- `SplitText` — válido para el H1 del Hero si se hace con sutileza
- `CountUp` — solo si se usa en datos reales (no hay stats de "50+ proyectos")
- El scroll-hide/show del navbar — ya funciona bien

---

## Iconografía

Los íconos de Lucide React se eliminan como decoración primaria. Solo se usan funcionalmente (ej: flecha en botón, X para cerrar modal, hamburger).

Los 12 íconos del brand kit (`src/assets/icons/`) se usan donde el contexto sea específico al negocio de Ravyn. No como decoración de sección.

La jerarquía visual en secciones la llevan los números mono (01, 02, 03) y los separadores tipográficos, no los íconos.

---

## Copy — voz del sitio

La voice guide del brand kit se aplica literalmente.

| Usar | Prohibido |
|---|---|
| construir · plantar · crecer · cosechar | premium · disrupción · sinergia |
| directo · concreto · cálido · raíz local | revolucionario · llave en mano |
| segunda persona (tu, tú) | nosotros en primera (el cliente primero) |
| frases cortas, sin adornos | "calidad que se siente" · "líder en el mercado" |

Copy clave que se mantiene intacto:
- **"Siembra tu proyecto con nosotros."** — hilo narrativo del sitio
- **"De la semilla al producto."** — tagline en el footer y manifesto
- **"Si ya sabes qué construir, perfecto. Si solo sabes qué problema tienes, también."** — sección Studio

---

## Fases de implementación

```
Fase 0 — Cimientos          Sistema de diseño (tokens, fuentes, assets)
Fase 1 — Shell              Nav + Footer
Fase 2 — Apertura           Hero (01)
Fase 3 — Sustancia          Manifiesto (02) + Arquitectura (03)
Fase 4 — Studio             Sección Studio (04)
Fase 5 — Labs               Sección Labs (05)
Fase 6 — Proceso            Sección Proceso (06) con animación del tallo
Fase 7 — Cierre             Pantalla final (07)
Fase 8 — Klino              /klino completa
Fase 9 — Ravynset           /ravynset completa
Fase 10 — Pulido            Animaciones, tipografía, spacing audit
```

Cada fase: visual check en browser antes de avanzar. No hay "terminar y revisar al final".

---

## Fase 0 — Cimientos

### 0.1 Tokens CSS en `global.css`

Eliminar todas las variables actuales relacionadas con el sistema techno anterior y reemplazar:

```css
:root {
  /* Colores */
  --color-pine:    #10342A;
  --color-radish:  #E0436B;
  --color-sprout:  #34C759;
  --color-cream:   #FAF6EE;
  --color-cream-2: #F1EBDD;
  --color-muted:   #5C7268;

  /* Tipografía */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body:    'Space Grotesk', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  /* Sombras */
  --shadow-sm: 0 1px 4px rgba(16,52,42,.08);
  --shadow-md: 0 8px 24px rgba(16,52,42,.12);

  /* Radii */
  --radius-sm:   8px;
  --radius-md:   14px;
  --radius-lg:   18px;
  --radius-pill: 100px;
}
```

Eliminar: `--accent-glow`, `--color-green` (techno), `--color-amber`, gradiente de fondo, todo el bloque `html[data-theme="dark"]`.

### 0.2 Tailwind config

Fusionar `tokens/tailwind.config.snippet.js` del brand kit. Resultado esperado: clases `text-pine`, `bg-cream`, `bg-radish`, `font-display`, `font-mono` disponibles globalmente.

### 0.3 Fuentes — cargar Fraunces

En `index.html`, dentro de `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,400;1,9..144,600&family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Alternativa offline: copiar TTF de `brand/ravyn-brand-kit/fonts/` a `public/fonts/` y declarar con `@font-face`. Preferible para performance.

### 0.4 Assets de marca

Copiar al proyecto:
```
brand/ravyn-brand-kit/logo/lockup/horizontal/lockup-h-onlight.png → public/brand/logo-light.png
brand/ravyn-brand-kit/logo/lockup/horizontal/lockup-h-ondark.png  → public/brand/logo-dark.png
brand/ravyn-brand-kit/logo/symbol/symbol-pine.png                 → public/brand/symbol.png
brand/ravyn-brand-kit/logo/symbol/symbol-cream.png               → public/brand/symbol-cream.png
brand/ravyn-brand-kit/icons/*.svg                                 → src/assets/icons/
```

### 0.5 Remover dark mode

- Eliminar prop `theme` y `onToggle` de `Navbar.tsx`
- Eliminar o desactivar `useTheme` hook
- Remover botón de toggle del nav
- El sitio simplemente no tiene modo oscuro en esta versión

---

## Archivos del proyecto y su destino

| Archivo | Acción |
|---|---|
| `global.css` | Reescritura completa (Fase 0) |
| `index.html` | Agregar fuentes, actualizar meta |
| `Navbar.tsx` | Reescritura (Fase 1) |
| `Landing.tsx` | Reescritura completa del layout y secciones (Fases 2-7) |
| `Hero.tsx` | Reescritura total (Fase 2) |
| `QuienesSomos.tsx` | Convertir en `Manifiesto.tsx` o reescribir in-place (Fase 3) |
| `Servicios.tsx` | Reescritura como sección Studio (Fase 4) |
| `Proyectos.tsx` | Reescritura como sección Labs con filas editoriales (Fase 5) |
| `Proceso.tsx` | Reescritura con metáfora de tallo (Fase 6) |
| `Contacto.tsx` | Reescritura como pantalla de cierre full-bleed (Fase 7) |
| `SolucionPersonalizada.tsx` | Eliminar — fusionado en Studio |
| `Klino.tsx` + secciones | Reescritura completa (Fase 8) |
| `Ravynset.tsx` + secciones | Reescritura completa (Fase 9) |
| `src/lib/supabase.ts` | Sin cambios |
| `src/hooks/useAuth.tsx` | Sin cambios |
| `AuthModal.tsx` | Solo refactoring visual menor (Fase 10) |
| `AccountModal.tsx` | Solo refactoring visual menor (Fase 10) |

---

## Checklist de coherencia antes de "terminado"

- [ ] Ningún elemento tiene `box-shadow` de color azul o neon
- [ ] `font-display` (Fraunces) no aparece en ningún párrafo de más de 1 línea
- [ ] Todos los botones de acción son `radish`, no azul
- [ ] No existe ningún toggle de tema visible
- [ ] El logo usa el lockup PNG, no el wordmark de texto
- [ ] La sección de Proceso usa terminología botánica (Semilla, Cultivo, Cosecha, Raíz)
- [ ] "premium", "disrupción", "llave en mano" no aparecen en ningún copy
- [ ] El nav en mobile tiene overlay cream (no negro)
- [ ] Las sub-páginas de Labs (/klino, /ravynset) tienen breadcrumb "Labs / Producto"
