import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-linear-to-b from-black via-slate-900 to-black flex flex-col items-center justify-center p-4 text-white">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-cyan-400/80 mb-4 leading-none">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Página no encontrada</h2>
        <p className="text-slate-400 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg no-underline hover:opacity-90 transition-opacity"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
