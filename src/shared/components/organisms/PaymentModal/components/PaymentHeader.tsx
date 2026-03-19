import { Icon } from '@/shared/components/Icon';

export const PaymentHeader = ({ plan, onClose }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-slate-700 shrink-0">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Icon name="credit-card" className="text-cyan-400" />
          Pago Seguro
        </h2>
        <p className="text-slate-400 text-sm mt-1">{plan?.name}</p>
      </div>
      <button
        onClick={onClose}
        className=" cursor-pointer text-slate-400 hover:text-white transition-colors"
      >
        <Icon name="times" className="text-2xl" />
      </button>
    </div>
  );
};
