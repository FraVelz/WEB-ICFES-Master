import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faCheckCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { MascotaCircle } from '@/shared/components/MascotaCircle';

// Secciones de introducción
const INTRODUCTION_SECTIONS = [
    {
        id: 1,
        message: '¡Hola!, Yo soy Zeus.',
        avatar: '/avatars/logo.webp', // Avatar con libro o presentación
        description: 'Tu asistente de estudio',
    },
    {
        id: 2,
        message: '¡Responde 5 preguntas cortas antes de comenzar!',
        avatar: '/avatars/logo.webp', // Avatar saludando
        description: 'Personalizaremos tu experiencia.',
    },
];

// Preguntas del cuestionario de onboarding
const ONBOARDING_QUESTIONS = [
    {
        id: 1,
        question: '¿Cuál es tu objetivo principal?',
        type: 'single',
        options: [
            { value: 'pass', label: 'Pasar el ICFES' },
            { value: 'excel', label: 'Obtener un puntaje excelente' },
            { value: 'prepare', label: 'Prepararme a mi propio ritmo' },
            { value: 'improve', label: 'Mejorar mis debilidades' },
        ],
    },
    {
        id: 2,
        question: '¿En cuánto tiempo planeas presentar el ICFES?',
        type: 'single',
        options: [
            { value: 'less_month', label: 'Menos de 1 mes' },
            { value: '1_3_months', label: '1 a 3 meses' },
            { value: '3_6_months', label: '3 a 6 meses' },
            { value: 'more_6_months', label: 'Más de 6 meses' },
        ],
    },
    {
        id: 3,
        question: '¿Cuál es tu nivel actual?',
        type: 'single',
        options: [
            { value: 'beginner', label: 'Principiante (nunca he practicado)' },
            { value: 'intermediate', label: 'Intermedio (tengo algo de experiencia)' },
            { value: 'advanced', label: 'Avanzado (ya he practicado bastante)' },
        ],
    },
    {
        id: 4,
        question: '¿Cuáles son tus áreas débiles? (selecciona 1 o más)',
        type: 'multiple',
        options: [
            { value: 'math', label: 'Matemáticas' },
            { value: 'language', label: 'Lenguaje' },
            { value: 'science', label: 'Ciencias Naturales' },
            { value: 'social', label: 'Ciencias Sociales' },
            { value: 'english', label: 'Inglés' },
            { value: 'none', label: 'Me desempeño bien en todo' },
        ],
    },
    {
        id: 5,
        question: '¿Cuánto tiempo disponible tienes para estudiar diariamente?',
        type: 'single',
        options: [
            { value: 'less_30m', label: 'Menos de 30 minutos' },
            { value: '30m_1h', label: '30 minutos a 1 hora' },
            { value: '1h_2h', label: '1 a 2 horas' },
            { value: 'more_2h', label: 'Más de 2 horas' },
        ],
    },
];

