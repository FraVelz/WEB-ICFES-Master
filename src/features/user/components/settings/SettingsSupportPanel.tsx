import { useId } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useUserSettingsContext } from '@/features/user/context/UserSettingsContext';
import { SUPPORT_BUG_REWARD_COPY, SUPPORT_CATEGORIES } from '@/features/user/constants/supportRequestConstants';
import { SettingsSection } from './SettingsSection';

export function SettingsSupportPanel() {
  const {
    supportMode,
    setSupportMode,
    supportCategory,
    setSupportCategory,
    supportMessage,
    setSupportMessage,
    supportEmail,
    setSupportEmail,
    supportSubmitting,
    handleSupportSubmit,
  } = useUserSettingsContext();
  const categoryId = useId();
  const emailId = useId();
  const messageId = useId();

  return (
    <SettingsSection title="Ayuda y Soporte" icon="headset">
      <p className="text-on-surface-muted mb-4 text-sm">
        Completa el formulario y enviaremos tu mensaje directamente al equipo.
      </p>
      {supportMode === 'report' && (
        <p
          className={cn(
            'border-app-ring/30 bg-app-ring/10 text-on-surface mb-4 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm'
          )}
        >
          <Icon name="gift" className="text-app-accent-strong mt-0.5 shrink-0" />
          <span>{SUPPORT_BUG_REWARD_COPY}</span>
        </p>
      )}
      <div className="border-surface-border bg-surface/50 mb-6 flex rounded-xl border p-1">
        <button
          type="button"
          onClick={() => setSupportMode('response')}
          className={cn(
            'flex flex-1 cursor-pointer flex-col items-center justify-center ' +
              'gap-1.5 rounded-lg px-4 py-3 text-sm font-medium transition-all',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
            supportMode === 'response'
              ? 'bg-surface-elevated text-on-surface shadow-sm'
              : 'text-on-surface-muted hover:bg-surface-elevated/60 hover:text-on-surface'
          )}
        >
          <Icon name="paper-plane" />
          Contactar
        </button>
        <button
          type="button"
          onClick={() => setSupportMode('report')}
          className={cn(
            'flex flex-1 cursor-pointer flex-col items-center justify-center ' +
              'gap-1.5 rounded-lg px-4 py-3 text-sm font-medium transition-all',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
            supportMode === 'report'
              ? 'bg-surface-elevated text-on-surface shadow-sm'
              : 'text-on-surface-muted hover:bg-surface-elevated/60 hover:text-on-surface'
          )}
        >
          <Icon name="bug" />
          Reportar Bug
        </button>
      </div>

      <form onSubmit={handleSupportSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={categoryId} className="text-on-surface-muted mb-1 block text-xs font-bold uppercase">
              Categoría
            </label>
            <select
              id={categoryId}
              value={supportCategory}
              onChange={(e) => setSupportCategory(e.target.value)}
              className={cn(
                'focus:border-app-ring border-surface-border bg-surface-via w-full rounded-lg border',
                'text-on-surface px-3 py-2.5 text-sm outline-none'
              )}
            >
              {SUPPORT_CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          {supportMode === 'response' && (
            <div>
              <label htmlFor={emailId} className="text-on-surface-muted mb-1 block text-xs font-bold uppercase">
                Email de contacto
              </label>
              <input
                id={emailId}
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                required
                className={cn(
                  'focus:border-app-ring border-surface-border bg-surface-via w-full rounded-lg border',
                  'text-on-surface px-3 py-2.5 text-sm outline-none'
                )}
                placeholder="tu@email.com"
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor={messageId} className="text-on-surface-muted mb-1 block text-xs font-bold uppercase">
            Mensaje
          </label>
          <textarea
            id={messageId}
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
            required
            className={cn(
              'border-surface-border bg-surface-via h-32 w-full resize-none rounded-lg border px-3 py-3 text-sm',
              'focus:border-app-ring text-on-surface outline-none'
            )}
            placeholder={supportMode === 'response' ? '¿En qué podemos ayudarte?' : 'Describe el error encontrado...'}
          />
        </div>

        <button
          type="submit"
          disabled={supportSubmitting}
          className={cn(
            'from-app-accent-strong w-full cursor-pointer rounded-xl bg-linear-to-r to-blue-600 py-3 font-bold',
            'shadow-app-ring/20 hover:from-cta-from text-white shadow-lg transition-all',
            'hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
            'focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
            'focus-visible:ring-offset-surface-via focus-visible:ring-offset-2'
          )}
        >
          {supportSubmitting
            ? 'Enviando…'
            : supportMode === 'report'
              ? 'Enviar reporte'
              : 'Enviar mensaje'}
        </button>
      </form>
    </SettingsSection>
  );
}
