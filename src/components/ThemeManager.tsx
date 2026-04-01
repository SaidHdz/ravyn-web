import React, { useEffect } from 'react';

interface ThemeManagerProps {
  theme?: string;
  isStandalone?: boolean; // Define si aplica el tema al body global
}

const ThemeManager: React.FC<ThemeManagerProps> = ({ theme = 'aesthetic', isStandalone = true }) => {
  useEffect(() => {
    // Siempre cargamos el LINK del CSS para que las clases escopeteadas (.theme-xxx) funcionen
    // pero solo aplicamos la clase al BODY si es standalone.
    
    // Eliminar links de temas previos para evitar conflictos
    const existingThemeLink = document.getElementById('ravyn-theme-link');
    if (existingThemeLink) {
      existingThemeLink.remove();
    }

    // Crear y añadir el nuevo link del tema
    const link = document.createElement('link');
    link.id = 'ravyn-theme-link';
    link.rel = 'stylesheet';
    link.href = `/css/theme-${theme}.css`;
    document.head.appendChild(link);

    // Si estamos en standalone (ej. sitio final), gestionamos el BODY
    if (isStandalone) {
      // Aplicar clase de tema al body
      document.body.className = `theme-${theme}`;
      document.body.setAttribute('data-theme', theme);
    } else {
      // Si NO es standalone, nos aseguramos de que el body NO tenga clases de tema
      // que pudieran activar reglas de body.theme-xxx
      document.body.classList.remove(`theme-${theme}`);
    }

    return () => {
      if (isStandalone) {
        // Limpiar al desmontar opcionalmente
      }
    };
  }, [theme, isStandalone]);

  return null;
};

export default ThemeManager;