// Componente de Layout reutilizable para mantener consistencia
const OnboardingLayout = ({ children, className = "" }) => (
    <div className={`min-h-[100dvh] bg-linear-to-b from-black via-slate-950 to-black text-white flex flex-col relative ${className}`}>
        {/* Background glow effects - Fixed position */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        </div>
        {/* Content wrapper */}
        <div className="relative z-10 flex flex-col flex-1 w-full">
            {children}
        </div>
    </div>
);

export const OnboardingQuiz = ({ onComplete, avatarConfig = {} }) => {
    const navigate = useNavigate();
    const [stage, setStage] = useState('intro'); // 'intro', 'quiz', 'completed'
    const [introIndex, setIntroIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    // Configuración de avatares - permitir personalización
    const avatarSettings = {
        intro1: avatarConfig.intro1 || '/avatars/logo.webp',
        intro2: avatarConfig.intro2 || '/avatars/logo.webp',
    };

    const currentQuestion = ONBOARDING_QUESTIONS[currentQuestionIndex];
    const isMultiple = currentQuestion?.type === 'multiple';
    const currentAnswer = answers[currentQuestion?.id] || (isMultiple ? [] : '');
    const progress = ((currentQuestionIndex + 1) / ONBOARDING_QUESTIONS.length) * 100;

    const handleSelectOption = (value) => {
        if (isMultiple) {
            const currentAnswers = Array.isArray(currentAnswer) ? currentAnswer : [];
            setAnswers(prev => ({
                ...prev,
                [currentQuestion.id]: currentAnswers.includes(value)
                    ? currentAnswers.filter(v => v !== value)
                    : [...currentAnswers, value],
            }));
        } else {
            setAnswers(prev => ({
                ...prev,
                [currentQuestion.id]: value,
            }));
        }
    };

    // Navegación de introducciones
    const handleIntroNext = () => {
        if (introIndex < INTRODUCTION_SECTIONS.length - 1) {
            setIntroIndex(prev => prev + 1);
        } else {
            setStage('quiz');
            setIntroIndex(0);
        }
    };

    const handleIntroBack = () => {
        if (introIndex > 0) {
            setIntroIndex(prev => prev - 1);
        } else {
            navigate('/');
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < ONBOARDING_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setStage('completed');
        }
    };

    const handleQuizBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        } else {
            // Volver a la introducción
            setStage('intro');
            setIntroIndex(INTRODUCTION_SECTIONS.length - 1);
        }
    };

    const handleContinue = () => {
        onComplete(answers);
    };

    const canProceed = isMultiple
        ? (Array.isArray(currentAnswer) && currentAnswer.length > 0)
        : currentAnswer !== '';

    // Pantalla de Introducción (Secciones 1 y 2)
    if (stage !== 'quiz' && stage !== 'completed') {
        const currentIntro = INTRODUCTION_SECTIONS[introIndex];
        const avatarSrc = introIndex === 0 ? avatarSettings.intro1 : avatarSettings.intro2;

        return (
            <OnboardingLayout>
                {/* Header */}
                <div className="h-16 flex items-center px-6">
                    <button
                        onClick={handleIntroBack}
                        className="cursor-pointer p-2 hover:bg-slate-800 rounded-lg transition-all duration-200"
                        title="Volver atrás"
                    >
                        <FontAwesomeIcon icon={faChevronRight} className="text-xl text-cyan-400 rotate-180" />
                    </button>
                </div>

                {/* Main Content */}
                <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                    {/* Avatar */}
                    <MascotaCircle
                        src={avatarSrc}
                        size="large"
                        alt="Zeus - Tu asistente"
                        className="mb-8"
                    />

                    {/* Message */}
                    <div className="w-full max-w-2xl bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center backdrop-blur-sm">
                        <h2 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                            {currentIntro.message}
                        </h2>
                        <p className="text-slate-300 text-sm">
                            {currentIntro.description}
                        </p>
                    </div>
                </main>

                {/* Bottom Section - Button */}
                <footer className="pb-8 px-6 w-full max-w-md mx-auto">
                    <button
                        onClick={handleIntroNext}
                        className="cursor-pointer w-full py-4 px-6 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                    >
                        <span>Continuar</span>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </footer>
            </OnboardingLayout>
        );
    }

    if (stage === 'completed') {
        return (
            <OnboardingLayout className="items-center justify-center">
                <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 w-full max-w-md mx-auto text-center space-y-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-r from-green-500 to-emerald-600 mx-auto shadow-lg shadow-green-500/30">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-5xl" />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-black bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                            ¡Perfecto!
                        </h2>

                        <p className="text-slate-300 text-lg">
                            Hemos entendido tus necesidades. Ahora crearemos tu cuenta personalizada con un plan adaptado a ti.
                        </p>
                    </div>

                    <button
                        onClick={handleContinue}
                        className="cursor-pointer w-full py-4 px-6 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                        Ir al Registro
                    </button>
                </main>
            </OnboardingLayout>
        );
    }

    return (
        <OnboardingLayout>
            {/* Header & Progress - Sticky Top */}
            <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-lg">
                <div className="h-16 flex items-center justify-between px-6">
                    <button
                        onClick={handleQuizBack}
                        className="cursor-pointer p-2 hover:bg-slate-800 rounded-lg transition-all duration-200"
                        title="Volver atrás"
                    >
                        <FontAwesomeIcon icon={faChevronRight} className="text-xl text-cyan-400 rotate-180" />
                    </button>
                    <div className="flex items-center justify-center gap-6 flex-1">
                        <h3 className="text-sm font-semibold text-slate-400 hidden sm:block">
                            Pregunta {currentQuestionIndex + 1} de {ONBOARDING_QUESTIONS.length}
                        </h3>
                        <span className="text-sm font-semibold text-cyan-400">{Math.round(progress)}%</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-0">
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-linear-to-r from-cyan-500 to-blue-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </header>

            {/* Main Content - Scrollable Area */}
            <main className="flex-1 flex flex-col w-full max-w-4xl mx-auto px-4 py-8 gap-8">
                
                {/* Question + Avatar */}
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <div className="flex-shrink-0">
                        <MascotaCircle
                            src="/avatars/pensativo.webp"
                            size="medium"
                            alt="Zeus - Tu asistente"
                            centered={false}
                        />
                    </div>
                    <div className="flex-1 text-center sm:text-left pt-2">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                            {currentQuestion.question}
                        </h2>
                    </div>
                </div>

                {/* Options List */}
                <div className="w-full space-y-3">
                    {currentQuestion.options.map(option => (
                        <button
                            key={option.value}
                            onClick={() => handleSelectOption(option.value)}
                            className={`cursor-pointer w-full p-4 text-left rounded-xl border-2 transition-all duration-200 font-semibold flex items-center gap-4 group
                                ${(isMultiple ? currentAnswer.includes(option.value) : currentAnswer === option.value)
                                ? 'border-cyan-500 bg-cyan-500/20 text-white shadow-lg shadow-cyan-500/10'
                                : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                                }`}
                        >
                            <div
                                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 
                                    ${(isMultiple ? currentAnswer.includes(option.value) : currentAnswer === option.value)
                                    ? 'border-cyan-500 bg-cyan-500 scale-110'
                                    : 'border-slate-600 group-hover:border-slate-400'
                                    }`}
                            >
                                {(isMultiple ? currentAnswer.includes(option.value) : currentAnswer === option.value) && (
                                    <span className="text-white text-sm font-bold">✓</span>
                                )}
                            </div>
                            <span className="text-base sm:text-lg">{option.label}</span>
                        </button>
                    ))}
                </div>

            </main>

            {/* Footer Actions */}
            <footer className="p-6 pt-2 w-full max-w-4xl mx-auto z-20">
                <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="cursor-pointer w-full py-4 px-6 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-md"
                >
                    {currentQuestionIndex === ONBOARDING_QUESTIONS.length - 1 ? (
                        <>
                            Finalizar
                            <FontAwesomeIcon icon={faCheckCircle} />
                        </>
                    ) : (
                        <>
                            Continuar
                            <FontAwesomeIcon icon={faArrowRight} />
                        </>
                    )}
                </button>
            </footer>
        </OnboardingLayout>
    );
};
