import { getAreaInfo } from '@/shared/constants';

export const getAreaColor = (areaId: string) => {
  const color = getAreaInfo(areaId).color ?? '';
  if (color.includes('blue')) return 'from-blue-500 to-blue-600';
  if (color.includes('green')) return 'from-green-500 to-green-600';
  if (color.includes('purple')) return 'from-purple-500 to-purple-600';
  if (color.includes('orange')) return 'from-orange-500 to-orange-600';
  if (color.includes('indigo')) return 'from-indigo-500 to-indigo-600';
  return 'from-blue-500 to-blue-600';
};

export const getBubbleBorderColor = (areaId: string) => {
  const color = getAreaInfo(areaId).color ?? '';
  if (color.includes('blue')) return 'border-blue-400/50';
  if (color.includes('green')) return 'border-green-400/50';
  if (color.includes('purple')) return 'border-purple-400/50';
  if (color.includes('orange')) return 'border-orange-400/50';
  if (color.includes('indigo')) return 'border-indigo-400/50';
  return 'border-blue-400/50';
};
