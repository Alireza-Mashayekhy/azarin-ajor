import Script from 'next/script';

interface GlobalSchemasProps {
  siteUrl: string;
  siteName?: string;
  description?: string;
  logoPath?: string; // relative to siteUrl
  socialLinks?: string[];
  contact?: {
    telephone?: string;
    contactType?: string;
    availableLanguage?: string[];
  };
}

export default function GlobalSchemas({
  siteUrl,
  siteName = 'Ekosesin',
  description = 'Ekosesin marketplace',
  logoPath = '/logo.png',
  socialLinks = [],
  contact,
}: GlobalSchemasProps) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}${logoPath}`,
    sameAs: socialLinks,
    ...(contact
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: contact.telephone,
            contactType: contact.contactType,
            availableLanguage: contact.availableLanguage,
          },
        }
      : {}),
  } as const;

  return (
    <>
      <Script
        id="json-ld-website-global"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="json-ld-organization-global"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
