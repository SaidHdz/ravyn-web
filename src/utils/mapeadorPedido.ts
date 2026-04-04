import { Pedido } from '@/types/pedido';

/**
 * Transforma el estado plano del Formulario (Configurator) 
 * al objeto estructurado (JSON Maestro) que espera LienzoRavyn.
 */
export const transformFormToLienzo = (formContent: any, activeModules: string[] = []): Pedido => {
  const temaGlobal = formContent.tema || 'neo-japan';

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

  if (activeModules.includes('modulo-historia') || formContent.memorias?.length > 0) {
    pedido.historia = {
      config: {
        tema: temaGlobal,
        titulo_principal: 'Nuestra Historia',
        subtitulo: formContent.historiaSubtitle || ''
      },
      memorias: (formContent.memorias || []).map((m: any) => ({
        id: String(m.id || Date.now()),
        photo_url: m.foto || '',
        titulo: m.titulo || '',
        descripcion_corta: '',
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
        contenido: d.texto || '',
        cancion: d.musica || ''
      }))
    };
  }

  if (activeModules.includes('modulo-wrapped')) {
    const w = formContent.wrapped || {};
    
    // CONSTRUCCIÓN DINÁMICA DE DIAPOSITIVAS BASADA EN EL FORMULARIO
    const diapositivas = [
      {
        id: 'slide-intro',
        tipo: 'intro',
        titulo: 'Nuestro Wrapped',
        datos: { subtitulo: `Un resumen de nuestra historia, ${formContent.pareja}` }
      },
      {
        id: 'slide-chat',
        tipo: 'metricas_chat',
        titulo: 'Nuestras Charlas',
        datos: {
          total_mensajes: w.totalMensajes || '0',
          palabra_top: w.palabraTop || 'Te amo',
          top_emojis: [w.emojiTop || '❤️', '✨', '🥰']
        }
      },
      {
        id: 'slide-temas',
        tipo: 'grafica_barras',
        titulo: '¿De qué hablamos?',
        datos: {
          subtitulo: 'Nuestros temas recurrentes',
          items: [
            { nombre: w.tema1 || 'Nosotros', porcentaje: w.tema1Porcentaje || 50 },
            { nombre: w.tema2 || 'Comida', porcentaje: w.tema2Porcentaje || 30 },
            { nombre: w.tema3 || 'Planes', porcentaje: w.tema3Porcentaje || 20 }
          ]
        }
      },
      {
        id: 'slide-paciencia',
        tipo: 'grafica_dona',
        titulo: 'Nivel de Paciencia',
        datos: {
          subtitulo: '¿Quién aguantó más?',
          etiquetas: ['Yo', 'Tú'],
          valores: [w.pacienciaYo || 50, w.pacienciaTu || 50]
        }
      },
      {
        id: 'slide-spotify',
        tipo: 'soundtrack',
        titulo: 'Nuestra Canción',
        datos: { spotify_embed_url: w.cancionSpotify || '' }
      },
      {
        id: 'slide-premios',
        tipo: 'superlativo_custom',
        titulo: 'Premio al Drama',
        datos: {
          icono_award: '🎭',
          ganador: w.premio1Ganador || 'Ambos',
          subtitulo: 'Por las mejores escenas de este año'
        }
      },
      {
        id: 'slide-resumen',
        tipo: 'resumen',
        titulo: 'En Resumen',
        datos: {
          dias_juntos: w.diasJuntos || '365',
          total_mensajes: w.totalMensajes || '0',
          emoji_top: w.emojiTop || '❤️'
        }
      }
    ];

    pedido.wrapped = {
      config: {
        tema: temaGlobal,
        velocidad_slide_segundos: 6
      },
      diapositivas: diapositivas
    };
  }

  return pedido;
};
