'use client';

import { useRef, useState } from 'react';
import { useShop } from '@/features/store/hooks/useShop';
import { usePersonalLogos } from '@/features/user/hooks/usePersonalLogos';
import { addPersonalLogo, removePersonalLogo } from '@/services/persistence';
import { MAX_PERSONAL_LOGOS, type PersonalLogo } from '@/features/user/types/personalLogo.types';
import { readImageFileAsDataUrl, validateLogoImageFile } from '@/features/user/utils/validateLogoImageFile';

type UseSettingsLogosOptions = {
  profileImage: string;
};

export function useSettingsLogos({ profileImage }: UseSettingsLogosOptions) {
  const { inventory, equippedLogoId, processing, equipLogo, unequipLogo } = useShop();
  const { logos: personalLogos, userId } = usePersonalLogos();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const profileAlreadySaved = profileImage ? personalLogos.some((logo) => logo.image === profileImage) : false;
  const canAddPersonalLogo = personalLogos.length < MAX_PERSONAL_LOGOS;
  const emptySlots = Math.max(0, MAX_PERSONAL_LOGOS - personalLogos.length);

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    window.setTimeout(() => setFeedback(null), 3500);
  };

  const equipPersonalLogo = async (logoId: string) => {
    if (equippedLogoId === logoId) return;
    await equipLogo(logoId);
  };

  const handleEquip = async (logoId: string) => {
    try {
      if (equippedLogoId === logoId) {
        await unequipLogo();
        notify('Logo quitado');
        return;
      }
      await equipLogo(logoId);
      notify('Logo equipado');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'No se pudo equipar el logo', 'error');
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!userId) {
      notify('Debes iniciar sesión para guardar logos personales', 'error');
      return;
    }

    const validationError = validateLogoImageFile(file);
    if (validationError) {
      notify(validationError, 'error');
      return;
    }

    try {
      const image = await readImageFileAsDataUrl(file);
      const saved = await addPersonalLogo(userId, image, 'Logo personal');
      const newLogo = saved[saved.length - 1];
      if (newLogo) {
        await equipPersonalLogo(newLogo.id);
        notify('Logo personal guardado y equipado');
      } else {
        notify('Logo personal guardado');
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : 'No se pudo guardar el logo', 'error');
    }
  };

  const handleUseProfilePhoto = async () => {
    if (!userId || !profileImage) {
      notify('Primero sube una foto de perfil', 'error');
      return;
    }
    if (profileAlreadySaved) {
      notify('Tu foto de perfil ya está guardada como logo', 'error');
      return;
    }
    if (!canAddPersonalLogo) {
      notify(`Solo puedes guardar hasta ${MAX_PERSONAL_LOGOS} logos personales`, 'error');
      return;
    }

    try {
      const saved = await addPersonalLogo(userId, profileImage, 'Desde perfil');
      const newLogo = saved[saved.length - 1];
      if (newLogo) {
        await equipPersonalLogo(newLogo.id);
        notify('Foto de perfil guardada y equipada como logo');
      } else {
        notify('Foto de perfil guardada como logo');
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : 'No se pudo guardar el logo', 'error');
    }
  };

  const handleRemovePersonal = async (logo: PersonalLogo) => {
    if (!userId) return;
    try {
      await removePersonalLogo(userId, logo.id);
      notify('Logo personal eliminado');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'No se pudo eliminar el logo', 'error');
    }
  };

  const handleUnequip = async () => {
    await unequipLogo();
    notify('Logo quitado');
  };

  return {
    inventory,
    personalLogos,
    equippedLogoId,
    processing,
    feedback,
    fileInputRef,
    profileAlreadySaved,
    userId,
    emptySlots,
    handleEquip,
    handleUpload,
    handleUseProfilePhoto,
    handleRemovePersonal,
    handleUnequip,
  };
}
