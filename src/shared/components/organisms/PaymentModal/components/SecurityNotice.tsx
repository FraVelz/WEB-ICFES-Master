import { Icon } from '@/shared/components/Icon';

export const SecurityNotice = () => {
  return (
    <div className="flex items-center gap-2 text-slate-400 text-xs p-3 bg-slate-800/50 rounded-lg">
      <Icon name="lock" className="text-green-400" />
      <span>Tu información de pago está protegida y encriptada</span>
    </div>
  );
};
