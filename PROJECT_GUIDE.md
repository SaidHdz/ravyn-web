# 🌌 Ravyn Studio: Guía del Ecosistema y Arquitectura

Bienvenido a la documentación técnica oficial de **Ravyn Studio**, una plataforma especializada en la **Arquitectura de Experiencias Digitales** y la creación de memorias interactivas.

Este documento está diseñado para servir como referencia maestra tanto para desarrolladores senior que se incorporen al proyecto como para los stakeholders del producto, detallando cómo los módulos individuales se orquestan para construir experiencias web personalizadas.

---

## 1. Visión General: Arquitectura de Memorias

**Ravyn Studio** no es solo un generador de páginas web; es un motor de **Arquitectura de Memorias**. Permite a los usuarios empaquetar sus historias, fotos y dedicatorias en experiencias digitales inmersivas y altamente estéticas (llamadas "Packs" o "Módulos").

### 🔄 Flujo del Usuario (User Journey)

El ciclo de vida de la creación de una experiencia se divide en cuatro fases principales:

1. **Landing Page (`/`):** El escaparate visual. Aquí el usuario explora los "Packs" predefinidos (colecciones de módulos) o decide construir una experiencia personalizada desde cero usando un carrito visual.
2. **El Constructor (`Configurator.tsx`):** El núcleo interactivo. Un formulario por pasos donde el usuario inyecta el contenido de su memoria (textos, fechas, fotos) y define la dirección de arte (Temas).
3. **Checkout y Generación:** Una vez finalizada la configuración, el sistema procesa los archivos pesados (imágenes), realiza el cobro y empaqueta la configuración en un JSON maestro.
4. **Live Page (`LienzoRavyn.tsx`):** El producto final. Un motor de renderizado dinámico que lee el JSON maestro y construye la página web interactiva, aplicando el tema y mostrando los módulos en el orden especificado.

---

## 2. Stack Tecnológico

El ecosistema está construido sobre tecnologías modernas orientadas al rendimiento y la fluidez de las interfaces de usuario (UI).

* **Core Framework:** React 18 (TypeScript)
* **Build Tool:** Vite (Optimización extrema de tiempos de carga y HMR).
* **Estilos y UI:** CSS Vanilla / Tailwind CSS (Gestión de utilidades y variables CSS para el sistema de temas).
* **Animaciones:** Framer Motion (Transiciones entre módulos, micro-interacciones y layouts fluidos).
* **Iconografía:** Lucide React.
* **Infraestructura Cloud (Pipeline Futuro):**
  * **Cloudinary:** Para el alojamiento, transformación y entrega optimizada de las imágenes cargadas por los usuarios.
  * **n8n:** Orquestación de flujos de trabajo (Webhooks para recibir el JSON maestro y automatizar el despliegue de las *Live Pages*).

---

## 3. Arquitectura de Componentes Principales

La magia de Ravyn ocurre en la interacción entre dos componentes titánicos: el que recoge los datos y el que los dibuja.

### 🛠️ El Constructor (`Configurator.tsx`)

Es el cerebro detrás de la recopilación de datos. Funciona como un asistente paso a paso que hidrata progresivamente el estado global de la aplicación.

* **Gestión de Pasos:** Mapea el array de módulos seleccionados y genera dinámicamente las pantallas del formulario (ej. Si el usuario eligió "Historia" y "Trivia", solo mostrará esos pasos además del general y el checkout).
* **Persistencia:** Implementa sincronización en tiempo real con `localStorage` para evitar que el usuario pierda su progreso si recarga la página accidentalmente.
* **Manejo de Assets Locales:** Convierte las imágenes subidas por el usuario en *Blob URLs* (`URL.createObjectURL`), permitiendo previsualizaciones instantáneas sin necesidad de subir la imagen a un servidor hasta que el pedido esté finalizado.

### 🎨 El Cerebro (`LienzoRavyn.tsx`)

Es el motor de renderizado. No tiene estado propio complejo; es una función pura que toma un archivo JSON (el `Pedido`) y lo transforma en una experiencia interactiva.

* **Renderizado Dinámico:** Lee la propiedad `configuracion_global.orden` (un array de strings como `['historia', 'contador', 'trivia']`) y utiliza un bloque `switch` (o mapa de componentes) para instanciar los componentes de React correspondientes en el orden exacto.
* **Inyección de Datos:** Pasa el fragmento específico del JSON como *props* a cada módulo (ej. `pedido.trivia` se inyecta únicamente en `<Trivia data={pedido.trivia} />`).
* **Envoltura Estética:** Aplica el componente `<ThemeManager />` en la raíz para inyectar las variables CSS globales que dictan el aspecto de todos los módulos hijos.

---

