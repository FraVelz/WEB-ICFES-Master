import ClientSPA from '@/components/ClientSPA';

const ROUTES = [
  'login', 'onboarding', 'signup', 'forgot-password', 'reset-password',
  'auth/redirect', 'logros', 'clasificatoria', 'ruta-aprendizaje', 'desafios-diarios',
  'perfil', 'configuracion', 'examen-completo', 'perfil/public',
  'practica/matematicas', 'practica/lenguaje', 'practica/ciencias', 'practica/sociales',
  'lessons/matematicas/algebra', 'lessons/matematicas/geometria', 'lessons/matematicas/calculo',
  'lessons/matematicas/trigonometria', 'lessons/matematicas/numeros-complejos',
  'lessons/lenguaje/gramatica', 'lessons/lenguaje/comprension', 'lessons/lenguaje/literatura',
  'lessons/lenguaje/ortografia', 'lessons/lenguaje/semantica',
  'lessons/ciencias/biologia', 'lessons/ciencias/fisica', 'lessons/ciencias/quimica',
  'lessons/ciencias/ecologia', 'lessons/ciencias/termodinamica',
  'lessons/sociales/historia', 'lessons/sociales/geografia', 'lessons/sociales/economia',
  'lessons/sociales/ciudadania', 'lessons/sociales/filosofia',
];

export function generateStaticParams() {
  return [
    { slug: [] }, // raíz "/"
    ...ROUTES.map((route) => ({ slug: route.split('/') })),
  ];
}

export default function SPAPage() {
  return <ClientSPA />;
}
