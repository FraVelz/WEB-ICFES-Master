import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { AvatarImage } from '@/features/user/components/AvatarImage';
import { useEquippedLogoId } from '@/features/store/hooks/useEquippedLogoId';
import { resolveProfileAvatarSrc } from '@/features/user/utils/resolveProfileAvatar';
import { useUserSettingsContext } from '@/features/user/context/UserSettingsContext';
import { SettingsSection } from './SettingsSection';

export function SettingsProfilePanel() {
  const {
    user,
    fileInputRef,
    loading,
    username,
    setUsername,
    bio,
    setBio,
    handleUsernameUpdate,
    handleBioUpdate,
    handleImageUpload,
    handleRemoveProfileImage,
  } = useUserSettingsContext();
  const equippedLogoId = useEquippedLogoId();
  const avatarSrc = resolveProfileAvatarSrc(user?.profileImage, equippedLogoId);

  return (
    <div className="lg:sticky lg:top-24">
      <SettingsSection className="relative overflow-hidden text-center">
        <div className="from-app-ring/10 absolute top-0 left-0 h-24 w-full bg-linear-to-b to-transparent" />

        <div className="group relative mb-4 inline-block">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-slate-800 bg-slate-800 shadow-2xl">
            <AvatarImage src={avatarSrc} alt="Profile" />
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Cambiar foto de perfil"
            className={cn(
              'absolute right-0 bottom-0 flex h-10 w-10 cursor-pointer items-center justify-center',
              'bg-app-ring rounded-full border-4 border-slate-900 text-white shadow-lg',
              'hover:bg-hub-orb transition-transform hover:scale-110',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
            )}
          >
            <Icon name="camera" className="text-sm" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
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
                className={cn(
                  'flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white',
                  'focus:border-app-ring focus:ring-app-ring transition-all outline-none focus:ring-1'
                )}
                placeholder="Tu nombre"
              />
              <button
                type="button"
                onClick={handleUsernameUpdate}
                disabled={loading}
                aria-label="Guardar nombre de usuario"
                className={cn(
                  'cursor-pointer rounded-lg bg-slate-800 px-3 py-2 text-slate-400 transition-colors',
                  'hover:bg-app-ring/20 hover:text-app-accent',
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
                  'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
                )}
              >
                <Icon name="check" />
              </button>
            </div>
          </div>

          <div className="text-left">
            <label className="mb-1 ml-1 block text-xs font-bold tracking-wider text-slate-500 uppercase">Bio</label>
            <div className="relative">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 150))}
                className={cn(
                  'h-24 w-full resize-none rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm',
                  'focus:border-app-ring focus:ring-app-ring text-white transition-all outline-none focus:ring-1'
                )}
                placeholder="Cuéntanos sobre ti..."
              />
              <button
                type="button"
                onClick={handleBioUpdate}
                disabled={loading}
                aria-label="Guardar biografía"
                className={cn(
                  'absolute right-2 bottom-2 flex h-8 w-8 cursor-pointer items-center justify-center',
                  'hover:bg-app-ring/20 rounded-md bg-slate-800 text-xs text-slate-400 transition-colors',
                  'hover:text-app-accent focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
                  'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
                )}
              >
                <Icon name="check" />
              </button>
            </div>
            <p className="mt-1 text-right text-xs text-slate-600">{bio.length}/150</p>
          </div>

          {user?.profileImage && (
            <button
              type="button"
              onClick={handleRemoveProfileImage}
              className="cursor-pointer text-xs text-red-400 underline-offset-2 hover:text-red-300 hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none"
            >
              Eliminar foto de perfil
            </button>
          )}
        </div>
      </SettingsSection>
    </div>
  );
}
