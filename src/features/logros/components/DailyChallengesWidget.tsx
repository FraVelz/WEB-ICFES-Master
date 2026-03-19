import React from 'react';

export const DailyChallengesWidget = () => {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
      <h3 className="mb-4 text-xl font-bold text-white">Desafíos Diarios</h3>
      <p className="text-slate-300">Próximamente...</p>
    </div>
  );
};

export const DailyChallengesPage = () => {
  return (
    <div className="min-h-dvh bg-slate-950 px-4 pt-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-white">Desafíos Diarios</h1>
        <DailyChallengesWidget />
      </div>
    </div>
  );
};
