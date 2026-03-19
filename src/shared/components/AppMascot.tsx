import React, { useState, useEffect } from 'react';
import { Icon } from '@/shared/components/Icon';

// Mascota Avatar de la App
const MASCOT_AVATARS = [
  {
    id: 1,
    src: '/avatars/saludando.webp',
    emotion: 'greeting',
    label: 'Amigable',
  },
  { id: 2, src: '/avatars/neutral.webp', emotion: 'neutral', label: 'Neutral' },
  {
    id: 3,
    src: '/avatars/pensativo.webp',
    emotion: 'thinking',
    label: 'Pensando',
  },
  {
    id: 4,
    src: '/avatars/celebrando.webp',
    emotion: 'celebrating',
    label: 'Celebrando',
  },
  {
    id: 4,
    src: '/avatars/celebrando-2.webp',
    emotion: 'celebrating',
    label: 'Celebrando',
  },
  {
    id: 5,
    src: '/avatars/depcecionado.webp',
    emotion: 'sad',
    label: 'Preocupado',
  },
];

const getMascotDialogue = (emotion, context) => {
  const dialogues = {
    greeting: [
      '¡Hola! ¿Listo para estudiar?',
      '¡Bienvenido! Hoy vamos a aprender juntos',
      '¿Qué tal? ¡Vamos a conquistar esos 500 puntos!',
    ],
    thinking: [
      'Hmm... Vamos a resolver esto',
      'Interesante pregunta...',
      'Déjame ayudarte a entender esto',
    ],
    celebrating: [
      '¡Excelente! ¡Así se hace!',
      '¡Eso es! ¡Vas muy bien!',
      '¡Increíble progreso! ',
    ],
    sad: [
      'No te preocupes, lo harás mejor próxima vez',
      'No desistas, ¡te veo mejorando!',
      'Cada error es una lección aprendida',
    ],
    neutral: [
      '¿En qué puedo ayudarte?',
      'Estoy aquí para ti',
      'Continuemos adelante',
    ],
  };

  const contextDialogues = {
    start: [
      '¡Bienvenido a tu jornada de aprendizaje!',
      'Hoy es un gran día para aprender',
      '¡Vamos a comenzar esta aventura!',
    ],
    practice: [
      '¡A practicar se ha dicho! ',
      'Vamos con esas preguntas',
      'Mostrémonos de qué estamos hechos',
    ],
    achievement: [
      '¡Lograste un hito! ',
      '¡Eres increíble!',
      'Este es tu momento de brillar ',
    ],
  };

  const selected = context ? contextDialogues[context] : dialogues[emotion];
  return selected[Math.floor(Math.random() * selected.length)];
};

/**
 * Componente Mascota - Similar a Duolingo Owl
 * Interactiva, motivadora y linda
 */
