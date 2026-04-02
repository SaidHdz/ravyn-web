import React, { useEffect } from 'react';

interface ThemeManagerProps {
  theme?: string;
}

const ThemeManager: React.FC<ThemeManagerProps> = ({ theme = 'aesthetic' }) => {
  useEffect(() => {
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

    // Limpiar todas las clases que empiecen por theme-
    const classesToRemove = Array.from(document.body.classList).filter(c => c.startsWith('theme-'));
    classesToRemove.forEach(c => document.body.classList.remove(c));

    // Aplicar clase de tema al body
    const themeClassName = `theme-${theme}`;
    document.body.classList.add(themeClassName);
    document.body.setAttribute('data-theme', theme);

    return () => {
      // Limpiar al desmontar para no afectar a otras rutas (opcional)
      // document.body.className = '';
      // document.body.removeAttribute('data-theme');
    };
  }, [theme]);

  return null; // Este componente no renderiza nada visualmente
};

export default ThemeManager;
