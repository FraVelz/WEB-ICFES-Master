import { faPlay } from '@fortawesome/free-solid-svg-icons';

export const COLLABORATION_BADGES = {
  STUDY_BUDDY: {
    id: 'STUDY_BUDDY',
    name: 'Compañero de Estudio',
    icon: faPlay,
    description: 'Invita a un amigo a estudiar',
    requirement: 'Refiere a 1 persona exitosamente',
    category: 'colaboracion'
  },
  SQUAD_LEADER: {
    id: 'SQUAD_LEADER',
    name: 'Líder de Escuadrón',
    icon: faPlay,
    description: 'Forma un grupo de 5 estudiantes',
    requirement: 'Refiere a 5 personas exitosamente',
    category: 'colaboracion'
  },
  SOCIAL_BUTTERFLY: {
    id: 'SOCIAL_BUTTERFLY',
    name: 'Mariposa Social',
    icon: faPlay,
    description: 'Comparte tu progreso 10 veces',
    requirement: 'Comparte tus logros 10 veces',
    category: 'colaboracion'
  },
  COMMUNITY_HERO: {
    id: 'COMMUNITY_HERO',
    name: 'Héroe Comunitario',
    icon: faPlay,
    description: 'Ayuda a 10 estudiantes con preguntas',
    requirement: 'Responde correctamente 10 preguntas de otros',
    category: 'colaboracion'
  },
  NETWORK_MASTER: {
    id: 'NETWORK_MASTER',
    name: 'Maestro de Redes',
    icon: faPlay,
    description: 'Conecta con 50 estudiantes',
    requirement: 'Agrega 50 amigos en la plataforma',
    category: 'colaboracion'
  }
};
