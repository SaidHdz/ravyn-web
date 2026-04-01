import React, { useEffect } from 'react';

interface ThemeManagerProps {
  theme?: string;
  isStandalone?: boolean; // Define si aplica el tema al body global
}

const ThemeManager: React.FC<ThemeManagerProps> = ({ theme = 'aesthetic', isStandalone = true }) => {
  useEffect(() => {
    // Si estamos en standalone (ej. sitio final), gestionamos el LINK y el BODY
    if (isStandalone) {
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

      // Aplicar clase de tema al body
      document.body.className = `theme-${theme}`;
      document.body.setAttribute('data-theme', theme);
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
