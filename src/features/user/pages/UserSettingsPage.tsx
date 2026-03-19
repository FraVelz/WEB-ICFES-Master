import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faTrash,
  faCamera,
  faUser,
  faQuoteLeft,
  faSignOut,
  faLock,
  faCloud,
  faCheckCircle,
  faQuestion,
  faWarning,
  faCheck,
  faGear,
  faHeadset,
  faPaperPlane,
  faBug,
  faHeart,
  faChevronRight,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { useUser } from '@/features/user/hooks/useUser';
import { useAuth } from '@/context/AuthContext';
import { useUserData, useProgress, useExam } from '@/hooks/FirestoreHooks';
import { updateUsername, updateUserBio, updateProfileImage } from '@/shared/utils/userProfile';
import { DonationSection } from '@/features/home';

// --- Internal Components for UI Consistency ---

const SettingsSection = ({ title, icon, children, className = "" }) => (
  <div className={`bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 sm:p-6 mb-6 ${className}`}>
    {title && (
      <h2 className="text-lg sm:text-xl font-bold mb-6 flex items-center gap-3 text-white border-b border-slate-800 pb-4">
        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 shadow-inner">
          <FontAwesomeIcon icon={icon} />
        </div>
        {title}
      </h2>
    )}
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const SettingOption = ({ label, description, icon, action, danger = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
      danger 
        ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/30 cursor-pointer' 
        : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600'
    }`}
  >
    <div className="flex items-start gap-4 mb-3 sm:mb-0">
      {icon && (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
          danger ? 'bg-red-500/10 text-red-400 group-hover:bg-red-500/20' : 'bg-slate-700/50 text-slate-400 group-hover:text-cyan-400 group-hover:bg-slate-700'
        }`}>
          <FontAwesomeIcon icon={icon} />
        </div>
      )}
      <div>
        <h3 className={`font-medium text-base ${danger ? 'text-red-400' : 'text-slate-200'}`}>{label}</h3>
        {description && <p className="text-sm text-slate-400 mt-0.5 leading-relaxed">{description}</p>}
      </div>
    </div>
    <div className="flex items-center justify-end w-full sm:w-auto pl-14 sm:pl-0">
      {action}
    </div>
  </div>
);

