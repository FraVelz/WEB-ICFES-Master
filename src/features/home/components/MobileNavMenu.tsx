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
        className="fixed right-6 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-shadow hover:shadow-xl"
        aria-label="Menú de navegación"
      >
        <Icon name={isOpen ? 'times' : 'bars'} size="lg" />
      </button>

      {/* Menu Panel */}
      {isOpen && (
        <div className="animate-slideUp fixed right-6 bottom-24 z-40 w-56 rounded-2xl bg-slate-900/95 p-2 shadow-2xl backdrop-blur-sm">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-white transition-colors hover:bg-blue-600/20 hover:text-blue-400"
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