export const AppMascot = ({
  size = 'md',
  emotion = 'greeting',
  showDialogue = true,
  interactive = true,
  context = null,
  className = '',
}) => {
  const [currentEmotion, setCurrentEmotion] = useState(emotion);
  const [dialogue, setDialogue] = useState(getMascotDialogue(emotion, context));
  const [isAnimating, setIsAnimating] = useState(false);
  const [bobbing] = useState(true);

  useEffect(() => {
    setCurrentEmotion(emotion);
    setDialogue(getMascotDialogue(emotion, context));
  }, [emotion, context]);

  // Cambiar emoción aleatorialmente cada 5 segundos si está activo
  useEffect(() => {
    if (!interactive) return;

    const emotionTimer = setInterval(() => {
      const emotions = ['greeting', 'thinking', 'neutral'];
      const randomEmotion =
        emotions[Math.floor(Math.random() * emotions.length)];
      setCurrentEmotion(randomEmotion);
      setDialogue(getMascotDialogue(randomEmotion));
    }, 5000);

    return () => clearInterval(emotionTimer);
  }, [interactive]);

  // Efecto de bobbing (movimiento suave hacia arriba y abajo)
  useEffect(() => {
    if (!bobbing) return;

    const bobbingStyle = document.createElement('style');
    bobbingStyle.textContent = `
 @keyframes mascotBob {
 0%, 100% { transform: translateY(0px); }
 50% { transform: translateY(-10px); }
 }
 .mascot-bobbing {
 animation: mascotBob 3s ease-in-out infinite;
 }
 `;
    document.head.appendChild(bobbingStyle);

    return () => document.head.removeChild(bobbingStyle);
  }, [bobbing]);

  const sizeClasses = {
    sm: { mascot: 'w-16 h-16', speech: 'max-w-xs', text: 'text-sm' },
    md: { mascot: 'w-32 h-32', speech: 'max-w-md', text: 'text-base' },
    lg: { mascot: 'w-40 h-40', speech: 'max-w-lg', text: 'text-lg' },
    xl: { mascot: 'w-52 h-52', speech: 'max-w-2xl', text: 'text-xl' },
  };

  const sizes = sizeClasses[size] || sizeClasses.md;

  const currentAvatar =
    MASCOT_AVATARS.find((a) => a.emotion === currentEmotion) ||
    MASCOT_AVATARS[0];

  const handleMascotClick = () => {
    if (!interactive) return;
    setIsAnimating(true);
    setCurrentEmotion('celebrating');
    setDialogue(getMascotDialogue('celebrating'));
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Mascota */}
      <div
        onClick={handleMascotClick}
        className={`group relative cursor-pointer transition-transform duration-300 ${interactive && 'hover:scale-110'} ${isAnimating && 'animate-bounce'} ${bobbing && 'mascot-bobbing'}`}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 scale-110 rounded-full bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-50"></div>

        {/* Mascota image */}
        <div
          className={`${sizes.mascot} relative z-10 flex items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-slate-800 to-slate-900 shadow-2xl shadow-blue-500/50`}
          style={{
            borderImage: 'linear-gradient(135deg, #06b6d4, #3b82f6, #a855f7) 1',
          }}
        >
          <img
            src={currentAvatar.src}
            alt="App Mascot"
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        {/* Emotion indicator */}
        <div className="absolute -right-2 -bottom-2 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 px-3 py-1 text-xs font-bold whitespace-nowrap text-white shadow-lg">
          {currentAvatar.label}
        </div>
      </div>

      {/* Speech Bubble */}
      {showDialogue && (
        <div className={`${sizes.speech} group relative`}>
          {/* Speech bubble tail */}
          <div className="absolute -top-3 left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-8 border-r-8 border-l-8 border-t-cyan-400/80 border-r-transparent border-l-transparent"></div>

          {/* Speech bubble */}
          <div className="rounded-2xl border border-cyan-400/50 bg-linear-to-r from-cyan-400/10 to-blue-400/10 p-4 shadow-xl shadow-cyan-400/20 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400">
            <p
              className={`${sizes.text} text-center leading-relaxed font-semibold text-white`}
            >
              {dialogue}
            </p>
          </div>

          {/* Quote mark decoration */}
          <div className="absolute -top-2 -left-2 font-serif text-4xl text-cyan-400/30">
            "
          </div>
        </div>
      )}

      {/* Stats bajo la mascota (opcional) */}
      {interactive && size !== 'sm' && (
        <div className="flex gap-6 pt-4">
          <div className="flex flex-col items-center">
            <Icon name="bolt" className="mb-1 text-xl text-yellow-400" />
            <span className="text-xs text-slate-300">Energía</span>
            <div className="mt-1 h-2 w-16 overflow-hidden rounded-full bg-slate-700">
              <div className="h-full w-4/5 rounded-full bg-linear-to-r from-yellow-400 to-orange-400"></div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Icon name="bullseye" className="mb-1 text-xl text-cyan-400" />
            <span className="text-xs text-slate-300">Enfoque</span>
            <div className="mt-1 h-2 w-16 overflow-hidden rounded-full bg-slate-700">
              <div className="h-full w-3/5 rounded-full bg-linear-to-r from-cyan-400 to-blue-400"></div>
            </div>
          </div>
        </div>
      )}

      {/* Hint: Click to interact */}
      {interactive && (
        <p className="mt-2 text-center text-xs text-slate-400 italic">
          ¡Haz clic para interactuar!
        </p>
      )}
    </div>
  );
};

export default AppMascot;
