import { Pedido } from '@/types/pedido';

/**
 * Transforma el estado plano del Formulario (Configurator) 
 * al objeto estructurado (JSON Maestro) que espera LienzoRavyn.
 * 
 * @param formContent El estado `projectConfig` del formulario.
 * @param activeModules Array con los nombres de los módulos seleccionados (ej: ['modulo-historia', ...])
 * @returns Un objeto que cumple estrictamente con la interfaz `Pedido`.
 */
export const transformFormToLienzo = (formContent: any, activeModules: string[] = []): Pedido => {
  const temaGlobal = formContent.tema || 'neo-japan';

  // 1. Estructura Base: Bienvenida y Configuración Global
  const pedido: Pedido = {
    bienvenida: {
      pareja: formContent.pareja || '',
      mensaje: formContent.mensajeBienvenida || ''
    },
    configuracion_global: {
      tema: temaGlobal,
      orden: activeModules.map(m => m.replace('modulo-', ''))
    }
  };

  // 2. Mapeo Condicional de Módulos
  // Solo inyectamos los módulos que el usuario ha configurado o seleccionado

  if (activeModules.includes('modulo-historia') || formContent.memorias?.length > 0) {
    pedido.historia = {
      config: {
        tema: temaGlobal,
        titulo_principal: 'Nuestra Historia',
        subtitulo: formContent.historiaSubtitle || ''
      },
      memorias: (formContent.memorias || []).map((m: any) => ({
        id: String(m.id || Date.now()),
        // CRÍTICO (Pipeline de Imágenes): El "swap" de URLs ocurre aquí.
        // Las imágenes actualmente traen un 'blob:http://...' local para la previsualización en el navegador.
        // Después del pago, se comprimirán y subirán a Cloudinary.
        // El script de orquestación (processOrderAndDeploy) DEBE buscar esta propiedad 'photo_url' y 
        // reemplazar el 'blob:' por la 'secure_url' pública de Cloudinary antes de enviar a n8n.
        photo_url: m.foto || '',
        titulo: m.titulo || '',
        descripcion_corta: '', // Reservado para futura iteración
        texto_largo: m.texto || '',
        fecha: m.fecha || '',
        lugar: m.lugar || ''
      }))
    };
  }

  if (activeModules.includes('modulo-contador') || formContent.contador?.fecha) {
    pedido.contador = {
      config: { tema: temaGlobal },
      titulo: formContent.contador?.titulo || '',
      mensaje: formContent.contador?.subtitulo || '',
      fecha: formContent.contador?.fecha || ''
    };
  }

  if (activeModules.includes('modulo-tarjetas') || formContent.tarjetas?.length > 0) {
    pedido.tarjetas = {
      config: {
        tema: temaGlobal,
        mensaje_inicio: formContent.mensajeInicioTarjetas || ''
      },
      cartas: (formContent.tarjetas || []).map((t: any) => ({
        id: t.id,
        titulo: t.titulo || '',
        contenido: t.contenido || '',
        // CRÍTICO (Pipeline de Imágenes): Mismo proceso que en historia.
        // Reemplazar la Blob URL temporal de 'imagen' por la de Cloudinary tras el pago.
        imagen: t.imagen || ''
      }))
    };
  }

  if (activeModules.includes('modulo-trivia') || formContent.trivia?.preguntas?.length > 0) {
    pedido.trivia = {
      config: {
        tema: temaGlobal,
        mensaje_inicio: '',
        mensaje_exito: formContent.trivia?.mensajeExito || '',
        mensaje_error: formContent.trivia?.mensajeError || ''
      },
      preguntas: (formContent.trivia?.preguntas || []).map((p: any) => ({
        pregunta: p.pregunta || '',
        opciones: p.opciones || [],
        correcta: p.correcta || 0
      }))
    };
  }

  if (activeModules.includes('modulo-evasivo') || formContent.evasivo?.pregunta) {
    pedido.evasivo = {
      config: { tema: temaGlobal },
      pregunta: formContent.evasivo?.pregunta || '',
      texto_si: formContent.evasivo?.textoSi || '',
      texto_no: formContent.evasivo?.textoNo || '',
      mensaje_exito: formContent.evasivo?.mensajeExito || ''
    };
  }

  if (activeModules.includes('modulo-dedicatorias') || formContent.dedicatorias?.length > 0) {
    pedido.dedicatorias = {
      config: {
        tema: temaGlobal,
        mensaje_inicio: formContent.mensajeInicioDedic || ''
      },
      cartas: (formContent.dedicatorias || []).map((d: any) => ({
        id: d.id,
        titulo: d.titulo || '',
        contenido: d.texto || '', // Mapeo de texto a contenido
        cancion: d.musica || ''
      }))
    };
  }

  if (activeModules.includes('modulo-wrapped') || formContent.wrapped) {
    // ATENCIÓN MÓDULO WRAPPED: Este módulo es altamente visual y estructurado.
    // 'WrappedFormConfigurator.tsx' debe asegurar que la estructura de 'diapositivas' 
    // se construya rigurosamente antes de enviarse aquí.
    // El mapeador recibe el array y se asegura de incluir todas sus propiedades.
    pedido.wrapped = {
      config: {
        tema: temaGlobal,
        velocidad_slide_segundos: 5
      },
      diapositivas: (formContent.wrapped?.diapositivas || []).map((slide: any) => ({
        id: slide.id || String(Date.now()),
        tipo: slide.tipo || 'intro',
        titulo: slide.titulo || '',
        datos: slide.datos || {}
      }))
    };
  }

  return pedido;
};
