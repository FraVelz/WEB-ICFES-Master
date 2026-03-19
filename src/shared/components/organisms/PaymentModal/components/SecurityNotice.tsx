import { Icon } from '@/shared/components/Icon';

export const SecurityNotice = () => {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-slate-800/50 p-3 text-xs text-slate-400">
      <Icon name="lock" className="text-green-400" />
      <span>Tu información de pago está protegida y encriptada</span>
    </div>
  );
};