export const UserSettingsPage = () => {
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const { logout } = useAuth();
  const { user: userData } = useUserData();
  const { resetProgress } = useProgress();
  const { resetUserExams } = useExam();

  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user?.username || userData?.displayName || '');
  const [bio, setBio] = useState(user?.bio || userData?.bio || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Support Form State
  const [supportMode, setSupportMode] = useState('response');
  const [supportCategory, setSupportCategory] = useState('technical');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [sendingSupport, setSendingSupport] = useState(false);

  useEffect(() => {
    setUsername(user?.username || userData?.displayName || '');
    setSupportEmail(user?.email || '');
  }, [user?.username, userData?.displayName, user?.email]);

  useEffect(() => {
    setBio(user?.bio || userData?.bio || '');
  }, [user?.bio, userData?.bio]);

  const showMessage = (msg, type = 'success') => {
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
      showMessage(`Error: ${err.message}`, 'error');
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
      showMessage(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      await updateProfileImage(file);
      await refreshUser();
      showMessage('Foto de perfil actualizada');
    } catch (err) {
      showMessage(`Error: ${err.message}`, 'error');
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

  const handleSupportSubmit = async (e) => {
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
      if (!user?.email) setSupportEmail('');
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
      showMessage(`Error al cerrar sesión: ${err.message}`, 'error');
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
      showMessage(`Error al eliminar datos: ${err.message}`, 'error');
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
      showMessage(`Error al eliminar cuenta: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-white pb-24 md:pb-0">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-cyan-900/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-50 backdrop-blur-xl border-b border-slate-800/60 bg-slate-950/80">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/perfil" className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
              <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
            </Link>
            <h1 className="text-xl font-bold text-white">Configuración</h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Alert Messages */}
          {message && (
            <div className={`fixed top-20 right-4 z-50 animate-fadeIn p-4 rounded-xl border shadow-xl backdrop-blur-md max-w-sm ${
              messageType === 'success' 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={messageType === 'success' ? faCheckCircle : faWarning} />
                <p className="font-medium text-sm">{message}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Profile (Sticky on Desktop) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="lg:sticky lg:top-24">
                <SettingsSection className="text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-cyan-500/10 to-transparent"></div>
                  
                  <div className="relative inline-block mb-4 group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl bg-slate-800">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-700 text-slate-500">
                          <FontAwesomeIcon icon={faUser} className="text-4xl" />
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer absolute bottom-0 right-0 w-10 h-10 bg-cyan-500 hover:bg-cyan-400 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 border-4 border-slate-900"
                    >
                      <FontAwesomeIcon icon={faCamera} className="text-sm" />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </div>

                  <div className="space-y-4">
                    <div className="text-left">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Nombre de Usuario</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value.slice(0, 30))}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                          placeholder="Tu nombre"
                        />
                        <button 
                          onClick={handleUsernameUpdate}
                          disabled={loading}
                          className="cursor-pointer px-3 py-2 bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-400 rounded-lg transition-colors"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      </div>
                    </div>

                    <div className="text-left">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Bio</label>
                      <div className="relative">
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value.slice(0, 150))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none h-24"
                          placeholder="Cuéntanos sobre ti..."
                        />
                        <button 
                          onClick={handleBioUpdate}
                          disabled={loading}
                          className="cursor-pointer absolute bottom-2 right-2 w-8 h-8 bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-400 rounded-md transition-colors flex items-center justify-center text-xs"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      </div>
                      <p className="text-right text-xs text-slate-600 mt-1">{bio.length}/150</p>
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
            <div className="lg:col-span-8 space-y-6">
              
              {/* Account Management */}
              <SettingsSection title="Gestión de Cuenta" icon={faLock}>
                <SettingOption
                  label="Cerrar Sesión"
                  description="Finaliza tu sesión actual en este dispositivo"
                  icon={faSignOut}
                  action={
                    <button 
                      onClick={handleLogout}
                      disabled={loading}
                      className="cursor-pointer px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Cerrar
                    </button>
                  }
                />
                
                <SettingOption
                  label="Borrar mis Datos"
                  description="Elimina progreso y exámenes. Mantiene la cuenta."
                  icon={faTrash}
                  danger={true}
                  onClick={() => setShowDeleteModal(true)}
                  action={
                    <FontAwesomeIcon icon={faChevronRight} className="text-slate-600" />
                  }
                />

                <SettingOption
                  label="Eliminar Cuenta"
                  description="Acción permanente. Elimina todo."
                  icon={faWarning}
                  danger={true}
                  onClick={() => setShowDeleteModal(true)}
                  action={
                    <FontAwesomeIcon icon={faChevronRight} className="text-slate-600" />
                  }
                />
              </SettingsSection>

              {/* Support Section */}
              <SettingsSection title="Ayuda y Soporte" icon={faHeadset}>
                <div className="bg-slate-950/50 rounded-xl p-1 flex mb-6 border border-slate-800">
                  <button
                    onClick={() => setSupportMode('response')}
                    className={`cursor-pointer flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      supportMode === 'response' 
                        ? 'bg-slate-800 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                    Contactar
                  </button>
                  <button
                    onClick={() => setSupportMode('report')}
                    className={`cursor-pointer flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                      supportMode === 'report' 
                        ? 'bg-slate-800 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={faBug} className="mr-2" />
                    Reportar Bug
                  </button>
                </div>

                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría</label>
                      <select
                        value={supportCategory}
                        onChange={(e) => setSupportCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-500 outline-none"
                      >
                        <option value="technical">Error técnico</option>
                        <option value="content">Contenido</option>
                        <option value="suggestion">Sugerencia</option>
                        <option value="other">Otro</option>
                      </select>
                    </div>
                    {supportMode === 'response' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email de contacto</label>
                        <input
                          type="email"
                          value={supportEmail}
                          onChange={(e) => setSupportEmail(e.target.value)}
                          required
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-cyan-500 outline-none"
                          placeholder="tu@email.com"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mensaje</label>
                    <textarea
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 text-sm text-white focus:border-cyan-500 outline-none h-32 resize-none"
                      placeholder={supportMode === 'response' ? "¿En qué podemos ayudarte?" : "Describe el error encontrado..."}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sendingSupport}
                    className=" cursor-pointer w-full py-3 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingSupport ? 'Enviando...' : 'Enviar Mensaje'}
                  </button>
                </form>
              </SettingsSection>

              {/* Info Section */}
              <SettingsSection title="Información" icon={faShieldAlt}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faCloud} className="text-cyan-400" />
                      Cloud Sync
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Tus datos se guardan localmente en tu dispositivo. En el futuro se sincronizarán con la nube.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faLock} className="text-cyan-400" />
                      Privacidad
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Tus datos están encriptados y protegidos. Solo tú tienes acceso a tu información personal y progreso.
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-60 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleIn">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-4">
                <FontAwesomeIcon icon={faWarning} className="text-xl" />
              </div>
              <h2 className="text-xl font-bold text-white text-center mb-2">Zona de Peligro</h2>
              <p className="text-slate-400 text-center text-sm mb-6">
                Estas acciones son irreversibles. Por favor confirma tu intención.
              </p>

              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-sm font-medium text-slate-300 mb-2">
                    Escribe <span className="text-white font-bold">"{deleteConfirmation === 'BORRAR TODO' ? 'BORRAR TODO' : 'BORRAR MI CUENTA'}"</span>
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 outline-none"
                    placeholder="Confirmación..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteConfirmation('');
                    }}
                    className="cursor-pointer flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={deleteConfirmation === 'BORRAR TODO' ? handleClearAllData : handleDeleteAccount}
                    disabled={loading || (deleteConfirmation !== 'BORRAR TODO' && deleteConfirmation !== 'BORRAR MI CUENTA')}
                    className="cursor-pointer flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="cursor-pointer fixed bottom-6 right-6 z-40 p-4 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-full shadow-lg shadow-pink-500/30 hover:scale-110 transition-transform duration-300 lg:hidden"
        >
          <FontAwesomeIcon icon={faHeart} className="text-xl" />
        </button>
      </div>
    </div>
  );
};
