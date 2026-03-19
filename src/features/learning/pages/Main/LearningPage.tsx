import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { useState, useMemo } from 'react';
import { LearningFilters } from '@/features/learning/components';
import { MaterialsGrid } from '@/features/learning/components';
import { AdditionalResources } from '@/features/learning/components';
import { FloatingFilterButton } from '@/shared/components/molecules';
import { ResultsSummary } from '@/shared/components/molecules';
import { LEARNING_MATERIALS } from '@/shared/data';

export const LearningPage = () => {
  const [activeLevel, setActiveLevel] = useState(null); // null | 'easy' | 'intermediate' | 'advanced'
  const [activeArea, setActiveArea] = useState('all');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Get all unique topics based on active area
  const allTopics = useMemo(() => {
    const topics = new Set();
    if (activeArea === 'all') {
      Object.values(LEARNING_MATERIALS).forEach(materials => {
        materials.forEach(material => {
          material.topics.forEach(topic => topics.add(topic));
        });
      });
    } else {
      const areaMaterials = LEARNING_MATERIALS[activeArea] || [];
      areaMaterials.forEach(material => {
        material.topics.forEach(topic => topics.add(topic));
      });
    }
    return Array.from(topics).sort();
  }, [activeArea]);

  // Filter topics based on search term
  const filteredTopics = useMemo(() => {
    if (!searchTerm) return allTopics;
    return allTopics.filter(topic =>
      topic.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allTopics]);

  // Filter materials based on selected area and topics
  const filteredMaterials = useMemo(() => {
    let result = {};

    Object.entries(LEARNING_MATERIALS).forEach(([area, materials]) => {
      if (activeArea !== 'all' && area !== activeArea) return;

      const filtered = materials.filter(material => {
        if (selectedTopics.length === 0) return true;
        return material.topics.some(topic => selectedTopics.includes(topic));
      });

      if (filtered.length > 0) {
        result[area] = filtered;
      }
    });

    return result;
  }, [activeArea, selectedTopics]);

  const handleAreaChange = (area) => {
    setActiveArea(area);
    setSelectedTopics([]);
    setSearchTerm('');
  };

  const clearFilters = () => {
    setActiveArea('all');
    setSelectedTopics([]);
    setSearchTerm('');
  };

  const toggleTopic = (topic) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const areaIcons = {
    mathematics: { icon: 'ruler', color: 'text-yellow-400', label: 'Matemáticas' },
    lenguaje: { icon: 'book', color: 'text-blue-400', label: 'Lenguaje' },
    science: { icon: 'flask', color: 'text-green-400', label: 'Ciencias' },
    social: { icon: 'globe', color: 'text-orange-400', label: 'Sociales' }
  };

  const learningLevels = {
    easy: {
      title: 'Nivel Fácil',
      subtitle: 'Aprende las Bases',
      description: 'Domina los conceptos fundamentales de cada materia con materiales estructurados, explicaciones y ejercicios básicos.',
      icon: 'lightbulb',
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      bgColor: 'bg-blue-500/10',
      hoverColor: 'hover:shadow-blue-500/30',
      subjects: 5
    },
    intermediate: {
      title: 'Nivel Intermedio',
      subtitle: 'Practica por Materia',
      description: 'Realiza exámenes individuales de cada materia para fortalecer tus conocimientos con preguntas tipo ICFES.',
      icon: 'bullseye',
      color: 'from-orange-500 to-yellow-500',
      textColor: 'text-orange-400',
      borderColor: 'border-orange-500/30',
      bgColor: 'bg-orange-500/10',
      hoverColor: 'hover:shadow-orange-500/30',
      subjects: 5
    },
    advanced: {
      title: 'Nivel Avanzado',
      subtitle: 'Simulacro Global ICFES',
      description: 'Completa un examen global que simula las condiciones reales del ICFES con todas las materias integradas.',
      icon: 'fire',
      color: 'from-red-500 to-pink-500',
      textColor: 'text-red-400',
      borderColor: 'border-red-500/30',
      bgColor: 'bg-red-500/10',
      hoverColor: 'hover:shadow-red-500/30',
      subjects: 5
    }
  };

  if (!activeLevel) {
    return (
      <div className="min-h-dvh bg-linear-to-b from-black via-slate-950 to-black text-white overflow-hidden">
        {/* Background glow effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-2/3 left-3/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="pt-20">
            {/* Hero Section */}
            <header className="text-center mb-20">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                📚 Modo Aprendizaje
              </h1>
              <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Elige tu nivel de dificultad y comienza tu camino hacia el dominio del ICFES
              </p>
            </header>

            {/* Level Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {Object.entries(learningLevels).map(([levelKey, level]) => (
                <div
                  key={levelKey}
                  onClick={() => setActiveLevel(levelKey)}
                  className={`group relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${level.borderColor} ${level.bgColor} hover:scale-105 hover:shadow-2xl ${level.hoverColor}`}
                >
                  {/* Card Background Glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`text-5xl mb-6 ${level.textColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon name={level.icon} />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-white mb-2">{level.title}</h2>
                    <p className={`text-sm font-semibold ${level.textColor} mb-4`}>{level.subtitle}</p>

                    {/* Description */}
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">{level.description}</p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-6 p-3 rounded-lg bg-black/30">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{level.subjects}</p>
                        <p className="text-xs text-slate-400">Materias</p>
                      </div>
                      <div className={`text-3xl ${level.textColor} group-hover:translate-x-1 transition-transform duration-300`}>
                        <Icon name="arrow-right" />
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 bg-linear-to-r ${level.color} text-white hover:shadow-lg group-hover:shadow-lg`}
                    >
                      Empezar Ahora
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Back Button */}
            <div className="text-center pb-20">
              <Link
                href="/"
                className="cursor-pointer inline-block bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105"
              >
                ← Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentLevel = learningLevels[activeLevel];

  return (
    <div className="min-h-dvh bg-linear-to-b from-black via-slate-950 to-black text-white overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-2/3 left-3/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="sm:px-6 pt-20">
          {/* Header with Back Button */}
          <button
            onClick={() => {
              setActiveLevel(null);
              setActiveArea('all');
              setSelectedTopics([]);
              setSearchTerm('');
            }}
            className={`mb-8 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${currentLevel.bgColor} ${currentLevel.borderColor} border hover:scale-105 hover:shadow-lg`}
          >
            <span className="text-lg">←</span>
            <span className="font-semibold">Volver a Niveles</span>
          </button>

          {/* Hero Section */}
          <header className="text-center mb-20">
            <div className={`text-5xl mb-4 ${currentLevel.textColor}`}>
              <Icon name={currentLevel.icon} />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {currentLevel.title}
            </h1>
            <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {currentLevel.description}
            </p>
          </header>

          {/* Level-specific content */}
          {activeLevel === 'easy' && (
            <>
              {/* Filter Section for Easy Level */}
              <LearningFilters
                activeArea={activeArea}
                selectedTopics={selectedTopics}
                searchTerm={searchTerm}
                onAreaChange={handleAreaChange}
                onTopicToggle={toggleTopic}
                onSearchChange={setSearchTerm}
                onClearFilters={clearFilters}
                areaIcons={areaIcons}
                filteredTopics={filteredTopics}
                allTopics={allTopics}
              />

              {/* Results Summary */}
              <ResultsSummary
                activeArea={activeArea}
                selectedTopics={selectedTopics}
                filteredMaterials={filteredMaterials}
              />

              {/* Materials Grid */}
              <MaterialsGrid
                filteredMaterials={filteredMaterials}
                areaIcons={areaIcons}
                selectedTopics={selectedTopics}
                onTopicToggle={toggleTopic}
              />
            </>
          )}

          {activeLevel === 'intermediate' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {Object.entries(areaIcons).map(([areaKey, areaData]) => (
                <Link
                  key={areaKey}
                  href={`/exam/${areaKey}`}
                  className="group p-8 rounded-2xl border-2 border-slate-700/50 bg-slate-800/20 hover:border-orange-500/60 hover:bg-orange-500/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className={`text-5xl ${areaData.color}`}>
                      <Icon name={areaData.icon} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{areaData.label}</h3>
                      <p className="text-slate-400 text-sm mb-4">Practica con exámenes específicos</p>
                      <p className="text-orange-400 font-semibold text-sm">Comenzar Examen →</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeLevel === 'advanced' && (
            <div className="max-w-2xl mx-auto mb-20">
              <div className="p-12 rounded-2xl border-2 border-red-500/30 bg-red-500/10">
                <div className="flex flex-col items-center text-center gap-6">
                  <div className="text-6xl text-red-400">
                    <Icon name="fire" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-4">Simulacro Global ICFES</h3>
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                      Completa un examen que simula las condiciones reales del ICFES. Incluye todas las materias integradas con el mismo formato, duración y dificultad del examen oficial.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                      <div className="p-3 rounded-lg bg-black/30">
                        <p className="text-red-400 font-semibold flex items-center gap-2"><Icon name="clock" /> Duración</p>
                        <p className="text-slate-300 text-sm">3 horas aproximadamente</p>
                      </div>
                      <div className="p-3 rounded-lg bg-black/30">
                        <p className="text-red-400 font-semibold flex items-center gap-2"><Icon name="chart-line" /> Preguntas</p>
                        <p className="text-slate-300 text-sm">200 preguntas totales</p>
                      </div>
                      <div className="p-3 rounded-lg bg-black/30">
                        <p className="text-red-400 font-semibold">🎯 Materias</p>
                        <p className="text-slate-300 text-sm">5 áreas integradas</p>
                      </div>
                      <div className="p-3 rounded-lg bg-black/30">
                        <p className="text-red-400 font-semibold">📈 Resultados</p>
                        <p className="text-slate-300 text-sm">Análisis detallado</p>
                      </div>
                    </div>
                    <Link
                      href="/exam/full"
                      className="inline-block w-full px-8 py-4 rounded-lg font-semibold transition-all duration-300 bg-linear-to-r from-red-500 to-pink-500 text-white hover:shadow-lg hover:shadow-red-500/30 hover:scale-105"
                    >
                      Iniciar Simulacro Global
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Resources Section - Only for Easy Level */}
        {activeLevel === 'easy' && <AdditionalResources />}

        {/* Back Button */}
        <div className="text-center pb-20">
          <Link
            href="/"
            className="cursor-pointer inline-block bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105"
          >
            ← Volver al Inicio
          </Link>
        </div>

        {/* Floating Filter Button - Only for Easy Level */}
        {activeLevel === 'easy' && <FloatingFilterButton />}
      </div>
    </div>
  );
};
