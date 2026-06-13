import { FAQS } from '@/features/home/data';
import { PUBLIC_CONTENT_PAGES } from '@/config/publicContentPages';
import { SITE_LOGO_URL } from '@/config/seo';
import { getSiteUrl } from '@/config/site';

export function HomeStructuredData() {
  const siteUrl = getSiteUrl();

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ICFES Master',
    url: siteUrl,
    logo: `${siteUrl}${SITE_LOGO_URL}`,
    description: 'Plataforma de preparación para el examen ICFES en Colombia.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'fravelz@proton.me',
      availableLanguage: 'Spanish',
    },
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ICFES Master',
    url: siteUrl,
    inLanguage: 'es-CO',
    description:
      'Prepárate para el ICFES con simulacros, práctica por área, gamificación y una ruta de aprendizaje guiada.',
    publisher: {
      '@type': 'Organization',
      name: 'ICFES Master',
      url: siteUrl,
    },
    potentialAction: {
      '@type': 'RegisterAction',
      target: `${siteUrl}/signup/`,
      name: 'Crear cuenta gratis',
    },
  };

  const webApplication = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ICFES Master',
    url: siteUrl,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'COP',
    },
    description:
      'Plataforma web gratuita para preparar el Saber 11° con preguntas, simulacros y ruta de aprendizaje.',
    inLanguage: 'es-CO',
  };

  const publicResources = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Recursos públicos sobre el ICFES',
    itemListElement: PUBLIC_CONTENT_PAGES.map((page, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: page.label,
      url: `${siteUrl}${page.href}`,
      description: page.description,
    })),
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

  const jsonLd = [organization, website, webApplication, publicResources, faqPage];

  return (
    <>
      {jsonLd.map((data) => (
        <script
          key={data['@type'] as string}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
