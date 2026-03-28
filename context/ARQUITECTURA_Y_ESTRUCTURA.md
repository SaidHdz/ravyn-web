# 🏗️ Arquitectura y Estructura Técnica - Ravyn

Este documento explica el "corazón" de Ravyn, detallando cómo funciona el sistema, su motor tecnológico y la forma en que los módulos se ensamblan para crear la experiencia final.

---

## 1. El Motor: Vite + React + TypeScript

Ravyn ha evolucionado de una base de archivos HTML/JS estáticos a una aplicación moderna y escalable.

- **Vite:** Es nuestro constructor (bundler). Lo elegimos porque es extremadamente rápido en desarrollo y genera archivos finales muy ligeros.
- **React:** Es la librería que maneja la interfaz. Usamos un enfoque **componentizado**, lo que significa que cada parte de la web (una trivia, una carta, un contador) es un bloque de código independiente.
- **TypeScript:** Es el "guardaespaldas" de nuestro código. Nos obliga a definir qué tipo de datos espera cada función, evitando errores comunes de "esto no debería ser un texto, debería ser un número".

---

## 2. Estructura de Carpetas

```text
ravyn-web/
├── public/                 # Archivos estáticos
│   ├── css/                # Temas visuales (theme-aesthetic.css, etc.)
│   └── pedidos/            # Datos reales de los clientes (data.json)
├── src/
│   ├── components/
│   │   ├── modules/        # Los bloques de construcción (Trivia, Historia, etc.)
│   │   ├── LienzoRavyn.tsx # EL ORQUESTADOR (El cerebro)
│   │   └── ThemeManager.ts # El encargado de la estética
│   ├── types/              # Definiciones de datos (Interfaces)
│   ├── views/              # Páginas principales (Landing, Visor de Módulos)
│   ├── App.tsx             # Punto de entrada de la lógica
│   └── main.tsx            # Punto de entrada del navegador
```

---

## 3. El Orquestador: `LienzoRavyn.tsx`

Este es el componente más importante del proyecto. Su función es leer un archivo de datos (`data.json`) y construir la página web en tiempo real.

### ¿Cómo funciona?
1. **Recibe el Pedido:** Obtiene un objeto llamado `pedido` que contiene toda la configuración del cliente.
2. **Gestiona el Tema:** Inyecta dinámicamente el archivo CSS correspondiente (ej. `theme-minecraft.css`) en la cabecera del documento.
3. **Renderizado Dinámico:** Lee el array `configuracion_global.orden` y, mediante un `switch`, decide qué módulos mostrar y en qué orden.

**Ejemplo de lógica interna:**
```tsx
const renderModulo = (nombre: string) => {
  switch (nombre) {
    case 'modulo-trivia':
      return <Trivia data={pedido.trivia} />;
    case 'modulo-contador':
      return <Contador data={pedido.contador} />;
    // ... así con todos los módulos
  }
};
```

---

## 4. El Sistema de Datos: `pedido.ts`

Para que Ravyn sea escalable, usamos **Interfaces**. Una interfaz es como un contrato: define exactamente qué campos debe tener un pedido para que el sistema no falle.

**Campos principales del Pedido:**
- `bienvenida`: Textos de la pantalla inicial.
- `configuracion_global`: El orden de los módulos y el tema visual.
- `modulos`: Cada módulo (Trivia, Historia, etc.) tiene su propia sección de datos y configuración interna.

---

## 5. Estética y Tematización Dinámica

Ravyn no usa un solo archivo CSS gigante. En su lugar, usa un sistema híbrido:

1. **CSS Global (`global.css`):** Define estructuras básicas (layouts, resets).
2. **Temas Específicos (`public/css/theme-*.css`):** Cada tema define **Variables CSS** (colores, fuentes, bordes).
3. **Componentes con Clases Semánticas:** Los componentes de React usan clases como `.boton-principal`. El color de ese botón cambia según el tema cargado porque apunta a una variable: `background: var(--color-primario);`.

---

## 6. Flujo de un Pedido (De Datos a Web)

1. Un cliente llena un formulario.
2. Se genera un archivo `data.json` con sus respuestas.
3. La aplicación carga ese `data.json`.
4. `LienzoRavyn` recibe los datos.
5. El `ThemeManager` aplica la estética elegida.
6. Los módulos se pintan en pantalla con el contenido del cliente.

---

## 7. Filosofía de Desarrollo

- **Modularidad:** Si queremos crear un módulo de "Rompecabezas", solo creamos un nuevo archivo en `components/modules/` y lo registramos en el orquestador. No tocamos el resto del sistema.
- **Independencia Estética:** Un módulo no debe tener colores fijos; siempre debe usar las variables del tema para que pueda verse bien en "Aesthetic", "Minecraft" o cualquier tema futuro.
