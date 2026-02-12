import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faStar, faCoins, faPlay } from '@fortawesome/free-solid-svg-icons';

export const LessonPreview = ({ isOpen, onClose, lesson, onStart }) => {
  if (!isOpen || !lesson) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative w-screen mb-20 max-w-md bg-slate-900 border-t border-slate-700 sm:border sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2 mr-8">{lesson.title}</h3>
          <p className="text-slate-400 text-sm">{lesson.description}</p>
        </div>

        {/* Rewards */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="flex flex-col items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700 min-w-[100px]">
            <span className="text-orange-400 font-bold text-lg">+{lesson?.xp ?? 0}</span>
            <span className="text-slate-500 text-xs uppercase tracking-wider">XP</span>
          </div>
          <div className="flex flex-col items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700 min-w-[100px]">
            <span className="text-yellow-400 font-bold text-lg">+{lesson?.coins ?? 0}</span>
            <span className="text-slate-500 text-xs uppercase tracking-wider">Monedas</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onStart(lesson);
            onClose();
          }}
          className="cursor-pointer w-full py-4 bg-green-500 hover:bg-green-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faPlay} />
          COMENZAR LECCIÓN
        </button>
      </div>
    </div>
  );
};
