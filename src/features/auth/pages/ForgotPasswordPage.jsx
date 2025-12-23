import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/AuthContext';
import UserFirestoreService from '@/features/user/services/UserFirestoreService';
import { EMAIL_MESSAGES } from '@/config/emailMessages';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: pedir email, 2: confirmación enviada
  const { resetPassword, verifyEmailExists } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      // Verificar si el email existe en Firebase/Firestore
      const emailExists = await verifyEmailExists(email);
      
      if (!emailExists) {
        setError(EMAIL_MESSAGES.forgotPasswordPage.errorEmailNotRegistered);
        setIsLoading(false);
        return;
      }

      // Enviar email de recuperación
      await resetPassword(email);
      setSuccess(true);
      setStep(2);
      setEmail('');
    } catch (err) {
      setError(err.message || EMAIL_MESSAGES.forgotPasswordPage.errorSendingEmail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-linear-to-b from-black via-slate-950 to-black text-white flex items-center justify-center px-6 overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors mb-8"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Volver al login
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black mb-4 bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            {EMAIL_MESSAGES.forgotPasswordPage.headerTitle}
          </h1>
          <p className="text-slate-400">
            {EMAIL_MESSAGES.forgotPasswordPage.headerSubtitle}
          </p>
        </div>

        {/* Step 1: Email Verification */}
        {step === 1 && (
          <>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                {EMAIL_MESSAGES.forgotPasswordPage.emailLabel}
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={EMAIL_MESSAGES.forgotPasswordPage.emailPlaceholder}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <FontAwesomeIcon icon={faExclamationCircle} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full py-3 px-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? EMAIL_MESSAGES.forgotPasswordPage.buttonLoadingText : EMAIL_MESSAGES.forgotPasswordPage.buttonText}
            </button>
          </form>
          </>
        )}

        {/* Step 2: Success Message */}
        {step === 2 && success && (
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 text-4xl" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white text-center mb-3">{EMAIL_MESSAGES.forgotPasswordPage.successTitle}</h2>
              <p className="text-slate-400 text-center">
                {EMAIL_MESSAGES.forgotPasswordPage.successMessage}
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-2">
              <p className="text-sm text-slate-300">
                <strong>{EMAIL_MESSAGES.forgotPasswordPage.importantLabel}</strong>
              </p>
              <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                {EMAIL_MESSAGES.forgotPasswordPage.importanceList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setStep(1);
                  setSuccess(false);
                  setError('');
                }}
                className="cursor-pointer w-full py-3 px-4 text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
              >
                {EMAIL_MESSAGES.forgotPasswordPage.useAnotherEmailButton}
              </button>
              <Link
                to="/login"
                className="block w-full py-3 px-4 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition-all text-center"
              >
                {EMAIL_MESSAGES.forgotPasswordPage.backToLogin}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
