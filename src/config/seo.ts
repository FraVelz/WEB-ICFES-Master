import type { Metadata } from 'next';
import { ogImageTwitter } from '@/config/ogImage';

/** Twitter card metadata for public content pages. */
export function contentPageTwitter(title: string, description: string): NonNullable<Metadata['twitter']> {
  return {
    ...ogImageTwitter,
    title,
    description,
  };
}

export const SITE_LOGO_URL = '/apple-icon/';
