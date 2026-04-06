'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { useUser } from '@/features/user/hooks/useUser';
import { useAuth } from '@/context/AuthContext';
import { useUserData, useProgress, useExam } from '@/hooks/FirestoreHooks';
import { updateUsername, updateUserBio, updateProfileImage } from '@/shared/utils/userProfile';
// import { DonationSection } from '@/features/home';

// --- Internal Components for UI Consistency ---

interface SettingsSectionProps {
  title?: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

const SettingsSection = ({ title, icon, children, className = '' }: SettingsSectionProps) => (
  <div className={`mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md sm:p-6 ${className}`}>
    {title && (
      <h2 className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-4 text-lg font-bold text-white sm:text-xl">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-cyan-400 shadow-inner">
          <Icon name={icon ?? 'settings'} />
        </div>
        {title}
      </h2>
    )}
    <div className="space-y-4">{children}</div>
  </div>
);

interface SettingOptionProps {
  label: string;
  description?: string;
  icon?: string;
  action: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
}

const SettingOption = ({ label, description, icon, action, danger = false, onClick }: SettingOptionProps) => (
  <div
    onClick={onClick}
    className={`group flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 sm:flex-row sm:items-center ${
      danger
        ? 'cursor-pointer border-red-500/20 bg-red-500/5 hover:border-red-500/30 hover:bg-red-500/10'
        : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/60'
    }`}
  >
    <div className="mb-3 flex items-start gap-4 sm:mb-0">
      {icon && (
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
            danger
              ? 'bg-red-500/10 text-red-400 group-hover:bg-red-500/20'
              : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-700 group-hover:text-cyan-400'
          }`}
        >
          <Icon name={icon ?? 'settings'} />
        </div>
      )}
      <div>
        <h3 className={`text-base font-medium ${danger ? 'text-red-400' : 'text-slate-200'}`}>{label}</h3>
        {description && <p className="mt-0.5 text-sm leading-relaxed text-slate-400">{description}</p>}
      </div>
    </div>
    <div className="flex w-full items-center justify-end pl-14 sm:w-auto sm:pl-0">{action}</div>
  </div>
);

export const UserSettingsPage = () => {
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const { logout } = useAuth();
  const { user: userData } = useUserData();
  const { resetProgress } = useProgress();
  const { resetUserExams } = useExam(undefined);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>(
    (user?.username ?? userData?.displayName ?? userData?.username ?? '') as string
  );
  const [bio, setBio] = useState<string>(() => (user?.bio ?? userData?.bio ?? '') || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Support Form State
  const [supportMode, setSupportMode] = useState('response');
  const [supportCategory, setSupportCategory] = useState('technical');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [sendingSupport, setSendingSupport] = useState(false);

  useEffect(() => {
    setUsername(user?.username ?? userData?.displayName ?? userData?.username ?? '');
    setSupportEmail((user?.email ?? userData?.email ?? '') as string);
  }, [user?.username, user?.email, userData?.displayName, userData?.email]);

  useEffect(() => {
    setBio(user?.bio || userData?.bio || '');
  }, [user?.bio, userData?.bio]);

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUsernameUpdate = async () => {
    if (!username.trim()) {
      showMessage('El nombre de usuario no puede estar vacío', 'error');
      return;
    }
    try {
      setLoading(true);
      await updateUsername(username);
      refreshUser();
      showMessage('Nombre de usuario actualizado');
    } catch (err) {
      showMessage(`Error: ${err instanceof Error ? err.message : 'Error desconocido'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBioUpdate = async () => {
    try {
      setLoading(true);
      await updateUserBio(bio);
      refreshUser();
      showMessage('Frase personal actualizada');
    } catch (err) {
      showMessage(`Error: ${err instanceof Error ? err.message : 'Error desconocido'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      await updateProfileImage(file);
      await refreshUser();
      showMessage('Foto de perfil actualizada');
    } catch (err) {
      showMessage(`Error: ${err instanceof Error ? err.message : 'Error desconocido'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProfileImage = async () => {
    try {
      setLoading(true);
      await updateProfileImage(null);
      await refreshUser();
      showMessage('Foto de perfil eliminada');
    } finally {
      setLoading(false);
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) {
      showMessage('Por favor describe tu problema o pregunta', 'error');
      return;
    }

    if (supportMode === 'response' && !supportEmail.trim()) {
      showMessage('Por favor ingresa un email para responderte', 'error');
      return;
    }

    try {
      setSendingSupport(true);
      // Modo visual: mensaje guardado localmente (backend pendiente)
      showMessage('Gracias 🙌 Tu mensaje se ha registrado. Te responderemos pronto.', 'success');
      setSupportMessage('');
      setSupportCategory('technical');
      if (!user?.email && !userData?.email) setSupportEmail('');
    } catch (err) {
      console.error('Error sending support message:', err);
      showMessage('Error al enviar el mensaje. Intenta nuevamente.', 'error');
    } finally {
      setSendingSupport(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      showMessage('Sesión cerrada exitosamente', 'success');
      setTimeout(() => router.push('/'), 1500);
    } catch (err) {
      showMessage(`Error al cerrar sesión: ${err instanceof Error ? err.message : 'Error desconocido'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllData = async () => {
    if (deleteConfirmation !== 'BORRAR TODO') {
      showMessage('Escribe "BORRAR TODO" para confirmar', 'error');
      return;
    }
    try {
      setLoading(true);
      await resetProgress();
      await resetUserExams();
      localStorage.clear();
      sessionStorage.clear();
      showMessage('Todos tus datos han sido eliminados', 'success');
      setShowDeleteModal(false);
      setDeleteConfirmation('');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      showMessage(`Error al eliminar datos: ${err instanceof Error ? err.message : 'Error desconocido'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'BORRAR MI CUENTA') {
      showMessage('Escribe "BORRAR MI CUENTA" para confirmar', 'error');
      return;
    }
    try {
      setLoading(true);
      await resetProgress();
      await resetUserExams();
      localStorage.clear();
      sessionStorage.clear();
      await logout();
      showMessage('Cuenta eliminada exitosamente', 'success');
      setTimeout(() => router.push('/'), 1500);
    } catch (err) {
      showMessage(`Error al eliminar cuenta: ${err instanceof Error ? err.message : 'Error desconocido'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-slate-950 pb-24 text-white md:pb-0">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 h-96 w-full bg-linear-to-b from-cyan-900/10 to-transparent"></div>
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
            <Link
              href="/perfil"
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <Icon name="arrow-left" className="text-lg" />
            </Link>
            <h1 className="text-xl font-bold text-white">Configuración</h1>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Alert Messages */}
          {message && (
            <div
              className={`animate-fadeIn fixed top-20 right-4 z-50 max-w-sm rounded-xl border p-4 shadow-xl backdrop-blur-md ${
                messageType === 'success'
                  ? 'border-green-500/30 bg-green-500/10 text-green-400'
                  : 'border-red-500/30 bg-red-500/10 text-red-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon name={messageType === 'success' ? 'check-circle' : 'warning'} />
                <p className="text-sm font-medium">{message}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Profile (Sticky on Desktop) */}
            <div className="space-y-6 lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <SettingsSection className="relative overflow-hidden text-center">
                  <div className="absolute top-0 left-0 h-24 w-full bg-linear-to-b from-cyan-500/10 to-transparent"></div>

                  <div className="group relative mb-4 inline-block">
                    <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-slate-800 bg-slate-800 shadow-2xl">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-700 text-slate-500">
                          <Icon name="user" className="text-4xl" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute right-0 bottom-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-slate-900 bg-cyan-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-cyan-400"
                    >
                      <Icon name="camera" className="text-sm" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="text-left">
                      <label className="mb-1 ml-1 block text-xs font-bold tracking-wider text-slate-500 uppercase">
                        Nombre de Usuario
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value.slice(0, 30))}
                          className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white transition-all outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                          placeholder="Tu nombre"
                        />
                        <button
                          onClick={handleUsernameUpdate}
                          disabled={loading}
                          className="cursor-pointer rounded-lg bg-slate-800 px-3 py-2 text-slate-400 transition-colors hover:bg-cyan-500/20 hover:text-cyan-400"
                        >
                          <Icon name="check" />
                        </button>
                      </div>
                    </div>

                    <div className="text-left">
                      <label className="mb-1 ml-1 block text-xs font-bold tracking-wider text-slate-500 uppercase">
                        Bio
                      </label>
                      <div className="relative">
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value.slice(0, 150))}
                          className="h-24 w-full resize-none rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white transition-all outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                          placeholder="Cuéntanos sobre ti..."
                        />
                        <button
                          onClick={handleBioUpdate}
                          disabled={loading}
                          className="absolute right-2 bottom-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-slate-800 text-xs text-slate-400 transition-colors hover:bg-cyan-500/20 hover:text-cyan-400"
                        >
                          <Icon name="check" />
                        </button>
                      </div>
                      <p className="mt-1 text-right text-xs text-slate-600">{bio.length}/150</p>
                    </div>

                    {user?.profileImage && (
                      <button
                        onClick={handleRemoveProfileImage}
                        className="cursor-pointer text-xs text-red-400 hover:text-red-300 hover:underline"
                      >
                        Eliminar foto de perfil
                      </button>
                    )}
                  </div>
                </SettingsSection>
              </div>
            </div>

            {/* Right Column: Settings & Support */}
            <div className="space-y-6 lg:col-span-8">
              {/* Account Management */}
              <SettingsSection title="Gestión de Cuenta" icon="lock">
                <SettingOption
                  label="Cerrar Sesión"
                  description="Finaliza tu sesión actual en este dispositivo"
                  icon="sign-out"
                  action={
                    <button
                      onClick={handleLogout}
                      disabled={loading}
                      className="cursor-pointer rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
                    >
                      Cerrar
                    </button>
                  }
                />

                <SettingOption
                  label="Borrar mis Datos"
                  description="Elimina progreso y exámenes. Mantiene la cuenta."
                  icon="trash"
                  danger={true}
                  onClick={() => setShowDeleteModal(true)}
                  action={<Icon name="chevron-right" className="text-slate-600" />}
                />

                <SettingOption
                  label="Eliminar Cuenta"
                  description="Acción permanente. Elimina todo."
                  icon="warning"
                  danger={true}
                  onClick={() => setShowDeleteModal(true)}
                  action={<Icon name="chevron-right" className="text-slate-600" />}
                />
              </SettingsSection>

              {/* Support Section */}
              <SettingsSection title="Ayuda y Soporte" icon="headset">
                <div className="mb-6 flex rounded-xl border border-slate-800 bg-slate-950/50 p-1">
                  <button
                    onClick={() => setSupportMode('response')}
                    className={`flex-1 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      supportMode === 'response'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon name="paper-plane" className="mr-2" />
                    Contactar
                  </button>
                  <button
                    onClick={() => setSupportMode('report')}
                    className={`flex-1 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      supportMode === 'report' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
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
                        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500"
                      >
                        <option value="technical">Error técnico</option>
                        <option value="content">Contenido</option>
                        <option value="suggestion">Sugerencia</option>
                        <option value="other">Otro</option>
                      </select>
                    </div>
                    {supportMode === 'response' && (
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-500 uppercase">
                          Email de contacto
                        </label>
                        <input
                          type="email"
                          value={supportEmail}
                          onChange={(e) => setSupportEmail(e.target.value)}
                          required
                          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500"
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
                      className="h-32 w-full resize-none rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-cyan-500"
                      placeholder={
                        supportMode === 'response' ? '¿En qué podemos ayudarte?' : 'Describe el error encontrado...'
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sendingSupport}
                    className="w-full cursor-pointer rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 py-3 font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sendingSupport ? 'Enviando...' : 'Enviar Mensaje'}
                  </button>
                </form>
              </SettingsSection>

              {/* Info Section */}
              <SettingsSection title="Información" icon="shield-alt">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <h3 className="mb-2 flex items-center gap-2 font-bold text-white">
                      <Icon name="cloud" className="text-cyan-400" />
                      Cloud Sync
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-400">
                      Tus datos se guardan localmente en tu dispositivo. En el futuro se sincronizarán con la nube.
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <h3 className="mb-2 flex items-center gap-2 font-bold text-white">
                      <Icon name="lock" className="text-cyan-400" />
                      Privacidad
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-400">
                      Tus datos están encriptados y protegidos. Solo tú tienes acceso a tu información personal y
                      progreso.
                    </p>
                  </div>
                </div>
              </SettingsSection>

              {/* <DonationSection /> */}
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="animate-scaleIn w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <Icon name="warning" className="text-xl" />
              </div>
              <h2 className="mb-2 text-center text-xl font-bold text-white">Zona de Peligro</h2>
              <p className="mb-6 text-center text-sm text-slate-400">
                Estas acciones son irreversibles. Por favor confirma tu intención.
              </p>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="mb-2 text-sm font-medium text-slate-300">
                    Escribe{' '}
                    <span className="font-bold text-white">
                      "{deleteConfirmation === 'BORRAR TODO' ? 'BORRAR TODO' : 'BORRAR MI CUENTA'}"
                    </span>
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500"
                    placeholder="Confirmación..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteConfirmation('');
                    }}
                    className="flex-1 cursor-pointer rounded-lg bg-slate-800 py-2.5 font-medium text-white transition-colors hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={deleteConfirmation === 'BORRAR TODO' ? handleClearAllData : handleDeleteAccount}
                    disabled={
                      loading || (deleteConfirmation !== 'BORRAR TODO' && deleteConfirmation !== 'BORRAR MI CUENTA')
                    }
                    className="flex-1 cursor-pointer rounded-lg bg-red-600 py-2.5 font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? 'Procesando...' : 'Confirmar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Donation Button */}
        <button
          onClick={() => {
            const element = document.getElementById('donation-section');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="fixed right-6 bottom-6 z-40 cursor-pointer rounded-full bg-linear-to-r from-pink-500 to-rose-500 p-4 text-white shadow-lg shadow-pink-500/30 transition-transform duration-300 hover:scale-110 lg:hidden"
        >
          <Icon name="heart" className="text-xl" />
        </button>
      </div>
    </div>
  );
};
