import { useState } from 'react';
import { Icon } from '@/shared/components/Icon';

export const MobileNavMenu = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'hero', label: 'Inicio', icon: 'home' },
    { id: 'areas', label: 'Áreas', icon: 'th-large' },
    { id: 'features', label: 'Características', icon: 'bolt' },
    { id: 'testimonials', label: 'Testimonios', icon: 'users' },
    { id: 'pricing', label: 'Planes', icon: 'credit-card' },
    { id: 'faq', label: 'Preguntas', icon: 'question' },
  ];

  const handleNavigate = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-linear-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Menú de navegación"
      >
        <Icon name={isOpen ? 'times' : 'bars'} size="lg" />
      </button>

      {/* Menu Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 bg-slate-900/95 backdrop-blur-sm rounded-2xl shadow-2xl p-2 w-56 animate-slideUp">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600/20 transition-colors text-left text-white hover:text-blue-400"
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
