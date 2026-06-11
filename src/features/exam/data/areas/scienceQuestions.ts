import { makeQuestion } from '../questionFactory';

export const SCIENCE_QUESTIONS = [
  makeQuestion(
    'cie-1',
    '¿Qué partícula tiene carga positiva en el átomo?',
    ['Electrón', 'Protón', 'Neutrón', 'Fotón'],
    1,
    'Los protones están en el núcleo y tienen carga positiva.'
  ),
  makeQuestion(
    'cie-2',
    'La fotosíntesis ocurre principalmente en:',
    ['Raíces', 'Cloroplastos', 'Mitocondrias', 'Núcleo'],
    1,
    'Los cloroplastos contienen clorofila para captar luz.'
  ),
  makeQuestion(
    'cie-3',
    '¿Cuál es la unidad básica de la vida?',
    ['Tejido', 'Órgano', 'Célula', 'Sistema'],
    2,
    'Todos los organismos están formados por células.'
  ),
  makeQuestion(
    'cie-4',
    'La ley de conservación de la energía establece que la energía:',
    [
      'Se crea en las plantas',
      'No se crea ni se destruye, solo se transforma',
      'Desaparece al calentar',
      'Solo existe en movimiento',
    ],
    1,
    'Principio fundamental de la termodinámica.'
  ),
  makeQuestion(
    'cie-5',
    '¿Qué gas es esencial para la respiración celular aeróbica?',
    ['Nitrógeno', 'Oxígeno', 'Helio', 'Argón'],
    1,
    'El oxígeno actúa como aceptor final de electrones en la mitocondria.'
  ),
  makeQuestion(
    'cie-6',
    'Un ecosistema incluye:',
    [
      'Solo los animales',
      'Componentes bióticos y abióticos en interacción',
      'Únicamente el suelo',
      'Solo factores climáticos',
    ],
    1,
    'Ecosistema = comunidad biológica + medio físico.',
    'intermedio'
  ),
  makeQuestion(
    'cie-7',
    'La velocidad se calcula como:',
    ['masa × aceleración', 'distancia / tiempo', 'fuerza / área', 'energía / carga'],
    1,
    'v = Δd / Δt.'
  ),
  makeQuestion(
    'cie-8',
    '¿Cuál es un ejemplo de energía renovable?',
    ['Carbón', 'Petróleo', 'Energía solar', 'Gas natural'],
    2,
    'La energía solar se reponde continuamente en escala humana.',
    'intermedio'
  ),
];
