import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingQuiz } from '../components/OnboardingQuiz';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const [quizAnswers, setQuizAnswers] = useState(null);

  // Configuración de avatares personalizables
  // Puedes cambiar las rutas de los avatares aquí
  const avatarConfig = {
    intro1: '/avatars/logo.webp', // Avatar para "Hola, Yo soy Zeus"
    intro2: '/avatars/logo.webp', // Avatar para "Responde 5 preguntas..."
  };

  const handleQuizComplete = (answers) => {
    // Guardar las respuestas en sessionStorage para usarlas después en el registro
    sessionStorage.setItem('onboardingAnswers', JSON.stringify(answers));
    setQuizAnswers(answers);
    // Navegar al registro después de 1 segundo
    setTimeout(() => {
      navigate('/signup');
    }, 1000);
  };

  return <OnboardingQuiz onComplete={handleQuizComplete} avatarConfig={avatarConfig} />;
};
