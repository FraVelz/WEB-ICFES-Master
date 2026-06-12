import type { MetadataRoute } from 'next';
import { CONTENT_LAST_UPDATED } from '@/config/ogImage';
import { getSiteUrl } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date(CONTENT_LAST_UPDATED);

  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/lectura/`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/importancia/`, lastModified, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${siteUrl}/consejos/`, lastModified, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${siteUrl}/informacion/`, lastModified, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${siteUrl}/privacidad/`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/terminos/`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
