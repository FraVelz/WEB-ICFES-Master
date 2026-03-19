import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faBolt } from '@fortawesome/free-solid-svg-icons';

// Mascota Avatar de la App
const MASCOT_AVATARS = [
 { id: 1, src: '/avatars/saludando.webp', emotion: 'greeting', label: 'Amigable' },
 { id: 2, src: '/avatars/neutral.webp', emotion: 'neutral', label: 'Neutral' },
 { id: 3, src: '/avatars/pensativo.webp', emotion: 'thinking', label: 'Pensando' },
 { id: 4, src: '/avatars/celebrando.webp', emotion: 'celebrating', label: 'Celebrando' },
 { id: 4, src: '/avatars/celebrando-2.webp', emotion: 'celebrating', label: 'Celebrando' },
 { id: 5, src: '/avatars/depcecionado.webp', emotion: 'sad', label: 'Preocupado' },
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
 className = ''
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
 const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
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
 xl: { mascot: 'w-52 h-52', speech: 'max-w-2xl', text: 'text-xl' }
 };

 const sizes = sizeClasses[size] || sizeClasses.md;

 const currentAvatar = MASCOT_AVATARS.find(a => a.emotion === currentEmotion) || MASCOT_AVATARS[0];

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
 className={`cursor-pointer relative group transition-transform duration-300 ${interactive && 'hover:scale-110'} ${isAnimating && 'animate-bounce'} ${bobbing && 'mascot-bobbing'}`}
 >
 {/* Glow effect */}
 <div className="absolute inset-0 bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 scale-110"></div>

 {/* Mascota image */}
 <div className={`${sizes.mascot} rounded-full overflow-hidden relative z-10 shadow-2xl shadow-blue-500/50 bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center`}
 style={{
 borderImage: 'linear-gradient(135deg, #06b6d4, #3b82f6, #a855f7) 1'
 }}
 >
 <img
 src={currentAvatar.src}
 alt="App Mascot"
 className="w-full h-full object-cover"
 onError={(e) => {
 e.target.style.display = 'none';
 }}
 />
 </div>

 {/* Emotion indicator */}
 <div className="absolute -bottom-2 -right-2 bg-linear-to-r from-cyan-400 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
 {currentAvatar.label}
 </div>
 </div>

 {/* Speech Bubble */}
 {showDialogue && (
 <div className={`${sizes.speech} relative group`}>
 {/* Speech bubble tail */}
 <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-cyan-400/80"></div>

 {/* Speech bubble */}
 <div className="bg-linear-to-r from-cyan-400/10 to-blue-400/10 backdrop-blur-xl border border-cyan-400/50 rounded-2xl p-4 shadow-xl shadow-cyan-400/20 hover:border-cyan-400 transition-all duration-300">
 <p className={`${sizes.text} text-white font-semibold text-center leading-relaxed`}>
 {dialogue}
 </p>
 </div>

 {/* Quote mark decoration */}
 <div className="absolute -top-2 -left-2 text-cyan-400/30 text-4xl font-serif">"</div>
 </div>
 )}

 {/* Stats bajo la mascota (opcional) */}
 {interactive && size !== 'sm' && (
 <div className="flex gap-6 pt-4">
 <div className="flex flex-col items-center">
 <FontAwesomeIcon icon={faBolt} className="text-yellow-400 text-xl mb-1" />
 <span className="text-xs text-slate-300">Energía</span>
 <div className="w-16 h-2 bg-slate-700 rounded-full mt-1 overflow-hidden">
 <div className="w-4/5 h-full bg-linear-to-r from-yellow-400 to-orange-400 rounded-full"></div>
 </div>
 </div>
 <div className="flex flex-col items-center">
 <FontAwesomeIcon icon={faBullseye} className="text-cyan-400 text-xl mb-1" />
 <span className="text-xs text-slate-300">Enfoque</span>
 <div className="w-16 h-2 bg-slate-700 rounded-full mt-1 overflow-hidden">
 <div className="w-3/5 h-full bg-linear-to-r from-cyan-400 to-blue-400 rounded-full"></div>
 </div>
 </div>
 </div>
 )}

 {/* Hint: Click to interact */}
 {interactive && (
 <p className="text-xs text-slate-400 text-center italic mt-2">¡Haz clic para interactuar!</p>
 )}
 </div>
 );
};

export default AppMascot;
