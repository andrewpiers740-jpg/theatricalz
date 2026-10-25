import JsonLd from '@/components/JsonLd';
import { SITE, CONTACT } from '@/config/site';

// WebPage (or ContactPage) structured data plus a breadcrumb for policy and information pages.
export default function PageSchema({ type = 'WebPage', path, name, description }) {
  const url = `https://${SITE.domain}${path}`;
  const page = {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: 'en-AU',
    isPartOf: { '@type': 'WebSite', name: SITE.name, url: `https://${SITE.domain}/` },
    publisher: { '@type': 'Organization', name: SITE.name, url: `https://${SITE.domain}/` },
  };
  if (type === 'ContactPage') {
    page.mainEntity = {
      '@type': 'Organization',
      name: SITE.name,
      email: CONTACT.email,
      telephone: CONTACT.phone,
    };
  }
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      page,
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${SITE.domain}/` },
          { '@type': 'ListItem', position: 2, name, item: url },
        ],
      },
    ],
  };
  return <JsonLd data={data} />;
}
