export const Card = ({ children, className = '', hover = false }) => {
  return (
    <div 
      className={`
        bg-white dark:bg-slate-950 dark:bg-opacity-80
        rounded-3xl shadow-2xl dark:shadow-2xl p-8
        border-2 border-gray-200 dark:border-gray-700
        ${hover ? 'hover-lift hover-glow transition-all duration-300 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
