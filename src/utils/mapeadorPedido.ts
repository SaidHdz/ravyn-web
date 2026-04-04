import { Pedido } from '@/types/pedido';

/**
 * Transforma el estado plano del Formulario (Configurator) 
 * al objeto estructurado (JSON Maestro) que espera LienzoRavyn.
 */
export const transformFormToLienzo = (formContent: any, activeModules: string[] = []): Pedido => {
  const temaGlobal = formContent.tema || 'neo-japan';
  const cleanModules = activeModules.map(m => m.replace('modulo-', ''));

  const pedido: Pedido = {
    bienvenida: {
      pareja: formContent.pareja || '',
      mensaje: formContent.mensajeBienvenida || ''
    },
    configuracion_global: {
      tema: temaGlobal,
      orden: cleanModules
    }
  };

  // --- Módulos Estándar ---
  if (cleanModules.includes('historia')) {
    pedido.historia = {
      config: { tema: temaGlobal, titulo_principal: 'Nuestra Historia', subtitulo: formContent.historiaSubtitle || '' },
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

  if (cleanModules.includes('contador')) {
    pedido.contador = {
      config: { tema: temaGlobal },
      titulo: formContent.contador?.titulo || '',
      mensaje: formContent.contador?.subtitulo || '',
      fecha: formContent.contador?.fecha || ''
    };
  }

  if (cleanModules.includes('tarjetas')) {
    pedido.tarjetas = {
      config: { tema: temaGlobal, mensaje_inicio: formContent.mensajeInicioTarjetas || '' },
      cartas: (formContent.tarjetas || []).map((t: any) => ({
        id: t.id, titulo: t.titulo || '', contenido: t.contenido || '', imagen: t.imagen || ''
      }))
    };
  }

  if (cleanModules.includes('trivia')) {
    pedido.trivia = {
      config: { tema: temaGlobal, mensaje_inicio: '', mensaje_exito: formContent.trivia?.mensajeExito || '', mensaje_error: formContent.trivia?.mensajeError || '' },
      preguntas: (formContent.trivia?.preguntas || []).map((p: any) => ({
        pregunta: p.pregunta || '', opciones: p.opciones || [], correcta: p.correcta || 0
      }))
    };
  }

  if (cleanModules.includes('evasivo')) {
    pedido.evasivo = {
      config: { tema: temaGlobal },
      pregunta: formContent.evasivo?.pregunta || '',
      texto_si: formContent.evasivo?.textoSi || '',
      texto_no: formContent.evasivo?.textoNo || '',
      mensaje_exito: formContent.evasivo?.mensajeExito || ''
    };
  }

  if (cleanModules.includes('dedicatorias')) {
    pedido.dedicatorias = {
      config: { tema: temaGlobal, mensaje_inicio: formContent.mensajeInicioDedic || '' },
      cartas: (formContent.dedicatorias || []).map((d: any) => ({
        id: d.id, titulo: d.titulo || '', contenido: d.texto || '', cancion: d.musica || ''
      }))
    };
  }

  // --- MÓDULO WRAPPED (MAPEO COMPLETO) ---
  if (cleanModules.includes('wrapped')) {
    const w = formContent.wrapped || {};
    
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
        id: 'slide-horario',
        tipo: 'horario_pico',
        titulo: 'Hora de Intensidad',
        datos: {
          subtitulo: 'Cuando más nos mensajeamos',
          pico_hora: w.horarioPico || '22:00',
          valores: [20, 45, 70, 90, 100, 80, 40] // Curva de ejemplo centrada en el pico
        }
      },
      {
        id: 'slide-perdon',
        tipo: 'medidor_perdon',
        titulo: 'Nivel de Paz',
        datos: {
          subtitulo: 'Nuestra capacidad de reconciliación',
          valor: w.pacienciaYo || 85, // Usamos la paciencia como valor del medidor
          perdonador_top: w.perdonadorTop || 'Tú'
        }
      },
      {
        id: 'slide-spotify',
        tipo: 'soundtrack',
        titulo: 'Nuestra Canción',
        datos: { spotify_embed_url: w.cancionSpotify || '' }
      },
      // --- PREMIOS / SUPERLATIVOS ---
      {
        id: 'award-1',
        tipo: 'superlativo_custom',
        titulo: 'El Mejor Chef',
        datos: {
          icono_award: '🍳',
          ganador: w.premio1Ganador || 'Tú',
          subtitulo: 'Por conquistar mi estómago cada día'
        }
      },
      {
        id: 'award-2',
        tipo: 'superlativo_custom',
        titulo: 'Se duerme en todo',
        datos: {
          icono_award: '😴',
          ganador: w.premio2Ganador || 'Yo',
          subtitulo: 'Incluso en las pelis de acción'
        }
      },
      {
        id: 'award-3',
        tipo: 'superlativo_custom',
        titulo: 'Premio al Drama',
        datos: {
          icono_award: '🎭',
          ganador: w.premio3Ganador || 'Ambos',
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
