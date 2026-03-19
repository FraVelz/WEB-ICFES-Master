export const Text = ({
  children,
  as = 'p',
  variant = 'default',
  className = '',
}) => {
  const Component = as;

  const variants = {
    default: 'text-white text-base md:text-base',
    small: 'text-gray-300 text-sm md:text-sm',
    large: 'text-white text-lg md:text-xl',
    muted: 'text-gray-400 text-base',
    bold: 'text-white font-bold text-base md:text-lg',
  };

  return (
    <Component className={`${variants[variant]} ${className}`}>
      {children}
    </Component>
  );
};

export const Title = ({ children, level = 1, className = '' }) => {
  const sizes = {
    1: 'text-3xl md:text-5xl lg:text-6xl',
    2: 'text-2xl md:text-3xl lg:text-4xl',
    3: 'text-xl md:text-2xl',
    4: 'text-lg md:text-xl',
    5: 'text-base md:text-lg',
    6: 'text-sm md:text-base',
  };

  return (
    <h1 className={`font-bold text-white ${sizes[level]} ${className}`}>
      {children}
    </h1>
  );
};
