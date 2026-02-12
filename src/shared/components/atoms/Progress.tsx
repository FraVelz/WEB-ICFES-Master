export const Progress = ({ value = 0, max = 100, className = '', showPercentage = true }) => {
  const percentage = (value / max) * 100;

  const getColor = () => {
    if (percentage >= 80) return 'bg-linear-to-r from-green-500 to-emerald-500';
    if (percentage >= 60) return 'bg-linear-to-r from-yellow-500 to-amber-500';
    return 'bg-linear-to-r from-red-500 to-orange-500';
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-6 overflow-hidden shadow-xl border-2 border-gray-400 dark:border-gray-500">
        <div
          className={`h-full ${getColor()} transition-all duration-500 ease-out shadow-lg`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-black text-gray-100 drop-shadow-lg">
            {value} de {max}
          </p>
          <p className="text-3xl font-black bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
            {Math.round(percentage)}%
          </p>
        </div>
      )}
    </div>
  );
};
