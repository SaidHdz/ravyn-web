import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import baseStyles from '@@/global.css?raw';

const IFRAME_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: transparent;
        min-height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="module-preview-root"></div>
  </body>
</html>`;

interface ModulePreviewFrameProps {
  theme: string;
  children: React.ReactNode;
  onThemeLoadStateChange?: (loading: boolean) => void;
}

const ModulePreviewFrame: React.FC<ModulePreviewFrameProps> = ({
  theme,
  children,
  onThemeLoadStateChange
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const currentThemeRef = useRef<string>('');
  const initializedRef = useRef<boolean>(false);

  // Inicializar el iframe una sola vez
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || initializedRef.current) return;

    const initIframe = () => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      doc.open();
      doc.write(IFRAME_TEMPLATE);
      doc.close();

      const root = doc.getElementById('module-preview-root');
      if (root) {
        setMountNode(root);
        initializedRef.current = true;
      }
    };

    // Intentar inicializar de inmediato
    initIframe();

    // Por si acaso, también escuchar el evento load
    const handleLoad = () => {
      if (!initializedRef.current) {
        initIframe();
      }
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, []);

  useEffect(() => {
    if (!mountNode) return;

    const doc = mountNode.ownerDocument;
    if (!doc) return;

    const ensureBaseStyles = () => {
      if (doc.getElementById('module-preview-base-styles')) return;
      const baseStyleTag = doc.createElement('style');
      baseStyleTag.id = 'module-preview-base-styles';
      baseStyleTag.textContent = baseStyles;
      doc.head.appendChild(baseStyleTag);
    };

    const applyTheme = () => {
      // Si el tema ya es el mismo que tenemos registrado como cargado, no hacer nada
      if (currentThemeRef.current === theme) {
        onThemeLoadStateChange?.(false);
        return;
      }

      // Limpiar temas anteriores
      const existingThemes = doc.querySelectorAll('link[id^="module-preview-theme"]');
      existingThemes.forEach(el => el.remove());

      onThemeLoadStateChange?.(true);

      const themeLink = doc.createElement('link');
      themeLink.id = `module-preview-theme-${Date.now()}`; // ID único para forzar refresco si es necesario
      themeLink.rel = 'stylesheet';
      themeLink.href = `/css/theme-${theme}.css`;

      let cancelled = false;

      const notifyLoaded = () => {
        if (!cancelled) {
          onThemeLoadStateChange?.(false);
          currentThemeRef.current = theme;
        }
      };

      // Timeout de seguridad por si falla la carga o el evento onload no dispara
      const timeoutId = setTimeout(() => {
        notifyLoaded();
      }, 3000);

      themeLink.onload = () => {
        clearTimeout(timeoutId);
        notifyLoaded();
      };

      themeLink.onerror = () => {
        clearTimeout(timeoutId);
        notifyLoaded();
      };

      doc.head.appendChild(themeLink);

      return () => {
        cancelled = true;
        clearTimeout(timeoutId);
      };
    };

    ensureBaseStyles();
    const cleanup = applyTheme();
    return cleanup;
  }, [theme, mountNode, onThemeLoadStateChange]);

  return (
    <div className="preview-frame-container">
      <iframe
        ref={iframeRef}
        className="module-preview-frame"
        title="Vista previa del módulo"
        // No usamos srcDoc aquí para evitar recargas accidentales al renderizar
      />
      {mountNode && createPortal(children, mountNode)}
    </div>
  );
};

export default ModulePreviewFrame;
