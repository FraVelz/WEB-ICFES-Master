import React from 'react';

export const DailyChallengesWidget = () => {
  return (
    <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Desafíos Diarios</h3>
      <p className="text-slate-300">Próximamente...</p>
    </div>
  );
};

export const DailyChallengesPage = () => {
    return (
        <div className="min-h-[100dvh] bg-slate-950 pt-24 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Desafíos Diarios</h1>
                <DailyChallengesWidget />
            </div>
        </div>
    );
};
