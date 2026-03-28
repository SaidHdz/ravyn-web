export interface ModuloConfig {
  tema?: string;
  [key: string]: any;
}

export interface Bienvenida {
  pareja: string;
  mensaje: string;
}

export interface ConfiguracionGlobal {
  orden: string[];
  tema?: string;
}

export interface Contador {
  config: ModuloConfig;
  titulo: string;
  mensaje: string;
  fecha: string;
}

export interface Evasivo {
  pregunta: string;
  config: ModuloConfig;
  texto_si: string;
  texto_no: string;
  mensaje_exito: string;
}

export interface Memoria {
  id: string;
  photo_url: string;
  titulo: string;
  descripcion_corta: string;
  texto_largo: string;
  fecha: string;
  lugar: string;
}

export interface Historia {
  config: {
    tema: string;
    titulo_principal: string;
    subtitulo: string;
    cancion?: string;
  };
  memorias: Memoria[];
}

export interface Tarjeta {
  id: number;
  titulo: string;
  contenido: string;
  imagen: string;
}

export interface Tarjetas {
  config: {
    tema: string;
    mensaje_inicio: string;
  };
  cartas: Tarjeta[];
}

export interface Pregunta {
  pregunta: string;
  opciones: string[];
  correcta: number;
}

export interface Trivia {
  config: {
    tema: string;
    mensaje_inicio: string;
  };
  preguntas: Pregunta[];
}

export interface Slide {
  id: string;
  tipo: 'intro' | 'metricas_chat' | 'grafica_dona' | 'grafica_barras' | 'horario_pico' | 'medidor_perdon' | 'soundtrack' | 'superlativo_custom' | 'resumen';
  titulo: string;
  datos: {
    subtitulo?: string;
    total_mensajes?: number | string;
    palabra_top?: string;
    top_emojis?: string[];
    valores?: number[];
    colores?: string[];
    etiquetas?: string[];
    items?: Array<{ nombre: string; porcentaje: number; color: string }>;
    pico_hora?: string;
    valor?: string;
    perdonador_top?: string;
    spotify_embed_url?: string;
    icono_award?: string;
    ganador?: string;
    dias_juntos?: number;
    emoji_top?: string;
    [key: string]: any;
  };
}

export interface Wrapped {
  config: {
    tema: string;
    velocidad_slide_segundos: number;
  };
  diapositivas: Slide[];
}

export interface Dedicatoria {
  id: number;
  titulo: string;
  contenido: string;
  cancion?: string;
}

export interface Dedicatorias {
  config: {
    tema: string;
    mensaje_inicio: string;
    secuencia?: string[];
    secuencia_1?: string;
    secuencia_2?: string;
  };
  cartas: Dedicatoria[];
}

export interface Pedido {
  bienvenida: Bienvenida;
  configuracion_global: ConfiguracionGlobal;
  contador?: Contador;
  evasivo?: Evasivo;
  nuestra_historia?: Historia;
  tarjetas?: Tarjetas;
  trivia?: Trivia;
  wrapped?: Wrapped;
  dedicatorias?: Dedicatorias;
  // Otros módulos se añadirán a medida que se migren
  [key: string]: any;
}
