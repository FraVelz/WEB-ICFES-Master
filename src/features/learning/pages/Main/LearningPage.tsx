'use client';

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
  const [activeLevel, setActiveLevel] = useState<'easy' | 'intermediate' | 'advanced' | null>(null);
  const [activeArea, setActiveArea] = useState('all');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Get all unique topics based on active area
  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    if (activeArea === 'all') {
      Object.values(LEARNING_MATERIALS).forEach((materials) => {
        materials.forEach((material) => {
          material.topics.forEach((topic) => topics.add(topic));
        });
      });
    } else {
      const areaMaterials = LEARNING_MATERIALS[activeArea] ?? [];
      areaMaterials.forEach((material) => {
        material.topics.forEach((topic) => topics.add(topic));
      });
    }
    return Array.from(topics).sort();
  }, [activeArea]);

  // Filter topics based on search term
  const filteredTopics = useMemo(() => {
    if (!searchTerm) return allTopics;
    return allTopics.filter((topic: string) =>
      topic.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allTopics]);

  // Filter materials based on selected area and topics
  const filteredMaterials = useMemo(() => {
    const result: Record<string, typeof LEARNING_MATERIALS[string]> = {};

    Object.entries(LEARNING_MATERIALS).forEach(([area, materials]) => {
      if (activeArea !== 'all' && area !== activeArea) return;

      const filtered = materials.filter((material) => {
        if (selectedTopics.length === 0) return true;
        return material.topics.some((topic) => selectedTopics.includes(topic));
      });

      if (filtered.length > 0) {
        result[area] = filtered;
      }
    });

    return result;
  }, [activeArea, selectedTopics]);

  const handleAreaChange = (area: string) => {
    setActiveArea(area);
    setSelectedTopics([]);
    setSearchTerm('');
  };

  const clearFilters = () => {
    setActiveArea('all');
    setSelectedTopics([]);
    setSearchTerm('');
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const areaIcons = {
    mathematics: {
      icon: 'ruler',
      color: 'text-yellow-400',
      label: 'Matemáticas',
    },
    lenguaje: { icon: 'book', color: 'text-blue-400', label: 'Lenguaje' },
    science: { icon: 'flask', color: 'text-green-400', label: 'Ciencias' },
    social: { icon: 'globe', color: 'text-orange-400', label: 'Sociales' },
  };

  type LevelKey = 'easy' | 'intermediate' | 'advanced';
  const learningLevels: Record<LevelKey, { title: string; subtitle: string; description: string; icon: string; color: string; textColor: string; borderColor: string; bgColor: string; hoverColor: string; subjects: number }> = {
    easy: {
      title: 'Nivel Fácil',
      subtitle: 'Aprende las Bases',
      description:
        'Domina los conceptos fundamentales de cada materia con materiales estructurados, explicaciones y ejercicios básicos.',
      icon: 'lightbulb',
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      bgColor: 'bg-blue-500/10',
      hoverColor: 'hover:shadow-blue-500/30',
      subjects: 5,
    },
    intermediate: {
      title: 'Nivel Intermedio',
      subtitle: 'Practica por Materia',
      description:
        'Realiza exámenes individuales de cada materia para fortalecer tus conocimientos con preguntas tipo ICFES.',
      icon: 'bullseye',
      color: 'from-orange-500 to-yellow-500',
      textColor: 'text-orange-400',
      borderColor: 'border-orange-500/30',
      bgColor: 'bg-orange-500/10',
      hoverColor: 'hover:shadow-orange-500/30',
      subjects: 5,
    },
    advanced: {
      title: 'Nivel Avanzado',
      subtitle: 'Simulacro Global ICFES',
      description:
        'Completa un examen global que simula las condiciones reales del ICFES con todas las materias integradas.',
      icon: 'fire',
      color: 'from-red-500 to-pink-500',
      textColor: 'text-red-400',
      borderColor: 'border-red-500/30',
      bgColor: 'bg-red-500/10',
      hoverColor: 'hover:shadow-red-500/30',
      subjects: 5,
    },
  };

  if (!activeLevel) {
    return (
      <div className="min-h-dvh overflow-hidden bg-linear-to-b from-black via-slate-950 to-black text-white">
        {/* Background glow effects */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/30 blur-3xl"></div>
          <div className="absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500/30 blur-3xl"></div>
          <div className="absolute top-2/3 left-3/4 h-72 w-72 animate-pulse rounded-full bg-indigo-500/20 blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="pt-20">
            {/* Hero Section */}
            <header className="mb-20 text-center">
              <h1 className="mb-8 bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-5xl font-bold text-transparent md:text-6xl lg:text-7xl">
                📚 Modo Aprendizaje
              </h1>
              <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
                Elige tu nivel de dificultad y comienza tu camino hacia el
                dominio del ICFES
              </p>
            </header>

            {/* Level Selection Grid */}
            <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-3">
              {Object.entries(learningLevels).map(([levelKey, level]) => (
                <div
                  key={levelKey}
                  onClick={() => setActiveLevel(levelKey as 'easy' | 'intermediate' | 'advanced')}
                  className={`group relative cursor-pointer rounded-2xl border-2 p-8 transition-all duration-300 ${level.borderColor} ${level.bgColor} hover:scale-105 hover:shadow-2xl ${level.hoverColor}`}
                >
                  {/* Card Background Glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className={`mb-6 text-5xl ${level.textColor} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon name={level.icon} />
                    </div>

                    {/* Title */}
                    <h2 className="mb-2 text-2xl font-bold text-white">
                      {level.title}
                    </h2>
                    <p
                      className={`text-sm font-semibold ${level.textColor} mb-4`}
                    >
                      {level.subtitle}
                    </p>

                    {/* Description */}
                    <p className="mb-6 text-sm leading-relaxed text-slate-300">
                      {level.description}
                    </p>

                    {/* Stats */}
                    <div className="mb-6 flex items-center justify-between rounded-lg bg-black/30 p-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">
                          {level.subjects}
                        </p>
                        <p className="text-xs text-slate-400">Materias</p>
                      </div>
                      <div
                        className={`text-3xl ${level.textColor} transition-transform duration-300 group-hover:translate-x-1`}
                      >
                        <Icon name="arrow-right" />
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      className={`w-full rounded-lg bg-linear-to-r px-4 py-3 font-semibold transition-all duration-300 ${level.color} text-white group-hover:shadow-lg hover:shadow-lg`}
                    >
                      Empezar Ahora
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Back Button */}
            <div className="pb-20 text-center">
              <Link
                href="/"
                className="inline-block cursor-pointer rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:shadow-purple-500/30"
              >
                ← Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentLevel = learningLevels[activeLevel!];

  return (
    <div className="min-h-dvh overflow-hidden bg-linear-to-b from-black via-slate-950 to-black text-white">
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/30 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500/30 blur-3xl"></div>
        <div className="absolute top-2/3 left-3/4 h-72 w-72 animate-pulse rounded-full bg-indigo-500/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="pt-20 sm:px-6">
          {/* Header with Back Button */}
          <button
            onClick={() => {
              setActiveLevel(null);
              setActiveArea('all');
              setSelectedTopics([]);
              setSearchTerm('');
            }}
            className={`mb-8 flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-300 ${currentLevel.bgColor} ${currentLevel.borderColor} border hover:scale-105 hover:shadow-lg`}
          >
            <span className="text-lg">←</span>
            <span className="font-semibold">Volver a Niveles</span>
          </button>

          {/* Hero Section */}
          <header className="mb-20 text-center">
            <div className={`mb-4 text-5xl ${currentLevel.textColor}`}>
              <Icon name={currentLevel.icon} />
            </div>
            <h1 className="mb-4 bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-5xl font-bold text-transparent md:text-6xl lg:text-7xl">
              {currentLevel.title}
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
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
            <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(areaIcons).map(([areaKey, areaData]) => (
                <Link
                  key={areaKey}
                  href={`/exam/${areaKey}`}
                  className="group rounded-2xl border-2 border-slate-700/50 bg-slate-800/20 p-8 transition-all duration-300 hover:scale-105 hover:border-orange-500/60 hover:bg-orange-500/10 hover:shadow-lg hover:shadow-orange-500/30"
                >
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className={`text-5xl ${areaData.color}`}>
                      <Icon name={areaData.icon} />
                    </div>
                    <div>
                      <h3 className="mb-2 text-2xl font-bold text-white">
                        {areaData.label}
                      </h3>
                      <p className="mb-4 text-sm text-slate-400">
                        Practica con exámenes específicos
                      </p>
                      <p className="text-sm font-semibold text-orange-400">
                        Comenzar Examen →
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeLevel === 'advanced' && (
            <div className="mx-auto mb-20 max-w-2xl">
              <div className="rounded-2xl border-2 border-red-500/30 bg-red-500/10 p-12">
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="text-6xl text-red-400">
                    <Icon name="fire" />
                  </div>
                  <div>
                    <h3 className="mb-4 text-3xl font-bold text-white">
                      Simulacro Global ICFES
                    </h3>
                    <p className="mb-6 text-lg leading-relaxed text-slate-300">
                      Completa un examen que simula las condiciones reales del
                      ICFES. Incluye todas las materias integradas con el mismo
                      formato, duración y dificultad del examen oficial.
                    </p>
                    <div className="mb-8 grid grid-cols-2 gap-4 text-left">
                      <div className="rounded-lg bg-black/30 p-3">
                        <p className="flex items-center gap-2 font-semibold text-red-400">
                          <Icon name="clock" /> Duración
                        </p>
                        <p className="text-sm text-slate-300">
                          3 horas aproximadamente
                        </p>
                      </div>
                      <div className="rounded-lg bg-black/30 p-3">
                        <p className="flex items-center gap-2 font-semibold text-red-400">
                          <Icon name="chart-line" /> Preguntas
                        </p>
                        <p className="text-sm text-slate-300">
                          200 preguntas totales
                        </p>
                      </div>
                      <div className="rounded-lg bg-black/30 p-3">
                        <p className="font-semibold text-red-400">
                          🎯 Materias
                        </p>
                        <p className="text-sm text-slate-300">
                          5 áreas integradas
                        </p>
                      </div>
                      <div className="rounded-lg bg-black/30 p-3">
                        <p className="font-semibold text-red-400">
                          📈 Resultados
                        </p>
                        <p className="text-sm text-slate-300">
                          Análisis detallado
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/exam/full"
                      className="inline-block w-full rounded-lg bg-linear-to-r from-red-500 to-pink-500 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30"
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
        <div className="pb-20 text-center">
          <Link
            href="/"
            className="inline-block cursor-pointer rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:shadow-purple-500/30"
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
