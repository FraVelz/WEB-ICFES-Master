import { makeQuestion } from './questionFactory';

export const MATHEMATICS_QUESTIONS = [
  makeQuestion(
    'mat-1',
    'Si un artículo cuesta $80.000 y tiene un descuento del 25%, ¿cuál es el precio final?',
    ['$60.000', '$55.000', '$20.000', '$65.000'],
    0,
    '25% de 80.000 = 20.000; precio final = 60.000.'
  ),
  makeQuestion(
    'mat-2',
    '¿Cuál es el resultado de 3/4 + 1/6?',
    ['5/6', '11/12', '4/10', '7/12'],
    1,
    'M.C.M. 12: 9/12 + 2/12 = 11/12.'
  ),
  makeQuestion(
    'mat-3',
    'En un triángulo rectángulo con catetos 6 y 8, ¿cuánto mide la hipotenusa?',
    ['10', '12', '14', '√14'],
    0,
    'Teorema de Pitágoras: √(6² + 8²) = √100 = 10.'
  ),
  makeQuestion('mat-4', 'Si f(x) = 2x + 3, ¿cuál es f(4)?', ['9', '11', '8', '14'], 1, 'f(4) = 2(4) + 3 = 11.'),
  makeQuestion(
    'mat-5',
    '¿Cuál es la probabilidad de obtener cara al lanzar una moneda justa?',
    ['1/4', '1/2', '1/3', '2/3'],
    1,
    'Dos resultados equiprobables: cara o sello → 1/2.'
  ),
  makeQuestion(
    'mat-6',
    'El 20% de un número es 40. ¿Cuál es el número?',
    ['200', '800', '160', '240'],
    0,
    '0,2x = 40 → x = 200.',
    'intermedio'
  ),
  makeQuestion(
    'mat-7',
    '¿Cuál es el área de un círculo de radio 5? (use π ≈ 3,14)',
    ['31,4', '78,5', '15,7', '25'],
    1,
    'A = πr² = 3,14 × 25 = 78,5.',
    'intermedio'
  ),
  makeQuestion('mat-8', 'Resuelve: 2x - 5 = 11', ['x = 3', 'x = 8', 'x = 6', 'x = 16'], 1, '2x = 16 → x = 8.'),
];

export const LANGUAGE_QUESTIONS = [
  makeQuestion(
    'len-1',
    '¿Cuál es la función predominante del texto narrativo?',
    [
      'Informar datos científicos',
      'Contar una historia o suceso',
      'Convencer al lector de comprar',
      'Describir un proceso técnico',
    ],
    1,
    'El texto narrativo relata hechos reales o ficticios en secuencia temporal.'
  ),
  makeQuestion(
    'len-2',
    'La palabra subrayada en "El río **serpentea** por el valle" es un ejemplo de:',
    ['Metáfora', 'Personificación', 'Hipérbole', 'Anáfora'],
    1,
    'Se atribuye cualidad de ser vivo (serpentear) a un elemento natural.'
  ),
  makeQuestion(
    'len-3',
    '¿Cuál oración está escrita correctamente según la norma culta?',
    [
      'Había muchos estudiantes en el salón.',
      'Habían muchos estudiantes en el salón.',
      'Había mucho estudiantes en el salón.',
      'Habían mucho estudiantes en el salón.',
    ],
    0,
    '"Había" concuerda con "estudiantes" (plural impersonal).'
  ),
  makeQuestion(
    'len-4',
    'En un texto argumentativo, la tesis corresponde a:',
    ['Un dato estadístico', 'La idea central que se defiende', 'Un ejemplo anecdótico', 'La bibliografía'],
    1,
    'La tesis es la postura o afirmación que el autor intenta sustentar.'
  ),
  makeQuestion(
    'len-5',
    '¿Qué conector expresa contraste?',
    ['además', 'sin embargo', 'por tanto', 'es decir'],
    1,
    '"Sin embargo" introduce oposición entre ideas.'
  ),
  makeQuestion(
    'len-6',
    'El autor usa citas de expertos principalmente para:',
    ['Alargar el texto', 'Respaldar su argumento con autoridad', 'Confundir al lector', 'Evitar la conclusión'],
    1,
    'Las citas aportan evidencia y credibilidad al argumento.',
    'intermedio'
  ),
  makeQuestion(
    'len-7',
    '¿Cuál palabra es un sinónimo de "abundante"?',
    ['escaso', 'profuso', 'breve', 'tenue'],
    1,
    '"Profuso" significa abundante o copioso.'
  ),
  makeQuestion(
    'len-8',
    'La idea principal de un párrafo suele encontrarse en:',
    ['La nota al pie', 'La oración tópica', 'Solo en el título del libro', 'Las comillas'],
    1,
    'La oración tópica sintetiza el contenido del párrafo.',
    'intermedio'
  ),
];

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
