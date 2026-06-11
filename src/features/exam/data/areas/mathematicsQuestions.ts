import { makeQuestion } from '../questionFactory';

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