## 4. Lógica de Datos: El Objeto `Pedido`

El corazón del sistema es el esquema de datos tipado (`src/types/pedido.ts`). Este JSON es el contrato entre el Constructor y el Cerebro.

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `bienvenida` | `Object` | Datos del Hero principal. Contiene `pareja` (nombres) y `mensaje` inicial. |
| `configuracion_global` | `Object` | Metadatos de la página. Contiene el `tema` elegido y el `orden` de los módulos a renderizar. |
| `nuestra_historia` | `Object` | Módulo de galería. Contiene configuración específica y un array de `memorias` (fotos, títulos, fechas y descripciones). |
| `contador` | `Object` | Módulo de tiempo. Almacena `titulo`, `mensaje` de apoyo y la `fecha` "Día Cero". |
| `trivia` | `Object` | Juego interactivo. Guarda mensajes de éxito/error y un array de `preguntas` (con sus opciones y el índice de la respuesta correcta). |
| `tarjetas` / `dedicatorias`| `Object` | Colecciones de mensajes tipo carta o sobre. |
| `evasivo` | `Object` | Micro-juego del "botón trampa". Almacena la `pregunta`, textos de los botones (SÍ/NO) y el `mensaje_exito`. |

---

## 5. Sistema de Estilos y Temas

Ravyn Studio utiliza una arquitectura de estilos agnóstica de componentes mediante **Variables CSS Globales**.

* **Funcionamiento:** El usuario elige un "Tema" (ej. *Neo Japan*, *Y2K Streamer*, *Minecraft*).
* **El Gestor (`ThemeManager.tsx`):** Este componente lee el ID del tema y monta dinámicamente un archivo CSS (ej. `theme-neo-japan.css`) o inyecta variables en el `:root` del documento.
* **Aplicación:** Los módulos (`Historia.tsx`, `Trivia.tsx`) no tienen colores *hardcodeados*. Usan clases de utilidad o variables CSS (ej. `background-color: var(--primary-color)` o fuentes específicas como `font-family: var(--font-display)`). Esto asegura que cambiar un tema altere instantáneamente la vibra completa del sitio sin tocar el código de los módulos.

---

## 6. Pipeline de Archivos y Despliegue

La gestión de imágenes (fotos pesadas de los usuarios) es crítica para el rendimiento y los costos operativos.

1. **Fase de Configuración (Local):** Al subir una foto, `Configurator.tsx` genera un **Blob URL**. Esto es rápido, gratuito y permite la previsualización inmediata. El Blob se almacena en el estado `projectConfig`.
2. **Post-Procesamiento (Al Pagar):** Justo antes de enviar el pedido a n8n, se dispara una función orquestadora (`processOrderAndDeploy`):
   * **Compresión:** Usa bibliotecas como `browser-image-compression` para reducir el peso de las imágenes en el cliente (ahorrando ancho de banda).
   * **Upload a Cloudinary:** Se suben las imágenes comprimidas al bucket.
   * **Sustitución:** Se reemplazan los *Blob URLs* temporales en el objeto `projectConfig` por las **URLs seguras (secure_url)** devueltas por Cloudinary.
3. **Despliegue:** El JSON final (ahora ligero y con URLs de red) se envía vía Webhook a **n8n**, el cual genera la carpeta del cliente y clona el template de `LienzoRavyn` para que la página cobre vida.

---

## 7. Guía de Mantenimiento: Cómo agregar un Nuevo Módulo

Para expandir el ecosistema creando un nuevo módulo interactivo (ej. "Mapa de Citas"), sigue estos 4 pasos:

1. **Actualizar el Esquema de Datos (`src/types/pedido.ts`):**
   * Añade la nueva interfaz (ej. `interface MapaCitas { lugares: Lugar[]; config: ModuloConfig }`).
   * Incorpórala a la interfaz principal `Pedido`.
2. **Crear el Componente UI (`src/components/modules/MapaCitas.tsx`):**
   * Desarrolla el componente que reciba la prop `data` (del tipo definido en el paso 1).
   * Usa `var(--color)` para integrarlo al sistema de temas.
3. **Registrarlo en El Cerebro (`src/components/LienzoRavyn.tsx`):**
   * Importa el nuevo componente.
   * Añádelo a la función `renderModulo` dentro del `switch` statement:
     ```typescript
     case 'mapa':
       return <MapaCitas key={id} data={pedido.mapa_citas} />;
     ```
4. **Crear su Paso en El Constructor (`src/views/Configurator.tsx`):**
   * Añade el paso al array `steps`.
   * En la función `renderStepContent()`, añade el `case 'mapa'` con los inputs necesarios para llenar la información del módulo y actualizar el estado `projectConfig`.
