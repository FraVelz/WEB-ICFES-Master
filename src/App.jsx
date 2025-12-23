import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/features/home/pages';

import { DailyChallengesPage } from '@/features/logros/pages';
import { LearningRoadmapPage } from '@/features/learning/pages';
import { PracticePage, FullExamPage, ClasificatoriaPage } from '@/features/exam/pages';
import { StorePage } from '@/features/store/pages';
import { PerfilNormal, PerfilPublico, UserSettingsPage } from '@/features/user/pages';
import LogrosPage from '@/features/logros';
import { Header, PrivateRoute, DemoRoute, DemoTimerBanner } from '@/shared/components';
import { LoginPage, SignupPage, ForgotPasswordPage, ResetPasswordPage, FirebaseRedirectPage, OnboardingPage } from '@/features/auth/pages';

import { useAuth } from '@/context/AuthContext';
import { usePlanScheduleChecker } from '@/features/store/hooks/usePlanScheduleChecker';


// Mathematics lessons
import { Algebra } from '@/features/learning/lessons/mathematics/Algebra';
import { Geometria } from '@/features/learning/lessons/mathematics/Geometria';
import { Calculo } from '@/features/learning/lessons/mathematics/Calculo';
import { Trigonometria } from '@/features/learning/lessons/mathematics/Trigonometria';
import { NumerosComplejos } from '@/features/learning/lessons/mathematics/NumerosComplejos';

// Lenguaje lessons
import { Gramatica } from '@/features/learning/lessons/lenguaje/Gramatica';
import { Comprension } from '@/features/learning/lessons/lenguaje/Comprension';
import { Literatura } from '@/features/learning/lessons/lenguaje/Literatura';
import { Ortografia } from '@/features/learning/lessons/lenguaje/Ortografia';
import { Semantica } from '@/features/learning/lessons/lenguaje/Semantica';

// Science lessons
import { Biologia } from '@/features/learning/lessons/science/Biologia';
import { Fisica } from '@/features/learning/lessons/science/Fisica';
import { Quimica } from '@/features/learning/lessons/science/Quimica';
import { Ecologia } from '@/features/learning/lessons/science/Ecologia';
import { Termodinamica } from '@/features/learning/lessons/science/Termodinamica';

// Social lessons
import { Historia } from '@/features/learning/lessons/social/Historia';
import { Geografia } from '@/features/learning/lessons/social/Geografia';
import { Economia } from '@/features/learning/lessons/social/Economia';
import { Ciudadania } from '@/features/learning/lessons/social/Ciudadania';
import { Filosofia } from '@/features/learning/lessons/social/Filosofia';

import { Privacidad, Terminos } from '@/features/legal';
import { MainLayout } from '@/shared/components/MainLayout';

function App() {
  const { isAuthenticated, loading } = useAuth();
  const [isDemoMode, setIsDemoMode] = React.useState(false);
  
  // Hook para revisar constantemente planes programados
  usePlanScheduleChecker();

  // Verificar si estamos en modo demo
  React.useEffect(() => {
    const demoMode = localStorage.getItem('demoMode') === 'true';
    setIsDemoMode(demoMode);
    
    const interval = setInterval(() => {
      const currentDemoMode = localStorage.getItem('demoMode') === 'true';
      setIsDemoMode(currentDemoMode);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-linear-to-b from-black via-slate-950 to-black text-white items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-lg font-semibold text-cyan-400">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado ni en demo, mostrar rutas públicas sin layout principal
  if (!isAuthenticated && !isDemoMode) {
    return (
      <div className="flex flex-col h-full bg-linear-to-b from-black via-slate-950 to-black relative">
         {/* Background glow effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-2/3 left-3/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative z-10 flex-1 overflow-y-auto">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/redirect" element={<FirebaseRedirectPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/perfil/public/:userId" element={<PerfilPublico />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      {/* Demo Timer Banner - Mostrar solo en modo demo */}
      {isDemoMode && <DemoTimerBanner isDemoMode={isDemoMode} />}

      <Routes>
          {/* Public Routes - Redirecciones si ya está autenticado */}
          <Route path="/login" element={<Navigate to="/perfil" />} />
          <Route path="/onboarding" element={<Navigate to="/perfil" />} />
          <Route path="/signup" element={<Navigate to="/perfil" />} />
          <Route path="/" element={<HomePage />} />
          
          {/* Legal Routes */}
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/terminos" element={<Terminos />} />
          
          {/* Public Profile Routes */}
          <Route path="/perfil/public/:userId" element={<PerfilPublico />} />
          
          {/* Protected Routes */}
          <Route path="/logros" element={isDemoMode ? <DemoRoute><LogrosPage /></DemoRoute> : <PrivateRoute><LogrosPage /></PrivateRoute>} />
          <Route path="/clasificatoria" element={<PrivateRoute><ClasificatoriaPage /></PrivateRoute>} />
          <Route path="/ruta-aprendizaje" element={<DemoRoute><LearningRoadmapPage /></DemoRoute>} />
          <Route path="/desafios-diarios" element={<PrivateRoute><DailyChallengesPage /></PrivateRoute>} />
          <Route path="/practica/:area" element={<PrivateRoute><PracticePage /></PrivateRoute>} />
          <Route path="/tienda" element={<PrivateRoute><StorePage /></PrivateRoute>} />
          <Route path="/perfil" element={<PrivateRoute><PerfilNormal /></PrivateRoute>} />
          <Route path="/configuracion" element={<PrivateRoute><UserSettingsPage /></PrivateRoute>} />
          <Route path="/examen-completo" element={<PrivateRoute><FullExamPage /></PrivateRoute>} />
          
          {/* Mathematics lessons */}
          <Route path="/lessons/matematicas/algebra" element={<Algebra />} />
          <Route path="/lessons/matematicas/geometria" element={<Geometria />} />
          <Route path="/lessons/matematicas/calculo" element={<Calculo />} />
          <Route path="/lessons/matematicas/trigonometria" element={<Trigonometria />} />
          <Route path="/lessons/matematicas/numeros-complejos" element={<NumerosComplejos />} />
          
          {/* Lenguaje lessons */}
          <Route path="/lessons/lenguaje/gramatica" element={<Gramatica />} />
          <Route path="/lessons/lenguaje/comprension" element={<Comprension />} />
          <Route path="/lessons/lenguaje/literatura" element={<Literatura />} />
          <Route path="/lessons/lenguaje/ortografia" element={<Ortografia />} />
          <Route path="/lessons/lenguaje/semantica" element={<Semantica />} />
          
          {/* Science lessons */}
          <Route path="/lessons/ciencias/biologia" element={<Biologia />} />
          <Route path="/lessons/ciencias/fisica" element={<Fisica />} />
          <Route path="/lessons/ciencias/quimica" element={<Quimica />} />
          <Route path="/lessons/ciencias/ecologia" element={<Ecologia />} />
          <Route path="/lessons/ciencias/termodinamica" element={<Termodinamica />} />
          
          {/* Social lessons */}
          <Route path="/lessons/sociales/historia" element={<Historia />} />
          <Route path="/lessons/sociales/geografia" element={<Geografia />} />
          <Route path="/lessons/sociales/economia" element={<Economia />} />
          <Route path="/lessons/sociales/ciudadania" element={<Ciudadania />} />
          <Route path="/lessons/sociales/filosofia" element={<Filosofia />} />
          
          {/* Catch-all route for invalid URLs */}
          <Route path="*" element={<Navigate to="/perfil" />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
