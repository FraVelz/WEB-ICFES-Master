import { getSiteUrl } from '@/config/site';

export type BreadcrumbItem = {
  name: string;
  path: string;
};

type PageStructuredDataProps = {
  title: string;
  description: string;
  path: string;
  breadcrumbs: BreadcrumbItem[];
  dateModified?: string;
};

export function PageStructuredData({
  title,
  description,
  path,
  breadcrumbs,
  dateModified = '2025-12-16',
}: PageStructuredDataProps) {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: pageUrl,
    inLanguage: 'es-CO',
    dateModified,
    isPartOf: {
      '@type': 'WebSite',
      name: 'ICFES Master',
      url: siteUrl,
    },
  };

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
    </>
  );
}

export function LegalStructuredData({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return (
    <PageStructuredData
      title={title}
      description={description}
      path={path}
      breadcrumbs={[
        { name: 'Inicio', path: '/' },
        { name: title, path },
      ]}
    />
  );
}
