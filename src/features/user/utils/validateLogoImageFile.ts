import { PERSONAL_LOGO_MAX_BYTES } from '@/features/user/types/personalLogo.types';

export function validateLogoImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'El archivo debe ser una imagen';
  }
  if (file.size > PERSONAL_LOGO_MAX_BYTES) {
    return 'La imagen no puede exceder 2MB';
  }
  return null;
}

export function readImageFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('No se pudo leer la imagen'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer la imagen'));
    reader.readAsDataURL(file);
  });
}
