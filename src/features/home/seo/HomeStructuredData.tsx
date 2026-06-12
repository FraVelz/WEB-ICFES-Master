import { FAQS } from '@/features/home/data';
import { OG_IMAGE } from '@/config/ogImage';
import { getSiteUrl } from '@/config/site';

export function HomeStructuredData() {
  const siteUrl = getSiteUrl();

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ICFES Master',
    url: siteUrl,
    logo: `${siteUrl}${OG_IMAGE.url}`,
    description: 'Plataforma de preparación para el examen ICFES en Colombia.',
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ICFES Master',
    url: siteUrl,
    inLanguage: 'es-CO',
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />
    </>
  );
}
