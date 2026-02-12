export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover-lift relative overflow-hidden';
  
  const variants = {
    primary: 'bg-linear-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/50 focus:ring-blue-500',
    secondary: 'bg-linear-to-r from-gray-700 to-gray-800 text-white hover:shadow-lg hover:shadow-gray-500/50 focus:ring-gray-600',
    success: 'bg-linear-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/50 focus:ring-green-500',
    danger: 'bg-linear-to-r from-red-600 to-orange-600 text-white hover:shadow-lg hover:shadow-red-500/50 focus:ring-red-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:shadow-lg focus:ring-blue-500 dark:border-blue-400 dark:text-blue-400'
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    full: 'w-full px-4 py-2 text-base'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
