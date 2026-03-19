import { Icon } from '@/shared/components/Icon';

export const QuickStatsSection = () => {
  const stats = [
    {
      icon: 'users',
      value: '12K+',
      label: 'Estudiantes activos',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: 'trophy',
      value: '98%',
      label: 'Aprobaron el ICFES',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: 'fire',
      value: '500+',
      label: 'Preguntas y simulacros',
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: 'graduation-cap',
      value: '48h',
      label: 'Promedio de estudio',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`bg-linear-to-br ${stat.color} rounded-xl p-6 text-white text-center hover:shadow-lg hover:shadow-current/50 transition-all transform hover:scale-105`}
          >
            <div className="text-4xl mb-3 opacity-80">
              <Icon name={stat.icon} />
            </div>
            <div className="text-3xl font-black mb-2">{stat.value}</div>
            <div className="text-sm opacity-90">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
