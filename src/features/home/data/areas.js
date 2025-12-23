import { 
  faBook, 
  faSquareRootVariable, 
  faFlask, 
  faGlobe 
} from "@fortawesome/free-solid-svg-icons";

export const AREAS = [
  {
    id: "lectura-critica",
    name: "Lectura Crítica",
    icon: faBook,
    color: "text-blue-400",
    bgColor: "bg-blue-600",
    gradient: "from-blue-600 to-blue-400",
    description: "Comprensión y análisis de textos",
    preguntas: 120,
    dificultad: "Intermedio"
  },
  {
    id: "matematicas",
    name: "Matemáticas",
    icon: faSquareRootVariable,
    color: "text-green-400",
    bgColor: "bg-green-600",
    gradient: "from-green-600 to-green-400",
    description: "Razonamiento cuantitativo",
    preguntas: 150,
    dificultad: "Avanzado"
  },
  {
    id: "ciencias-naturales",
    name: "Ciencias Naturales",
    icon: faFlask,
    color: "text-purple-400",
    bgColor: "bg-purple-600",
    gradient: "from-purple-600 to-purple-400",
    description: "Física, química y biología",
    preguntas: 130,
    dificultad: "Avanzado"
  },
  {
    id: "sociales-ciudadanas",
    name: "Sociales y Ciudadanas",
    icon: faGlobe,
    color: "text-orange-400",
    bgColor: "bg-orange-600",
    gradient: "from-orange-600 to-orange-400",
    description: "Historia, geografía y competencias ciudadanas",
    preguntas: 140,
    dificultad: "Intermedio"
  },
  {
    id: "ingles",
    name: "Inglés",
    icon: faBook,
    color: "text-pink-400",
    bgColor: "bg-pink-600",
    gradient: "from-pink-600 to-pink-400",
    description: "Comprensión de lectura y vocabulario en inglés",
    preguntas: 110,
    dificultad: "Intermedio"
  }
];
