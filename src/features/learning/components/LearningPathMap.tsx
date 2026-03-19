import { useState } from 'react';
import { Icon } from '@/shared/components/Icon';
import Link from 'next/link';

export const LearningPathMap = () => {
  const [expandedArea, setExpandedArea] = useState(null);

  const learningPaths = [
    {
      id: 'lectura',
      name: 'Lectura Crítica',
      icon: 'book',
      color: 'from-blue-600 to-blue-400',
      icon_color: 'text-blue-400',
      completion: 65,
      difficulty: 'Intermedio',
      modules: [
        { 
          id: 1, 
          name: 'Comprensión de Textos', 
          status: 'completed', 
          xp: 500,
          lessons: 8,
          icon: 'check-circle' 
        },
        { 
          id: 2, 
          name: 'Análisis Crítico', 
          status: 'in-progress', 
          xp: 500,
          lessons: 6,
          icon: 'hourglass',
          progress: 60
        },
        { 
          id: 3, 
          name: 'Inferencias y Argumentos', 
          status: 'locked', 
          xp: 750,
          lessons: 10,
          icon: 'lock' 
        },
      ]
    },
    {
      id: 'matematicas',
      name: 'Matemáticas',
      icon: 'square-root-variable',
      color: 'from-green-600 to-green-400',
      icon_color: 'text-green-400',
      completion: 45,
      difficulty: 'Avanzado',
      modules: [
        { 
          id: 1, 
          name: 'Álgebra Básica', 
          status: 'completed', 
          xp: 600,
          lessons: 12,
          icon: 'check-circle' 
        },
        { 
          id: 2, 
          name: 'Geometría y Trigonometría', 
          status: 'in-progress', 
          xp: 750,
          lessons: 10,
          icon: 'hourglass',
          progress: 40
        },
        { 
          id: 3, 
          name: 'Cálculo y Series', 
          status: 'locked', 
          xp: 1000,
          lessons: 15,
          icon: 'lock' 
        },
        { 
          id: 4, 
          name: 'Estadística Aplicada', 
          status: 'locked', 
          xp: 800,
          lessons: 8,
          icon: 'lock' 
        },
      ]
    },
    {
      id: 'ciencias',
      name: 'Ciencias Naturales',
      icon: 'flask',
      color: 'from-purple-600 to-purple-400',
      icon_color: 'text-purple-400',
      completion: 30,
      difficulty: 'Avanzado',
      modules: [
        { 
          id: 1, 
          name: 'Biología General', 
          status: 'completed', 
          xp: 500,
          lessons: 10,
          icon: 'check-circle' 
        },
        { 
          id: 2, 
          name: 'Física Clásica', 
          status: 'in-progress', 
          xp: 700,
          lessons: 12,
          icon: 'hourglass',
          progress: 30
        },
        { 
          id: 3, 
          name: 'Química Orgánica', 
          status: 'locked', 
          xp: 800,
          lessons: 14,
          icon: 'lock' 
        },
        { 
          id: 4, 
          name: 'Ecología y Sostenibilidad', 
          status: 'locked', 
          xp: 600,
          lessons: 8,
          icon: 'lock' 
        },
      ]
    },
    {
      id: 'sociales',
      name: 'Sociales y Ciudadanas',
      icon: 'globe',
      color: 'from-orange-600 to-orange-400',
      icon_color: 'text-orange-400',
      completion: 50,
      difficulty: 'Intermedio',
      modules: [
        { 
          id: 1, 
          name: 'Historia de Colombia', 
          status: 'completed', 
          xp: 500,
          lessons: 9,
          icon: 'check-circle' 
        },
        { 
          id: 2, 
          name: 'Geografía Política', 
          status: 'in-progress', 
          xp: 600,
          lessons: 8,
          icon: 'hourglass',
          progress: 50
        },
        { 
          id: 3, 
          name: 'Economía y Desarrollo', 
          status: 'locked', 
          xp: 700,
          lessons: 10,
          icon: 'lock' 
        },
        { 
          id: 4, 
          name: 'Filosofía Política', 
          status: 'locked', 
          xp: 650,
          lessons: 7,
          icon: 'lock' 
        },
      ]
    },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-500/20 border-green-500';
      case 'in-progress': return 'bg-blue-500/20 border-blue-500';
      case 'locked': return 'bg-slate-700/50 border-slate-600';
      default: return 'bg-slate-800 border-slate-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return 'check-circle';
      case 'in-progress': return 'hourglass';
      case 'locked': return 'lock';
      default: return 'star';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Encabezado */}
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-2">Tu Ruta de Aprendizaje</h2>
        <p className="text-slate-400">Progresa paso a paso a través de módulos cuidadosamente diseñados</p>
      </div>

      {/* Áreas de Conocimiento */}
      <div className="grid gap-4">
        {learningPaths.map((path) => (
          <div key={path.id} className="group">
            {/* Card Principal del Área */}
            <button
              onClick={() => setExpandedArea(expandedArea === path.id ? null : path.id)}
              className="w-full bg-linear-to-r from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50 text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`bg-linear-to-br ${path.color} p-3 rounded-lg text-2xl`}>
                    <Icon name={path.icon} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{path.name}</h3>
                    <div className="flex gap-4 text-sm text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Icon name="star" className="text-yellow-400" />
                        {path.modules.length} módulos
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="fire" className="text-red-400" />
                        {path.difficulty}
                      </span>
                    </div>
                    
                    {/* Barra de Progreso */}
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`bg-linear-to-r ${path.color} h-full transition-all duration-500`}
                        style={{ width: `${path.completion}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{path.completion}% completado</p>
                  </div>
                </div>
                
                <Icon 
                  name="arrow-right" 
                  className={`text-slate-400 text-lg transition-transform duration-300 ${expandedArea === path.id ? 'rotate-90' : ''}`}
                />
              </div>
            </button>

            {/* Módulos Expandibles */}
            {expandedArea === path.id && (
              <div className="mt-3 space-y-2 pl-4 border-l-2 border-slate-700">
                {path.modules.map((module) => (
                  <div 
                    key={module.id}
                    className={`rounded-lg p-4 border transition-all duration-300 ${getStatusColor(module.status)} backdrop-blur-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Icon 
                          name={getStatusIcon(module.status)} 
                          className={`text-lg ${
                            module.status === 'completed' ? 'text-green-400' :
                            module.status === 'in-progress' ? 'text-blue-400' :
                            'text-slate-500'
                          }`}
                        />
                        <div>
                          <p className="text-white font-semibold">{module.name}</p>
                          <p className="text-sm text-slate-400">{module.lessons} lecciones</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="bg-yellow-500/20 px-2 py-1 rounded text-yellow-400 text-xs font-bold">
                          +{module.xp} XP
                        </div>
                      </div>
                    </div>

                    {/* Barra de progreso del módulo */}
                    {module.status === 'in-progress' && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-full rounded-full transition-all"
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{module.progress}%</span>
                      </div>
                    )}

                    {/* Botón de Acción */}
                    {module.status !== 'locked' && (
                      <Link 
                        href={module.status === 'in-progress' ? `/practica/${path.id}` : `/aprendizaje`}
                        className="mt-3 w-full inline-block text-center py-2 px-4 bg-linear-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
                      >
                        {module.status === 'completed' ? 'Revisar' : 'Continuar'}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stats Adicionales */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-linear-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-1">2,450</div>
          <p className="text-xs text-slate-400">Total XP</p>
        </div>
        <div className="bg-linear-to-br from-green-900/30 to-green-800/20 border border-green-700/50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">12</div>
          <p className="text-xs text-slate-400">Días seguidos</p>
        </div>
        <div className="bg-linear-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-1">8</div>
          <p className="text-xs text-slate-400">Insignias ganadas</p>
        </div>
      </div>
    </div>
  );
};
