'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';

type AvatarImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
};

export function AvatarImage({ src, alt, className, fallback = null }: AvatarImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <>{fallback}</>;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      className={cn('object-cover', className)}
      onError={() => setFailed(true)}
    />
  );
}
