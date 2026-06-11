import { makeQuestion } from '../questionFactory';

export const SOCIAL_QUESTIONS = [
  makeQuestion(
    'soc-1',
    'La Constitución Política de Colombia de 1991 establece que Colombia es:',
    ['Una monarquía', 'Un Estado social de derecho', 'Un protectorado', 'Una confederación'],
    1,
    'Artículo 1: Colombia es un Estado social de derecho.'
  ),
  makeQuestion(
    'soc-2',
    '¿Cuál es una función de la Rama Legislativa?',
    ['Juzgar procesos penales', 'Expedir leyes', 'Comandar las Fuerzas Militares', 'Dirigir la Policía'],
    1,
    'El Congreso tiene función legislativa.'
  ),
  makeQuestion(
    'soc-3',
    'La democracia participativa implica que los ciudadanos:',
    [
      'Solo votan cada 20 años',
      'Pueden incidir en decisiones públicas',
      'No tienen derechos',
      'Delegan todo al ejecutivo',
    ],
    1,
    'Mecanismos como referendo, plebiscito y cabildo abierto.'
  ),
  makeQuestion(
    'soc-4',
    'Un conflicto armado interno afecta principalmente:',
    ['Solo la economía global', 'Derechos humanos y convivencia', 'La órbita lunar', 'El clima polar'],
    1,
    'Impacto en población civil, desplazamiento y instituciones.'
  ),
  makeQuestion(
    'soc-5',
    'La globalización se caracteriza por:',
    [
      'Aislamiento total de países',
      'Mayor interconexión económica y cultural',
      'Prohibición del comercio',
      'Fin de las tecnologías',
    ],
    1,
    'Intercambio de bienes, ideas y capital a escala mundial.'
  ),
  makeQuestion(
    'soc-6',
    'Los derechos fundamentales incluyen:',
    ['Solo derechos de propiedad', 'Vida, dignidad e igualdad', 'Privilegios de gobernantes', 'Impuestos obligatorios'],
    1,
    'Consagrados en el Título II de la Constitución.',
    'intermedio'
  ),
  makeQuestion(
    'soc-7',
    'Un mapa temático muestra principalmente:',
    [
      'Fotografías satelitales en color',
      'Distribución de un fenómeno (población, clima, etc.)',
      'Solo fronteras políticas',
      'Coordenadas astronómicas',
    ],
    1,
    'Representa información específica sobre el territorio.'
  ),
  makeQuestion(
    'soc-8',
    'La separación de poderes busca:',
    [
      'Concentrar autoridad en una persona',
      'Evitar abusos mediante equilibrio entre ramas',
      'Eliminar el Congreso',
      'Suprimir la justicia',
    ],
    1,
    'Montesquieu: ejecutivo, legislativo y judicial se controlan mutuamente.',
    'intermedio'
  ),
];
