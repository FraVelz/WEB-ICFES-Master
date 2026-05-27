import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useUserSettingsContext } from '@/features/user/context/UserSettingsContext';
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
    sendingSupport,
    handleSupportSubmit,
  } = useUserSettingsContext();

  return (
    <SettingsSection title="Ayuda y Soporte" icon="headset">
      <div className="mb-6 flex rounded-xl border border-slate-800 bg-slate-950/50 p-1">
        <button
          type="button"
          onClick={() => setSupportMode('response')}
          className={cn(
            'flex-1 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-inset',
            supportMode === 'response' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          )}
        >
          <Icon name="paper-plane" className="mr-2" />
          Contactar
        </button>
        <button
          type="button"
          onClick={() => setSupportMode('report')}
          className={cn(
            'flex-1 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-inset',
            supportMode === 'report' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          )}
        >
          <Icon name="bug" className="mr-2" />
          Reportar Bug
        </button>
      </div>

      <form onSubmit={handleSupportSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500 uppercase">Categoría</label>
            <select
              value={supportCategory}
              onChange={(e) => setSupportCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-app-ring"
            >
              <option value="technical">Error técnico</option>
              <option value="content">Contenido</option>
              <option value="suggestion">Sugerencia</option>
              <option value="other">Otro</option>
            </select>
          </div>
          {supportMode === 'response' && (
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500 uppercase">Email de contacto</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-app-ring"
                placeholder="tu@email.com"
              />
            </div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-slate-500 uppercase">Mensaje</label>
          <textarea
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
            required
            className={cn(
              'h-32 w-full resize-none rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-sm',
              'text-white outline-none focus:border-app-ring'
            )}
            placeholder={
              supportMode === 'response' ? '¿En qué podemos ayudarte?' : 'Describe el error encontrado...'
            }
          />
        </div>

        <button
          type="submit"
          disabled={sendingSupport}
          className={cn(
            'w-full cursor-pointer rounded-xl bg-linear-to-r from-app-accent-strong to-blue-600 py-3 font-bold',
            'text-white shadow-lg shadow-app-ring/20 transition-all hover:from-cta-from',
            'hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
            'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
          )}
        >
          {sendingSupport ? 'Enviando...' : 'Enviar Mensaje'}
        </button>
      </form>
    </SettingsSection>
  );
}
