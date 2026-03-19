import { Icon } from '@/shared/components/Icon';

export const PaymentHeader = ({ plan, onClose }) => {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-slate-700 p-6">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
          <Icon name="credit-card" className="text-cyan-400" />
          Pago Seguro
        </h2>
        <p className="mt-1 text-sm text-slate-400">{plan?.name}</p>
      </div>
      <button
        onClick={onClose}
        className="cursor-pointer text-slate-400 transition-colors hover:text-white"
      >
        <Icon name="times" className="text-2xl" />
      </button>
    </div>
  );
};
