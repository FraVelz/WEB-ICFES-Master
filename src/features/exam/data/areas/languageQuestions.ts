import { makeQuestion } from '../questionFactory';

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
