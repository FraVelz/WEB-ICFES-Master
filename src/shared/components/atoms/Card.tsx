export const Card = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`dark:bg-opacity-80 rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-slate-950 dark:shadow-2xl ${hover ? 'hover-lift hover-glow cursor-pointer transition-all duration-300' : ''} ${className} `}
    >
      {children}
    </div>
  );
};
