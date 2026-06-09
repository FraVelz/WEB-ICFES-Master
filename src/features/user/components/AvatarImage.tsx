'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { DefaultProfileAvatarGraphic } from './DefaultProfileAvatarGraphic';

type AvatarImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  /** Si se omite, se muestra la silueta neutra por defecto. */
  fallback?: React.ReactNode;
  sizes?: string;
};

export function AvatarImage({ src, alt, className, fallback, sizes = '96px' }: AvatarImageProps) {
  const [failed, setFailed] = useState(false);
  const trimmed = src?.trim();

  if (!trimmed || failed) {
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }
    return <DefaultProfileAvatarGraphic className={className} />;
  }

  return (
    <Image
      src={trimmed}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized
      className={cn('object-cover', className)}
      onError={() => setFailed(true)}
    />
  );
}
