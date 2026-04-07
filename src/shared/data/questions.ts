// ICFES-area question data
// Questions grouped by area

import type { ExamQuestion } from '@/shared/types/question';

export const MATHEMATICS_QUESTIONS: ExamQuestion[] = [];
export const LANGUAGE_QUESTIONS: ExamQuestion[] = [];
export const SCIENCE_QUESTIONS: ExamQuestion[] = [];
export const SOCIAL_QUESTIONS: ExamQuestion[] = [];

/** Práctica básica ICFES Inglés (gramática, vocabulario, lectura). */
export const ENGLISH_QUESTIONS: ExamQuestion[] = [
  {
    id: 'en-1',
    text: 'Choose the correct option: "She ___ to the library every Monday."',
    options: [
      { id: 'a', text: 'go', letter: 'A' },
      { id: 'b', text: 'goes', letter: 'B' },
      { id: 'c', text: 'going', letter: 'C' },
      { id: 'd', text: 'gone', letter: 'D' },
    ],
    correctAnswer: 'b',
    explanation: 'Third person singular (she) takes "goes" in the present simple.',
    difficulty: 'básico',
  },
  {
    id: 'en-2',
    text: 'Which sentence is correct?',
    options: [
      { id: 'a', text: 'There is many books.', letter: 'A' },
      { id: 'b', text: 'There are many books.', letter: 'B' },
      { id: 'c', text: 'There be many books.', letter: 'C' },
      { id: 'd', text: 'There is a many books.', letter: 'D' },
    ],
    correctAnswer: 'b',
    explanation: '"Books" is plural, so use "There are".',
    difficulty: 'básico',
  },
  {
    id: 'en-3',
    text: 'Complete: "If I ___ rich, I would travel more."',
    options: [
      { id: 'a', text: 'am', letter: 'A' },
      { id: 'b', text: 'was', letter: 'B' },
      { id: 'c', text: 'were', letter: 'C' },
      { id: 'd', text: 'be', letter: 'D' },
    ],
    correctAnswer: 'c',
    explanation: 'Second conditional uses "were" for hypothetical "I" in formal/formulaic English.',
    difficulty: 'intermedio',
  },
  {
    id: 'en-4',
    text: 'Choose the word that best fits: "The weather is ___ today than yesterday."',
    options: [
      { id: 'a', text: 'good', letter: 'A' },
      { id: 'b', text: 'better', letter: 'B' },
      { id: 'c', text: 'best', letter: 'C' },
      { id: 'd', text: 'more good', letter: 'D' },
    ],
    correctAnswer: 'b',
    explanation: 'Comparison between two days requires the comparative "better".',
    difficulty: 'básico',
  },
  {
    id: 'en-5',
    text: 'Which is the correct question tag? "You like coffee, ___?"',
    options: [
      { id: 'a', text: "isn't it", letter: 'A' },
      { id: 'b', text: "aren't you", letter: 'B' },
      { id: 'c', text: "don't you", letter: 'C' },
      { id: 'd', text: "won't you", letter: 'D' },
    ],
    correctAnswer: 'c',
    explanation: 'Present simple affirmative "You like" → tag "don\'t you?".',
    difficulty: 'intermedio',
  },
  {
    id: 'en-6',
    text: 'Pick the correct passive voice: "The letter ___ yesterday."',
    options: [
      { id: 'a', text: 'was sent', letter: 'A' },
      { id: 'b', text: 'is sent', letter: 'B' },
      { id: 'c', text: 'sent', letter: 'C' },
      { id: 'd', text: 'has sent', letter: 'D' },
    ],
    correctAnswer: 'a',
    explanation: 'Past passive: was/were + past participle.',
    difficulty: 'intermedio',
  },
  {
    id: 'en-7',
    text: 'Reading: "Maria studies hard because she wants to pass the exam." Why does Maria study hard?',
    options: [
      { id: 'a', text: 'Because she likes studying only.', letter: 'A' },
      { id: 'b', text: 'Because she wants to pass the exam.', letter: 'B' },
      { id: 'c', text: 'Because the exam is easy.', letter: 'C' },
      { id: 'd', text: 'The text does not say.', letter: 'D' },
    ],
    correctAnswer: 'b',
    explanation: 'The clause after "because" states the reason explicitly.',
    difficulty: 'básico',
  },
  {
    id: 'en-8',
    text: 'Choose the correct connector: "I was tired; ___, I finished my homework."',
    options: [
      { id: 'a', text: 'although', letter: 'A' },
      { id: 'b', text: 'however', letter: 'B' },
      { id: 'c', text: 'because', letter: 'C' },
      { id: 'd', text: 'unless', letter: 'D' },
    ],
    correctAnswer: 'b',
    explanation: '"However" introduces a contrast between being tired and finishing homework.',
    difficulty: 'intermedio',
  },
  {
    id: 'en-9',
    text: 'Which word is a synonym of "happy"?',
    options: [
      { id: 'a', text: 'sad', letter: 'A' },
      { id: 'b', text: 'glad', letter: 'B' },
      { id: 'c', text: 'angry', letter: 'C' },
      { id: 'd', text: 'bored', letter: 'D' },
    ],
    correctAnswer: 'b',
    explanation: '"Glad" means pleased or happy.',
    difficulty: 'básico',
  },
  {
    id: 'en-10',
    text: 'Complete: "Neither Tom nor his brothers ___ at home now."',
    options: [
      { id: 'a', text: 'is', letter: 'A' },
      { id: 'b', text: 'are', letter: 'B' },
      { id: 'c', text: 'was', letter: 'C' },
      { id: 'd', text: 'be', letter: 'D' },
    ],
    correctAnswer: 'b',
    explanation: 'With "neither...nor", the verb often agrees with the nearer plural subject "brothers".',
    difficulty: 'intermedio',
  },
];

export const ALL_QUESTIONS: ExamQuestion[] = [
  ...MATHEMATICS_QUESTIONS,
  ...LANGUAGE_QUESTIONS,
  ...SCIENCE_QUESTIONS,
  ...SOCIAL_QUESTIONS,
  ...ENGLISH_QUESTIONS,
];
