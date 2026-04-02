export type Rareza = 'comun' | 'rara' | 'epica';

export interface Pack {
  id: string;
  nombre: string;
  subtitulo: string;
  rareza: Rareza;
  precio: number;
  descripcion: string;
  modulos: string[];
  colorAura: string;
  colorBorde: string;
  etiqueta: string;
}

<<<<<<< HEAD
=======
export const MODULE_PRICES: Record<string, number> = {
  'contador': 69,
  'evasivo': 89,
  'historia': 109,
  'trivia': 129,
  'tarjetas': 149,
  'dedicatorias': 179,
  'wrapped': 309,
};

>>>>>>> 6fc9480732c08144cbc4357cc24d64c5d7d54913
export const PACKS_CONFIG: Pack[] = [
  {
    id: 'pack-semilla',
    nombre: 'Semilla',
    subtitulo: 'Pack Básico',
    rareza: 'comun',
    precio: 249,
    descripcion: 'El detalle perfecto y rápido para marcar un momento especial.',
    modulos: ['historia', 'contador', 'tarjetas'],
<<<<<<< HEAD
    colorAura: 'rgba(205, 127, 50, 0.2)', // Bronce
=======
    colorAura: 'rgba(205, 127, 50, 0.2)',
>>>>>>> 6fc9480732c08144cbc4357cc24d64c5d7d54913
    colorBorde: '#cd7f32',
    etiqueta: 'LO ESENCIAL'
  },
  {
    id: 'pack-rabanito',
    nombre: 'Rabanito',
    subtitulo: 'Pack Interactivo',
    rareza: 'rara',
    precio: 389,
    descripcion: 'Una experiencia dinámica con juegos y cartas profundas.',
<<<<<<< HEAD
    modulos: ['historia', 'trivia', 'evasivo', 'cartas'],
    colorAura: 'rgba(26, 64, 115, 0.4)', // Azul Ravyn con brillo
=======
    modulos: ['historia', 'trivia', 'evasivo', 'dedicatorias'],
    colorAura: 'rgba(26, 64, 115, 0.4)',
>>>>>>> 6fc9480732c08144cbc4357cc24d64c5d7d54913
    colorBorde: '#1A4073',
    etiqueta: 'MÁS POPULAR'
  },
  {
    id: 'pack-cosecha',
    nombre: 'Cosecha',
    subtitulo: 'Pack Completo',
    rareza: 'epica',
    precio: 799,
    descripcion: 'La arquitectura total de vuestros recuerdos. El regalo definitivo.',
<<<<<<< HEAD
    modulos: ['historia', 'contador', 'tarjetas', 'trivia', 'evasivo', 'cartas', 'wrapped'],
    colorAura: 'rgba(211, 47, 47, 0.5)', // Rojo Rábano con brillo intenso
=======
    modulos: ['historia', 'contador', 'tarjetas', 'trivia', 'evasivo', 'dedicatorias', 'wrapped'],
    colorAura: 'rgba(211, 47, 47, 0.5)',
>>>>>>> 6fc9480732c08144cbc4357cc24d64c5d7d54913
    colorBorde: '#D32F2F',
    etiqueta: 'EXPERIENCIA TOTAL'
  }
];
